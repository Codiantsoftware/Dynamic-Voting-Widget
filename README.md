# Dynamic Voting Widget

A responsive and interactive voting widget that allows users to view, vote on, edit, and reorder ideas.

## Features

- **Dynamic Card Generation**: Loads idea cards from an API
- **Voting System**: Users can upvote and downvote ideas
- **Edit Functionality**: Edit card details via modal
- **Persistence**: Changes persist after page reload
- **Drag & Drop**: Reorder cards with drag and drop
- **Sorting**: Sort cards based on votes or title
- **Add New Ideas**: Create new idea cards
- **Reset All**: Restore original data
- **Responsive Design**: Works on all screen sizes
- **Error Handling**: Robust error handling and loading states

## Tech Stack

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with CSS variables and Flexbox/Grid
- **Vanilla JavaScript**: No dependencies, pure JS implementation
- **LocalStorage API**: For client-side data persistence
- **Drag & Drop API**: Native browser API for drag and drop

## Project Structure

```
voting-widget/
│
├── index.html                 # Main HTML file
│
├── assets/
│   ├── css/
│   │   └── styles.css         # CSS styles
│   │
│   └── js/
│       ├── api.js             # API handling
│       ├── storage.js         # LocalStorage management
│       ├── ui.js              # UI rendering and interaction
│       ├── sortable.js        # Drag and drop functionality
│       └── app.js             # Main application entry point
```

## Implementation Details

### Architecture

The application follows a modular and service-oriented architecture:

- **ApiService**: Handles API communication and data operations
- **StorageService**: Manages local storage and persistence
- **UiService**: Controls UI rendering and user interaction
- **SortableModule**: Implements drag and drop functionality

### Data Flow

1. The app loads ideas from the API (or from localStorage if available)
2. The UI renders the idea cards
3. User interactions (voting, editing, sorting) update the model
4. Changes are persisted to localStorage
5. UI is updated to reflect changes

### Key Implementation Decisions

- Used a module-based approach for better code organization and maintainability
- Used localStorage for persistence to avoid unnecessary API calls
- Optimized performance by only updating necessary elements when possible
- Added comprehensive error handling and loading states

## How to Use

1. Clone the repository
2. Open `index.html` in a web browser
3. Interact with the voting widget:
   - Click the upvote/downvote buttons to change votes
   - Click the edit button (pencil icon) to modify a card
   - Drag cards to reorder them
   - Use the sort dropdown to change the display order
   - Click "Add New Idea" to create a new card
   - Click "Reset All" to restore the original data