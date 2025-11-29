```markdown
# AI‑Phishing‑Link‑Analyzer 🚨

A lightweight web app that analyzes suspicious URLs using AI (Google Gemini or compatible LLM) plus custom cybersecurity heuristics to provide an on‑the‑spot risk assessment and actionable guidance.

Live demo: https://ai-phishing-link-analyzer.vercel.app

---

## Table of contents

- [About](#about)  
- [Features](#features)  
- [Tech stack](#tech-stack)  
- [Architecture overview](#architecture-overview)  
- [Getting started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Install](#install)  
  - [Configuration (.env)](#configuration-env)  
  - [Run locally](#run-locally)  
  - [Build & deploy](#build--deploy)  
- [Usage](#usage)  
- [How the analysis works](#how-the-analysis-works)  
- [Security & privacy considerations](#security--privacy-considerations)  
- [Testing & CI](#testing--ci)  
- [Troubleshooting](#troubleshooting)  
- [Contributing](#contributing)  
- [License](#license)  
- [Acknowledgements](#acknowledgements)

---

## About

This project helps users quickly evaluate whether a URL looks safe, suspicious, or malicious by combining an LLM-based analysis (for natural-language explanation and heuristics interpretation) with deterministic checks (blocklists, known bad patterns, and simple technical tests such as domain similarity and punycode detection).

It is intended for educational and research purposes — not a replacement for professional cybersecurity tooling.

---

## Features

- Single-click URL analysis with an AI-powered reasoning summary.  
- Final classification: Safe / Suspicious / Malicious / Unknown.  
- Heuristic checks: domain age (if available), IP vs domain, punycode/homograph detection, excessive subdomains, suspicious TLDs, presence of URL shorteners, common phishing keywords.  
- Optionally cross-check against blocklists / local allowlist.  
- Simple, responsive UI (React + Vite) and a pluggable AI backend layer.

---

## Tech stack

- Frontend: React + Vite, Tailwind/CSS (or plain CSS depending on repo)  
- Backend (optional): Node.js / Express or serverless functions to proxy AI requests securely  
- AI: Google Gemini API or other LLM provider (OpenAI-compatible providers can be used)  
- CI/CD: GitHub Actions (recommended), deploy to Vercel / Netlify

---

## Architecture overview

1. Frontend accepts a URL from the user.  
2. Local deterministic checks run in the client or a backend: regex checks, punycode detection, domain heuristics, optional blocklist lookup.  
3. A structured prompt and the URL are sent to the LLM for a reasoning-based assessment.  
4. The app aggregates LLM output with heuristics to produce the final verdict and a human-readable explanation.  
5. Optionally log anonymized results (consent required) for analytics or model tuning.

---

## Getting started

### Prerequisites

- Node.js v14+ (v18 recommended)  
- npm or yarn  
- An API key for your selected LLM provider (e.g. Google Gemini, OpenAI, or other). For production, store keys securely in environment variables.

### Install

Clone the repo and install dependencies:

```bash
git clone https://github.com/Rakesh3697/AI-Phishing-Link-Analyzer.git
cd AI-Phishing-Link-Analyzer
npm install
# or
# yarn
```

### Configuration (.env)

Create a `.env` in the project root (this file must NOT be committed). Example:

```
# Example .env
VITE_APP_API_BASE_URL=https://your-backend.example.com   # optional if you use a backend
GEMINI_API_KEY=your_gemini_api_key_here                  # or PROVIDER_API_KEY depending on integration
NODE_ENV=development
PORT=3000
# Optional: if you use serverless functions or a proxy, include their keys/config
```

Notes:
- If the app calls the AI directly from the browser (not recommended for production), ensure keys are restricted and usage is rate-limited. Prefer a backend proxy for API key safety.
- If you have different providers, map variables accordingly (e.g., OPENAI_API_KEY).

### Run locally

Start the dev server:

```bash
npm run dev
# or
# yarn dev
```

Open http://localhost:3000 (or the port shown in terminal).

### Build & deploy

Build for production:

```bash
npm run build
```

Deploy static frontend to Vercel / Netlify, or host with any static host. If you use a serverless backend (for AI proxy), deploy that to Vercel serverless functions, AWS Lambda, Cloud Run, etc.

---

## Usage

1. Open the web app.  
2. Paste or type a suspicious URL into the input field.  
3. Click "Analyze".  
4. Review the verdict and the AI-generated explanation. The response will include recommended actions (e.g., "Do not click", "Open in an isolated VM", "Check domain registrar").  

Example output structure (internal representation):

```json
{
  "url": "http://example.com/verify",
  "classification": "Suspicious",
  "confidence": 0.78,
  "reasons": [
    "Shortened URL detected",
    "Suspicious token in path",
    "Domain uses recently registered TLD"
  ],
  "suggestedAction": "Do not submit credentials; verify via official site"
}
```

---

## How the analysis works

- Prompt engineering: the app crafts a structured prompt to the LLM describing required checks, expected JSON schema, and examples. This reduces hallucinations and produces consistent outputs.  
- Deterministic heuristics: regex, domain checks, punycode/homograph detection, blocklist lookups.  
- Aggregation: heuristics can up- or down-weight the model's assessment; the app returns both the model's reasoning and the final aggregated verdict.

If you want to inspect or improve prompts, check the code module that builds LLM prompts (e.g. src/utils/promptBuilder.*).

---

## Security & privacy considerations

- Never commit API keys or `.env` files. Add `.env` to `.gitignore`.  
- Avoid sending highly-sensitive or private URLs to third-party APIs. Redact tokens or personal identifiers if necessary.  
- Treat AI output as advisory — LLMs can be wrong or hallucinate. Use deterministic checks to reduce false positives/negatives.  
- When analyzing potentially malicious URLs, do not open them in your environment. Use isolated sandboxes for deeper analysis.  
- Consider adding telemetry opt-in and data minimization for production.

---

## Testing & CI

- Add unit tests for heuristic functions (jest / vitest recommended) and integration tests for the prompt-to-response flow.  
- Configure GitHub Actions to run linting, unit tests, and build on PRs. Example job steps: install, test, build, lint.

---

## Troubleshooting

- "AI requests failing": Verify API key, check provider rate limits, and confirm the endpoint URL in .env.  
- "UI not loading / port conflicts": Ensure PORT is free and correct in env. Try removing Vite cache: rm -rf node_modules/.vite && npm run dev.  
- "Inconsistent model output": Add stricter JSON schema enforcement in prompts and implement a fallback parser.

---

## Contributing

Contributions are welcome!

1. Fork the repository.  
2. Create a branch: git checkout -b feature/my-feature  
3. Make changes and add tests.  
4. Commit: git commit -m "Add <feature>"  
5. Push: git push origin feature/my-feature  
6. Open a Pull Request describing your changes.

Please follow conventional commits if possible and add unit tests for new logic.

---

## License

MIT License — see LICENSE file for details.

---

## Acknowledgements

- Inspiration: multiple public phishing detection tools and prompt engineering best practices.  
- LLM provider documentation (Google Gemini / OpenAI).

---

## Next steps you might want

- Add screenshots or an animated GIF to the README (place images in /assets and reference them).  
- Add an example prompt file and JSON schema for the LLM response.  
- Add a GitHub Actions CI workflow to run tests and build on PRs.

```
