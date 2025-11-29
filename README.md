

```
# AI‑Phishing‑Link‑Analyzer 🚨

A lightweight web app that analyzes suspicious URLs using AI (Google Gemini or any LLM API) plus custom cybersecurity heuristics to provide instant risk assessment with clear, actionable guidance.

🔗 **Live demo:** https://ai-phishing-link-analyzer.vercel.app

---

## 📌 Table of contents

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

## 🧩 About

AI‑Phishing‑Link‑Analyzer helps users quickly evaluate whether a URL is **safe**, **suspicious**, or **malicious** by combining:

- LLM‑based reasoning  
- Deterministic cybersecurity heuristics  
- URL pattern analysis  

This is **an educational and research tool**, not a full enterprise security scanner.

---

## ✨ Features

- One‑click URL analysis  
- Final verdict: **Safe / Suspicious / Malicious / Unknown**  
- AI‑powered explanation of risk factors  
- Heuristic checks including:
  - Punycode / homograph detection  
  - Suspicious TLDs  
  - Excessive subdomains  
  - URL shorteners  
  - Phishing keyword patterns  
  - IP‑based URLs  
  - Optional blocklist/allowlist checks  
- Clean, responsive UI (React + Vite)  

---

## 🛠 Tech stack

- **Frontend:** React + Vite  
- **Styles:** TailwindCSS / CSS  
- **AI Provider:** Google Gemini API (or OpenAI‑compatible models)  
- **Deployment:** Vercel / Netlify  
- **Optional Backend:** Node.js / Express or serverless proxy  

---

## 🏗 Architecture overview

```

User → URL Input
↓
Client Heuristics → regex checks, punycode detection, shortener detection
↓
LLM Analysis → structured prompt → AI returns JSON-based reasoning
↓
Aggregator → merges heuristics + model output
↓
Final Verdict → shown to the user with explanation

````

If using a backend, the AI request is proxied securely to hide API keys.

---

## 🚀 Getting started

### Prerequisites

- Node.js v16+  
- npm or yarn  
- API key for your LLM provider (Gemini recommended)

---

### 📥 Install

```bash
git clone https://github.com/Rakesh3697/AI-Phishing-Link-Analyzer.git
cd AI-Phishing-Link-Analyzer
npm install
````

---

### ⚙️ Configuration (.env)

Create a `.env` file in the project root:

```
# AI Provider Key
GEMINI_API_KEY=your_key_here

# Optional backend endpoint (if using proxy)
VITE_APP_API_BASE_URL=https://your-backend.com

# Dev environment settings
NODE_ENV=development
PORT=3000
```

⚠️ **Never commit `.env` files.**

---

### ▶️ Run locally

```bash
npm run dev
```

App will start at:

```
http://localhost:3000
```

---

### 📦 Build & deploy

```bash
npm run build
```

Deploy `dist/` to:

* **Vercel** (recommended)
* Netlify
* GitHub Pages
* Any static hosting platform

If using a backend proxy, deploy serverless functions to:

* Vercel Serverless
* Cloudflare Workers
* AWS Lambda
* Google Cloud Run

---

## 🖥 Usage

1. Open the web app
2. Paste any URL
3. Click **Analyze**
4. Review:

   * AI reasoning
   * Heuristic flags
   * Final verdict + recommended action

Example output:

```json
{
  "url": "http://example.com/verify",
  "classification": "Suspicious",
  "confidence": 0.78,
  "reasons": [
    "URL contains phishing keyword: verify",
    "Uses a suspicious TLD",
    "Domain resembles a known brand"
  ],
  "suggestedAction": "Avoid entering credentials; verify on official site"
}
```

---

## 🧠 How the analysis works

### 1. **Prompt engineering**

A structured JSON‑enforced prompt ensures predictable AI output.

### 2. **Deterministic heuristics**

* Regex-based phishing patterns
* TLD reputation
* Shortener detection (bit.ly, tinyurl, etc.)
* Domain entropy
* Punycode → homograph detection

### 3. **LLM risk classification**

AI determines:

* Risk level
* Reasoning
* Social engineering patterns
* Brand impersonation attempts

### 4. **Aggregation**

Heuristics adjust the AI’s score to reduce hallucinations.

---

## 🔐 Security & privacy considerations

* Never expose API keys in frontend production builds
* Avoid sending sensitive URLs to external AI APIs
* Treat LLM results as advisory
* Prefer backend proxy for all AI calls
* Add `.env` to `.gitignore`

---

## 🧪 Testing & CI

Recommended:

* **Unit tests** → heuristic functions
* **Integration tests** → LLM JSON validator
* **GitHub Actions** pipeline:

  * Install
  * Lint
  * Test
  * Build

---

## 🩻 Troubleshooting

| Issue                     | Fix                                                |
| ------------------------- | -------------------------------------------------- |
| API requests failing      | Check API key + verify endpoint URL                |
| "process is not defined"  | Avoid using Node-only variables in Vite frontend   |
| App not starting          | Delete `.vite` cache → `rm -rf node_modules/.vite` |
| AI responses inconsistent | Strengthen JSON schema + add fallback parser       |

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch:

   ```bash
   git checkout -b feature/my-feature
   ```
3. Commit changes
4. Push and open a PR

PRs with tests are appreciated.

---

## 📄 License

MIT License.
See **LICENSE** file.

---

## 🙌 Acknowledgements

* Google Gemini Developers
* OpenAI-compatible API standards
* Public phishing datasets and URL heuristics research
* Community cybersecurity tools & research

---

```
