
# <p align="center">**📺 Multimodal video access interface**</p>


## 🔍 Overview
AI Challenge Front-End là ứng dụng giao diện tương tác người dùng dành cho cuộc thi AI Challenge năm 2025, được xây dựng với mục tiêu mang lại một trải nghiệm trực quan, hiện đại và mượt mà khi tương tác với các tính năng AI.

## 🔑 Key Features
- 🔎 Video search and preview
- 🎬 Progress tracking and refinement panel
- 📱 Responsive design for mobile and desktop
- ⚡ Modular component structure
- 📊 Mock database for development

## 🛠️ Tech Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)


## 📂 Project Structure
```
front-end/
├── public/                # Static assets
├── src/
│   ├── assets/            # Images and media
│   ├── components/        # Reusable UI components
│   │   ├── layout/        # Layout components (e.g., AppHeader)
│   │   ├── ui/            # UI primitives 
│   │   │   ├── buttons/   # Button components
│   │   │   ├── dialogs/   # Dialog components
│   │   │   └── ...        # Other UI primitives
│   ├── context/           # React context providers
│   ├── data/              # Mock data and database
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components (routing targets)
│   ├── App.tsx            # Main app component
│   └── main.tsx           # App entry point
├── .env                   # Environment variables
├── index.html             # HTML template
├── package.json           # Project metadata and scripts
├── tailwind.config.ts     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
├── README.md              # Documentation
└── ...
```


## ✨ Demo
- 🔗 Live Demo: [ai-challenge-frontend.vercel.app](https://ai-challenge-frontend.vercel.app)
- 🎬 Backend Repository: [AI_Challenge_Backend](https://github.com/dngan0365/AI_Challenge_Backend)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or bun

### 💻 Frontend Setup (React)
#### 1. Clone the repository:
```sh
git clone https://github.com/dngan0365/AI_Challenge_Frontend.git
cd AI_Challenge_Frontend
```

#### 2. Install dependencies:
```sh
npm install # or yarn install, or bun install
```

#### 3. Running the Development Server
```sh
npm run dev # or yarn dev, or bun run dev
```

Open your browser at the URL shown in the console (default: `http://localhost:8080`).

#### 4. Building for Production
```sh
npm run build # or yarn build, or bun run build
```
### ⚙️ Backend Setup (FastAPI)
#### 1. Clone the repository:
```sh
git clone https://github.com/dngan0365/AI_Challenge_Backend.git
cd AI_Challenge_Backend
```
#### 2. Create and activate a virtual environment:
```sh
python -m venv venv
venv\Scripts\activate      # Windows
source venv/bin/activate   # macOS/Linux
```

#### 3. Install dependencies:
```sh
pip install -r requirements.txt
```

#### 4. Run the backend:
```sh
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 🌐 Deployment
The application is deployed at: [ai-challenge-frontend.vercel.app](https://ai-challenge-frontend.vercel.app)

<img src="src\assets\default_interface.png" width="100%">
<img src="src\assets\search_interface.png" width="100%">
<img src="src\assets\result_sample.png" width="100%">

