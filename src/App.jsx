import React, { useState } from "react";
import { marked } from "marked";
import "./App.css";

// ⭐ Use a REAL supported model
const API_MODEL = "gemini-2.0-flash";

// 🔑 Add your API key here
const API_KEY = "AIzaSyBXgmWQ3l3EcYF6bW49xZlfq_wT9TJhCiw";

// Correct endpoint
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${API_MODEL}:generateContent?key=${API_KEY}`;

const MAX_RETRIES = 3;

function App() {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [sources, setSources] = useState([]);
  const [risk, setRisk] = useState("");

  // Extract "RISK: Safe/Suspicious/Malicious"
  const parseRiskLevel = (text) => {
    const match = text.match(/RISK:\s*(Safe|Suspicious|Malicious|Unknown)/i);
    return match ? match[1].toLowerCase() : "unknown";
  };

  // Retry wrapper
  const fetchWithRetry = async (payload, attempt = 0) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // 429 — retry
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

  // Main analysis
  const analyzeLink = async () => {
    setError("");
    setAnalysis("");
    setSources([]);
    setRisk("");

    if (!link || !link.startsWith("http")) {
      setError("Enter a valid URL (must start with http:// or https://).");
      return;
    }

    if (!API_KEY || API_KEY === "YOUR_API_KEY") {
      setError("Add your Gemini API key inside the code.");
      return;
    }

    setLoading(true);

    const systemInstruction = `
You are a cybersecurity AI analyzing URLs.
Use Google Search grounding to check domain reputation.
Respond ALWAYS in markdown with:

**RISK: Safe/Suspicious/Malicious/Unknown**

Then provide:
- Reasoning
- Indicators
- Final recommendation
`;

    const payload = {
      contents: [{ parts: [{ text: `Analyze this link for phishing risks: ${link}` }] }],
      tools: [{ google_search: {} }],
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

      // Extract grounding sources
      const grounding = candidate?.groundingMetadata?.groundingAttributions || [];
      const extractedSources = grounding
        .map((a) => ({
          uri: a.web?.uri,
          title: a.web?.title,
        }))
        .filter((s) => s.uri && s.title);

      setSources(extractedSources);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = () => {
    switch (risk) {
      case "safe":
        return "risk-safe";
      case "suspicious":
        return "risk-suspicious";
      case "malicious":
        return "risk-malicious";
      default:
        return "risk-unknown";
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="title">
          <span className="title-highlight">AI</span> Link Safety Scanner
        </h1>

        <p className="subtitle">
          Enter a suspicious URL to get instant security analysis powered by Gemini.
        </p>

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
          <div className="analysis-section">
            <h2 className="section-title">Analysis Report</h2>

            <div
              className={`analysis-box ${getRiskClass()}`}
              dangerouslySetInnerHTML={{ __html: analysis }}
            ></div>

            <div className="sources">
              {sources.length > 0 ? (
                <>
                  <p><b>Sources:</b></p>
                  <ul>
                    {sources.map((s, i) => (
                      <li key={i}>
                        <a href={s.uri} target="_blank" rel="noreferrer" className="link">
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="no-sources">No sources cited.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
