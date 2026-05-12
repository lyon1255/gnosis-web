import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { collection, onSnapshot, query, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Komponensek
import Header from './components/Header';
import Footer from './components/Footer';
import BugReportModal from './components/BugReportModal';

// Oldalak
import Home from './pages/Home';
import PatchNotes from './pages/PatchNotes';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AdminDashboard from './pages/AdminDashboard';

const ScrollToHash = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.replace('#', ''));
      if (element) setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
    } else { window.scrollTo(0, 0); }
  }, [location]);
  return null;
};

export default function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('default'); 
  const [showBugModal, setShowBugModal] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [patchNotes, setPatchNotes] = useState([]);
  const [stats, setStats] = useState({ totalViews: 0, uniqueVisitors: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [systemSettings, setSystemSettings] = useState({ maintenance: false, announcement: '', serverStatus: 'online' });

  // 1. GLOBÁLIS ADATOK (Patches, Stats, Settings)
  useEffect(() => {
    onSnapshot(doc(db, 'settings', 'global'), (doc) => doc.exists() && setSystemSettings(doc.data()));
    onSnapshot(query(collection(db, 'patchNotes')), (snap) => {
      const notes = [];
      snap.forEach(doc => notes.push({ id: doc.id, ...doc.data() }));
      setPatchNotes(notes.sort((a, b) => b.timestamp - a.timestamp));
    });
    onSnapshot(doc(db, 'analytics', 'site_stats'), (doc) => doc.exists() && setStats(doc.data()));
  }, []);

  // 2. AUTH LOGIKA (Steam & Firebase)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const steamToken = params.get('token');
    if (steamToken) {
      signInWithCustomToken(auth, steamToken).then(() => window.history.replaceState({}, document.title, window.location.pathname));
    }
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userSnap = await getDoc(doc(db, 'users', currentUser.uid));
        if (userSnap.exists()) setUserRole(userSnap.data().role || 'default');
        else {
          await setDoc(doc(db, 'users', currentUser.uid), { uid: currentUser.uid, name: currentUser.displayName, photoURL: currentUser.photoURL, role: 'default', lastLogin: Date.now() });
          setUserRole('default');
        }
      } else setUserRole('default');
    });
    return () => unsub();
  }, []);

  // Görgetés figyelése
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSteamLogin = () => {
    setIsLoggingIn(true);
    window.location.href = 'https://steamauth-dmwo7p5zfa-uc.a.run.app';
  };

  const hasAdminAccess = ['owner', 'developer', 'moderator'].includes(userRole);
  const isMaintenanceExempt = ['owner', 'developer'].includes(userRole);

  // KARBANTARTÁS KÉPERNYŐ
  if (systemSettings.maintenance && !isMaintenanceExempt) {
    return (
      <div className="min-h-screen bg-[#0E1624] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#162031] border border-red-500/20 p-12 rounded-2xl">
          <AlertTriangle className="text-red-500 w-16 h-16 mx-auto mb-6 animate-pulse" />
          <h1 className="font-montserrat font-black text-3xl text-white mb-4 uppercase">System Offline</h1>
          <p className="font-inter text-white/50 text-sm mb-8">Maintenance in progress. Please check back later.</p>
          <a href="https://playgnosis.hu" className="text-[10px] font-black text-[#2EF2C4] uppercase tracking-widest">Discord Status</a>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToHash />
      <div className="bg-[#0E1624] min-h-screen font-sans text-[#F4FFFD] relative">
        
        <Header 
          scrolled={scrolled}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          user={user}
          userRole={userRole}
          hasAdminAccess={hasAdminAccess}
          systemSettings={systemSettings}
          handleSteamLogin={handleSteamLogin}
          isLoggingIn={isLoggingIn}
          setShowBugModal={setShowBugModal}
        />

        <Routes>
          <Route path="/" element={<Home latestNote={patchNotes[0]} isNewUpdate={patchNotes[0] ? (Date.now() - patchNotes[0].timestamp) < (7*24*60*60*1000) : false} />} />
          <Route path="/patch-notes" element={<PatchNotes patchNotes={patchNotes} isAdmin={['owner', 'developer'].includes(userRole)} isNewUpdate={(ts) => (Date.now() - ts) < (7*24*60*60*1000)} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/admin" element={hasAdminAccess ? <AdminDashboard stats={stats} userRole={userRole} /> : <div className="pt-40 text-center font-black text-4xl text-red-500 uppercase">Access Denied</div>} />
        </Routes>

        <Footer />

        {/* AZ ÚJ MODULÁRIS MODAL */}
        <BugReportModal 
          isOpen={showBugModal} 
          onClose={() => setShowBugModal(false)} 
          user={user} 
        />

        {/* Karbantartás admin jelző */}
        {systemSettings.maintenance && isMaintenanceExempt && (
          <div className="fixed bottom-6 right-6 z-[100] bg-red-500 text-white px-4 py-2 rounded-full font-black text-[10px] uppercase flex items-center gap-2 border border-white/20 shadow-2xl">
            <ShieldAlert size={14} /> Maintenance Mode ON
          </div>
        )}
      </div>
    </Router>
  );
}