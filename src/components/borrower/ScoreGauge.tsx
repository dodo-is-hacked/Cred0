import React from 'react';
import { ScoreResult, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { ShieldCheck, Award } from 'lucide-react';

interface ScoreGaugeProps {
  scoreResult: ScoreResult;
  language: Language;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ scoreResult, language }) => {
  const t = translations[language] || translations.en;
  
  // Safe default score fallback to prevent NaN in math calculations
  const rawScore = scoreResult?.score;
  const score = typeof rawScore === 'number' && !isNaN(rawScore) ? rawScore : 300;
  const zone = scoreResult?.zone || 'Building';

  // Calculate percentage along 300-900 scale (0% to 100%)
  const percentage = Math.min(1, Math.max(0, (score - 300) / 600));

  // Gauge colors by zone
  const getZoneColor = (z: string) => {
    switch (z) {
      case 'Trusted':
        return { main: '#059669', bg: '#D1FAE5', text: 'text-emerald-700 dark:text-emerald-300' };
      case 'Good':
        return { main: '#10B981', bg: '#E0E7FF', text: 'text-blue-700 dark:text-blue-300' };
      case 'Fair':
        return { main: '#EAB308', bg: '#FEF3C7', text: 'text-amber-700 dark:text-amber-300' };
      case 'Building':
      default:
        return { main: '#F97316', bg: '#FFEDD5', text: 'text-orange-700 dark:text-orange-300' };
    }
  };

  const colors = getZoneColor(zone);

  // SVG Gauge calculations (semi-circle radius 80)
  const radius = 80;
  const circumference = Math.PI * radius; // Half-circle arc length ~ 251.3
  const strokeDashoffset = circumference - percentage * circumference;

  const getZoneLabel = (z: string) => {
    switch (z) {
      case 'Trusted': return t.zone_trusted;
      case 'Good': return t.zone_good;
      case 'Fair': return t.zone_fair;
      case 'Building':
      default: return t.zone_building;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-6 bg-theme-surface rounded-2xl border border-theme-border shadow-xs">
      
      {/* Semi-circular Gauge Chart */}
      <div className="relative w-64 h-36 flex items-end justify-center mb-2">
        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
          
          {/* Background Arc Bands */}
          {/* Band 1: Building (300-499) */}
          <path
            d="M 20 100 A 80 80 0 0 1 73 30"
            fill="none"
            stroke="#FDBA74"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Band 2: Fair (500-649) */}
          <path
            d="M 76 28 A 80 80 0 0 1 124 28"
            fill="none"
            stroke="#FDE047"
            strokeWidth="14"
          />
          {/* Band 3: Good (650-799) */}
          <path
            d="M 127 30 A 80 80 0 0 1 165 65"
            fill="none"
            stroke="#6EE7B7"
            strokeWidth="14"
          />
          {/* Band 4: Trusted (800-900) */}
          <path
            d="M 167 68 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#34D399"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Active Highlight Overlay Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={colors.main}
            strokeWidth="16"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          {/* Center Score Marker Indicator */}
          <g transform={`rotate(${percentage * 180 - 90}, 100, 100)`}>
            <line x1="100" y1="100" x2="100" y2="28" stroke="var(--text-primary)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="100" r="6" fill="var(--accent-primary)" stroke="var(--surface)" strokeWidth="2" />
          </g>
        </svg>

        {/* Min / Max Labels under arc */}
        <div className="absolute left-2 bottom-0 text-[11px] font-semibold text-theme-secondary">300</div>
        <div className="absolute right-2 bottom-0 text-[11px] font-semibold text-theme-secondary">900</div>
      </div>

      {/* Ink-Stamp Score Visual Display Frame */}
      <div className="ink-stamp-frame px-8 py-4 mb-4 flex flex-col items-center">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-theme-secondary mb-1">
          <ShieldCheck className="w-4 h-4 text-theme-accent" />
          <span>TRUST SCORE</span>
        </div>
        
        {/* Lora Display Numeral */}
        <div className="font-serif-lora text-5xl sm:text-6xl font-extrabold tracking-tight text-theme-primary my-0.5">
          {score}
        </div>

        {/* Zone Badge */}
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-theme-soft border border-theme-border">
          <Award className="w-3.5 h-3.5 text-theme-accent" />
          <span className="text-theme-accent">{getZoneLabel(zone)}</span>
        </div>
      </div>

      {/* Scale caption */}
      <p className="text-xs text-theme-secondary">
        {t.score_scale_label} · Non-Discriminatory Alternative Scoring
      </p>

    </div>
  );
};
