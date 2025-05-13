/**
 * API handling functions for the voting widget
 */
class ApiService {
    constructor() {
        this.apiUrl = 'https://my.beastscan.com/test-kit';
        this.storageService = new StorageService();
    }

    /**
     * Fetch ideas from the API
     * @returns {Promise<Array>} Array of idea objects
     */
    async fetchIdeas() {
        try {
            // Check if we have local data first
            const localData = this.storageService.getIdeas();
            if (localData && localData.length > 0) {
                return localData;
            }

            // If no local data, fetch from API
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            // Format data to match our app structure
            const enrichedData = data.map(idea => ({
                id: idea.id || this._generateId(),
                title: idea.title,
                description: idea.description,
                image: idea.image,
                upVotes: idea.votes?.up || 0,
                downVotes: idea.votes?.down || 0,
                voteCount: (idea.votes?.up || 0) - (idea.votes?.down || 0),
                buttonLabel: idea.button?.label || "Learn More",
                buttonLink: idea.button?.url || "https://www.beastscan.com"
            }));

            // Save to local storage
            this.storageService.saveIdeas(enrichedData);

            return enrichedData;
        } catch (error) {
            console.error('Error fetching ideas:', error);
            throw error;
        }
    }

    /**
     * Update an idea in the local storage
     * @param {Object} updatedIdea - The updated idea object
     * @returns {Promise<Array>} Updated array of ideas
     */
    async updateIdea(updatedIdea) {
        try {
            // In a real app, we would make an API call here
            // For this demo, we'll just update local storage
            const ideas = this.storageService.getIdeas();
            const updatedIdeas = ideas.map(idea =>
                idea.id === updatedIdea.id ? updatedIdea : idea
            );

            this.storageService.saveIdeas(updatedIdeas);
            return updatedIdeas;
        } catch (error) {
            console.error('Error updating idea:', error);
            throw error;
        }
    }

    /**
     * Add a new idea to the collection
     * @param {Object} newIdea - The new idea to add
     * @returns {Promise<Array>} Updated array of ideas
     */
    async addIdea(newIdea) {
        try {
            // Add a unique ID and default vote counts
            const ideaWithId = {
                ...newIdea,
                id: this._generateId(),
                upVotes: 0,
                downVotes: 0,
                voteCount: 0
            };

            const ideas = this.storageService.getIdeas() || [];
            const updatedIdeas = [...ideas, ideaWithId];

            this.storageService.saveIdeas(updatedIdeas);
            return updatedIdeas;
        } catch (error) {
            console.error('Error adding idea:', error);
            throw error;
        }
    }

    /**
     * Update the vote count for an idea
     * @param {string} id - The ID of the idea
     * @param {string} voteType - The type of vote ('up' or 'down')
     * @returns {Promise<Array>} Updated array of ideas
     */
    async updateVote(id, voteType) {
        try {
            const ideas = this.storageService.getIdeas();
            const updatedIdeas = ideas.map(idea => {
                if (idea.id === id) {
                    const updatedIdea = { ...idea };

                    if (voteType === 'up') {
                        updatedIdea.upVotes = (updatedIdea.upVotes || 0) + 1;
                    } else if (voteType === 'down') {
                        updatedIdea.downVotes = (updatedIdea.downVotes || 0) + 1;
                    }

                    // Calculate the net vote count
                    updatedIdea.voteCount = updatedIdea.upVotes - updatedIdea.downVotes;

                    return updatedIdea;
                }
                return idea;
            });

            this.storageService.saveIdeas(updatedIdeas);
            return updatedIdeas;
        } catch (error) {
            console.error('Error updating vote:', error);
            throw error;
        }
    }

    /**
     * Reset all data to original API data
     * @returns {Promise<Array>} Reset array of ideas
     */
    async resetAll() {
        try {
            // Clear local storage and fetch fresh data
            this.storageService.clearIdeas();

            // Fetch fresh data from API
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            // Format data to match our app structure
            const enrichedData = data.map(idea => ({
                id: idea.id || this._generateId(),
                title: idea.title,
                description: idea.description,
                image: idea.image,
                upVotes: idea.votes?.up || 0,
                downVotes: idea.votes?.down || 0,
                voteCount: (idea.votes?.up || 0) - (idea.votes?.down || 0),
                buttonLabel: idea.button?.label || "Learn More",
                buttonLink: idea.button?.url || "https://www.beastscan.com"
            }));

            // Save to local storage
            this.storageService.saveIdeas(enrichedData);

            return enrichedData;
        } catch (error) {
            console.error('Error resetting data:', error);
            throw error;
        }
    }

    /**
     * Generate a unique ID for new ideas
     * @returns {string} Unique ID
     * @private
     */
    _generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
}