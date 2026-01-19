const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { uploadMultiple, uploadSingle } = require('../config/multer');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { logLogin, logLogout, logCRUD } = require('../middleware/auditLogger');
const { checkPermission, checkSuperAdmin } = require('../middleware/permissions');
const UserTag = require('../models/UserTag');

// Data modules
const { 
    getAllEvents, 
    getEventById, 
    getEventsSortedByDate,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../data/events');

const {
    getAllLocations,
    createLocation,
    deleteLocation,
    getAllCategories,
    createCategory,
    deleteCategory,
    getAllAuthors,
    createAuthor,
    getPoleByName,
    createPole,
    createRole,
    getAllRoles
} = require('../data/settings');

const {
    getAllMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember,
    getAllPoles
} = require('../data/members');

const {
    getAllDonations,
    getDonationById,
    createDonation,
    updateDonation,
    deleteDonation
} = require('../data/donations');

const {
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews
} = require('../data/news');

const {
    getAllQuotes,
    getQuoteById,
    createQuote,
    updateQuote,
    deleteQuote
} = require('../data/quotes');

// Rate limiter pour les tentatives de connexion
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Max 5 tentatives
    message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware d'authentification avec sessions
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect('/admin/login');
};

// Page de connexion admin
router.get('/login', (req, res) => {
    // Si déjà connecté, rediriger vers dashboard
    if (req.session && req.session.userId) {
        return res.redirect('/admin/dashboard');
    }
    
    res.render('admin-login', {
        title: 'Connexion Admin - Mosquée Bleue',
        currentPath: req.path,
        error: null
    });
});

// Traitement de la connexion - sécurisé avec bcrypt et rate limiting
router.post('/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Chercher l'utilisateur dans la base de données
        const user = await User.findOne({ where: { username } });
        
        if (!user) {
            await logLogin(req, username, false, 'Utilisateur inexistant');
            return res.render('admin-login', {
                title: 'Connexion Admin - Mosquée Bleue',
                currentPath: req.path,
                error: 'Identifiant ou mot de passe incorrect'
            });
        }
        
        // Vérifier si le compte est verrouillé
        if (user.locked_until && new Date() < user.locked_until) {
            const minutesLeft = Math.ceil((user.locked_until - new Date()) / 60000);
            await logLogin(req, username, false, `Compte verrouillé (${minutesLeft} min restantes)`);
            return res.render('admin-login', {
                title: 'Connexion Admin - Mosquée Bleue',
                currentPath: req.path,
                error: `Compte temporairement verrouillé. Réessayez dans ${minutesLeft} minute(s).`
            });
        }
        
        // Vérifier si le compte est actif
        if (!user.active) {
            await logLogin(req, username, false, 'Compte désactivé');
            return res.render('admin-login', {
                title: 'Connexion Admin - Mosquée Bleue',
                currentPath: req.path,
                error: 'Ce compte a été désactivé. Contactez un administrateur.'
            });
        }
        
        // Comparer le mot de passe avec bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            // Incrémenter les tentatives échouées
            user.failed_login_attempts += 1;
            
            // Verrouiller le compte après 5 tentatives
            if (user.failed_login_attempts >= 5) {
                user.locked_until = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
            }
            
            await user.save();
            await logLogin(req, username, false, 'Mot de passe incorrect');
            
            return res.render('admin-login', {
                title: 'Connexion Admin - Mosquée Bleue',
                currentPath: req.path,
                error: 'Identifiant ou mot de passe incorrect'
            });
        }
        
        // Connexion réussie - réinitialiser les tentatives et mettre à jour last_login
        user.failed_login_attempts = 0;
        user.locked_until = null;
        user.last_login = new Date();
        await user.save();
        
        // Créer la session
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;
        
        // Logger la connexion réussie
        await logLogin(req, username, true);
        
        return res.redirect('/admin/dashboard');
        
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return res.render('admin-login', {
            title: 'Connexion Admin - Mosquée Bleue',
            currentPath: req.path,
            error: 'Une erreur est survenue. Veuillez réessayer.'
        });
    }
});

// Dashboard admin (protégé)
router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        // Récupérer l'utilisateur avec ses permissions
        const user = await User.findByPk(req.session.userId);
        
        const events = await getAllEvents();
        const news = await getAllNews();
        const members = await getAllMembers();
        const donations = await getAllDonations();
        const quotes = await getAllQuotes();
        
        // Compter les utilisateurs (seulement pour super admin)
        let usersCount = 0;
        const permissions = user.permissions || {};
        const isSuperAdmin = permissions.settings && permissions.users;
        
        if (isSuperAdmin) {
            usersCount = await User.count();
        }
        
        const stats = {
            events: events.length,
            news: news.length,
            members: members.length,
            donations: donations.length,
            quotes: quotes.length,
            users: usersCount
        };
        
        res.render('admin/dashboard', {
            title: 'Dashboard Admin - Mosquée Bleue',
            currentPath: req.path,
            stats,
            userPermissions: user.permissions || {},
            userTag: user.tag || null,
            isSuperAdmin: isSuperAdmin
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur lors du chargement du dashboard');
    }
});

// Déconnexion
router.get('/logout', async (req, res) => {
    await logLogout(req);
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion:', err);
        }
        res.clearCookie('connect.sid'); // Nom du cookie de session par défaut
        res.redirect('/admin/login');
    });
});

// Routes CRUD Événements
router.get('/events', isAuthenticated, checkPermission('events'), async (req, res) => {
    try {
        const events = await getEventsSortedByDate();
        res.render('admin/events-list', {
            title: 'Gestion des événements - Admin',
            currentPath: req.path,
            events
        });
    } catch (error) {
        console.error('Erreur liste événements:', error);
        res.status(500).send('Erreur lors du chargement des événements');
    }
});

router.get('/events/new', isAuthenticated, checkPermission('events'), async (req, res) => {
    try {
        const locations = await getAllLocations();
        const categories = await getAllCategories();
        
        res.render('admin/event-form', {
            title: 'Nouvel événement - Admin',
            currentPath: req.path,
            event: null,
            locations,
            categories
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/events', isAuthenticated, checkPermission('events'), uploadMultiple, async (req, res) => {
    try {
        // Gérer création de nouveau pôle
        let eventPole = req.body.pole;
        if (req.body.pole === 'autre' && req.body.new_pole) {
            const newPole = await createPole({
                name: req.body.new_pole,
                slug: req.body.new_pole.toLowerCase().replace(/\s+/g, '-')
            });
            eventPole = newPole.name;
        }
        
        // Gérer création de nouveau lieu
        let eventLocation = req.body.location;
        if (req.body.location === 'autre' && req.body.new_location) {
            const newLoc = await createLocation({
                name: req.body.new_location,
                is_system: false
            });
            eventLocation = newLoc.name;
        }
        
        // Gérer création de nouvelle catégorie
        let eventCategory = req.body.category;
        if (req.body.category === 'autre' && req.body.new_category) {
            const newCat = await createCategory({
                name: req.body.new_category,
                is_system: false
            });
            eventCategory = newCat.name;
        }
        
        // Gérer les images uploadées
        const images = req.files ? req.files.map(f => '/images/events/' + f.filename) : [];
        
        const eventData = {
            pole: eventPole,
            title: req.body.title,
            date: req.body.date,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            location: eventLocation,
            category: eventCategory,
            description: req.body.description,
            images: images
        };
        
        await createEvent(eventData);
        await logCRUD(req, 'CREATE', 'EVENT', null, eventData.title);
        console.log('✅ Événement créé:', eventData.title);
        res.redirect('/admin/events');
    } catch (error) {
        console.error('Erreur création événement:', error);
        res.status(500).send('Erreur lors de la création de l\'événement');
    }
});

router.get('/events/:id/edit', isAuthenticated, checkPermission('events'), async (req, res) => {
    try {
        const event = await getEventById(parseInt(req.params.id));
        if (!event) {
            return res.status(404).send('Événement non trouvé');
        }
        
        const locations = await getAllLocations();
        const categories = await getAllCategories();
        
        res.render('admin/event-form', {
            title: 'Modifier événement - Admin',
            currentPath: req.path,
            event,
            locations,
            categories
        });
    } catch (error) {
        console.error('Erreur chargement événement:', error);
        res.status(500).send('Erreur lors du chargement');
    }
});

router.post('/events/:id', isAuthenticated, checkPermission('events'), uploadMultiple, async (req, res) => {
    try {
        const event = await getEventById(parseInt(req.params.id));
        if (!event) {
            return res.status(404).send('Événement non trouvé');
        }
        
        // Gérer création de nouveau pôle
        let eventPole = req.body.pole;
        if (req.body.pole === 'autre' && req.body.new_pole) {
            const newPole = await createPole({
                name: req.body.new_pole,
                slug: req.body.new_pole.toLowerCase().replace(/\s+/g, '-')
            });
            eventPole = newPole.name;
        }
        
        let eventLocation = req.body.location;
        if (req.body.location === 'autre' && req.body.new_location) {
            const newLoc = await createLocation({
                name: req.body.new_location,
                is_system: false
            });
            eventLocation = newLoc.name;
        }
        
        let eventCategory = req.body.category;
        if (req.body.category === 'autre' && req.body.new_category) {
            const newCat = await createCategory({
                name: req.body.new_category,
                is_system: false
            });
            eventCategory = newCat.name;
        }
        
        // Gérer images : garder anciennes + nouvelles - supprimer celles demandées
        let images = [];
        if (event.images) {
            // Si images est une chaîne JSON, la parser
            images = typeof event.images === 'string' ? JSON.parse(event.images) : event.images;
        }
        
        // Supprimer les images demandées
        if (req.body.remove_images) {
            const toRemove = Array.isArray(req.body.remove_images) ? req.body.remove_images : [req.body.remove_images];
            toRemove.forEach(img => {
                const imagePath = path.join(__dirname, '../../public', img);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log('Image supprimée:', imagePath);
                }
            });
            images = images.filter(img => !toRemove.includes(img));
        }
        
        // Ajouter nouvelles images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(f => '/images/events/' + f.filename);
            images = [...images, ...newImages];
        }
        
        const eventData = {
            pole: eventPole,
            title: req.body.title,
            date: req.body.date,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            location: eventLocation,
            category: eventCategory,
            description: req.body.description,
            images: images
        };
        
        await updateEvent(parseInt(req.params.id), eventData);
        await logCRUD(req, 'UPDATE', 'EVENT', req.params.id, eventData.title);
        console.log('✅ Événement modifié:', req.params.id);
        res.redirect('/admin/events');
    } catch (error) {
        console.error('Erreur modification événement:', error);
        console.error('Stack:', error.stack);
        const lang = req.cookies.lang || 'fr';
        const t = require(`../i18n/${lang}.json`);
        res.status(500).render('error', {
            title: 'Erreur',
            error: process.env.NODE_ENV === 'development' ? error : {},
            currentPath: req.path,
            t: t
        });
    }
});

router.post('/events/:id/delete', isAuthenticated, checkPermission('events'), async (req, res) => {
    try {
        const event = await getEventById(parseInt(req.params.id));
        const eventTitle = event ? event.title : `ID ${req.params.id}`;
        await deleteEvent(parseInt(req.params.id));
        await logCRUD(req, 'DELETE', 'EVENT', req.params.id, eventTitle);
        console.log('✅ Événement supprimé:', req.params.id);
        res.redirect('/admin/events');
    } catch (error) {
        console.error('Erreur suppression événement:', error);
        res.status(500).send('Erreur lors de la suppression');
    }
});

// ==================== NEWS ROUTES ====================
router.get('/news', isAuthenticated, checkPermission('news'), async (req, res) => {
    try {
        const newsList = await getAllNews();
        res.render('admin/news-list', { title: 'Actualités', currentPath: req.path, news: newsList });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur lors du chargement');
    }
});

// Alias pour /news-list (utilisé dans la navigation)
router.get('/news-list', isAuthenticated, checkPermission('news'), async (req, res) => {
    try {
        const newsList = await getAllNews();
        res.render('admin/news-list', { title: 'Actualités', currentPath: req.path, news: newsList });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur lors du chargement');
    }
});

router.get('/news/new', isAuthenticated, checkPermission('news'), async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render('admin/news-form', { 
            title: 'Nouvelle actualité', 
            currentPath: req.path,
            news: null, 
            categories 
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/news', isAuthenticated, checkPermission('news'), uploadMultiple, async (req, res) => {
    try {
        console.log('=== NEWS CREATE ===');
        console.log('req.files:', req.files);
        console.log('req.body:', req.body);
        
        let newsCategory = req.body.category || req.body.categorie;
        
        if ((req.body.category === 'autre' || req.body.categorie === 'autre') && req.body.new_category) {
            const newCat = await createCategory({
                name: req.body.new_category,
                is_system: false
            });
            newsCategory = newCat.name;
        }
        
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(f => '/images/news/' + f.filename);
            console.log('Images créées:', images);
        }
        
        const newsData = {
            title: req.body.title || req.body.titre,
            content: req.body.content || req.body.description,
            images: images,
            image: images.length > 0 ? images[0] : null,
            category: newsCategory
        };
        
        console.log('newsData:', newsData);
        await createNews(newsData);
        await logCRUD(req, 'CREATE', 'NEWS', null, newsData.title);
        res.redirect('/admin/news');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur lors de la création');
    }
});

router.get('/news/:id/edit', isAuthenticated, checkPermission('news'), async (req, res) => {
    try {
        const news = await getNewsById(parseInt(req.params.id));
        const categories = await getAllCategories();
        res.render('admin/news-form', { 
            title: 'Modifier actualité', 
            currentPath: req.path,
            news, 
            categories 
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/news/:id', isAuthenticated, checkPermission('news'), uploadMultiple, async (req, res) => {
    try {
        console.log('=== NEWS UPDATE ===');
        console.log('req.files:', req.files);
        console.log('req.body:', req.body);
        
        const news = await getNewsById(parseInt(req.params.id));
        let newsCategory = req.body.category || req.body.categorie;
        
        if ((req.body.category === 'autre' || req.body.categorie === 'autre') && req.body.new_category) {
            const newCat = await createCategory({
                name: req.body.new_category,
                is_system: false
            });
            newsCategory = newCat.name;
        }
        
        // Gérer images : garder anciennes + nouvelles - supprimer celles demandées
        let images = [];
        if (news.images) {
            images = typeof news.images === 'string' ? JSON.parse(news.images) : news.images;
        }
        
        // Supprimer les images demandées
        if (req.body.remove_images) {
            const toRemove = Array.isArray(req.body.remove_images) ? req.body.remove_images : [req.body.remove_images];
            toRemove.forEach(img => {
                const imagePath = path.join(__dirname, '../../public', img);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log('Image supprimée:', imagePath);
                }
            });
            images = images.filter(img => !toRemove.includes(img));
        }
        
        // Ajouter nouvelles images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(f => '/images/news/' + f.filename);
            images = [...images, ...newImages];
            console.log('Nouvelles images ajoutées:', newImages);
        }
        
        const newsData = {
            title: req.body.title || req.body.titre,
            content: req.body.content || req.body.description,
            images: images,
            image: images.length > 0 ? images[0] : news.image,
            category: newsCategory
        };
        
        console.log('newsData final:', newsData);
        await updateNews(parseInt(req.params.id), newsData);
        await logCRUD(req, 'UPDATE', 'NEWS', req.params.id, newsData.title);
        res.redirect('/admin/news');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/news/:id/delete', isAuthenticated, checkPermission('news'), async (req, res) => {
    try {
        const news = await getNewsById(parseInt(req.params.id));
        const newsTitle = news ? news.title : `ID ${req.params.id}`;
        await deleteNews(parseInt(req.params.id));
        await logCRUD(req, 'DELETE', 'NEWS', req.params.id, newsTitle);
        res.redirect('/admin/news');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

// ==================== QUOTES ROUTES ====================
router.get('/quotes', isAuthenticated, checkPermission('quotes'), async (req, res) => {
    try {
        const { getAllQuotesAdmin } = require('../data/quotes');
        const quotes = await getAllQuotesAdmin();
        res.render('admin/quotes-list', { title: 'Citations', currentPath: req.path, quotes });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.get('/quotes/new', isAuthenticated, checkPermission('quotes'), async (req, res) => {
    try {
        const { getAllQuoteSources } = require('../data/quoteSources');
        const sources = await getAllQuoteSources();
        res.render('admin/quote-form', { 
            title: 'Nouvelle citation', 
            currentPath: req.path,
            quote: null, 
            sources 
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/quotes', isAuthenticated, checkPermission('quotes'), async (req, res) => {
    try {
        const { getOrCreateQuoteSource } = require('../data/quoteSources');
        
        // Gérer la source (créer si nouvelle)
        let authorName = req.body.author;
        if (req.body.author === 'autre' && req.body.new_author) {
            const newSource = await getOrCreateQuoteSource(req.body.new_author.trim());
            authorName = newSource.name;
        }
        
        const quoteData = {
            text_original: req.body.text_original,
            text_fr: req.body.text_fr,
            text_tr: req.body.text_tr || null,
            author: authorName,
            active: req.body.active ? true : false
        };
        
        await createQuote(quoteData);
        await logCRUD(req, 'CREATE', 'QUOTE', null, `Citation de ${quoteData.author}`);
        res.redirect('/admin/quotes');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.get('/quotes/:id/edit', isAuthenticated, checkPermission('quotes'), async (req, res) => {
    try {
        const { getAllQuoteSources } = require('../data/quoteSources');
        const quote = await getQuoteById(parseInt(req.params.id));
        const sources = await getAllQuoteSources();
        res.render('admin/quote-form', { 
            title: 'Modifier citation', 
            currentPath: req.path,
            quote, 
            sources 
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/quotes/:id', isAuthenticated, checkPermission('quotes'), async (req, res) => {
    try {
        const { getOrCreateQuoteSource } = require('../data/quoteSources');
        
        // Gérer la source (créer si nouvelle)
        let authorName = req.body.author;
        if (req.body.author === 'autre' && req.body.new_author) {
            const newSource = await getOrCreateQuoteSource(req.body.new_author.trim());
            authorName = newSource.name;
        }
        
        const quoteData = {
            text_original: req.body.text_original,
            text_fr: req.body.text_fr,
            text_tr: req.body.text_tr || null,
            author: authorName,
            active: req.body.active ? true : false
        };
        
        await updateQuote(parseInt(req.params.id), quoteData);
        await logCRUD(req, 'UPDATE', 'QUOTE', req.params.id, `Citation de ${quoteData.author}`);
        res.redirect('/admin/quotes');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/quotes/:id/delete', isAuthenticated, checkPermission('quotes'), async (req, res) => {
    try {
        const quote = await getQuoteById(parseInt(req.params.id));
        const quoteDesc = quote ? `Citation de ${quote.author}` : `ID ${req.params.id}`;
        await deleteQuote(parseInt(req.params.id));
        await logCRUD(req, 'DELETE', 'QUOTE', req.params.id, quoteDesc);
        res.redirect('/admin/quotes');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

// ==================== MEMBERS ROUTES ====================
router.get('/members', isAuthenticated, checkPermission('members'), async (req, res) => {
    try {
        const members = await getAllMembers();
        const poles = await getAllPoles();
        res.render('admin/members-list', { title: 'Membres', currentPath: req.path, members, poles });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.get('/members/new', isAuthenticated, checkPermission('members'), async (req, res) => {
    try {
        const roles = await getAllRoles();
        res.render('admin/member-form', { 
            title: 'Nouveau membre', 
            currentPath: req.path,
            member: null,
            roles
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/members', isAuthenticated, checkPermission('members'), uploadSingle, async (req, res) => {
    try {
        let memberPole = req.body.pole;
        let memberRole = req.body.role;
        
        if (req.body.pole === 'autre' && req.body.new_pole) {
            const existingPole = await getPoleByName(req.body.new_pole);
            if (existingPole) {
                memberPole = existingPole.name;
            } else {
                const newPole = await createPole({
                    name: req.body.new_pole,
                    is_system: false
                });
                memberPole = newPole.name;
            }
        }
        
        if (req.body.role === 'autre' && req.body.new_role) {
            const newRole = await createRole({
                name: req.body.new_role,
                is_system: false
            });
            memberRole = newRole.name;
        }
        
        const image = req.file ? '/images/team/' + req.file.filename : null;
        
        const memberData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            pole: memberPole,
            role: memberRole,
            description: req.body.description,
            image: image,
            order: parseInt(req.body.order) || 0
        };
        
        await createMember(memberData);
        await logCRUD(req, 'CREATE', 'MEMBER', null, `${memberData.first_name} ${memberData.last_name}`);
        res.redirect('/admin/members');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.get('/members/:id/edit', isAuthenticated, checkPermission('members'), async (req, res) => {
    try {
        const member = await getMemberById(parseInt(req.params.id));
        const roles = await getAllRoles();
        res.render('admin/member-form', { 
            title: 'Modifier membre', 
            currentPath: req.path,
            member,
            roles
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/members/:id', isAuthenticated, checkPermission('members'), uploadSingle, async (req, res) => {
    try {
        const member = await getMemberById(parseInt(req.params.id));
        let memberPole = req.body.pole;
        let memberRole = req.body.role;
        
        if (req.body.pole === 'autre' && req.body.new_pole) {
            const existingPole = await getPoleByName(req.body.new_pole);
            if (existingPole) {
                memberPole = existingPole.name;
            } else {
                const newPole = await createPole({
                    name: req.body.new_pole,
                    is_system: false
                });
                memberPole = newPole.name;
            }
        }
        
        if (req.body.role === 'autre' && req.body.new_role) {
            const newRole = await createRole({
                name: req.body.new_role,
                is_system: false
            });
            memberRole = newRole.name;
        }
        
        const image = req.file ? '/images/team/' + req.file.filename : member.image;
        
        const memberData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            pole: memberPole,
            role: memberRole,
            image: image,
            order: parseInt(req.body.order) || 0
        };
        
        await updateMember(parseInt(req.params.id), memberData);
        await logCRUD(req, 'UPDATE', 'MEMBER', req.params.id, `${memberData.first_name} ${memberData.last_name}`);
        res.redirect('/admin/members');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/members/:id/delete', isAuthenticated, checkPermission('members'), async (req, res) => {
    try {
        const member = await getMemberById(parseInt(req.params.id));
        const memberName = member ? `${member.first_name} ${member.last_name}` : `ID ${req.params.id}`;
        await deleteMember(parseInt(req.params.id));
        await logCRUD(req, 'DELETE', 'MEMBER', req.params.id, memberName);
        res.redirect('/admin/members');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

// ==================== DONATIONS ROUTES ====================
router.get('/donations', isAuthenticated, checkPermission('donations'), async (req, res) => {
    try {
        const donations = await getAllDonations();
        res.render('admin/donations-list', { title: 'Campagnes de dons', currentPath: req.path, donations });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.get('/donations/new', isAuthenticated, checkPermission('donations'), (req, res) => {
    res.render('admin/donation-form', { 
        title: 'Nouvelle campagne', 
        currentPath: req.path,
        donation: null 
    });
});

router.post('/donations', isAuthenticated, checkPermission('donations'), uploadMultiple, async (req, res) => {
    try {
        // Gérer les images uploadées
        const images = req.files ? req.files.map(f => '/images/donations/' + f.filename) : [];
        
        const donationData = {
            title: req.body.title,
            description: req.body.description,
            goal_amount: parseFloat(req.body.goal_amount),
            current_amount: parseFloat(req.body.current_amount) || 0,
            end_date: req.body.end_date || null,
            active: req.body.active ? true : false,
            images: images,
            image: images.length > 0 ? images[0] : null
        };
        
        console.log('✅ Donation créée avec images:', images);
        await createDonation(donationData);
        await logCRUD(req, 'CREATE', 'DONATION', null, donationData.title);
        res.redirect('/admin/donations');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.get('/donations/:id/edit', isAuthenticated, checkPermission('donations'), async (req, res) => {
    try {
        const donation = await getDonationById(parseInt(req.params.id));
        res.render('admin/donation-form', { 
            title: 'Modifier campagne', 
            currentPath: req.path,
            donation 
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/donations/:id', isAuthenticated, checkPermission('donations'), uploadMultiple, async (req, res) => {
    try {
        const donation = await getDonationById(parseInt(req.params.id));
        
        // Gérer images : garder anciennes + nouvelles - supprimer celles demandées
        let images = [];
        if (donation.images) {
            images = typeof donation.images === 'string' ? JSON.parse(donation.images) : donation.images;
        }
        
        // Supprimer les images demandées
        if (req.body.remove_images) {
            const toRemove = Array.isArray(req.body.remove_images) ? req.body.remove_images : [req.body.remove_images];
            toRemove.forEach(img => {
                const imagePath = path.join(__dirname, '../../public', img);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log('Image supprimée:', imagePath);
                }
            });
            images = images.filter(img => !toRemove.includes(img));
        }
        
        // Ajouter nouvelles images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(f => '/images/donations/' + f.filename);
            images = [...images, ...newImages];
            console.log('Nouvelles images ajoutées:', newImages);
        }
        
        const donationData = {
            title: req.body.title,
            description: req.body.description,
            goal_amount: parseFloat(req.body.goal_amount),
            current_amount: parseFloat(req.body.current_amount) || 0,
            end_date: req.body.end_date || null,
            active: req.body.active ? true : false,
            images: images,
            image: images.length > 0 ? images[0] : donation.image
        };
        
        await updateDonation(parseInt(req.params.id), donationData);
        await logCRUD(req, 'UPDATE', 'DONATION', req.params.id, donationData.title);
        res.redirect('/admin/donations');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/donations/:id/delete', isAuthenticated, checkPermission('donations'), async (req, res) => {
    try {
        const donation = await getDonationById(parseInt(req.params.id));
        const donationTitle = donation ? donation.title : `ID ${req.params.id}`;
        await deleteDonation(parseInt(req.params.id));
        await logCRUD(req, 'DELETE', 'DONATION', req.params.id, donationTitle);
        res.redirect('/admin/donations');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

// ============================================
// ROUTES PARAMÈTRES ET GESTION UTILISATEURS
// ============================================

// Page des paramètres (réservée aux super admins)
router.get('/settings', isAuthenticated, checkSuperAdmin, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'role', 'tag', 'permissions', 'active', 'last_login', 'created_at'],
            order: [['created_at', 'DESC']]
        });
        
        const tags = await UserTag.findAll({
            where: { active: true },
            order: [['name', 'ASC']]
        });
        
        res.render('admin/settings', {
            title: 'Paramètres - Admin',
            currentPath: req.path,
            users: users,
            tags: tags,
            isSuperAdmin: true // Toujours true car route protégée par checkSuperAdmin
        });
    } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
        res.status(500).send('Erreur lors du chargement des paramètres');
    }
});

// Formulaire de création d'utilisateur
router.get('/users/new', isAuthenticated, checkSuperAdmin, async (req, res) => {
    try {
        const tags = await UserTag.findAll({
            where: { active: true },
            order: [['name', 'ASC']]
        });
        
        res.render('admin/user-form', {
            title: 'Nouveau compte admin - Admin',
            currentPath: req.path,
            user: null,
            tags: tags,
            error: null
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur lors du chargement du formulaire');
    }
});

// Créer un utilisateur
router.post('/users', isAuthenticated, checkSuperAdmin, async (req, res) => {
    try {
        const { username, password, password_confirm, tag, custom_tag, permissions, active, super_admin } = req.body;
        
        // Validation
        if (password !== password_confirm) {
            const tags = await UserTag.findAll({ where: { active: true } });
            return res.render('admin/user-form', {
                title: 'Nouveau compte admin',
                currentPath: req.path,
                user: null,
                tags: tags,
                error: 'Les mots de passe ne correspondent pas'
            });
        }
        
        // Valider le mot de passe
        if (password.length < 8) {
            const tags = await UserTag.findAll({ where: { active: true } });
            return res.render('admin/user-form', {
                title: 'Nouveau compte admin',
                currentPath: req.path,
                user: null,
                tags: tags,
                error: 'Le mot de passe doit contenir au moins 8 caractères'
            });
        }
        
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        
        if (!hasUpperCase || !hasLowerCase || !hasNumber) {
            const tags = await UserTag.findAll({ where: { active: true } });
            return res.render('admin/user-form', {
                title: 'Nouveau compte admin',
                currentPath: req.path,
                user: null,
                tags: tags,
                error: 'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre'
            });
        }
        
        // Déterminer le tag final
        let finalTag = tag;
        if (tag === '__custom__' && custom_tag) {
            // Créer le nouveau tag
            const newTag = await UserTag.create({
                name: custom_tag.trim(),
                description: `Tag créé par ${req.session.username}`,
                active: true
            });
            finalTag = newTag.id; // Utiliser l'ID du nouveau tag
        }
        
        // Construire les permissions
        let permsObj = {
            events: false,
            news: false,
            quotes: false,
            members: false,
            donations: false,
            settings: false,
            audit_logs: false,
            users: false
        };
        
        // Si super admin coché, donner toutes les permissions
        if (super_admin === '1') {
            permsObj = {
                events: true,
                news: true,
                quotes: true,
                members: true,
                donations: true,
                settings: true,
                audit_logs: true,
                users: true
            };
        } else {
            // Sinon, appliquer les permissions sélectionnées
            if (permissions) {
                const permsArray = Array.isArray(permissions) ? permissions : [permissions];
                permsArray.forEach(perm => {
                    if (permsObj.hasOwnProperty(perm)) {
                        permsObj[perm] = true;
                    }
                });
            }
        }
        
        // Crypter le mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Créer l'utilisateur
        const newUser = await User.create({
            username: username,
            password: hashedPassword,
            role: 'admin',
            tag: finalTag || null,
            permissions: permsObj,
            active: active === '1' || active === 'on'
        });
        
        // Logger la création
        await logCRUD(req, 'CREATE', 'USER', newUser.id, username);
        
        res.redirect('/admin/settings');
        
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        const tags = await UserTag.findAll({ where: { active: true } });
        res.render('admin/user-form', {
            title: 'Nouveau compte admin',
            currentPath: req.path,
            user: null,
            tags: tags,
            error: error.message || 'Une erreur est survenue'
        });
    }
});

// Formulaire d'édition d'utilisateur
router.get('/users/:id/edit', isAuthenticated, checkSuperAdmin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }
        
        const tags = await UserTag.findAll({
            where: { active: true },
            order: [['name', 'ASC']]
        });
        
        res.render('admin/user-form', {
            title: 'Modifier un administrateur - Admin',
            currentPath: req.path,
            user: user,
            tags: tags,
            error: null
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur lors du chargement du formulaire');
    }
});

// Toggle statut utilisateur
router.post('/users/:id/toggle-status', isAuthenticated, checkSuperAdmin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.json({ success: false, message: 'Utilisateur non trouvé' });
        }
        
        // Ne pas permettre de se désactiver soi-même
        if (user.id === req.session.userId) {
            return res.json({ success: false, message: 'Vous ne pouvez pas désactiver votre propre compte' });
        }
        
        user.active = !user.active;
        await user.save();
        
        // Logger
        await logCRUD(req, 'UPDATE', 'USER', user.id, user.username, 
            null, null, `${user.active ? 'Activation' : 'Désactivation'} du compte`);
        
        res.json({ success: true });
        
    } catch (error) {
        console.error('Erreur:', error);
        res.json({ success: false, message: 'Erreur serveur' });
    }
});

// Mettre à jour un utilisateur
router.post('/users/:id', isAuthenticated, checkSuperAdmin, async (req, res) => {
    try {
        const { username, password, password_confirm, tag, custom_tag, permissions, active, super_admin } = req.body;
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }
        
        // Validation du mot de passe si fourni
        if (password && password.length > 0) {
            if (password !== password_confirm) {
                const tags = await UserTag.findAll({ where: { active: true } });
                return res.render('admin/user-form', {
                    title: 'Modifier un administrateur',
                    currentPath: req.path,
                    user: user,
                    tags: tags,
                    error: 'Les mots de passe ne correspondent pas'
                });
            }
            
            if (password.length < 8) {
                const tags = await UserTag.findAll({ where: { active: true } });
                return res.render('admin/user-form', {
                    title: 'Modifier un administrateur',
                    currentPath: req.path,
                    user: user,
                    tags: tags,
                    error: 'Le mot de passe doit contenir au moins 8 caractères'
                });
            }
            
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            
            if (!hasUpperCase || !hasLowerCase || !hasNumber) {
                const tags = await UserTag.findAll({ where: { active: true } });
                return res.render('admin/user-form', {
                    title: 'Modifier un administrateur',
                    currentPath: req.path,
                    user: user,
                    tags: tags,
                    error: 'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre'
                });
            }
            
            // Crypter et mettre à jour le mot de passe
            const saltRounds = 10;
            user.password = await bcrypt.hash(password, saltRounds);
        }
        
        // Mettre à jour le username
        user.username = username;
        
        // Déterminer le tag final
        let finalTag = tag;
        if (tag === '__custom__' && custom_tag) {
            await UserTag.create({
                name: custom_tag.trim(),
                description: `Tag créé par ${req.session.username}`,
                active: true
            });
            finalTag = custom_tag.trim();
        }
        user.tag = finalTag || null;
        
        // Construire les permissions
        let permsObj = {
            events: false,
            news: false,
            quotes: false,
            members: false,
            donations: false,
            settings: false,
            audit_logs: false,
            users: false
        };
        
        if (super_admin === '1') {
            permsObj = {
                events: true,
                news: true,
                quotes: true,
                members: true,
                donations: true,
                settings: true,
                audit_logs: true,
                users: true
            };
        } else {
            if (permissions) {
                const permsArray = Array.isArray(permissions) ? permissions : [permissions];
                permsArray.forEach(perm => {
                    if (permsObj.hasOwnProperty(perm)) {
                        permsObj[perm] = true;
                    }
                });
            }
        }
        
        user.permissions = permsObj;
        user.active = active === '1' || active === 'on';
        
        await user.save();
        
        // Logger
        await logCRUD(req, 'UPDATE', 'USER', user.id, user.username);
        
        res.redirect('/admin/settings?success=user_updated');
        
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur lors de la mise à jour');
    }
});

// Supprimer un utilisateur
router.post('/users/:id/delete', isAuthenticated, checkSuperAdmin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.json({ success: false, message: 'Utilisateur non trouvé' });
        }
        
        // Ne pas permettre de se supprimer soi-même
        if (user.id === req.session.userId) {
            return res.json({ success: false, message: 'Vous ne pouvez pas supprimer votre propre compte' });
        }
        
        const username = user.username;
        
        // Logger avant suppression
        await logCRUD(req, 'DELETE', 'USER', user.id, username);
        
        await user.destroy();
        
        res.json({ success: true });
        
    } catch (error) {
        console.error('Erreur:', error);
        res.json({ success: false, message: 'Erreur serveur' });
    }
});

// ============================================
// API ROUTES - AUDIT LOGS
// ============================================

// API pour récupérer les logs d'audit (utilisé dans settings.ejs)
router.get('/api/audit-logs', isAuthenticated, checkSuperAdmin, async (req, res) => {
    try {
        const { Op } = require('sequelize');
        const { filter, page = 0, limit = 50 } = req.query;
        
        // Construire les filtres
        const where = {};
        
        if (filter && filter !== 'all') {
            where.action = filter;
        }
        
        // Récupérer les logs
        const logs = await AuditLog.findAll({
            where: where,
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(page) * parseInt(limit)
        });
        
        res.json({
            success: true,
            logs: logs,
            page: parseInt(page),
            limit: parseInt(limit)
        });
        
    } catch (error) {
        console.error('Erreur récupération logs:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des logs',
            logs: []
        });
    }
});

// ============================================
// FIN DES ROUTES ADMIN
// ============================================

module.exports = router;
