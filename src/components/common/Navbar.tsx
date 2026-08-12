import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import { Language } from '../../types/types';
import { Sun, Moon, ShieldCheck, User, Building2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    toggleTheme,
    role,
    setRole,
    currentBorrower,
    borrowers,
    handleSelectBorrower,
    handleNewBorrower
  } = useAppContext();

  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  const getTagline = () => {
    if (language === 'hi') return t.tagline_hi;
    if (language === 'bn') return t.tagline_bn;
    return t.tagline;
  };

  const handleRoleSwitch = (newRole: 'borrower' | 'lender') => {
    setRole(newRole);
    if (newRole === 'lender') {
      navigate('/lender');
    } else {
      navigate('/borrower/auth');
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-theme-border bg-theme-surface/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        
        {/* Left: Brand & Tagline */}
        <div className="flex items-center space-x-3.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-theme-accent text-white shadow-sm">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="font-serif-lora text-2xl sm:text-3xl font-bold tracking-tight text-theme-primary">
                {t.brand_name}
              </span>
              <span className="hidden text-xs sm:text-sm font-bold uppercase tracking-wider text-theme-secondary sm:inline-block">
                {language === 'hi' ? 'भरोसा' : language === 'bn' ? 'ভরসা' : 'CREDIT'}
              </span>
            </div>
            <p className="hidden text-xs sm:text-sm text-theme-secondary md:block font-medium">
              {getTagline()}
            </p>
          </div>
        </div>

        {/* Center: Quick Demo Borrower Selector */}
        {currentBorrower && (
          <div className="flex items-center gap-2">
            <div className="relative group">
              <button className="flex items-center gap-2 rounded-xl border border-theme-border bg-theme-bg px-3.5 py-2 text-xs sm:text-sm font-semibold text-theme-primary hover:border-theme-accent">
                <User className="h-4 w-4 text-theme-accent" />
                <span className="max-w-[140px] truncate">{currentBorrower.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-theme-secondary" />
              </button>

              {/* Fixed Dropdown Wrapper:
                  - Positioned directly at top-full
                  - Added pt-1 container so hover target remains contiguous
                  - Added hover:block alongside group-hover:block
              */}
              <div className="absolute left-0 top-full hidden w-60 pt-1 group-hover:block hover:block z-50">
                <div className="rounded-2xl border border-theme-border bg-theme-surface p-1.5 shadow-xl">
                  <div className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-theme-secondary">
                    {t.switch_profile}
                  </div>
                  {borrowers.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        handleSelectBorrower(b);
                        navigate('/borrower/auth');
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs sm:text-sm text-left font-medium ${
                        b.id === currentBorrower.id
                          ? 'bg-theme-soft font-bold text-theme-accent'
                          : 'text-theme-primary hover:bg-theme-bg'
                      }`}
                    >
                      <span className="truncate">{b.name}</span>
                      <span className="text-xs text-theme-secondary">({b.location.split(',')[0]})</span>
                    </button>
                  ))}
                  <div className="mt-1 border-t border-theme-border pt-1">
                    <button
                      onClick={() => {
                        handleNewBorrower();
                        navigate('/borrower/auth');
                      }}
                      className="flex w-full items-center justify-center gap-1 rounded-xl bg-theme-accent py-2 text-xs sm:text-sm font-bold text-white hover:opacity-90"
                    >
                      + New Borrower Flow
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Controls: Role Switch, Language, Theme */}
        <div className="flex items-center space-x-3">
          
          {/* Role Switcher */}
          <div className="flex rounded-xl border border-theme-border bg-theme-bg p-1">
            <button
              onClick={() => handleRoleSwitch('borrower')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                role === 'borrower'
                  ? 'bg-theme-accent text-white shadow-sm'
                  : 'text-theme-secondary hover:text-theme-primary'
              }`}
            >
              <User className="h-4 w-4" />
              <span>{t.role_borrower.split(' ')[0]}</span>
            </button>
            <button
              onClick={() => handleRoleSwitch('lender')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                role === 'lender'
                  ? 'bg-theme-accent text-white shadow-sm'
                  : 'text-theme-secondary hover:text-theme-primary'
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>{t.role_lender.split(' ')[0]}</span>
            </button>
          </div>

          {/* Language Selector Segmented Toggle */}
          <div className="flex rounded-xl border border-theme-border bg-theme-bg p-1">
            {(['en', 'hi', 'bn'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-extrabold transition-all ${
                  language === lang
                    ? 'bg-theme-surface font-bold text-theme-accent shadow-xs'
                    : 'text-theme-secondary hover:text-theme-primary'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिं' : 'বাং'}
              </button>
            ))}
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-theme-border bg-theme-bg text-theme-secondary hover:border-theme-accent hover:text-theme-primary"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 text-slate-700" />
            ) : (
              <Sun className="h-5 w-5 text-amber-400" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};