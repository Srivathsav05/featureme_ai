# FutureMe — Meet the Version of You Who Already Made It

FutureMe is a premium, AI-powered personal reflection experience developed for live demonstrations. Users input details about their goals, struggles, and ambitions, and receive structural, hyper-personalized existential hindsight as a letter from their future self, combined with strategic next moves, custom daily habits, caution warnings, and a personal daily mantra. Once generated, users can engage in a real-time character-driven dialogue with their future self.

---

## Technical Stack
- **Frontend**: Clean Vanilla HTML5, premium responsive HSL-calibrated CSS, and advanced Vanilla JS. Features custom glassmorphism, background orbital glow systems, loading spinners, state managers, and dual-layer API fallbacks.
- **Backend**: Node.js and Express.js REST API with CORS enablement.
- **AI Engine**: Google Gemini API via official `@google/generative-ai` package using `gemini-1.5-flash` model.

---

## Directory Layout
```
futureme/
  frontend/
    index.html     # Gorgeous Apple-style glassmorphic landing & portal page
    style.css      # Custom animations, variables, layout systems, and scrolls
    script.js      # Client state controller, loading sequences, and chat logic
  backend/
    server.js      # Express application serving static files and calling Gemini
    package.json   # Node configuration and script runners
    .env.example   # Template environment configuration
  README.md        # Technical execution manual (this file)
```

---

## Quick Start Setup

### Step 1: Environment Setup
1. Open the `backend` folder.
2. Duplicate `.env.example` and rename it to `.env`.
3. Open `.env` and configure your API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key
   PORT=5000
   ```

### Step 2: Install Dependencies
Open a command prompt or terminal in the `backend` folder and run:
```bash
cd backend
npm install
```

### Step 3: Run the Server
Start the Express server using either:
```bash
npm run dev
```
or:
```bash
npm start
```
Once launched, you will see:
`🚀 FutureMe Backend running on port 5000`
`🌐 Accessible locally at http://localhost:5000`

### Step 4: Access the Frontend
Open your favorite web browser and navigate to:
**`http://localhost:5000`**

*Note: You can also double-click `frontend/index.html` directly in your file system to open it locally. Our built-in CORS controls and dual-layer client simulation fallback make sure the frontend runs flawlessly even if loaded directly from disk!*

---

## API Routes Documentation

### 1. POST `/api/generate-futureme`
Creates the initial FutureMe report, parsing a user profile.

- **Request Body**:
  ```json
  {
    "name": "Nitish",
    "age": "23",
    "goal": "Build a successful AI startup",
    "struggle": "Lack of consistency",
    "oneYearVision": "Running a profitable AI company",
    "tone": "Brutally Honest"
  }
  ```
- **Response Format**:
  ```json
  {
    "success": true,
    "data": {
      "message": "A powerful 120-180 word message from the future self.",
      "futureIdentity": "A concise description of who the user is becoming.",
      "nextMoves": ["Action 1", "Action 2", "Action 3"],
      "habit": "One small daily habit they should start today.",
      "warning": "One mistake their future self warns them about.",
      "mantra": "A short memorable line they can repeat daily."
    }
  }
  ```

### 2. POST `/api/chat-futureme`
Enables conversational interactions preserving character tone and contextual profile bounds.

- **Request Body**:
  ```json
  {
    "userProfile": {
      "name": "Nitish",
      "age": "23",
      "goal": "Build a successful AI startup",
      "struggle": "Lack of consistency",
      "oneYearVision": "Running a profitable AI company",
      "tone": "Brutally Honest"
    },
    "chatHistory": [
      { "role": "user", "message": "Will I actually make it?" },
      { "role": "futureme", "message": "Only if your daily actions stop negotiating with your dreams." }
    ],
    "question": "What should I focus on this week?"
  }
  ```
- **Response Format**:
  ```json
  {
    "success": true,
    "reply": "..."
  }
  ```

---

## Highlights for Your Sunday Session Demo 🚀
- **Apple Visual Paradigm**: Custom glassmorphism variables, premium conically glowing input border boxes, circular gradients, and responsive sizing.
- **State-driven Loading sequences**: Custom interval loops cycling through deep psychological prompts ("Analyzing the coordinates of your goals...", "Decrypting friction points...", etc.) to build immense engagement during API requests.
- **Fail-safe Simulation Driver**: If a user runs the demo without internet, with an invalid API key, or without starting the backend first, the frontend **seamlessly falls back to a locally computed, tone-specific calibration logic**. The chat client switches to matching simulated replies instantly, preventing *any* live failure while alerting the console.
- **Clipboard Exporters**: Beautiful formatting mapping key outcomes into markdown blocks ready for sharing in WhatsApp, Twitter, or Slack.
