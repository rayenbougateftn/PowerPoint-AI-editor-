/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'framer-motion';
import { Upload, FileText, Zap, Layout, ArrowRight, Download, CheckCircle, Shield } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">R</div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Rayen Bougatef</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">How it works</a>
              <button 
                onClick={signInWithGoogle}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6"
            >
              Convert PDFs into Stunning <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Presentations Instantly</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto"
            >
              Upload your document. Our AI extracts core insights and builds professional, beautifully designed slide decks in seconds.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
            >
              <button 
                onClick={signInWithGoogle}
                className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-indigo-200"
              >
                Start Converting for Free 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all">
                See Demo
              </button>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="aspect-[16/9] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
              <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
              </div>
              <div className="flex-1 flex bg-slate-100 items-center justify-center p-8">
                <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg flex gap-6">
                   <div className="w-1/3 flex flex-col gap-2">
                     <div className="h-4 bg-slate-100 rounded w-full"></div>
                     <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                     <div className="h-4 bg-slate-100 rounded w-4/6"></div>
                     <div className="h-32 bg-indigo-50 rounded-lg mt-4 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-indigo-200" />
                     </div>
                   </div>
                   <div className="flex-1 flex flex-col gap-4">
                     <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                        <Zap className="w-4 h-4 fill-indigo-600" /> AI Processing...
                     </div>
                     <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                     <div className="space-y-2">
                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                        <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                     </div>
                     <div className="mt-auto flex justify-end">
                        <div className="h-8 w-24 bg-indigo-600 rounded-lg"></div>
                     </div>
                   </div>
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 lg:-right-12 p-4 bg-white rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce">
               <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <Download className="w-6 h-6" />
               </div>
               <div>
                  <div className="text-xs text-slate-500 font-medium">Export Ready</div>
                  <div className="text-sm font-bold text-slate-900">presentation.pptx</div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Instant Generation", desc: "Complex PDFs summarized and structured into slides in under 30 seconds." },
              { icon: Layout, title: "Smart Layouts", desc: "AI automatically chooses the best visual layout for every slide type." },
              { icon: Shield, title: "Secure & Private", desc: "Your files are encrypted and automatically deleted after processing." },
              { icon: CheckCircle, title: "Fully Editable", desc: "Export to PowerPoint and maintain full control over every element." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-16">Creating presentations in 3 steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-dashed border-t-2 border-dashed border-slate-200"></div>
             {[
               { step: "01", title: "Upload PDF", desc: "Drag and drop your document into our secure interface." },
               { step: "02", title: "AI Magic", desc: "Our engine extracts text, summarizes content, and builds the structure." },
               { step: "03", title: "Perfect PPTX", desc: "Preview your slides, customize the theme, and download your deck." }
             ].map((item, i) => (
               <div key={i} className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 bg-white rounded-full shadow-lg border-4 border-indigo-600 flex items-center justify-center text-2xl font-black text-indigo-600 mb-8">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-600 max-w-xs">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-sm">R</div>
                <span className="font-bold text-slate-900">Rayen Bougatef</span>
              </div>
              <div className="flex gap-8 text-sm text-slate-500">
                <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
                <a href="#" className="hover:text-indigo-600">Terms of Service</a>
                <a href="#" className="hover:text-indigo-600">Contact Support</a>
              </div>
              <p className="text-sm text-slate-400">© 2026 Rayen Bougatef. All rights reserved.</p>
           </div>
        </div>
      </footer>
    </div>
  );
}
