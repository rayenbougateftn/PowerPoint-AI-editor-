/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, ChevronLeft, ChevronRight, Save, Download, 
  Trash2, Plus, Layout, Palette, Wand2, ArrowLeft, Loader2, Sparkles, Shield
} from 'lucide-react';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { extractTextFromPDF } from '../lib/pdf';
import { generateSlidesFromText } from '../lib/gemini';
import { exportToPPTX } from '../lib/pptx';
import { Presentation, SlideContent, THEMES, PresentationTheme } from '../types';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState<Partial<Presentation>>({
    title: 'Untitled Presentation',
    slides: [],
    theme: 'corporate'
  });
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (id) {
      loadPresentation(id);
    }
  }, [id]);

  const loadPresentation = async (presId: string) => {
    try {
      const docRef = doc(db, 'presentations', presId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Presentation;
        setPresentation({ ...data, id: docSnap.id });
      } else {
        setError('Presentation not found');
      }
    } catch (err) {
      console.error('Error loading presentation:', err);
      setError('Failed to load presentation');
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !auth.currentUser) return;

    // Limit file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Please upload a PDF smaller than 10MB.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessingStep('Extracting text from PDF...');

    try {
      const text = await extractTextFromPDF(file);
      setProcessingStep('AI is analyzing content and structuring slides...');
      
      const newSlides = await generateSlidesFromText(text, file.name.replace('.pdf', ''));
      
      const newTitle = file.name.replace('.pdf', '');
      const newPresentation = {
        title: newTitle,
        slides: newSlides,
        theme: presentation.theme || 'corporate',
        userId: auth.currentUser.uid,
        createdAt: Date.now()
      };

      // Auto-save
      const docRef = await addDoc(collection(db, 'presentations'), newPresentation);
      setPresentation({ ...newPresentation, id: docRef.id });
      navigate(`/editor/${docRef.id}`, { replace: true });
      setCurrentSlideIndex(0);
    } catch (err: any) {
      console.error('Processing error:', err);
      setError(err.message || 'Failed to process PDF');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  }, [presentation.theme, navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    noClick: isProcessing,
    noKeyboard: isProcessing
  } as any);

  const handleSave = async () => {
    if (!presentation.id || !auth.currentUser) return;
    setSaveStatus('saving');
    try {
      await setDoc(doc(db, 'presentations', presentation.id), {
        ...presentation,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus('error');
    }
  };

  const handleExport = async () => {
    if (!presentation.slides || presentation.slides.length === 0) return;
    try {
      await exportToPPTX(
        presentation.title || 'Presentation', 
        presentation.slides, 
        presentation.theme || 'corporate'
      );
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export presentation');
    }
  };

  const updateSlide = (index: number, updates: Partial<SlideContent>) => {
    if (!presentation.slides) return;
    const newSlides = [...presentation.slides];
    newSlides[index] = { ...newSlides[index], ...updates };
    setPresentation({ ...presentation, slides: newSlides });
  };

  const currentTheme = THEMES[presentation.theme || 'corporate'];

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
         <div className="relative mb-12">
            <div className="w-32 h-32 bg-indigo-600/20 rounded-full animate-ping absolute inset-0"></div>
            <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center relative z-10">
               <Sparkles className="w-16 h-16 text-white animate-pulse" />
            </div>
         </div>
         <h2 className="text-3xl font-bold text-white mb-4">Processing your PDF</h2>
         <p className="text-indigo-200 text-lg mb-8 max-w-md">{processingStep}</p>
         <div className="w-full max-w-xs bg-slate-800 h-2 rounded-full overflow-hidden">
            <motion.div 
               className="h-full bg-indigo-500"
               animate={{ x: [-100, 300] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
         </div>
         <p className="mt-12 text-slate-500 text-sm">Large documents may take up to a minute. Don't close this tab.</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-100 flex flex-col font-sans">
      {/* Editor Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-slate-200"></div>
          <input 
            type="text" 
            value={presentation.title}
            onChange={(e) => setPresentation({ ...presentation, title: e.target.value })}
            className="text-lg font-bold text-slate-900 border-none focus:ring-0 bg-transparent p-0 min-w-[200px]"
            placeholder="Presentation Title"
          />
          {saveStatus === 'saved' && <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Saved</span>}
          {saveStatus === 'saving' && <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Saving...</span>}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 font-bold rounded-lg transition-all"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button 
            onClick={handleExport}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold transition-all shadow-md active:scale-95"
          >
            <Download className="w-4 h-4" />
            Export PPTX
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {presentation.slides && presentation.slides.length > 0 ? (
          <>
            {/* Slide Navigation (Thumbnails) */}
            <aside className="w-full lg:w-64 bg-white border-r border-slate-200 overflow-y-auto px-4 py-6 hidden lg:block">
               <div className="space-y-4">
                  {presentation.slides.map((slide, i) => (
                    <div 
                      key={i}
                      onClick={() => setCurrentSlideIndex(i)}
                      className={`relative aspect-video rounded-lg border-2 transition-all cursor-pointer overflow-hidden p-2 flex flex-col gap-1 ${currentSlideIndex === i ? 'border-indigo-600 shadow-lg ring-4 ring-indigo-50' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                       <div className="text-[6px] font-bold text-slate-400 mb-1">{i + 1}</div>
                       <div 
                         className="h-2 bg-slate-200 rounded w-3/4"
                         style={{ backgroundColor: currentSlideIndex === i ? currentTheme.primary + '40' : undefined }}
                       ></div>
                       <div className="space-y-0.5">
                          <div className="h-1 bg-slate-100 rounded w-full"></div>
                          <div className="h-1 bg-slate-100 rounded w-full"></div>
                          <div className="h-1 bg-slate-100 rounded w-2/3"></div>
                       </div>
                    </div>
                  ))}
               </div>
            </aside>

            {/* Main Stage */}
            <main className="flex-1 bg-slate-100 overflow-y-auto p-4 lg:p-12 pb-24 lg:pb-12 flex flex-col items-center">
              {/* Slide Stage */}
              <div className="w-full max-w-4xl aspect-[16/9] bg-white shadow-2xl rounded-sm overflow-hidden relative border border-slate-200 flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentSlideIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 p-12 lg:p-16 flex flex-col"
                  >
                     <div className="mb-8">
                       <textarea 
                         value={presentation.slides[currentSlideIndex].title}
                         onChange={(e) => updateSlide(currentSlideIndex, { title: e.target.value })}
                         className="text-4xl lg:text-5xl font-black w-full border-none focus:ring-0 p-0 overflow-hidden resize-none leading-tight"
                         rows={2}
                         style={{ color: currentTheme.primary }}
                       />
                     </div>
                     <div className="flex-1 overflow-y-auto">
                        <textarea 
                          value={presentation.slides[currentSlideIndex].bullets.join('\n')}
                          onChange={(e) => updateSlide(currentSlideIndex, { bullets: e.target.value.split('\n') })}
                          className="w-full h-full text-xl lg:text-2xl text-slate-600 border-none focus:ring-0 p-0 resize-none leading-relaxed"
                          placeholder="Add bullet points..."
                          style={{ color: currentTheme.secondary }}
                        />
                     </div>
                     {/* Theme accent bar */}
                     <div 
                       className="absolute bottom-0 left-0 right-0 h-4"
                       style={{ backgroundColor: currentTheme.primary }}
                     ></div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Visual Overlay based on layout */}
                {presentation.slides[currentSlideIndex].layout === 'section' && (
                   <div className="absolute inset-0 bg-opacity-10 pointer-events-none" style={{ backgroundColor: currentTheme.primary }}></div>
                )}
              </div>

              {/* Toolbar */}
              <div className="mt-8 flex items-center gap-4 bg-white p-3 rounded-2xl shadow-xl border border-slate-200">
                  <button 
                    disabled={currentSlideIndex === 0}
                    onClick={() => setCurrentSlideIndex(p => p - 1)}
                    className="p-3 hover:bg-slate-100 rounded-xl disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="text-sm font-bold text-slate-500 px-4">
                    Slide {currentSlideIndex + 1} of {presentation.slides.length}
                  </div>
                  <button 
                    disabled={currentSlideIndex === (presentation.slides.length - 1)}
                    onClick={() => setCurrentSlideIndex(p => p + 1)}
                    className="p-3 hover:bg-slate-100 rounded-xl disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="h-6 w-px bg-slate-200 mx-2"></div>
                  <div className="flex items-center gap-1">
                     {Object.entries(THEMES).map(([key, theme]) => (
                       <button 
                         key={key}
                         onClick={() => setPresentation({ ...presentation, theme: key as PresentationTheme })}
                         title={theme.name}
                         className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all ${presentation.theme === key ? 'border-white ring-2 ring-indigo-600 scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                         style={{ backgroundColor: theme.primary }}
                       >
                       </button>
                     ))}
                  </div>
              </div>
            </main>
          </>
        ) : (
          /* Empty State / Upload */
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50">
            <div 
              {...getRootProps()} 
              className={`max-w-xl w-full aspect-square md:aspect-[4/3] bg-white rounded-3xl border-4 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-12 text-center group ${isDragActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
            >
              <input {...getInputProps()} />
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform shadow-inner shadow-indigo-100/50">
                 <Upload className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Upload your PDF</h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Drag and drop your document here, or <span className="text-indigo-600 underline">browse your files</span>. We'll handle the rest.
              </p>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                 <div className="flex items-center gap-1"><FileText className="w-4 h-4" /> PDF only</div>
                 <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                 <div className="flex items-center gap-1"><Shield className="w-4 h-4" /> Secure & Private</div>
              </div>
            </div>
            
            {error && (
              <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3 max-w-lg">
                <Trash2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
              <div className="flex items-center gap-3">
                 <Wand2 className="w-5 h-5" />
                 <span className="text-sm font-bold">AI Summarization</span>
              </div>
              <div className="flex items-center gap-3">
                 <Layout className="w-5 h-5" />
                 <span className="text-sm font-bold">Smart Formatting</span>
              </div>
              <div className="flex items-center gap-3">
                 <Palette className="w-5 h-5" />
                 <span className="text-sm font-bold">Designer Themes</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
