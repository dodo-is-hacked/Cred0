import { BorrowerProfile, ScoringProvider, ScoreResult } from '../types';

export class CustomModelScoringProvider implements ScoringProvider {
  async computeScore(profile: BorrowerProfile): Promise<ScoreResult> {
    // 1. Try calling your custom model API first
    try {
      const customResponse = await fetch('/api/scoring/custom-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });

      if (customResponse.ok) {
        const customResult: ScoreResult = await customResponse.json();
        return customResult;
      }
      
      console.warn('Custom model API returned non-200. Falling back to Gemini...');
    } catch (error) {
      console.warn('Custom model API unreachable/failed. Falling back to Gemini...', error);
    }

    // 2. Fallback to Gemini API if your custom model fails
    const geminiResponse = await fetch('/api/scoring/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
    });

    if (!geminiResponse.ok) {
      throw new Error(`Both custom model and Gemini fallback failed with status ${geminiResponse.status}`);
    }

    return await geminiResponse.json();
  }
}