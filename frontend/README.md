# Portfolio — Frontend Application

High-performance, immersive portfolio web application engineered with **Next.js 16 (App Router)**, **React 19**, **Three.js / React Three Fiber**, **Framer Motion**, and **Tailwind CSS v4**.

---

## Architecture Overview

```
frontend/
├── public/                 # Static assets (SVGs, favicons, branding)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (routes)/       # about, projects, experience, skills, notes, resume, contact...
│   │   ├── api/            # Route handlers with FastAPI backend fallback proxy
│   │   ├── layout.tsx      # Root application layout with fonts and metadata
│   │   ├── page.tsx        # Immersive homepage with 3D viewport
│   │   └── globals.css     # Global styles & Tailwind v4 themes
│   ├── components/
│   │   ├── canvas/         # Three.js / React Three Fiber 3D models & canvas
│   │   ├── ui/             # Reusable interactive UI components & page sections
│   │   └── index.ts        # Unified component barrel exports
│   ├── config/
│   │   └── site.ts         # Truthful verified portfolio data & site constants
│   ├── lib/
│   │   ├── api-client.ts   # Client-side API fetchers with fallback handling
│   │   ├── audio.ts        # Web Audio API subtle interactive sound effects
│   │   ├── backend-proxy.ts# Server-side proxy routing to FastAPI backend
│   │   └── projectsData.ts # Export adapter for project datasets
│   └── types/
│       └── index.ts        # Shared TypeScript interfaces & types
├── package.json            # Frontend dependencies & run scripts
├── tsconfig.json           # TypeScript configuration with @/* path alias
├── next.config.ts          # Next.js server and compilation configuration
└── postcss.config.mjs      # Tailwind CSS PostCSS plugin configuration
```

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components)
- **UI Runtime**: [React 19](https://react.dev/)
- **3D Experiences**: [Three.js](https://threejs.org/) & [@react-three/fiber](https://r3f.docs.pmnd.rs/) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Available Scripts

Inside the `frontend` directory:

```bash
# Start local development server (http://localhost:3000)
npm run dev

# Compile production build
npm run build

# Start production server
npm run start

# Run ESLint validation
npm run lint
```
