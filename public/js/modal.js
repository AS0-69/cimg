// ========================================
// MODAL SYSTEM FOR EVENTS & NEWS
// ========================================

// Sample data - À remplacer par des vraies données de la base de données
const eventsData = [
    {
        id: 1,
        title: 'Conférence : Les valeurs islamiques',
        date: '2026-01-15',
        time: '20h00 - 22h00',
        location: 'Salle principale',
        category: 'Conférence',
        description: `Rejoignez-nous pour une conférence enrichissante sur l'importance des valeurs islamiques dans la vie quotidienne moderne.

Cette conférence abordera plusieurs thématiques importantes :
- Les piliers de la foi et leur application pratique
- L'éthique islamique dans le monde professionnel
- La famille et les valeurs islamiques
- Le rôle de la mosquée dans la préservation des valeurs

Intervenant: Sheikh Ahmed Ben Salah, imam et conférencier reconnu.

Places limitées, inscription recommandée.`,
        images: [
            '/images/Logo_CIMG_VF_GT_MOSAIQUE.png'
        ],
        tags: ['Conférence', 'Valeurs', 'Formation']
    },
    {
        id: 2,
        title: 'Cours d\'arabe pour débutants',
        date: '2026-01-20',
        time: '18h30 - 19h30',
        location: 'Salle 2',
        category: 'Cours',
        description: `Démarrage d'un nouveau cycle de cours d'arabe destiné aux débutants.

Programme du cours :
- Apprentissage de l'alphabet arabe
- Prononciation et règles de base
- Vocabulaire du quotidien
- Introduction à la lecture du Coran

Durée : 12 semaines (2 sessions par semaine)
Niveau : Débutant complet
Matériel pédagogique fourni

Les cours sont dispensés par des enseignants qualifiés avec une méthode progressive et adaptée.`,
        images: [
            '/images/Logo_CIMG_VF_GT_MOSAIQUE.png'
        ],
        tags: ['Cours', 'Arabe', 'Débutant', 'Langue']
    },
    {
        id: 3,
        title: 'Activité jeunesse : Sortie éducative',
        date: '2026-01-25',
        time: '14h00 - 18h00',
        location: 'Départ mosquée',
        category: 'Jeunesse',
        description: `Sortie éducative organisée pour les jeunes de 12 à 18 ans.

Au programme :
- Visite d'un site historique islamique
- Activités sportives en équipe
- Pique-nique convivial
- Discussions et partages

Cette sortie vise à renforcer les liens entre les jeunes de notre communauté tout en leur offrant une journée riche en découvertes et en apprentissages.

Encadrement assuré par des éducateurs expérimentés.
Autorisation parentale obligatoire pour les mineurs.

Prix : 15€ par personne (incluant transport et repas)`,
        images: [
            '/images/Logo_CIMG_VF_GT_MOSAIQUE.png'
        ],
        tags: ['Jeunesse', 'Sortie', 'Éducatif', 'Sport']
    }
];

const newsData = [
    {
        id: 1,
        title: 'Nouveau programme de cours d\'arabe',
        date: '2026-01-05',
        category: 'Éducation',
        description: `La mosquée est heureuse d'annoncer le lancement d'un nouveau programme complet de cours d'arabe pour tous les niveaux.

Ce programme innovant comprend :
- Cours pour enfants (6-12 ans)
- Cours pour adolescents (13-17 ans)
- Cours pour adultes débutants
- Cours avancés de tajweed

Les inscriptions sont ouvertes dès maintenant. Le programme débutera le 1er février 2026.

Nos enseignants sont tous diplômés et expérimentés dans l'enseignement de la langue arabe et du Coran.

Pour plus d'informations ou pour vous inscrire, contactez-nous au 04 74 68 00 00 ou passez au secrétariat de la mosquée.`,
        images: [
            '/images/Logo_CIMG_VF_GT_MOSAIQUE.png'
        ],
        tags: ['Éducation', 'Arabe', 'Cours', 'Nouveau']
    },
    {
        id: 2,
        title: 'Horaires du Ramadan 2026',
        date: '2026-01-03',
        category: 'Annonce',
        description: `Information importante concernant les horaires et activités durant le mois sacré de Ramadan 1447 (mars 2026).

La mosquée sera ouverte tous les jours pour :
- Prières de Tarawih (21h00)
- Iftar collectif (variable selon le calendrier)
- Cours de Coran quotidiens
- Conférences spirituelles hebdomadaires

Programme spécial des 10 derniers jours avec retraite spirituelle (I'tikaf).

Le calendrier détaillé des horaires de prière et d'iftar sera publié prochainement incha Allah.

Des bénévoles sont recherchés pour l'organisation des iftars collectifs. Si vous souhaitez participer, merci de vous manifester auprès du comité d'organisation.`,
        images: [
            '/images/Logo_CIMG_VF_GT_MOSAIQUE.png'
        ],
        tags: ['Ramadan', 'Horaires', 'Annonce']
    },
    {
        id: 3,
        title: 'Collecte pour les nécessiteux',
        date: '2025-12-28',
        category: 'Solidarité',
        description: `Lancement d'une grande collecte de denrées alimentaires et de vêtements pour aider les familles dans le besoin de notre région.

Cette initiative s'inscrit dans notre engagement solidaire et notre volonté d'aider les plus démunis.

Articles recherchés :
- Denrées non périssables (conserves, pâtes, riz, etc.)
- Vêtements chauds pour l'hiver
- Produits d'hygiène
- Couvertures et literie

Points de collecte :
- À la mosquée (tous les jours après la prière)
- Au secrétariat (horaires d'ouverture)

La distribution aura lieu le 15 janvier 2026.

Votre générosité fera la différence pour de nombreuses familles. Qu'Allah vous récompense pour votre bienfaisance.`,
        images: [
            '/images/Logo_CIMG_VF_GT_MOSAIQUE.png'
        ],
        tags: ['Solidarité', 'Collecte', 'Aide', 'Charité']
    }
];

// Modal functionality
function initModalSystem() {
    // Event modals
    const eventButtons = document.querySelectorAll('[data-event-id]');
    eventButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const eventId = parseInt(button.getAttribute('data-event-id'));
            openEventModal(eventId);
        });
    });
    
    // News modals
    const newsButtons = document.querySelectorAll('[data-news-id]');
    newsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const newsId = parseInt(button.getAttribute('data-news-id'));
            openNewsModal(newsId);
        });
    });
    
    // Close buttons
    document.querySelectorAll('.modal-close, .modal-overlay').forEach(element => {
        element.addEventListener('click', closeAllModals);
    });
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

async function openEventModal(eventId) {
    // Récupérer l'événement depuis l'API
    try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) {
            console.error('Erreur lors de la récupération de l\'événement');
            return;
        }
        const event = await response.json();
        if (!event) return;
        
        const modal = createModal(event, 'event');
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => modal.classList.add('active'), 10);
    } catch (error) {
        console.error('Erreur:', error);
    }
}

async function openNewsModal(newsId) {
    // Récupérer l'actualité depuis l'API
    try {
        const response = await fetch(`/api/news/${newsId}`);
        if (!response.ok) {
            console.error('Erreur lors de la récupération de l\'actualité');
            return;
        }
        const news = await response.json();
        if (!news) return;
        
        const modal = createModal(news, 'news');
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => modal.classList.add('active'), 10);
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function createModal(data, type) {
    const modal = document.createElement('div');
    modal.className = `${type}-modal`;
    modal.id = `${type}Modal${data.id}`;
    
    let currentImageIndex = 0;
    const hasImages = data.images && data.images.length > 0;
    
    // Format date - gérer à la fois 'date' (events) et 'createdAt' (news)
    const dateValue = data.date || data.createdAt;
    const dateObj = new Date(dateValue);
    const formattedDate = dateObj.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
    
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close" aria-label="Fermer">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="modal-body">
                ${hasImages ? `
                <div class="modal-gallery">
                    <img src="${data.images[0]}" alt="${data.title}" id="modalImage${data.id}">
                    ${data.images.length > 1 ? `
                    <div class="gallery-controls">
                        <button class="gallery-btn" id="prevBtn${data.id}">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <span class="gallery-counter" id="galleryCounter${data.id}">1 / ${data.images.length}</span>
                        <button class="gallery-btn" id="nextBtn${data.id}">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="carousel-progress-container">
                        <div class="carousel-progress-bar" id="carouselProgress${data.id}"></div>
                    </div>
                    ` : ''}
                </div>
                ` : `
                <div class="modal-gallery no-image"></div>
                `}
                
                <div class="modal-info">
                    <h2>${data.title}</h2>
                    
                    <div class="modal-meta">
                        <div class="modal-meta-item">
                            <i class="far fa-calendar"></i>
                            <span>${formattedDate}</span>
                        </div>
                        ${(data.time || data.start_time) ? `
                        <div class="modal-meta-item">
                            <i class="far fa-clock"></i>
                            <span>${data.time || (data.start_time && data.end_time ? `${data.start_time} - ${data.end_time}` : data.start_time)}</span>
                        </div>
                        ` : ''}
                        ${data.location ? `
                        <div class="modal-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${data.location}</span>
                        </div>
                        ` : ''}
                        <div class="modal-meta-item">
                            <i class="fas fa-tag"></i>
                            <span>${data.category}</span>
                        </div>
                    </div>
                    
                    <div class="modal-description">
                        ${(data.description || data.content || '').split('\n\n').map(p => `<p>${p}</p>`).join('')}
                    </div>
                    
                    ${data.tags && data.tags.length > 0 ? `
                    <div class="modal-tags">
                        ${data.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('')}
                    </div>
                    ` : ''}
                    
                    <div class="modal-actions">
                        ${type === 'event' && new Date(data.date) >= new Date() ? `
                        <button class="modal-action-btn primary">
                            <i class="fas fa-user-plus"></i>
                            S'inscrire
                        </button>
                        ` : ''}
                        <button class="modal-action-btn secondary share-btn" data-title="${data.title}" data-text="${(data.description || data.content || '').substring(0, 100) + '...'}" data-type="${type}" data-id="${data.id}">
                            <i class="fas fa-share-alt"></i>
                            Partager
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Gallery controls if multiple images
    if (hasImages && data.images.length > 1) {
        let carouselInterval;
        let progressInterval;
        let progressValue = 0;
        
        const updateImage = () => {
            const img = modal.querySelector(`#modalImage${data.id}`);
            const counter = modal.querySelector(`#galleryCounter${data.id}`);
            img.src = data.images[currentImageIndex];
            counter.textContent = `${currentImageIndex + 1} / ${data.images.length}`;
        };
        
        const startCarousel = () => {
            stopCarousel();
            progressValue = 0;
            
            const totalDuration = 5000;
            const updateInterval = 50;
            const progressStep = 100 / (totalDuration / updateInterval);
            
            progressInterval = setInterval(() => {
                progressValue += progressStep;
                if (progressValue >= 100) progressValue = 100;
                const progressBar = modal.querySelector(`#carouselProgress${data.id}`);
                if (progressBar) progressBar.style.width = progressValue + '%';
            }, updateInterval);
            
            carouselInterval = setInterval(() => {
                currentImageIndex = (currentImageIndex + 1) % data.images.length;
                updateImage();
                startCarousel();
            }, totalDuration);
        };
        
        const stopCarousel = () => {
            if (carouselInterval) clearInterval(carouselInterval);
            if (progressInterval) clearInterval(progressInterval);
        };
        
        modal.querySelector(`#prevBtn${data.id}`).addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + data.images.length) % data.images.length;
            updateImage();
            startCarousel();
        });
        
        modal.querySelector(`#nextBtn${data.id}`).addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % data.images.length;
            updateImage();
            startCarousel();
        });
        
        startCarousel();
    }
    
    // Close modal handlers
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.modal-overlay').addEventListener('click', () => closeModal(modal));
    
    // Share button handler
    const shareBtn = modal.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => handleShare(data, type));
    }
    
    return modal;
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => modal.remove(), 300);
}

function closeAllModals() {
    document.querySelectorAll('.event-modal, .news-modal').forEach(modal => {
        closeModal(modal);
    });
}

// ========================================
// SHARE FUNCTIONALITY
// ========================================
async function handleShare(data, type) {
    const url = `${window.location.origin}/${type === 'event' ? 'evenements' : 'actualites'}#${type}-${data.id}`;
    const title = data.title;
    const text = data.description ? data.description.substring(0, 150) + '...' : `Découvrez ${type === 'event' ? 'cet événement' : 'cette actualité'} sur le site de la Mosquée Bleue`;
    
    // Try Web Share API (native on mobile/modern browsers)
    if (navigator.share) {
        try {
            await navigator.share({
                title: title,
                text: text,
                url: url
            });
            showToast('Partagé avec succès !', 'success');
        } catch (err) {
            // User cancelled or error occurred
            if (err.name !== 'AbortError') {
                console.error('Erreur de partage:', err);
                showShareModal(title, text, url);
            }
        }
    } else {
        // Fallback: show share modal with options
        showShareModal(title, text, url);
    }
}

function showShareModal(title, text, url) {
    // Create share options modal
    const shareModal = document.createElement('div');
    shareModal.className = 'share-options-modal';
    shareModal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="share-modal-content">
            <button class="modal-close" aria-label="Fermer">
                <i class="fas fa-times"></i>
            </button>
            <h3><i class="fas fa-share-alt"></i> Partager</h3>
            
            <div class="share-link-container">
                <input type="text" value="${url}" readonly class="share-link-input" id="shareUrlInput">
                <button class="btn-copy-link" data-action="copy">
                    <i class="far fa-copy"></i> Copier
                </button>
            </div>
            
            <div class="share-socials">
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" class="share-social-btn facebook">
                    <i class="fab fa-facebook-f"></i>
                    <span>Facebook</span>
                </a>
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}" target="_blank" class="share-social-btn twitter">
                    <i class="fab fa-twitter"></i>
                    <span>Twitter</span>
                </a>
                <a href="https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}" target="_blank" class="share-social-btn whatsapp">
                    <i class="fab fa-whatsapp"></i>
                    <span>WhatsApp</span>
                </a>
                <a href="https://www.instagram.com/" target="_blank" class="share-social-btn instagram" data-action="copy-instagram" data-url="${url}">
                    <i class="fab fa-instagram"></i>
                    <span>Instagram</span>
                </a>
                <a href="mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}" class="share-social-btn email">
                    <i class="far fa-envelope"></i>
                    <span>Email</span>
                </a>
            </div>
        </div>
    `;
    
    document.body.appendChild(shareModal);
    setTimeout(() => shareModal.classList.add('active'), 10);
    
    // Copy button handler
    shareModal.querySelector('[data-action="copy"]').addEventListener('click', () => {
        const input = shareModal.querySelector('#shareUrlInput');
        navigator.clipboard.writeText(input.value).then(() => {
            showToast('Lien copié !', 'success');
        }).catch(() => {
            showToast('Erreur lors de la copie', 'error');
        });
    });
    
    // Instagram copy handler
    shareModal.querySelector('[data-action="copy-instagram"]').addEventListener('click', (e) => {
        e.preventDefault();
        const url = e.currentTarget.dataset.url;
        navigator.clipboard.writeText(url).then(() => {
            showToast('Lien copié ! Collez-le dans votre story Instagram', 'success');
        });
    });
    
    // Close handlers
    shareModal.querySelector('.modal-close').addEventListener('click', () => {
        shareModal.classList.remove('active');
        setTimeout(() => shareModal.remove(), 300);
    });
    shareModal.querySelector('.modal-overlay').addEventListener('click', () => {
        shareModal.classList.remove('active');
        setTimeout(() => shareModal.remove(), 300);
    });
}

// Global function for copy button
window.copyShareLink = function() {
    const input = document.getElementById('shareUrlInput');
    input.select();
    input.setSelectionRange(0, 99999); // For mobile
    
    try {
        document.execCommand('copy');
        showToast('Lien copié !', 'success');
    } catch (err) {
        // Fallback for modern browsers
        navigator.clipboard.writeText(input.value).then(() => {
            showToast('Lien copié !', 'success');
        }).catch(() => {
            showToast('Erreur lors de la copie', 'error');
        });
    }
};

// Toast notification system
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========================================
// EXPORT
// ========================================
window.modalSystem = {
    init: initModalSystem,
    openEvent: openEventModal,
    openNews: openNewsModal,
    eventsData,
    newsData
};
