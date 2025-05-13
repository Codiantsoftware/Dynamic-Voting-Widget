/**
 * Handles drag and drop sorting functionality
 * @param {HTMLElement} container - The container element for sortable items
 * @param {Object} storageService - The storage service instance
 */
function initSortable(container, storageService) {
    if (!container) return;

    let draggedItem = null;
    let placeholder = null;
    let cards = Array.from(container.querySelectorAll('.idea-card'));

    // Initialize drag events for all cards
    cards.forEach(card => {
        // Make the card draggable
        card.setAttribute('draggable', true);

        // Drag start event
        card.addEventListener('dragstart', function (e) {
            draggedItem = this;

            // Create placeholder
            placeholder = document.createElement('div');
            placeholder.className = 'idea-card drag-placeholder';
            placeholder.style.height = `${this.offsetHeight}px`;

            // Set drag image and effects
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', this.dataset.id);

            // Add dragging class after a short delay
            setTimeout(() => {
                this.classList.add('dragging');
            }, 0);
        });

        // Drag end event
        card.addEventListener('dragend', function () {
            this.classList.remove('dragging');
            draggedItem = null;

            // Remove placeholder if it exists
            if (placeholder && placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
            }
            placeholder = null;

            // Save the new order
            saveCurrentOrder(container, storageService);
        });

        // Drag over event
        card.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            if (draggedItem === this) return;

            // Get the middle of the current card
            const rect = this.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;

            // Determine if we should place the placeholder before or after this card
            if (e.clientY < midY) {
                // Insert before
                if (placeholder && placeholder.nextSibling !== this) {
                    container.insertBefore(placeholder, this);
                }
            } else {
                // Insert after
                if (placeholder && placeholder !== this.nextSibling) {
                    container.insertBefore(placeholder, this.nextSibling);
                }
            }
        });

        // Drag enter event
        card.addEventListener('dragenter', function (e) {
            e.preventDefault();
            if (draggedItem === this) return;
        });
    });

    // Container level events
    container.addEventListener('dragover', function (e) {
        e.preventDefault();

        // If we're not over a card but over the container itself
        if (!e.target.closest('.idea-card')) {
            const mouseY = e.clientY;
            const cards = Array.from(container.querySelectorAll('.idea-card:not(.dragging)'));

            // Find the appropriate position based on mouse position
            let closestCard = null;
            let closestDistance = Number.MAX_VALUE;

            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardMiddleY = rect.top + rect.height / 2;
                const distance = Math.abs(mouseY - cardMiddleY);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestCard = card;
                }
            });

            // Position the placeholder based on closest card
            if (closestCard) {
                const rect = closestCard.getBoundingClientRect();
                const isBelow = mouseY > rect.top + rect.height / 2;

                if (isBelow) {
                    container.insertBefore(placeholder, closestCard.nextSibling);
                } else {
                    container.insertBefore(placeholder, closestCard);
                }
            } else {
                // If no cards or far from any card, append to end
                container.appendChild(placeholder);
            }
        }
    });

    container.addEventListener('drop', function (e) {
        e.preventDefault();

        if (!draggedItem || !placeholder) return;

        // Insert the dragged item where the placeholder is
        container.insertBefore(draggedItem, placeholder);

        // Remove placeholder
        if (placeholder.parentNode) {
            placeholder.parentNode.removeChild(placeholder);
        }

        // Save the new order
        saveCurrentOrder(container, storageService);
    });
}

/**
 * Save the current order of cards to storage
 * @param {HTMLElement} container - The container element for sortable items
 * @param {Object} storageService - The storage service instance
 */
function saveCurrentOrder(container, storageService) {
    const cards = Array.from(container.querySelectorAll('.idea-card'));
    const orderIds = cards.map(card => card.dataset.id);

    storageService.saveOrder(orderIds);
}