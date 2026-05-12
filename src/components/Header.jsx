import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bug, LogOut, ChevronDown, Activity } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { DiscordIcon, TwitterIcon, InstagramIcon, SteamIcon } from './Shared';

export default function Header({ 
  scrolled, isMobileMenuOpen, setIsMobileMenuOpen, 
  user, userRole, hasAdminAccess, 
  systemSettings, handleSteamLogin, isLoggingIn, 
  setShowBugModal 
}) {
  // --- VALÓS IDEJŰ SZERVER STÁTUSZ ---
  const [liveStatus, setLiveStatus] = useState('checking');

  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        // Lekérdezzük a valós szervered állapotát
        const response = await fetch('https://auth.playgnosis.hu/health/live');
        if (response.ok) {
          setLiveStatus('online');
        } else {
          setLiveStatus('offline');
        }
      } catch (error) {
        // Ha nem érhető el, vagy hálózati hiba van
        setLiveStatus('offline');
      }
    };

    // Azonnali lekérdezés betöltéskor
    checkServerHealth();

    // Utána 30 másodpercenként frissítjük az állapotot a háttérben
    const interval = setInterval(checkServerHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* --- GLOBÁLIS ÜZENET BANNER --- */}
      {systemSettings.announcement && (
        <div className="fixed top-0 left-0 w-full z-[60] bg-gradient-to-r from-[#7A3CFF] to-[#2EF2C4] py-2 px-4 text-center shadow-2xl h-9 md:h-10 flex items-center justify-center">
          <p className="text-[10px] md:text-xs font-black text-[#0E1624] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
            <Activity size={14} className="animate-pulse" />
            {systemSettings.announcement}
            <Activity size={14} className="animate-pulse" />
          </p>
        </div>
      )}

      {/* --- NAVBAR --- */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled || isMobileMenuOpen ? 'bg-[#0E1624] py-4 shadow-lg border-b border-[#7A3CFF]/20' : 'bg-transparent py-6 lg:py-8'} px-6 md:px-12 lg:px-20`}
        style={{ top: systemSettings.announcement ? (window.innerWidth >= 768 ? '40px' : '36px') : '0' }}
      >
        
        <div className="flex items-center justify-between">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="font-montserrat font-black text-2xl lg:text-3xl tracking-tighter text-[#F4FFFD]">
            GNOSIS<span className="text-[#2EF2C4]">.</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="font-inter text-xs font-bold tracking-widest text-white/70 hover:text-[#2EF2C4] uppercase transition-all">Home</Link>
            <Link to="/#story" className="font-inter text-xs font-bold tracking-widest text-white/70 hover:text-[#2EF2C4] uppercase transition-all">Story</Link>
            <Link to="/#world" className="font-inter text-xs font-bold tracking-widest text-white/70 hover:text-[#2EF2C4] uppercase transition-all">World</Link>
            <Link to="/patch-notes" className="font-inter text-xs font-bold tracking-widest text-[#7A3CFF] hover:text-[#2EF2C4] uppercase transition-all">Patch Notes</Link>
            
            <div className="relative group py-4">
              <button className="inline-flex font-inter text-xs font-bold tracking-widest text-[#F4FFFD]/70 group-hover:text-[#2EF2C4] uppercase transition-all items-center gap-1">
                Community <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-[-8px] w-48 bg-[#162031] border border-[#7A3CFF]/30 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl p-2">
                  <a href="https://playgnosis.hu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 text-sm text-[#F4FFFD]/80 hover:bg-[#7A3CFF]/20 hover:text-[#2EF2C4] rounded transition-all"><DiscordIcon className="w-4 h-4" /> Discord</a>
                  <a href="https://playgnosis.hu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 text-sm text-[#F4FFFD]/80 hover:bg-[#7A3CFF]/20 hover:text-[#2EF2C4] rounded transition-all"><TwitterIcon className="w-4 h-4" /> Twitter</a>
                  <a href="https://playgnosis.hu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 text-sm text-[#F4FFFD]/80 hover:bg-[#7A3CFF]/20 hover:text-[#2EF2C4] rounded transition-all"><InstagramIcon className="w-4 h-4" /> Instagram</a>
              </div>
            </div>

            {/* --- VALÓS SZERVER STÁTUSZ JELZŐ --- */}
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10" title="Live Game Server Status">
              <div className={`w-1.5 h-1.5 rounded-full ${
                liveStatus === 'online' ? 'bg-[#2EF2C4] animate-pulse' : 
                liveStatus === 'checking' ? 'bg-yellow-500 animate-pulse' : 
                'bg-red-500'
              }`}></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{liveStatus}</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {user && <button onClick={() => setShowBugModal(true)} className="px-4 py-2 border border-red-500/20 text-red-400 text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all rounded flex items-center gap-2"><Bug size={14}/> Report Bug</button>}
            {hasAdminAccess && <Link to="/admin" className="text-[10px] font-black tracking-widest bg-[#2EF2C4] text-[#0E1624] px-4 py-2 rounded hover:brightness-110 transition-all uppercase shadow-[0_0_15px_rgba(46,242,196,0.3)]">Admin Panel</Link>}
            
            {!user ? (
              <button onClick={handleSteamLogin} disabled={isLoggingIn} className="bg-white text-slate-900 font-inter font-black text-[10px] tracking-widest px-6 py-3 rounded flex items-center gap-2 hover:bg-[#2EF2C4] transition-all">
                {isLoggingIn ? <div className="w-3 h-3 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div> : <SteamIcon size={16} />}
                SIGN IN WITH STEAM
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-white/5 p-1 pr-4 rounded-full border border-white/10 hover:border-[#7A3CFF]/50 transition-all">
                <img src={user.photoURL} className="w-8 h-8 rounded-full border border-[#2EF2C4]" alt="profile" />
                <button onClick={() => signOut(auth)} className="text-[10px] font-black text-white/40 hover:text-red-400 uppercase tracking-widest transition-colors">Logout</button>
              </div>
            )}
          </div>

          <button className="lg:hidden text-[#F4FFFD]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0E1624] z-40 lg:hidden p-8 flex flex-col gap-6 uppercase font-montserrat font-black justify-center">
           <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
           <Link to="/#story" onClick={() => setIsMobileMenuOpen(false)}>Story</Link>
           <Link to="/#world" onClick={() => setIsMobileMenuOpen(false)}>World</Link>
           <Link to="/patch-notes" onClick={() => setIsMobileMenuOpen(false)} className="text-[#7A3CFF]">Patch Notes</Link>
           <div className="h-px bg-white/10 my-2"></div>
           {user && <button onClick={() => { setShowBugModal(true); setIsMobileMenuOpen(false); }} className="text-left text-red-400">Report Bug</button>}
           {hasAdminAccess && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-[#2EF2C4]">Admin Dashboard</Link>}
           {!user ? (
             <button onClick={handleSteamLogin} disabled={isLoggingIn} className="text-left flex items-center gap-2">
               <SteamIcon size={20}/> Sign in with Steam
             </button>
           ) : (
             <button onClick={() => signOut(auth)} className="text-left text-white/30">Logout</button>
           )}
        </div>
      )}
    </>
  );
}