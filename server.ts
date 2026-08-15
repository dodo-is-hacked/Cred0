import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", name: "Cred0 Micro-Credit Scoring API" });
  });

  // Auth Endpoints
  app.post("/api/auth/otp-request", (req, res) => {
    const { phone } = req.body;
    res.json({ success: true, message: `OTP sent to +91 ${phone}` });
  });

  app.post("/api/auth/otp-verify", (req, res) => {
    const { otp } = req.body;
    if (otp === "1234" || (otp && otp.length === 4)) {
      res.json({ success: true, token: "mock_jwt_token_" + Date.now() });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP code" });
    }
  });

  // Gemini Hybrid Scoring API
  // server.ts
app.post("/api/scoring/gemini", async (req, res) => {
  const { profile } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are an underwriting AI for Cred0, an alternative micro-credit platform for informal economy borrowers.
Analyze the following borrower profile and compute a credit score and breakdown:

Borrower Profile:
- Name: ${profile?.name}
- Occupation: ${profile?.occupation}
- Age: ${profile?.age}
- Education: ${profile?.education}
- Household Size: ${profile?.householdSize}
- Earning Members: ${profile?.earningMembers}
- Assets: ${profile?.assets?.join(', ') || 'None'}
- Community Tie: ${profile?.communityTie?.active ? profile?.communityTie?.groupType : 'None'}
- Document Verified: ${profile?.documentVerified}
- Preferred Language: ${profile?.language || 'en'}

Return ONLY a valid JSON object matching this structure (no markdown code blocks, no text before or after):
{
  "score": <number between 300 and 900>,
  "zone": "<Building | Fair | Good | Cred0ed>",
  "defaultRiskPercent": <number default probability percentage, e.g. 7.5>,
  "riskCategory": "<Low | Moderate | High>",
  "aiInsight": "<2-sentence underwriting summary in language '${profile?.language || 'en'}'>",
  "shapFactors": [
    {
      "feature": "<Feature Name>",
      "impact": <positive or negative number impact>,
      "explanation": {
        "en": "<English description>",
        "hi": "<Hindi description>",
        "bn": "<Bengali description>"
      }
    }
  ],
  "recommendations": [
    {
      "id": "<rec_id>",
      "title": { "en": "...", "hi": "...", "bn": "..." },
      "description": { "en": "...", "hi": "...", "bn": "..." },
      "pointsToGain": <number points>,
      "applyActionKey": "<join_shg | verify_doc | add_asset | add_earner>"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const parsedResult = JSON.parse(text);

    return res.json(parsedResult);
  } catch (err: any) {
    console.error("Gemini scoring error:", err);
    return res.status(500).json({ error: "Failed to generate AI score" });
  }
});

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cred0 Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
