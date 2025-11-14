# Card Game Solver - Project Proposal

Guiding Principles & Safety

- Educational First: This tool is for learning, practicing math, and understanding statistics. It is not for use in any competitive or real-money environment.
- Not for gambling, only for educational purposes.

Overview

We will build a solver for three card games: POKER, BLACKJACK, and 24. The app will analyze camera input, identify cards, and provide educational guidance such as win probabilities, recommended moves (per basic strategy for Blackjack), or arithmetic solutions for 24.

Proposed Technical Stack

- Vercel: Deploy frontend
- React: Frontend (bootstrapped with Create React App)
- OpenCV: Computer vision for card detection and camera distortion correction
- Claude (Anthropic): Use Claude Opus 4.1 for AI-assisted interpretation and higher-level reasoning
- .env files: Store keys in `.env` files in `claudehackathon/` and `claudehackathon/backend/`

Backend Setup (high level)

The repository contains a `backend/` folder which is a Node project (`npm init -y` was run). The backend will host any server-side endpoints required for CV processing, model calls, or serving the frontend.

Backend Development Steps (agent-driven — single-step execution)

Each step below should be completed one at a time by the agent. After each step the README must be updated. Do NOT perform later steps until the current step is completed and documented.

1. Build out a way for the computer to interact with the camera.
2. Build out a way to analyze the live data coming in through the camera & analyze what cards are in the hand.
3. Analyze a picture every 2 seconds taken from the video feed.
4. State Management: differentiate between "my hand" and "community cards" based on position on the table.
5. Build a way to analyze which game is being played (POKER, BLACKJACK, 24).
6. Use an OpenCV camera distortion model to accurately identify cards on the table.
7. Send the identified cards to Claude to enumerate winning possibilities.

Specific game logic

- POKER: Identify 2 hole cards and 3-5 community cards. Run a Monte Carlo simulation to estimate win/tie/lose percentages. Display hand label and percentages. Do not provide betting advice or opponent modeling.
- BLACKJACK: Identify player's 2 cards and dealer's up-card. Follow a hard-coded Basic Strategy table to output the single correct move: Hit/Stand/Double/Split. (Out of scope: card counting and bet sizing.)
- 24: Given 4 cards, show arithmetic solutions to make 24 using each card exactly once.

Frontend

- Minimal, HUD-like UI that could be displayed on smart glasses. Use matte colors, radial shadows, and a simple layout.
- Directory structure: `images/`, `components/`, `data/`, `pages/`.
- Global API variable to configure backend URL (use environment variable `REACT_APP_API_URL`).

Security & Keys

Never commit real API keys. Use `.env` files and `.env.example` placeholders. The repository has an HTTPS remote by default; consider switching to SSH for local developer comfort.

Necessary Keys (placeholders)

- PORT=5000
- CLIENT_URL=http://localhost:3000
- ANTHROPIC_API_KEY=replace_with_your_key

Out of scope / Ethics

- No real-money or gambling use. The app is educational only.

Next steps

1. Create `.env.example` files in root and `backend/` with placeholders (done).
2. Add backend README with step-by-step instructions for environment and running (done).
3. Begin agent-driven backend tasks, one at a time, updating docs after each step.
