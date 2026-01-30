import { Suspense, lazy } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Lazy load the landing page for better performance
const LandingPage = lazy(() => import("@/pages/LandingPage"));

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-obsidian flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      <p className="text-white/60 font-body text-sm tracking-widest uppercase">Loading</p>
    </div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-obsidian">
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#0A0A0A',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            color: '#F5F5F5',
          },
        }}
      />
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
