import React from 'react';
import { AnimatedSection } from '../components/Shared';

const LegalPage = ({ title, lastUpdated, children }) => {
  return (
    <main className="pt-32 lg:pt-40 pb-20 px-6 md:px-12 lg:px-20 timeline-bg min-h-screen">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection className="mb-12">
          <h1 className="font-montserrat font-black text-4xl md:text-5xl text-[#F4FFFD] mb-4">
            {title}
          </h1>
          <p className="font-inter text-[#2EF2C4] text-xs font-bold tracking-[0.2em] uppercase">
            Last Updated: {lastUpdated}
          </p>
          <div className="h-1 w-20 bg-[#7A3CFF] mt-6 shadow-[0_0_15px_rgba(122,60,255,0.5)]"></div>
        </AnimatedSection>

        <AnimatedSection delay={100} className="prose prose-invert max-w-none font-inter text-[#F4FFFD]/80 leading-relaxed space-y-6 bg-[#0E1624]/50 border border-[#7A3CFF]/10 p-8 md:p-12 rounded-xl backdrop-blur-sm shadow-2xl">
          {children}
        </AnimatedSection>
      </div>
    </main>
  );
};

export default LegalPage;