/**
 * Storage service for managing local data persistence
 */
class StorageService {
    constructor() {
        this.storageKey = 'voting_widget_ideas';
        this.orderKey = 'voting_widget_order';
    }

    /**
     * Get ideas from local storage
     * @returns {Array} Array of idea objects
     */
    getIdeas() {
        try {
            const storedData = localStorage.getItem(this.storageKey);
            return storedData ? JSON.parse(storedData) : null;
        } catch (error) {
            console.error('Error getting ideas from storage:', error);
            return null;
        }
    }

    /**
     * Save ideas to local storage
     * @param {Array} ideas - Array of idea objects
     */
    saveIdeas(ideas) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(ideas));
        } catch (error) {
            console.error('Error saving ideas to storage:', error);
        }
    }

    /**
     * Clear ideas from local storage
     */
    clearIdeas() {
        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.orderKey);
        } catch (error) {
            console.error('Error clearing ideas from storage:', error);
        }
    }

    /**
     * Save the custom order of ideas
     * @param {Array} orderIds - Array of idea IDs in custom order
     */
    saveOrder(orderIds) {
        try {
            localStorage.setItem(this.orderKey, JSON.stringify(orderIds));
        } catch (error) {
            console.error('Error saving order to storage:', error);
        }
    }

    /**
     * Get the custom order of ideas
     * @returns {Array} Array of idea IDs in custom order
     */
    getOrder() {
        try {
            const storedOrder = localStorage.getItem(this.orderKey);
            return storedOrder ? JSON.parse(storedOrder) : null;
        } catch (error) {
            console.error('Error getting order from storage:', error);
            return null;
        }
    }
}