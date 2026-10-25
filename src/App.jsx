import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ScamProvider } from './context/ScamContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { AiAnalyzerPage } from './pages/AiAnalyzerPage';
import { DatabasePage } from './pages/DatabasePage';
import { ReportPage } from './pages/ReportPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { ScamDetailPage } from './pages/ScamDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ScamProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-slate-50/80 dark:bg-[#000000] text-slate-900 dark:text-slate-100 transition-colors cyber-grid-pattern relative">
              {/* Cyber Neon Lighting Meshes */}
              <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#a855f7]/15 via-[#00e5ff]/12 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
              <div className="fixed bottom-0 right-0 w-[550px] h-[350px] bg-gradient-to-tl from-[#00e5ff]/12 via-[#a855f7]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
              <div className="fixed top-1/3 -left-24 w-[400px] h-[400px] bg-[#a855f7]/8 rounded-full blur-3xl pointer-events-none -z-10" />

              <Navbar />
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/analyzer" element={<AiAnalyzerPage />} />
                  <Route path="/analyze" element={<AiAnalyzerPage />} />
                  <Route path="/database" element={<DatabasePage />} />
                  <Route path="/search" element={<Navigate to="/" replace />} />
                  <Route path="/report" element={<ReportPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/scam/:id" element={<ScamDetailPage />} />
                  <Route path="/map" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </ScamProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}