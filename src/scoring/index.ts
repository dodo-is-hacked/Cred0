import { ScoringMode, ScoringProvider } from '../types';
import { CustomModelScoringProvider } from './customProvider';
import { GeminiScoringProvider } from './geminiProvider';

export function getScoringProvider(mode: ScoringMode = 'custom'): ScoringProvider {
  switch (mode) {
    case 'gemini_hybrid':
      return new GeminiScoringProvider();
    case 'custom':
    default:
      return new CustomModelScoringProvider();
  }
}