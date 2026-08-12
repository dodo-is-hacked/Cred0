import { BorrowerProfile, ScoringProvider, ScoreResult } from '../types';

export class GeminiScoringProvider implements ScoringProvider {
  async computeScore(profile: BorrowerProfile): Promise<ScoreResult> {
      // Call backend API endpoint `/api/scoring/gemini` if available
      const response = await fetch('/api/scoring/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });

      if (!response.ok) {
      throw new Error(`Gemini scoring request failed with status ${response.status}`);
    }

    const data: ScoreResult = await response.json();
    return data;
  }
}
