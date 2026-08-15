import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import { Language } from '../../types/types';
import { Sun, Moon, ShieldCheck, User, Building2, ChevronDown, Plus } from 'lucide-react';
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
    handleNewBorrower,
    lenders,
    currentLender,
    handleSelectLender,
  } = useAppContext();

  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  const [activeDropdown, setActiveDropdown] = useState<'borrower' | 'lender' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSwitch = (newRole: 'borrower' | 'lender') => {
    setRole(newRole);
    setActiveDropdown(null);
    navigate(newRole === 'lender' ? '/lender' : '/borrower/auth');
  };

  const localizedBadge = {
    hi: 'भरोसा',
    bn: 'ভরসা',
    en: 'CREDIT',
  }[language] || 'CREDIT';

  return (
    <header className="sticky top-0 z-40 border-b border-theme-border bg-theme-surface/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        
        {/* Left: Brand */}
        <div 
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
          className="flex items-center space-x-3.5 cursor-pointer select-none" 
          onClick={() => navigate('/')}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-theme-accent text-white shadow-sm">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="font-serif-lora text-2xl sm:text-3xl font-bold tracking-tight text-theme-primary">
                {t.brand_name}
              </span>
              <span className="hidden text-xs sm:text-sm font-bold uppercase tracking-wider text-theme-secondary sm:inline-block">
                {localizedBadge}
              </span>
            </div>
            <p className="hidden text-xs sm:text-sm text-theme-secondary md:block font-medium">
              {t[`tagline_${language}`] || t.tagline}
            </p>
          </div>
        </div>

        {/* Center: Profile Switchers */}
        <div ref={dropdownRef} className="flex items-center gap-2">
          {role === 'borrower' && currentBorrower && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'borrower' ? null : 'borrower')}
                aria-expanded={activeDropdown === 'borrower'}
                className="flex items-center gap-2 rounded-xl border border-theme-border bg-theme-bg px-3.5 py-2 text-xs sm:text-sm font-semibold text-theme-primary hover:border-theme-accent transition-colors"
              >
                <User className="h-4 w-4 text-theme-accent" />
                <span className="max-w-[140px] truncate">{currentBorrower.name}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-theme-secondary transition-transform ${activeDropdown === 'borrower' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'borrower' && (
                <div className="absolute left-0 top-full mt-1.5 w-60 rounded-2xl border border-theme-border bg-theme-surface p-1.5 shadow-xl z-50">
                  <div className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-theme-secondary">
                    {t.switch_profile}
                  </div>
                  {borrowers.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        handleSelectBorrower(b);
                        setActiveDropdown(null);
                        navigate('/borrower/auth');
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs sm:text-sm text-left font-medium transition-colors ${
                        b.id === currentBorrower.id
                          ? 'bg-theme-soft font-bold text-theme-accent'
                          : 'text-theme-primary hover:bg-theme-bg'
                      }`}
                    >
                      <span className="truncate">{b.name}</span>
                    </button>
                  ))}
                  <div className="mt-1 border-t border-theme-border pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        handleNewBorrower();
                        setActiveDropdown(null);
                        navigate('/borrower/auth');
                      }}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-theme-accent py-2 text-xs sm:text-sm font-bold text-white hover:opacity-90 transition-opacity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      New Borrower Flow
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {role === 'lender' && currentLender && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'lender' ? null : 'lender')}
                aria-expanded={activeDropdown === 'lender'}
                className="flex items-center gap-2 rounded-xl border border-theme-border bg-theme-bg px-3.5 py-2 text-xs sm:text-sm font-semibold text-theme-primary hover:border-theme-accent transition-colors"
              >
                <Building2 className="h-4 w-4 text-theme-accent" />
                <span className="max-w-[160px] truncate">{currentLender.name}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-theme-secondary transition-transform ${activeDropdown === 'lender' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'lender' && (
                <div className="absolute left-0 top-full mt-1.5 w-64 rounded-2xl border border-theme-border bg-theme-surface p-1.5 shadow-xl z-50">
                  <div className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-theme-secondary">
                    {t.switch_lender}
                  </div>
                  {lenders.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        handleSelectLender(l);
                        setActiveDropdown(null);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs sm:text-sm text-left font-medium transition-colors ${
                        l.id === currentLender.id
                          ? 'bg-theme-soft font-bold text-theme-accent'
                          : 'text-theme-primary hover:bg-theme-bg'
                      }`}
                    >
                      <span className="truncate">{l.name}</span>
                      <span className="text-[10px] text-theme-secondary capitalize">({l.type})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Role, Language, Theme Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex rounded-xl border border-theme-border bg-theme-bg p-1">
            <button
              type="button"
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
              type="button"
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

          <div className="flex rounded-xl border border-theme-border bg-theme-bg p-1">
            {(['en', 'hi', 'bn'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
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

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-theme-border bg-theme-bg text-theme-secondary hover:border-theme-accent hover:text-theme-primary transition-colors"
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