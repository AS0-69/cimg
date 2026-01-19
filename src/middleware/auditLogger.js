/**
 * Middleware pour logger automatiquement toutes les actions admin
 */

const AuditLog = require('../models/AuditLog');

/**
 * Récupérer l'adresse IP du client
 */
function getClientIp(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] || 
           req.connection?.remoteAddress || 
           req.socket?.remoteAddress || 
           req.connection?.socket?.remoteAddress ||
           'unknown';
}

/**
 * Logger une action dans la base de données
 */
async function logAction({
    userId,
    username,
    action,
    resourceType = null,
    resourceId = null,
    resourceName = null,
    description = null,
    oldValues = null,
    newValues = null,
    ipAddress,
    userAgent,
    status = 'SUCCESS',
    errorMessage = null
}) {
    try {
        await AuditLog.create({
            user_id: userId,
            username: username,
            action: action,
            resource_type: resourceType,
            resource_id: resourceId,
            resource_name: resourceName,
            description: description,
            old_values: oldValues,
            new_values: newValues,
            ip_address: ipAddress,
            user_agent: userAgent,
            status: status,
            error_message: errorMessage
        });
    } catch (error) {
        // Ne pas bloquer l'application si le logging échoue
        console.error('Erreur lors du logging audit:', error);
    }
}

/**
 * Middleware pour logger les connexions
 */
async function logLogin(req, username, success = true, errorMessage = null) {
    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    await logAction({
        userId: req.session?.userId || null,
        username: username,
        action: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
        description: success ? 
            `Connexion réussie depuis ${ipAddress}` : 
            `Tentative de connexion échouée: ${errorMessage}`,
        ipAddress: ipAddress,
        userAgent: userAgent,
        status: success ? 'SUCCESS' : 'FAILURE',
        errorMessage: errorMessage
    });
}

/**
 * Middleware pour logger les déconnexions
 */
async function logLogout(req) {
    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    await logAction({
        userId: req.session?.userId || null,
        username: req.session?.username || 'unknown',
        action: 'LOGOUT',
        description: `Déconnexion depuis ${ipAddress}`,
        ipAddress: ipAddress,
        userAgent: userAgent
    });
}

/**
 * Middleware pour logger les actions CRUD
 */
async function logCRUD(req, action, resourceType, resourceId = null, resourceName = null, oldValues = null, newValues = null, description = null) {
    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    // Générer une description automatique si non fournie
    if (!description) {
        const actionText = {
            'CREATE': 'Création',
            'UPDATE': 'Modification',
            'DELETE': 'Suppression',
            'VIEW': 'Consultation'
        }[action] || action;
        
        const resourceText = {
            'EVENT': 'événement',
            'NEWS': 'actualité',
            'QUOTE': 'citation',
            'MEMBER': 'membre',
            'DONATION': 'campagne de don'
        }[resourceType] || resourceType;
        
        description = `${actionText} ${resourceText}${resourceName ? ': ' + resourceName : ''}`;
    }
    
    await logAction({
        userId: req.session?.userId || null,
        username: req.session?.username || 'unknown',
        action: action,
        resourceType: resourceType,
        resourceId: resourceId,
        resourceName: resourceName,
        description: description,
        oldValues: oldValues,
        newValues: newValues,
        ipAddress: ipAddress,
        userAgent: userAgent
    });
}

/**
 * Middleware pour logger automatiquement les requêtes POST/DELETE sur les routes admin
 */
function autoLogMiddleware(req, res, next) {
    // Sauvegarder la fonction send originale
    const originalSend = res.send;
    
    // Override res.send pour logger après la réponse
    res.send = function(data) {
        // Restaurer la fonction originale
        res.send = originalSend;
        
        // Logger l'action si c'est une route admin modifiant des données
        if (req.session?.userId && (req.method === 'POST' || req.method === 'DELETE')) {
            // Ne pas logger les routes de login/logout (déjà géré)
            if (!req.path.includes('/login') && !req.path.includes('/logout')) {
                // Logger sera fait manuellement dans les routes spécifiques
            }
        }
        
        // Envoyer la réponse
        return res.send(data);
    };
    
    next();
}

module.exports = {
    logLogin,
    logLogout,
    logCRUD,
    logAction,
    autoLogMiddleware,
    getClientIp
};
