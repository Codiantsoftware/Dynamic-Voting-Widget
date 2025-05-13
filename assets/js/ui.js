/**
 * UI handling functions for the voting widget
 */
class UiService {
    constructor(apiService, storageService) {
        this.apiService = apiService;
        this.storageService = storageService;
        this.ideas = [];

        // DOM elements
        this.ideasContainer = document.getElementById('ideas-container');
        this.loadingElement = document.getElementById('loading');
        this.errorElement = document.getElementById('error-message');
        this.editModal = document.getElementById('edit-modal');
        this.addModal = document.getElementById('add-modal');

        // Modal elements
        this.editForm = document.getElementById('edit-form');
        this.addForm = document.getElementById('add-form');

        // Buttons
        this.resetButton = document.getElementById('reset-all');
        this.addButton = document.getElementById('add-new');
        this.retryButton = document.getElementById('retry');
        this.closeModalButton = document.getElementById('close-modal');
        this.closeAddModalButton = document.getElementById('close-add-modal');

        // Sorting
        this.sortSelect = document.getElementById('sort-options');

        this.initEventListeners();
    }

    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Modal close buttons
        this.closeModalButton.addEventListener('click', () => this.hideModal(this.editModal));
        this.closeAddModalButton.addEventListener('click', () => this.hideModal(this.addModal));

        // Reset button
        this.resetButton.addEventListener('click', () => this.resetAll());

        // Add new idea button
        this.addButton.addEventListener('click', () => this.showAddModal());

        // Retry button
        this.retryButton.addEventListener('click', () => this.loadIdeas());

        // Edit form submission
        this.editForm.addEventListener('submit', (e) => this.handleEditSubmit(e));

        // Add form submission
        this.addForm.addEventListener('submit', (e) => this.handleAddSubmit(e));

        // Sort select
        this.sortSelect.addEventListener('change', () => this.sortIdeas());

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.editModal) {
                this.hideModal(this.editModal);
            }
            if (e.target === this.addModal) {
                this.hideModal(this.addModal);
            }
        });
    }

    /**
     * Load ideas from the API and render them
     */
    async loadIdeas() {
        try {
            this.showLoading();
            this.hideError();

            this.ideas = await this.apiService.fetchIdeas();

            // Apply custom order if exists
            const customOrder = this.storageService.getOrder();
            if (customOrder) {
                // Sort ideas based on the custom order
                this.ideas.sort((a, b) => {
                    const indexA = customOrder.indexOf(a.id);
                    const indexB = customOrder.indexOf(b.id);

                    // Handle new ideas that aren't in the saved order
                    if (indexA === -1) return 1;
                    if (indexB === -1) return -1;

                    return indexA - indexB;
                });
            }

            this.renderIdeas();
            this.hideLoading();
        } catch (error) {
            console.error('Error loading ideas:', error);
            this.hideLoading();
            this.showError();
        }
    }

    /**
     * Render the ideas in the container
     */
    renderIdeas() {
        this.ideasContainer.innerHTML = '';

        this.ideas.forEach(idea => {
            const card = this.createIdeaCard(idea);
            this.ideasContainer.appendChild(card);
        });

        // Initialize sortable functionality
        initSortable(this.ideasContainer, this.storageService);
    }

    /**
     * Create an idea card element
     * @param {Object} idea - The idea object
     * @returns {HTMLElement} The card element
     */
    createIdeaCard(idea) {
        const card = document.createElement('div');
        card.className = 'idea-card';
        card.dataset.id = idea.id;

        card.innerHTML = `
            <img src="${idea.image}" alt="${idea.title}" class="card-image">
            <button class="edit-btn" title="Edit">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5z"/>
                </svg>
            </button>
            <div class="card-content">
                <h3 class="card-title">${idea.title}</h3>
                <p class="card-description">${idea.description}</p>
                <a href="${idea.buttonLink}" class="btn btn-outline" target="_blank">${idea.buttonLabel}</a>
                <div class="card-actions">
                    <div class="vote-actions">
                        <button class="vote-btn upvote" data-id="${idea.id}" data-action="up">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                            </svg>
                            <span>${idea.upVotes || 0}</span>
                        </button>
                        <span class="vote-count">${idea.voteCount || 0}</span>
                        <button class="vote-btn downvote" data-id="${idea.id}" data-action="down">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                            </svg>
                            <span>${idea.downVotes || 0}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        const editBtn = card.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => this.showEditModal(idea));

        const upvoteBtn = card.querySelector('.upvote');
        upvoteBtn.addEventListener('click', () => this.handleVote(idea.id, 'up'));

        const downvoteBtn = card.querySelector('.downvote');
        downvoteBtn.addEventListener('click', () => this.handleVote(idea.id, 'down'));

        return card;
    }

    /**
     * Handle vote button click
     * @param {string} id - The ID of the idea
     * @param {string} voteType - The type of vote ('up' or 'down')
     */
    async handleVote(id, voteType) {
        try {
            const updatedIdeas = await this.apiService.updateVote(id, voteType);
            this.ideas = updatedIdeas;

            // Update only the specific card for better performance
            const card = document.querySelector(`.idea-card[data-id="${id}"]`);
            const idea = this.ideas.find(idea => idea.id === id);

            if (card && idea) {
                const voteCountElement = card.querySelector('.vote-count');
                const upVoteElement = card.querySelector('.upvote span');
                const downVoteElement = card.querySelector('.downvote span');

                voteCountElement.textContent = idea.voteCount;
                upVoteElement.textContent = idea.upVotes;
                downVoteElement.textContent = idea.downVotes;
            }

            this.showToast(`Vote ${voteType}!`);
        } catch (error) {
            console.error('Error handling vote:', error);
            this.showToast('Error updating vote', true);
        }
    }

    /**
     * Show the edit modal
     * @param {Object} idea - The idea object to edit
     */
    showEditModal(idea) {
        // Populate the form
        document.getElementById('edit-id').value = idea.id;
        document.getElementById('edit-title').value = idea.title;
        document.getElementById('edit-description').value = idea.description;
        document.getElementById('edit-image').value = idea.image;
        document.getElementById('edit-button-label').value = idea.buttonLabel;
        document.getElementById('edit-button-link').value = idea.buttonLink;

        // Show the modal
        this.showModal(this.editModal);
    }

    /**
     * Show the add new idea modal
     */
    showAddModal() {
        // Reset the form
        this.addForm.reset();

        // Show the modal
        this.showModal(this.addModal);
    }

    /**
     * Handle edit form submission
     * @param {Event} e - The form submit event
     */
    async handleEditSubmit(e) {
        e.preventDefault();

        const id = document.getElementById('edit-id').value;
        const title = document.getElementById('edit-title').value;
        const description = document.getElementById('edit-description').value;
        const image = document.getElementById('edit-image').value;
        const buttonLabel = document.getElementById('edit-button-label').value;
        const buttonLink = document.getElementById('edit-button-link').value;

        try {
            // Find the idea to keep the vote counts
            const currentIdea = this.ideas.find(idea => idea.id === id);

            const updatedIdea = {
                ...currentIdea,
                title,
                description,
                image,
                buttonLabel,
                buttonLink
            };

            const updatedIdeas = await this.apiService.updateIdea(updatedIdea);
            this.ideas = updatedIdeas;

            this.renderIdeas();
            this.hideModal(this.editModal);
            this.showToast('Idea updated successfully!');
        } catch (error) {
            console.error('Error updating idea:', error);
            this.showToast('Error updating idea', true);
        }
    }

    /**
     * Handle add form submission
     * @param {Event} e - The form submit event
     */
    async handleAddSubmit(e) {
        e.preventDefault();

        const title = document.getElementById('add-title').value;
        const description = document.getElementById('add-description').value;
        const image = document.getElementById('add-image').value;
        const buttonLabel = document.getElementById('add-button-label').value;
        const buttonLink = document.getElementById('add-button-link').value;

        try {
            const newIdea = {
                title,
                description,
                image,
                buttonLabel,
                buttonLink
            };

            const updatedIdeas = await this.apiService.addIdea(newIdea);
            this.ideas = updatedIdeas;

            this.renderIdeas();
            this.hideModal(this.addModal);
            this.showToast('New idea added successfully!');
        } catch (error) {
            console.error('Error adding idea:', error);
            this.showToast('Error adding idea', true);
        }
    }

    /**
     * Reset all data to original API data
     */
    async resetAll() {
        if (confirm('Are you sure you want to reset all ideas to the original data? This cannot be undone.')) {
            try {
                this.showLoading();

                const resetIdeas = await this.apiService.resetAll();
                this.ideas = resetIdeas;

                this.renderIdeas();
                this.hideLoading();
                this.showToast('All ideas have been reset to default!');
            } catch (error) {
                console.error('Error resetting ideas:', error);
                this.hideLoading();
                this.showToast('Error resetting ideas', true);
            }
        }
    }

    /**
     * Sort ideas based on selected sort option
     */
    sortIdeas() {
        const sortOption = this.sortSelect.value;

        switch (sortOption) {
            case 'votes-high':
                this.ideas.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
                break;
            case 'votes-low':
                this.ideas.sort((a, b) => (a.voteCount || 0) - (b.voteCount || 0));
                break;
            case 'title':
                this.ideas.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'default':
                // Reset to saved order or original order
                const customOrder = this.storageService.getOrder();
                if (customOrder) {
                    this.ideas.sort((a, b) => {
                        const indexA = customOrder.indexOf(a.id);
                        const indexB = customOrder.indexOf(b.id);

                        if (indexA === -1) return 1;
                        if (indexB === -1) return -1;

                        return indexA - indexB;
                    });
                }
                break;
        }

        this.renderIdeas();
    }

    /**
     * Show a toast notification
     * @param {string} message - The message to show
     * @param {boolean} isError - Whether the toast is an error message
     */
    showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.className = `toast ${isError ? 'error' : ''}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Remove the toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    /**
     * Show a modal
     * @param {HTMLElement} modal - The modal element to show
     */
    showModal(modal) {
        modal.classList.remove('hidden');
    }

    /**
     * Hide a modal
     * @param {HTMLElement} modal - The modal element to hide
     */
    hideModal(modal) {
        modal.classList.add('hidden');
    }

    /**
     * Show the loading indicator
     */
    showLoading() {
        this.loadingElement.classList.remove('hidden');
    }

    /**
     * Hide the loading indicator
     */
    hideLoading() {
        this.loadingElement.classList.add('hidden');
    }

    /**
     * Show the error message
     */
    showError() {
        this.errorElement.classList.remove('hidden');
    }

    /**
     * Hide the error message
     */
    hideError() {
        this.errorElement.classList.add('hidden');
    }
}