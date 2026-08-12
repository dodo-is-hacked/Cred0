import React, { useState } from 'react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import { Upload, FileCheck, CheckCircle2, FileText, ArrowRight, Trash2, Eye, X, ShieldCheck } from 'lucide-react';

interface UploadedDoc {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

interface DocumentUploadProps {
  language: Language;
  onVerifyDocument: (docType: string, docName: string) => void;
  onSkip: () => void;
  verified: boolean;
  docName?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  language,
  onVerifyDocument,
  onSkip,
  verified,
  docName,
}) => {
  const t = translations[language] || translations.en;

  // Initialize uploaded docs list with preset if verified
  const [docList, setDocList] = useState<UploadedDoc[]>(() => {
    if (verified && docName) {
      return [{
        id: 'doc_init',
        name: docName,
        type: 'Utility & Identity Record',
        size: '1.4 MB',
        uploadedAt: new Date().toLocaleDateString()
      }];
    }
    return [];
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewDoc, setPreviewDoc] = useState<UploadedDoc | null>(null);

  const simulateAddFiles = (newDocs: { name: string; type: string; size: string }[]) => {
    setIsVerifying(true);
    setProgress(10);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsVerifying(false);

          const added: UploadedDoc[] = newDocs.map((d, idx) => ({
            id: `doc_${Date.now()}_${idx}`,
            name: d.name,
            type: d.type,
            size: d.size,
            uploadedAt: new Date().toLocaleDateString()
          }));

          const updatedList = [...docList, ...added];
          setDocList(updatedList);
          
          // Trigger verification callback with primary document name
          onVerifyDocument(updatedList[0].type, updatedList[0].name);
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray: File[] = Array.from(e.target.files);
      const docsToAdd = filesArray.map((f: File) => ({
        name: f.name,
        type: f.type.includes('pdf') ? 'PDF Document' : 'Image Document',
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`
      }));
      simulateAddFiles(docsToAdd);
    }
  };

  const handleDeleteDoc = (id: string) => {
    const updated = docList.filter(d => d.id !== id);
    setDocList(updated);
    if (updated.length > 0) {
      onVerifyDocument(updated[0].type, updated[0].name);
    }
  };

  return (
    <div className="space-y-6 bg-theme-surface p-6 sm:p-8 rounded-2xl border border-theme-border shadow-xs">
      
      {/* Header */}
      <div>
        <h3 className="font-serif-lora text-2xl font-bold text-theme-primary">
          {t.doc_title}
        </h3>
        <p className="text-sm text-theme-secondary mt-1">
          {t.doc_subtitle}
        </p>
      </div>

      {/* Uploaded Documents Grid / List */}
      {docList.length > 0 && (
        <div className="space-y-3 rounded-2xl border border-emerald-500/30 bg-emerald-50/40 p-4 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Uploaded & Verified Documents ({docList.length})
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {docList.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-theme-border bg-theme-surface shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-theme-soft text-theme-accent">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-theme-primary truncate">
                      {doc.name}
                    </p>
                    <p className="text-[11px] text-theme-secondary">
                      {doc.type} · {doc.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(doc)}
                    title="Preview Document"
                    className="p-1.5 rounded-lg text-theme-secondary hover:text-theme-accent hover:bg-theme-bg"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteDoc(doc.id)}
                    title="Delete Document"
                    className="p-1.5 rounded-lg text-theme-secondary hover:text-red-500 hover:bg-theme-bg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar Simulation */}
      {isVerifying ? (
        <div className="space-y-4 rounded-2xl border border-theme-border bg-theme-bg p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-theme-soft text-theme-accent animate-pulse">
            <FileCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-theme-primary">{t.doc_verifying}</p>
            <p className="text-xs text-theme-secondary">Extracting address verification & utility stability signals...</p>
          </div>
          
          <div className="mx-auto max-w-xs h-2.5 w-full overflow-hidden rounded-full bg-theme-border">
            <div
              className="h-full bg-theme-accent transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs font-mono font-semibold text-theme-accent">{progress}%</p>
        </div>
      ) : (
        /* Multi-File Dropzone & Presets */
        <div className="space-y-4">
          
          {/* Main Dropzone */}
          <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-theme-border bg-theme-bg p-8 text-center transition-all hover:border-theme-accent hover:bg-theme-soft/30 cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileInput}
              className="hidden"
            />
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-theme-surface text-theme-accent shadow-xs border border-theme-border">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-theme-primary">{t.doc_dropzone}</p>
            <p className="text-xs text-theme-secondary mt-1">PNG, JPG, or PDF (Upload multiple records at once)</p>
          </label>

          {/* Quick Preset Samples */}
          <div className="space-y-2 pt-2">
            <p className="text-xs font-bold text-theme-secondary uppercase tracking-wider">
              {t.doc_preset_title}
            </p>

            <div className="grid gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => simulateAddFiles([{ name: 'Electricity_Bill_Muzaffarpur.pdf', type: 'Utility Electricity Bill', size: '1.2 MB' }])}
                className="flex items-center gap-2 rounded-xl border border-theme-border bg-theme-bg p-3 text-left hover:border-theme-accent hover:bg-theme-surface transition-all group"
              >
                <FileText className="h-4 w-4 shrink-0 text-theme-accent group-hover:scale-110" />
                <span className="text-xs font-semibold text-theme-primary line-clamp-1">
                  {t.doc_preset_1}
                </span>
              </button>

              <button
                type="button"
                onClick={() => simulateAddFiles([{ name: 'Land_Record_Nadia.pdf', type: 'FPO Land Record', size: '2.4 MB' }])}
                className="flex items-center gap-2 rounded-xl border border-theme-border bg-theme-bg p-3 text-left hover:border-theme-accent hover:bg-theme-surface transition-all group"
              >
                <FileText className="h-4 w-4 shrink-0 text-theme-accent group-hover:scale-110" />
                <span className="text-xs font-semibold text-theme-primary line-clamp-1">
                  {t.doc_preset_2}
                </span>
              </button>

              <button
                type="button"
                onClick={() => simulateAddFiles([{ name: 'Vending_Permit_Kolkata.pdf', type: 'Trade License Permit', size: '0.9 MB' }])}
                className="flex items-center gap-2 rounded-xl border border-theme-border bg-theme-bg p-3 text-left hover:border-theme-accent hover:bg-theme-surface transition-all group"
              >
                <FileText className="h-4 w-4 shrink-0 text-theme-accent group-hover:scale-110" />
                <span className="text-xs font-semibold text-theme-primary line-clamp-1">
                  {t.doc_preset_3}
                </span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-theme-border">
            <button
              onClick={onSkip}
              className="text-xs font-semibold text-theme-secondary hover:text-theme-primary underline underline-offset-4"
            >
              {t.doc_skip} →
            </button>

            {docList.length > 0 && (
              <button
                onClick={onSkip}
                className="flex items-center gap-2 rounded-xl bg-theme-accent px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-90"
              >
                <span>Continue ({docList.length} Uploaded)</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-theme-border bg-theme-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-theme-accent" />
                <h4 className="font-serif-lora text-base font-bold text-theme-primary truncate max-w-[240px]">
                  {previewDoc.name}
                </h4>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="rounded-lg p-1 text-theme-secondary hover:text-theme-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 py-2">
              <div className="rounded-xl border border-theme-border bg-theme-bg p-4 text-center space-y-2">
                <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-theme-primary">Document Verification Successful</p>
                <p className="text-xs text-theme-secondary">Verified document record stored for underwriting evaluation.</p>
              </div>

              <div className="space-y-1 text-xs text-theme-secondary">
                <p><span className="font-semibold text-theme-primary">Document Type:</span> {previewDoc.type}</p>
                <p><span className="font-semibold text-theme-primary">File Size:</span> {previewDoc.size}</p>
                <p><span className="font-semibold text-theme-primary">Uploaded On:</span> {previewDoc.uploadedAt}</p>
              </div>
            </div>

            <button
              onClick={() => setPreviewDoc(null)}
              className="w-full rounded-xl bg-theme-accent py-2.5 text-xs font-bold text-white shadow-xs"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
