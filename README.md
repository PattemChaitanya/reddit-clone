# Reddit Clone

A responsive Reddit clone built with modern web technologies. This project demonstrates advanced React development skills and can be used as a portfolio project.

![Reddit Clone Screenshot](./screenshot.png)

## Features

- Responsive UI that mimics Reddit's design
- Light and dark mode support
- View posts and comments
- Nested comments with expand/collapse functionality
- Upvote/downvote posts and comments
- Sort posts by different criteria (hot, new, top, controversial)
- Browse subreddits and view subreddit details
- Search for posts and subreddits
- View user profiles
- Mock API for simulating backend interactions
- Comprehensive unit and integration tests

## Technologies Used

- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Redux Toolkit** - State management
- **React Router** - Navigation and routing
- **Material UI** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form validation and handling
- **Webpack** - Module bundler
- **Axios** - HTTP client
- **date-fns** - Date utility library
- **Jest** - Testing framework
- **React Testing Library** - Testing utilities

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/reddit-clone.git
cd reddit-clone
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Testing

This project includes a comprehensive test suite with both unit and integration tests:

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### Test Structure

Tests are organized as follows:

- Unit tests for individual components in `src/components/__tests__/`
- Unit tests for Redux store and slices in `src/store/__tests__/`
- Integration tests for pages in `src/pages/__tests__/`
- App routing tests in `src/__tests__/`

### Testing Approach

- **Unit Tests**: Test individual components in isolation with mocked dependencies
- **Integration Tests**: Test component interactions within a page
- **Redux Tests**: Test state management logic
- **Route Tests**: Test navigation and routing functionality

## Build for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
reddit-clone/
├── public/              # Static files
├── src/                 # Source code
│   ├── assets/          # Assets (images, etc.)
│   ├── components/      # Reusable components
│   │   └── __tests__/   # Component tests
│   ├── pages/           # Page components
│   │   └── __tests__/   # Page tests
│   ├── services/        # API services
│   ├── store/           # Redux store
│   │   └── __tests__/   # Redux tests
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   ├── __tests__/       # App-level tests
│   ├── App.tsx          # Main App component
│   ├── index.tsx        # Entry point
│   ├── index.css        # Global styles
│   └── theme.ts         # Theme configuration
├── jest.config.js       # Jest configuration
├── .gitignore           # Git ignore file
├── package.json         # Dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── webpack.config.js    # Webpack configuration
└── README.md            # Project documentation
```

## Features to Add

- User authentication
- Create and edit posts
- Create and moderate subreddits
- User settings
- Award system
- Notifications
- Real backend integration

## License

This project is open source and available under the [MIT License](LICENSE).

## Credits

- Design inspired by [Reddit](https://www.reddit.com/)
- Built with ❤️ by Chaitanya Pattem