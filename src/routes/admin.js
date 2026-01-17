const express = require('express');
const router = express.Router();
const { uploadMultiple, uploadSingle } = require('../config/multer');
const fs = require('fs');
const path = require('path');

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
    getAllEventTypes,
    createEventType,
    deleteEventType,
    getAllLocations,
    createLocation,
    deleteLocation,
    getAllCategories,
    createCategory,
    deleteCategory,
    getAllAuthors,
    createAuthor,
    getAllPolesList,
    createPole,
    getAllRoles,
    createRole
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

// Middleware d'authentification simple (à améliorer avec session/JWT)
const isAuthenticated = (req, res, next) => {
    // Pour le moment, simple vérification cookie
    if (req.cookies && req.cookies.adminAuth === 'true') {
        return next();
    }
    res.redirect('/admin/login');
};

// Page de connexion admin
router.get('/login', (req, res) => {
    // Si déjà connecté, rediriger vers dashboard
    if (req.cookies && req.cookies.adminAuth === 'true') {
        return res.redirect('/admin/dashboard');
    }
    
    res.render('admin-login', {
        title: 'Connexion Admin - Mosquée Bleue',
        currentPath: req.path,
        error: null
    });
});

// Traitement de la connexion
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // TODO: Remplacer par vraie authentification avec base de données
    // Credentials temporaires pour développement
    if (username === 'admin' && password === 'mosquee2024') {
        res.cookie('adminAuth', 'true', { 
            maxAge: 24 * 60 * 60 * 1000, // 24h
            httpOnly: true 
        });
        return res.redirect('/admin/dashboard');
    }
    
    res.render('admin-login', {
        title: 'Connexion Admin - Mosquée Bleue',
        currentPath: req.path,
        error: 'Identifiant ou mot de passe incorrect'
    });
});

// Dashboard admin (protégé)
router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const events = await getAllEvents();
        const news = await getAllNews();
        const members = await getAllMembers();
        const donations = await getAllDonations();
        const quotes = await getAllQuotes();
        
        const stats = {
            events: events.length,
            news: news.length,
            members: members.length,
            donations: donations.length,
            quotes: quotes.length
        };
        
        res.render('admin/dashboard', {
            title: 'Dashboard Admin - Mosquée Bleue',
            currentPath: req.path,
            stats
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur lors du chargement du dashboard');
    }
});

// Déconnexion
router.get('/logout', (req, res) => {
    res.clearCookie('adminAuth');
    res.redirect('/admin/login');
});

// Routes CRUD Événements
router.get('/events', isAuthenticated, async (req, res) => {
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

router.get('/events/new', isAuthenticated, async (req, res) => {
    try {
        const types = await getAllEventTypes();
        const locations = await getAllLocations();
        const categories = await getAllCategories();
        
        res.render('admin/event-form', {
            title: 'Nouvel événement - Admin',
            currentPath: req.path,
            event: null,
            types,
            locations,
            categories
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/events', isAuthenticated, uploadMultiple, async (req, res) => {
    try {
        // Gérer création de nouveau type
        let eventType = req.body.type;
        if (req.body.type === 'autre' && req.body.new_type) {
            const newType = await createEventType({
                name: req.body.new_type.toLowerCase().replace(/\s+/g, '_'),
                label_fr: req.body.new_type,
                is_system: false
            });
            eventType = newType.name;
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
            type: eventType,
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
        console.log('✅ Événement créé:', eventData.title);
        res.redirect('/admin/events');
    } catch (error) {
        console.error('Erreur création événement:', error);
        res.status(500).send('Erreur lors de la création de l\'événement');
    }
});

router.get('/events/:id/edit', isAuthenticated, async (req, res) => {
    try {
        const event = await getEventById(parseInt(req.params.id));
        if (!event) {
            return res.status(404).send('Événement non trouvé');
        }
        
        const types = await getAllEventTypes();
        const locations = await getAllLocations();
        const categories = await getAllCategories();
        
        res.render('admin/event-form', {
            title: 'Modifier événement - Admin',
            currentPath: req.path,
            event,
            types,
            locations,
            categories
        });
    } catch (error) {
        console.error('Erreur chargement événement:', error);
        res.status(500).send('Erreur lors du chargement');
    }
});

router.post('/events/:id', isAuthenticated, uploadMultiple, async (req, res) => {
    try {
        const event = await getEventById(parseInt(req.params.id));
        if (!event) {
            return res.status(404).send('Événement non trouvé');
        }
        
        // Gérer types/lieux/catégories comme pour create
        let eventType = req.body.type;
        if (req.body.type === 'autre' && req.body.new_type) {
            const newType = await createEventType({
                name: req.body.new_type.toLowerCase().replace(/\s+/g, '_'),
                label_fr: req.body.new_type,
                is_system: false
            });
            eventType = newType.name;
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
            type: eventType,
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

router.post('/events/:id/delete', isAuthenticated, async (req, res) => {
    try {
        await deleteEvent(parseInt(req.params.id));
        console.log('✅ Événement supprimé:', req.params.id);
        res.redirect('/admin/events');
    } catch (error) {
        console.error('Erreur suppression événement:', error);
        res.status(500).send('Erreur lors de la suppression');
    }
});

// ==================== NEWS ROUTES ====================
router.get('/news', isAuthenticated, async (req, res) => {
    try {
        const newsList = await getAllNews();
        res.render('admin/news-list', { title: 'Actualités', news: newsList });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur lors du chargement');
    }
});

router.get('/news/new', isAuthenticated, async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render('admin/news-form', { title: 'Nouvelle actualité', news: null, categories });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/news', isAuthenticated, uploadMultiple, async (req, res) => {
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
        res.redirect('/admin/news');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur lors de la création');
    }
});

router.get('/news/:id/edit', isAuthenticated, async (req, res) => {
    try {
        const news = await getNewsById(parseInt(req.params.id));
        const categories = await getAllCategories();
        res.render('admin/news-form', { title: 'Modifier actualité', news, categories });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/news/:id', isAuthenticated, uploadMultiple, async (req, res) => {
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
        res.redirect('/admin/news');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/news/:id/delete', isAuthenticated, async (req, res) => {
    try {
        await deleteNews(parseInt(req.params.id));
        res.redirect('/admin/news');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

// ==================== QUOTES ROUTES ====================
router.get('/quotes', isAuthenticated, async (req, res) => {
    try {
        const { getAllQuotesAdmin } = require('../data/quotes');
        const quotes = await getAllQuotesAdmin();
        res.render('admin/quotes-list', { title: 'Citations', quotes });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.get('/quotes/new', isAuthenticated, async (req, res) => {
    try {
        const { getAllQuoteSources } = require('../data/quoteSources');
        const sources = await getAllQuoteSources();
        res.render('admin/quote-form', { title: 'Nouvelle citation', quote: null, sources });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/quotes', isAuthenticated, async (req, res) => {
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
        res.redirect('/admin/quotes');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.get('/quotes/:id/edit', isAuthenticated, async (req, res) => {
    try {
        const { getAllQuoteSources } = require('../data/quoteSources');
        const quote = await getQuoteById(parseInt(req.params.id));
        const sources = await getAllQuoteSources();
        res.render('admin/quote-form', { title: 'Modifier citation', quote, sources });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/quotes/:id', isAuthenticated, async (req, res) => {
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
        res.redirect('/admin/quotes');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/quotes/:id/delete', isAuthenticated, async (req, res) => {
    try {
        await deleteQuote(parseInt(req.params.id));
        res.redirect('/admin/quotes');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

// ==================== MEMBERS ROUTES ====================
router.get('/members', isAuthenticated, async (req, res) => {
    try {
        const members = await getAllMembers();
        const poles = await getAllPoles();
        res.render('admin/members-list', { title: 'Membres', members, poles });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.get('/members/new', isAuthenticated, async (req, res) => {
    try {
        const poles = await getAllPolesList();
        const roles = await getAllRoles();
        res.render('admin/member-form', { title: 'Nouveau membre', member: null, poles, roles });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/members', isAuthenticated, uploadSingle, async (req, res) => {
    try {
        let memberPole = req.body.pole;
        let memberRole = req.body.role;
        
        if (req.body.pole === 'autre' && req.body.new_pole) {
            const newPole = await createPole({
                name: req.body.new_pole,
                is_system: false
            });
            memberPole = newPole.name;
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
            email: req.body.email,
            phone: req.body.phone,
            order: parseInt(req.body.order) || 0
        };
        
        await createMember(memberData);
        res.redirect('/admin/members');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.get('/members/:id/edit', isAuthenticated, async (req, res) => {
    try {
        const member = await getMemberById(parseInt(req.params.id));
        const poles = await getAllPolesList();
        const roles = await getAllRoles();
        res.render('admin/member-form', { title: 'Modifier membre', member, poles, roles });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/members/:id', isAuthenticated, uploadSingle, async (req, res) => {
    try {
        const member = await getMemberById(parseInt(req.params.id));
        let memberPole = req.body.pole;
        let memberRole = req.body.role;
        
        if (req.body.pole === 'autre' && req.body.new_pole) {
            const newPole = await createPole({
                name: req.body.new_pole,
                is_system: false
            });
            memberPole = newPole.name;
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
            description: req.body.description,
            image: image,
            email: req.body.email,
            phone: req.body.phone,
            order: parseInt(req.body.order) || 0
        };
        
        await updateMember(parseInt(req.params.id), memberData);
        res.redirect('/admin/members');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/members/:id/delete', isAuthenticated, async (req, res) => {
    try {
        await deleteMember(parseInt(req.params.id));
        res.redirect('/admin/members');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

// ==================== DONATIONS ROUTES ====================
router.get('/donations', isAuthenticated, async (req, res) => {
    try {
        const donations = await getAllDonations();
        res.render('admin/donations-list', { title: 'Campagnes de dons', donations });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.get('/donations/new', isAuthenticated, (req, res) => {
    res.render('admin/donation-form', { title: 'Nouvelle campagne', donation: null });
});

router.post('/donations', isAuthenticated, uploadMultiple, async (req, res) => {
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
        res.redirect('/admin/donations');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.get('/donations/:id/edit', isAuthenticated, async (req, res) => {
    try {
        const donation = await getDonationById(parseInt(req.params.id));
        res.render('admin/donation-form', { title: 'Modifier campagne', donation });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/donations/:id', isAuthenticated, uploadMultiple, async (req, res) => {
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
        res.redirect('/admin/donations');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

router.post('/donations/:id/delete', isAuthenticated, async (req, res) => {
    try {
        await deleteDonation(parseInt(req.params.id));
        res.redirect('/admin/donations');
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).send('Erreur');
    }
});

module.exports = router;
