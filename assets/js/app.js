/**
 * Main application entry point
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize services
    const apiService = new ApiService();
    const storageService = new StorageService();
    const uiService = new UiService(apiService, storageService);

    // Load initial data
    uiService.loadIdeas();
});