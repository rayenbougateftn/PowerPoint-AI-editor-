/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Plus, Layout, Trash2, Clock, Play, Download, Settings, LogOut, ChevronRight } from 'lucide-react';
import { db, auth, logout } from '../lib/firebase';
import { Presentation, THEMES } from '../types';

export default function Dashboard() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPresentations();
  }, []);

  const fetchPresentations = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'presentations'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Presentation));
      setPresentations(data);
    } catch (error) {
      console.error('Error fetching presentations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this presentation?')) return;
    try {
      await deleteDoc(doc(db, 'presentations', id));
      setPresentations(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting presentation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-200 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">R</div>
          <span className="font-bold text-slate-900">Rayen Bougatef</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
            <Layout className="w-5 h-5" />
            My Decks
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            Account
          </button>
        </nav>
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold overflow-hidden">
               {auth.currentUser?.photoURL ? <img src={auth.currentUser.photoURL} alt="" /> : auth.currentUser?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-slate-900 truncate">{auth.currentUser?.displayName || 'User'}</p>
               <p className="text-xs text-slate-500 truncate">{auth.currentUser?.email}</p>
            </div>
          </div>
          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 p-4 lg:p-6 flex items-center justify-between">
           <h1 className="text-2xl font-bold text-slate-900">My Presentations</h1>
           <button 
             onClick={() => navigate('/editor')}
             className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-all shadow-md active:scale-95"
           >
             <Plus className="w-5 h-5" />
             New Conversion
           </button>
        </header>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[1,2,3].map(n => (
                 <div key={n} className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse"></div>
               ))}
            </div>
          ) : presentations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {presentations.map((p) => (
                <div 
                  key={p.id} 
                  onClick={() => navigate(`/editor/${p.id}`)}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer flex flex-col"
                >
                  <div className="aspect-video bg-slate-100 relative overflow-hidden flex items-center justify-center">
                    {/* Simplified Slide Preview */}
                    <div 
                      className="w-3/4 h-3/4 bg-white shadow-lg rounded p-4 flex flex-col gap-2"
                      style={{ borderLeft: `4px solid ${THEMES[p.theme || 'corporate'].primary}` }}
                    >
                       <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                       <div className="space-y-1 mt-2">
                          <div className="h-2 bg-slate-100 rounded w-full"></div>
                          <div className="h-2 bg-slate-100 rounded w-full"></div>
                          <div className="h-2 bg-slate-100 rounded w-2/3"></div>
                       </div>
                    </div>
                    <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                       <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-indigo-600 hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-indigo-600" />
                       </div>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{p.title}</h3>
                      <button 
                        onClick={(e) => handleDelete(e, p.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between text-xs text-slate-500 font-medium pt-4 border-t border-slate-50">
                       <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(p.createdAt).toLocaleDateString()}
                       </div>
                       <div className="flex items-center gap-1">
                          <Download className="w-3.5 h-3.5" />
                          PPX Ready
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
               <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-6">
                  <Plus className="w-10 h-10" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">Create your first presentation</h3>
               <p className="text-slate-500 mb-8 max-w-sm text-center">Upload a PDF and let our AI transform it into a professional slide deck in seconds.</p>
               <button 
                 onClick={() => navigate('/editor')}
                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg active:scale-95"
               >
                 <Plus className="w-5 h-5" />
                 Start with a PDF
               </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
