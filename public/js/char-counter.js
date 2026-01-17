/**
 * Compteur de caractères pour les champs de formulaire
 */

document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner tous les champs avec data-maxlength
    const fields = document.querySelectorAll('[data-maxlength]');
    
    fields.forEach(field => {
        const maxLength = parseInt(field.getAttribute('data-maxlength'));
        
        // Créer le compteur
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.setAttribute('data-field', field.id || field.name);
        
        // Insérer le compteur après le champ
        field.parentNode.insertBefore(counter, field.nextSibling);
        
        // Fonction pour mettre à jour le compteur
        function updateCounter() {
            const currentLength = field.value.length;
            const remaining = maxLength - currentLength;
            
            counter.textContent = `${remaining} / ${maxLength} caractères restants`;
            
            // Changer la couleur selon le pourcentage restant
            if (remaining < maxLength * 0.1) {
                counter.classList.add('char-counter-warning');
                counter.classList.remove('char-counter-good');
            } else if (remaining < maxLength * 0.3) {
                counter.classList.add('char-counter-good');
                counter.classList.remove('char-counter-warning');
            } else {
                counter.classList.remove('char-counter-warning', 'char-counter-good');
            }
            
            // Empêcher de dépasser la limite
            if (currentLength > maxLength) {
                field.value = field.value.substring(0, maxLength);
            }
        }
        
        // Mettre à jour au chargement
        updateCounter();
        
        // Mettre à jour à chaque saisie
        field.addEventListener('input', updateCounter);
        field.addEventListener('keyup', updateCounter);
        field.addEventListener('paste', function() {
            setTimeout(updateCounter, 10);
        });
    });
});
