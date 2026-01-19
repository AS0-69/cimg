/**
 * Middleware pour vérifier les permissions des utilisateurs
 */

const User = require('../models/User');

/**
 * Middleware pour vérifier si l'utilisateur a accès à une ressource spécifique
 * @param {string} resource - events, news, quotes, members, donations, settings, audit_logs, users
 */
function checkPermission(resource) {
    return async (req, res, next) => {
        try {
            // Vérifier si l'utilisateur est connecté
            if (!req.session || !req.session.userId) {
                return res.redirect('/admin/login');
            }
            
            // Récupérer l'utilisateur
            const user = await User.findByPk(req.session.userId);
            
            if (!user) {
                return res.redirect('/admin/login');
            }
            
            // Vérifier si l'utilisateur a la permission
            const permissions = user.permissions || {};
            
            if (!permissions[resource]) {
                // Rendre une page d'erreur personnalisée
                return res.status(403).render('error', {
                    title: 'Accès refusé',
                    currentPath: req.path,
                    errorCode: 403,
                    errorTitle: 'Accès refusé',
                    errorMessage: `Vous n'avez pas la permission d'accéder à cette section.`,
                    errorDetails: `Votre compte n'a pas accès à la gestion de "${getResourceName(resource)}". Contactez un administrateur si vous pensez que c'est une erreur.`,
                    backLink: '/admin/dashboard'
                });
            }
            
            // Ajouter les permissions à la requête pour usage ultérieur
            req.userPermissions = permissions;
            req.userTag = user.tag;
            
            next();
        } catch (error) {
            console.error('Erreur lors de la vérification des permissions:', error);
            res.status(500).send('Erreur serveur');
        }
    };
}

/**
 * Obtenir le nom lisible d'une ressource
 */
function getResourceName(resource) {
    const names = {
        events: 'Événements',
        news: 'Actualités',
        quotes: 'Citations',
        members: 'Membres',
        donations: 'Dons et Campagnes',
        settings: 'Paramètres',
        audit_logs: 'Journal d\'Audit',
        users: 'Gestion des Utilisateurs'
    };
    return names[resource] || resource;
}

/**
 * Middleware pour vérifier si l'utilisateur est un super admin
 */
async function checkSuperAdmin(req, res, next) {
    try {
        if (!req.session || !req.session.userId) {
            return res.redirect('/admin/login');
        }
        
        const user = await User.findByPk(req.session.userId);
        
        if (!user) {
            return res.redirect('/admin/login');
        }
        
        const permissions = user.permissions || {};
        
        // Un super admin a accès à settings ou users
        if (!permissions.settings && !permissions.users) {
            return res.status(403).render('error', {
                title: 'Accès refusé',
                currentPath: req.path,
                errorCode: 403,
                errorTitle: 'Accès réservé aux super administrateurs',
                errorMessage: 'Seuls les super administrateurs peuvent accéder à cette section.',
                errorDetails: 'Cette fonctionnalité est réservée aux administrateurs avec des privilèges élevés. Contactez votre responsable si vous avez besoin d\'accès.',
                backLink: '/admin/dashboard'
            });
        }
        
        next();
    } catch (error) {
        console.error('Erreur lors de la vérification super admin:', error);
        res.status(500).send('Erreur serveur');
    }
}

/**
 * Middleware pour ajouter isSuperAdmin à toutes les vues
 */
async function addSuperAdminFlag(req, res, next) {
    res.locals.isSuperAdmin = false;
    
    if (req.session && req.session.userId) {
        try {
            const user = await User.findByPk(req.session.userId);
            if (user) {
                const permissions = user.permissions || {};
                // Un super admin a accès à settings ET users
                res.locals.isSuperAdmin = permissions.settings && permissions.users;
            }
        } catch (error) {
            console.error('Erreur lors de la vérification super admin flag:', error);
        }
    }
    
    next();
}

module.exports = {
    checkPermission,
    checkSuperAdmin,
    addSuperAdminFlag,
    getResourceName
};
