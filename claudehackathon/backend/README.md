# Backend README

This folder contains the backend server for the Card Game Solver project. It is a minimal Node.js project started with `npm init -y`.

Prerequisites

- Node.js (16+ recommended)
- npm
- Optional: Python and OpenCV bindings if you plan to run CV code server-side

Environment

1. Copy `.env.example` to `.env` and fill in real values.

2. Important variables

- PORT — port to run the backend server (default: 5000)
- CLIENT_URL — the frontend URL (default: http://localhost:3000)
- ANTHROPIC_API_KEY — Claude/Anthropic API key
- OPENCV_CONFIG_PATH — optional path for OpenCV calibration data

Run locally

Install dependencies (if any are added):

```bash
npm install
```

Start the server (example):

```bash
npm run start
```

Note: At the moment this backend is a placeholder. Follow the agent-driven steps in `../PROPOSAL.md` to implement camera endpoints, CV processing, and AI integration. Each step should be implemented one at a time and documented in this README.
