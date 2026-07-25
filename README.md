# 🚀 HackOps AI — The AI Operations Layer for Hackathons

[![Next.js 14](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_WebGL-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

> **"Devfolio tells you who registered. HackOps AI tells you who should team up, who needs help right now, and who is actually worth hiring."**

HackOps AI is a production-grade AI-operations layer designed for hackathon organizers, judges, mentors, and participants. It automates code reviews with multi-rubric LLM radar charts, calculates real-time skill complementarity matrix distance, and dispatches AI mentor triage.

---

## ✨ Features Breakdown

### 1. 🌟 3D Live WebGL Landing Page (`/landing`)
- Built with **Three.js** featuring interactive particle constellation meshes, icosahedron cyber cores, torus rings, and smooth camera parallax.
- Glassmorphic **3D Auth Modal** supporting instant Sign In and Account Creation with persona selection (Judge, Participant, Mentor, Organizer).

### 2. ⚡ Live AI Evaluation Hub (`/evaluation`)
- **Clean Interactive Workbench**: Paste or enter any project title, GitHub repository URL, description/README, and file tree.
- **Google Gemini 1.5 Flash Integration**: Real-time multi-rubric evaluation across **Innovation, Technical Complexity, Completeness, and UX/Presentation**.
- **Interactive Recharts Radar Chart**: Visual breakdown comparing team performance against top 10 hackathon averages.
- **Exportable Markdown Reports**: One-click export of structured evaluation summaries for hackathon organizers.

### 3. 📂 Standalone Projects Directory (`/projects`)
- Comprehensive repositories browser with **Grid View** and **List View** toggles.
- Filter by category tabs (*AIML, Healthcare, EdTech, Agritech, FinTech, Travel, Blockchain, Social Impact*), keyword search, and sorting.
- Live **"+ Submit New Project"** modal for real-time project additions.

### 4. 👥 Team Complementarity Engine (`/participant/team-matching`)
- Skill vector distance algorithm evaluating one-hot skill matrices to recommend well-rounded, complementary team rosters.
- Skill deficit alerts (*e.g., "Team lacks UI/UX Specialist"*) and live team acceptance metrics.

### 5. 💬 AI Mentor Triage & Escalation (`/participant/mentor-assistant`)
- Instant technical diagnosis assistant powered by Gemini for quick code/architecture advice.
- Real-time mentor matching and video session request scheduling.

### 6. ⚙️ Settings & Gemini API Configurator (`/settings`)
- Persona switcher (*Judge, Participant, Mentor, Organizer, Sponsor*).
- Client-side **Google Gemini API Key Configurator** saved securely in local session context.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS Glassmorphism
- **3D Engine**: [Three.js](https://threejs.org/)
- **AI SDK**: Official `@google/generative-ai` (`gemini-1.5-flash`)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Persistence**: React Context API (`AppContext`) + `localStorage`

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and `npm` installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Varun-Khandelwal31/Hackers-AI.git
   cd Hackers-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional):**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
   *(Note: You can also enter your Gemini API Key directly inside the app under Settings → API Keys).*

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) (or the active port displayed in terminal).

---

## 🏗️ Architecture Overview

```
HackOps AI Repository Structure
├── app/
│   ├── page.tsx                      # Root 3D Landing Page entry point
│   ├── landing/page.tsx              # 3D Three.js Live Landing Page & Auth Modal
│   ├── dashboard/page.tsx            # Main Operations Dashboard
│   ├── evaluation/page.tsx           # Dual-mode AI Evaluation Hub (Workbench & Directory)
│   ├── projects/page.tsx             # Standalone Projects Directory & Repositories Browser
│   ├── participant/
│   │   ├── team-matching/page.tsx    # Team Vector Complementarity Engine
│   │   └── mentor-assistant/page.tsx # AI Mentor Chat & Session Scheduling
│   ├── settings/page.tsx             # Profile, Persona Role & Gemini API Key Configurator
│   └── api/
│       ├── evaluate/route.ts         # Google Gemini LLM Multi-Rubric Evaluation API
│       ├── mentor-chat/route.ts      # Gemini AI Mentor Triage API
│       └── match-team/route.ts       # Skill Vector Distance Team Matching API
├── components/
│   ├── ThreeCanvas.tsx               # 3D WebGL Particle Constellation Mesh (Three.js)
│   ├── RadarChartWrapper.tsx         # Recharts Radar Chart Visualizer
│   ├── AppShell.tsx                  # Global App Shell with Navigation Sidebar & Header
│   ├── Sidebar.tsx                   # Left Navigation Bar
│   ├── Navbar.tsx                    # Top Header Bar & Search Bar
│   └── Toast.tsx                     # Toast Notification System
└── lib/
    ├── AppContext.tsx                # Central State Store & localStorage Persistence
    ├── ai-engine.ts                  # Google Generative AI Evaluation Logic
    └── seed-data.ts                  # High-quality Initial Project & Mentor Data
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Author

Developed with ❤️ by **Varun Khandelwal**  
- **GitHub**: [@Varun-Khandelwal31](https://github.com/Varun-Khandelwal31)  
- **Project**: [Hackers-AI](https://github.com/Varun-Khandelwal31/Hackers-AI)
