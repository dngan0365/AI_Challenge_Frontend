
# AI Challenge Front-End

This is the front-end application for the AI Challenge project. It is built using React, TypeScript, Vite, and Tailwind CSS, providing a modern, fast, and responsive user interface for interacting with AI-powered features.

## Features

- Video search and preview
- Progress tracking and refinement panel
- Responsive design for mobile and desktop
- Modular component structure
- Mock database for development

## Tech Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or bun

### Installation

1. Clone the repository:
	```sh
	git clone https://github.com/dngan0365/AI_Challenge_Frontend.git
	cd AI_Challenge_Frontend
	```
2. Install dependencies:
	```sh
	npm install
	# or
	yarn install
	# or
	bun install
	```

### Running the Development Server

```sh
npm run dev
# or
yarn dev
# or
bun run dev
```

The app will be available at `http://localhost:5173` by default.

### Building for Production

```sh
npm run build
# or
yarn build
# or
bun run build
```

## Project Structure

```
front-end/
├── public/                # Static assets
├── src/
│   ├── assets/            # Images and media
│   ├── components/        # Reusable UI components
│   │   ├── layout/        # Layout components (e.g., AppHeader)
│   │   └── ui/            # UI primitives (buttons, dialogs, etc.)
│   ├── context/           # React context providers
│   ├── data/              # Mock data and database
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components (routing targets)
│   ├── App.tsx            # Main app component
│   └── main.tsx           # App entry point
├── index.html             # HTML template
├── package.json           # Project metadata and scripts
├── tailwind.config.ts     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
└── ...
```

## Contributing

Contributions are welcome! Please open issues or pull requests for suggestions and improvements.

## License

This project is licensed under the MIT License.
