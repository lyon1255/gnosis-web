import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0E1624] py-16 px-6 md:px-20 border-t border-[#7A3CFF]/20 text-center md:text-left">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="font-montserrat font-black text-3xl tracking-tighter text-white/50 hover:text-white transition-all cursor-default">GNOSIS<span className="text-[#2EF2C4]">.</span></h2>
          <p className="text-[10px] text-white/20 mt-2 uppercase tracking-[0.3em] font-black">&copy; 2026 Gnosis Online / Sunken Babel Network</p>
        </div>
        <div className="flex gap-8 text-[11px] font-black tracking-[0.2em] text-white/40 uppercase">
          <Link to="/privacy-policy" className="hover:text-[#2EF2C4] transition-all">Privacy</Link>
          <Link to="/terms-of-service" className="hover:text-[#2EF2C4] transition-all">Terms</Link>
          <a href="mailto:takacs.gergo2000@gmail.com" className="hover:text-[#2EF2C4] transition-all">Support</a>
        </div>
      </div>
    </footer>
  );
}