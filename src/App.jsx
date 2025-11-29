import React, { useState } from "react";
import { marked } from "marked";
import "./App.css";

// Vite env variables (use import.meta.env)
const API_MODEL = import.meta.env.VITE_API_MODEL;
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${API_MODEL}:generateContent?key=${API_KEY}`;

const MAX_RETRIES = 3;

function App() {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [risk, setRisk] = useState("");

  const parseRiskLevel = (text) => {
    const match = text.match(/RISK:\s*(Safe|Suspicious|Malicious|Unknown)/i);
    return match ? match[1].toLowerCase() : "unknown";
  };

  const fetchWithRetry = async (payload, attempt = 0) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 429 && attempt < MAX_RETRIES) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(payload, attempt + 1);
      }

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`API failed: ${res.status} → ${errBody}`);
      }

      return res.json();
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(payload, attempt + 1);
      }
      throw new Error(`Failed after retries → ${err.message}`);
    }
  };

  const analyzeLink = async () => {
    setError("");
    setAnalysis("");
    setRisk("");

    if (!link.startsWith("http")) {
      setError("Enter a valid URL (starting with http:// or https://).");
      return;
    }

    if (!API_KEY || !API_MODEL) {
      setError("Missing API_KEY or API_MODEL in .env.");
      return;
    }

    setLoading(true);

    const systemInstruction = `
You are a cybersecurity AI analyzing URLs.
Respond ALWAYS in markdown with:

**RISK: Safe/Suspicious/Malicious/Unknown**

Then provide:
- Reasoning
- Indicators
- Final recommendation
`;

    const payload = {
      contents: [{ parts: [{ text: `Analyze this link for phishing risks: ${link}` }] }],
      system_instruction: { parts: [{ text: systemInstruction }] },
    };

    try {
      const result = await fetchWithRetry(payload);
      const candidate = result?.candidates?.[0];
      const rawText = candidate?.content?.parts?.[0]?.text;

      if (!rawText) {
        setError("Empty response from Gemini.");
        return;
      }

      const riskLevel = parseRiskLevel(rawText);
      setRisk(riskLevel);
      setAnalysis(marked.parse(rawText));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = () => {
    switch (risk) {
      case "safe": return "risk-safe";
      case "suspicious": return "risk-suspicious";
      case "malicious": return "risk-malicious";
      default: return "risk-unknown";
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="title"><span className="title-highlight">AI</span> Link Safety Scanner</h1>
        <p className="subtitle">Enter a suspicious URL to get instant security analysis powered by Gemini.</p>

        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://example.com/login"
          className="input"
        />

        <button onClick={analyzeLink} disabled={loading} className="button">
          {loading ? "Analyzing..." : "Analyze Link"}
        </button>

        {loading && <div className="loading">🔍 Checking link reputation...</div>}
        {error && <div className="error">{error}</div>}

        {analysis && (
          <div className={`analysis-box ${getRiskClass()}`} dangerouslySetInnerHTML={{ __html: analysis }}></div>
        )}
      </div>
    </div>
  );
}

export default App;
