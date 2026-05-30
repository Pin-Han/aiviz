# Phase 1: Project Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the monorepo, shared types, tooling, and CI foundation so all future phases have a stable base.

**Architecture:** npm workspaces monorepo with three packages: `frontend/` (Vite React), `api/` (Vercel Serverless), `shared/` (TypeScript types/constants). All packages share a root tsconfig.

**Tech Stack:** TypeScript, npm workspaces, Vitest

**Status:** Not Started

---

## Task 1: Initialize Monorepo Root

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `.nvmrc`

- [ ] **Step 1: Create root package.json with workspaces**

```json
{
  "name": "aiviz",
  "private": true,
  "workspaces": [
    "shared",
    "api",
    "frontend"
  ],
  "scripts": {
    "test": "npm run test --workspaces --if-present",
    "lint": "npm run lint --workspaces --if-present"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

- [ ] **Step 2: Create root tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create .gitignore**

```
node_modules/
dist/
.env
.env.local
*.log
.vercel
.DS_Store
docs/superpowers/specs/
```

Note: `docs/superpowers/specs/` is gitignored — spec files stay local only.

- [ ] **Step 4: Create .nvmrc**

```
20
```

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json .gitignore .nvmrc
git commit -m "chore: initialize monorepo root with npm workspaces"
```

---

## Task 2: Set Up `shared/` Package

**Files:**
- Create: `shared/package.json`
- Create: `shared/tsconfig.json`
- Create: `shared/types.ts`
- Create: `shared/constants.ts`

- [ ] **Step 1: Create shared/package.json**

```json
{
  "name": "@aiviz/shared",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./types.ts",
  "scripts": {}
}
```

- [ ] **Step 2: Create shared/tsconfig.json**

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["./**/*.ts"]
}
```

- [ ] **Step 3: Create shared/types.ts**

```typescript
// ── Page Data (input to rules) ──────────────────────────

export interface PageData {
  url: string
  html: string
  jsonLd: JsonLdProduct | null
  openGraph: OpenGraphData
  metaTags: MetaTagData
  crawlTimeMs: number
}

export interface JsonLdProduct {
  '@type': string
  name?: string
  description?: string
  image?: string | string[]
  brand?: { '@type': string; name: string } | string
  offers?: {
    '@type': string
    price?: string | number
    priceCurrency?: string
    availability?: string
  }
  aggregateRating?: {
    '@type': string
    ratingValue?: string | number
    reviewCount?: string | number
  }
  [key: string]: unknown
}

export interface OpenGraphData {
  title?: string
  description?: string
  image?: string
  type?: string
  siteName?: string
}

export interface MetaTagData {
  title?: string
  description?: string
  robots?: string
}

// ── Rule System ─────────────────────────────────────────

export type RuleCategory = 'basic' | 'advanced'
export type RuleStatus = 'pass' | 'warn' | 'fail'

export interface Rule {
  id: string
  name: string
  description: string
  category: RuleCategory
  maxScore: number
  check(pageData: PageData): RuleResult
}

export interface RuleResult {
  score: number
  status: RuleStatus
  message: string
  fix?: string
  code?: string
}

// ── AI Provider ─────────────────────────────────────────

export interface ReadabilityResult {
  summary: string
  strengths: string[]
  weaknesses: string[]
}

export interface AiReadabilityResponse {
  summary: string
  strengths: string[]
  weaknesses: string[]
}

export type AiReadability = AiReadabilityResponse | { unavailable: true }

// ── API Response ────────────────────────────────────────

export interface AnalysisResponse {
  url: string
  analyzedAt: string
  score: {
    total: number
    basic: number
    advanced: number
  }
  rules: Array<{
    id: string
    name: string
    category: RuleCategory
    score: number
    maxScore: number
    status: RuleStatus
    message: string
    fix: string | null
    code: string | null
  }>
  aiReadability: AiReadability
  meta: {
    crawlTimeMs: number
    aiCallTimeMs: number
    remainingQuota: number
  }
}

// ── API Error ───────────────────────────────────────────

export interface ApiError {
  error: string
  code: number
}
```

- [ ] **Step 4: Create shared/constants.ts**

```typescript
export const SCORE_MAX_BASIC = 80
export const SCORE_MAX_ADVANCED = 20
export const SCORE_MAX_TOTAL = SCORE_MAX_BASIC + SCORE_MAX_ADVANCED

export const RATE_LIMIT_PER_IP = 3
export const RATE_LIMIT_GLOBAL = 500

export const CRAWL_TIMEOUT_MS = 10_000
export const REQUEST_TIMEOUT_MS = 30_000

export const CATEGORY_LABELS: Record<string, string> = {
  basic: '基本項目',
  advanced: '進階優化',
}

export const STATUS_LABELS: Record<string, string> = {
  pass: '通過',
  warn: '警告',
  fail: '未通過',
}
```

- [ ] **Step 5: Commit**

```bash
git add shared/
git commit -m "feat: add shared types and constants package"
```

---

## Task 3: Set Up `api/` Package Skeleton

**Files:**
- Create: `api/package.json`
- Create: `api/tsconfig.json`
- Create: `api/vercel.json`

- [ ] **Step 1: Create api/package.json**

```json
{
  "name": "@aiviz/api",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "cheerio": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.5.0",
    "vitest": "^3.0.0"
  }
}
```

Note: `@google/generative-ai` will be added in Phase 4 when we implement the Gemini provider.

- [ ] **Step 2: Create api/tsconfig.json**

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "paths": {
      "@aiviz/shared": ["../shared"]
    }
  },
  "include": ["./**/*.ts", "../shared/**/*.ts"]
}
```

- [ ] **Step 3: Create api/vercel.json**

```json
{
  "functions": {
    "api/analyze.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "POST, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type" }
      ]
    }
  ]
}
```

- [ ] **Step 4: Commit**

```bash
git add api/
git commit -m "feat: add api package skeleton with Vercel config"
```

---

## Task 4: Set Up `frontend/` Package Skeleton

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/tsconfig.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/postcss.config.js`
- Create: `frontend/index.html`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/index.css`

- [ ] **Step 1: Scaffold Vite React project**

```bash
cd frontend
npm create vite@latest . -- --template react-ts
```

If it asks to overwrite, choose yes (directory is empty except package.json).

- [ ] **Step 2: Update frontend/package.json**

After scaffolding, update to include workspace reference and scripts:

```json
{
  "name": "@aiviz/frontend",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lz-string": "^1.5.0"
  },
  "devDependencies": {
    "@types/lz-string": "^1.5.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.5.0",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 3: Create frontend/vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@aiviz/shared': path.resolve(__dirname, '../shared'),
    },
  },
})
```

- [ ] **Step 4: Create frontend/tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 5: Create frontend/postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: Create frontend/src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 7: Create frontend/src/App.tsx**

```tsx
function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-900">
        AIViz
      </h1>
    </div>
  )
}

export default App
```

- [ ] **Step 8: Create frontend/src/main.tsx**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 9: Install all dependencies from root**

```bash
cd /path/to/aiviz
npm install
```

- [ ] **Step 10: Verify frontend starts**

```bash
cd frontend
npm run dev
```

Expected: Vite dev server starts, browser shows "AIViz" heading with Tailwind styling.

- [ ] **Step 11: Commit**

```bash
git add frontend/ package-lock.json
git commit -m "feat: scaffold frontend with Vite, React, Tailwind"
```

---

## Phase 1 Completion Checklist

- [ ] Monorepo root with npm workspaces configured
- [ ] `shared/` package with all types and constants
- [ ] `api/` package skeleton with Vercel config
- [ ] `frontend/` package with Vite + React + Tailwind running
- [ ] `.gitignore` excludes `docs/superpowers/specs/`
- [ ] `npm install` from root installs all workspace dependencies
- [ ] `npm run dev` in frontend/ shows the placeholder page
