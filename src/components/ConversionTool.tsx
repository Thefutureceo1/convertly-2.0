import React, { useState } from 'react';
import { Upload, FileJson, FileSpreadsheet, FileImage, FileText, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import { cn } from '../lib/utils';

interface ConversionToolProps {
  credits: number;
  onConvert: () => Promise<boolean>;
}

type ConversionType = 'json-to-csv' | 'image-to-pdf';

export const ConversionTool: React.FC<ConversionToolProps> = ({ credits, onConvert }) => {
  const [type, setType] = useState<ConversionType>('json-to-csv');
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus('idle');
      setError(null);
    }
  };

  const convertJsonToCsv = async (file: File) => {
    const text = await file.text();
    try {
      const json = JSON.parse(text);
      const csv = Papa.unparse(json);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace('.json', '.csv');
      a.click();
    } catch (err) {
      throw new Error('Invalid JSON file');
    }
  };

  const convertImageToPdf = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imgData = e.target?.result as string;
          const pdf = new jsPDF();
          const img = new Image();
          img.src = imgData;
          img.onload = () => {
            const imgProps = pdf.getImageProperties(img);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(file.name.split('.')[0] + '.pdf');
            resolve();
          };
        } catch (err) {
          reject(new Error('Failed to process image'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleConvert = async () => {
    if (!file) return;
    if (credits <= 0) {
      setError('No credits remaining. Please buy more credits to continue.');
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (type === 'json-to-csv') {
        await convertJsonToCsv(file);
      } else {
        await convertImageToPdf(file);
      }

      const success = onConvert();
      if (success) {
        setStatus('success');
      } else {
        throw new Error('Failed to deduct credit');
      }
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Conversion failed');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => { setType('json-to-csv'); setFile(null); setStatus('idle'); }}
          className={cn(
            "flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-200",
            type === 'json-to-csv' 
              ? "bg-zinc-900 border-zinc-700 text-white shadow-lg shadow-black/20" 
              : "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
          )}
        >
          <div className="flex items-center gap-2">
            <FileJson className="w-5 h-5" />
            <ArrowRight className="w-3 h-3 opacity-50" />
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">JSON to CSV</span>
        </button>

        <button
          onClick={() => { setType('image-to-pdf'); setFile(null); setStatus('idle'); }}
          className={cn(
            "flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-200",
            type === 'image-to-pdf' 
              ? "bg-zinc-900 border-zinc-700 text-white shadow-lg shadow-black/20" 
              : "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
          )}
        >
          <div className="flex items-center gap-2">
            <FileImage className="w-5 h-5" />
            <ArrowRight className="w-3 h-3 opacity-50" />
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">Image to PDF</span>
        </button>
      </div>

      <div className="relative group">
        <input
          type="file"
          onChange={handleFileChange}
          accept={type === 'json-to-csv' ? '.json' : 'image/*'}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className={cn(
          "flex flex-col items-center justify-center gap-4 p-12 border-2 border-dashed rounded-3xl transition-all duration-300",
          file ? "border-zinc-600 bg-zinc-900/30" : "border-zinc-800 bg-transparent group-hover:border-zinc-700 group-hover:bg-zinc-900/10"
        )}>
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-zinc-200 transition-colors">
            <Upload className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-zinc-200">
              {file ? file.name : "Click or drag file to upload"}
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              {type === 'json-to-csv' ? "JSON files only" : "JPG, PNG, WEBP"}
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Conversion successful! 1 credit used.
          </motion.div>
        )}
      </AnimatePresence>

      <button
        disabled={!file || isConverting}
        onClick={handleConvert}
        className={cn(
          "w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3",
          !file || isConverting
            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            : "bg-white text-black hover:bg-zinc-200 active:scale-[0.98]"
        )}
      >
        {isConverting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Converting...
          </>
        ) : (
          <>
            Convert Now
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      <p className="text-center text-xs text-zinc-600">
        Secure, client-side conversion. Your files never leave your browser.
      </p>
    </div>
  );
};
