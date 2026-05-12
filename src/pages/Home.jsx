import React from 'react';
import { PlayCircle, ArrowRight } from 'lucide-react';
import { AnimatedSection, SteamIcon } from '../components/Shared';
import { Link } from 'react-router-dom';

export default function Home({ latestNote, isNewUpdate }) {
  return (
    <main>
      <section id="home" className="relative h-screen flex flex-col hero-bg">
        <AnimatedSection delay={200} className="flex-grow flex flex-col justify-center px-6 md:px-12 lg:px-20 z-10 w-full lg:w-2/3 xl:w-1/2">
          <div className="flex items-center gap-4 mb-4 lg:mb-6">
            <div className="h-[1px] w-8 lg:w-12 bg-[#2EF2C4] shadow-[0_0_10px_rgba(46,242,196,0.8)]"></div>
            <span className="font-inter text-[#2EF2C4] text-xs lg:text-sm font-bold tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(46,242,196,0.4)]">GNOSIS ONLINE · 2026</span>
          </div>
          <h1 className="font-montserrat font-black text-5xl sm:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tighter text-[#F4FFFD] mb-6 lg:mb-8 drop-shadow-2xl">
            ENTER. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2EF2C4] via-[#7A3CFF] to-[#7A3CFF] drop-shadow-[0_0_30px_rgba(122,60,255,0.6)]">THE RIFTS.</span>
          </h1>
          <p className="font-inter text-[#F4FFFD]/80 text-base sm:text-xl max-w-lg mb-8 lg:mb-12 leading-relaxed drop-shadow-md lg:drop-shadow-none">
            100 pocket dimensions. Tactical ability-based combat. A dying world seeking its salvation. Will you conquer Sunken Babel?
          </p>
			<div className="flex flex-col sm:flex-row gap-4 mt-10">
			  
			  {/* ÚJ: PLAY NOW GOMB */}
			  <a 
				href="https://store.steampowered.com/app/XXXXXX/Gnosis_Online/" 
				target="_blank" 
				rel="noopener noreferrer"
				className="bg-[#2EF2C4] text-[#0E1624] font-montserrat font-black px-10 py-5 rounded uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-110 hover:scale-105 transition-all shadow-[0_0_30px_rgba(46,242,196,0.3)]"
			  >
				<SteamIcon className="w-6 h-6" />
				PLAY NOW ON STEAM
			  </a>

			  {/* A RÉGI TRAILER GOMB */}
			  <button 
				onClick={() => ""}
				className="bg-white/5 backdrop-blur-md border border-white/10 text-white font-montserrat font-black px-10 py-5 rounded uppercase tracking-widest hover:bg-white/10 hover:scale-105 transition-all flex items-center justify-center gap-3"
			  >
				WATCH THE TRAILER
			  </button>
			  
			</div>
        </AnimatedSection>
      </section>

      <section id="story" className="py-20 lg:py-32 px-6 md:px-12 lg:px-20 bg-[#0E1624] relative border-t border-[#7A3CFF]/10">
        <AnimatedSection className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2">
            <h2 className="font-montserrat font-black text-3xl md:text-4xl lg:text-5xl text-[#F4FFFD] mb-6">
              THE MYSTERY OF <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2EF2C4] to-[#7A3CFF]">THE SUNKEN GATES</span>
            </h2>
            <div className="font-inter text-[#F4FFFD]/80 text-sm lg:text-base leading-relaxed space-y-6 max-h-[320px] overflow-y-auto pr-4 custom-scrollbar">
              <p>The world of Aethelgard lived long according to the usual order of empires, intrigues, and magic. The great human kingdoms and proud elven clans fought their petty wars on the borders for centuries, believing they were the masters of the world. They were wrong.</p>
              <p>Doom didn't arrive as a flaming comet or a demon army. The wind simply started blowing, and <strong className="text-[#2EF2C4]">The Aether Storm</strong> appeared in the sky.</p>
              <p>It wasn't a normal storm. A suffocating, dark purple fog that slowly but unstoppably devoured the continents. Where the storm passed, nothing remained but ash and silence. Magic failed, armies crumbled to dust. The survivors fled north, to the only place the storm inexplicably avoided: an ancient, barren plateau at the edge of the world. This became <strong className="text-[#F4FFFD]">Brink Valley</strong>.</p>
              <p>The starving and terrified refugees trapped in the valley soon discovered why the storm hadn't swallowed them. In the middle of the plateau gaped an unfathomably massive, perfectly circular crater. And at the deepest bottom of the abyss, where sunlight had long lost its power, it wasn't darkness waiting for them, but a pulsating, interstellar vortex. A gigantic, artificial Teleporter.</p>
              <p>This was the <strong className="text-[#7A3CFF]">First Rift</strong>. Nightmarish, aether-infected monsters began crawling out of the gate. If the survivors did nothing, whatever was on the other side would eventually flood Brink Valley, finishing what the Aether Storm started.</p>
              <p>However, during the first desperate clashes, something changed. When the beasts were killed, their corpses collapsed into aetheric energy, leaving behind crystallized knowledge, never-before-seen metals, and tiny shards of <strong className="text-[#2EF2C4]">Gnosis</strong>.</p>
              <p>These shards revealed that the gate led to an infinite simulation network consisting of 100 floors. Each floor is an isolated Pocket Dimension. And most importantly: deep within the entire simulation, at the bottom of the 100th floor, rests the "Knowledge"—the source code capable of stopping the Aether Storm and restoring the world. <strong className="text-[#F4FFFD]">Sunken Babel</strong> is not just a prison. It is the world's last lifeboat.</p>
              <p>The kings and warlords forged <strong className="text-[#F4FFFD]">The Covenant of Scars</strong>. Humanity had only one path left for survival: downwards. Thus the order of <strong className="text-[#2EF2C4]">Adventurers</strong> was born. Mercenaries, fallen nobles, and greedy treasure hunters willing to step through the teleporter.</p>
              <p>Every level is a new world. Every killed Boss is another cracked code in the system. The Adventurers jump into the dark so that somewhere, at the bottom of the 100th floor, they can bring back the light.</p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative lg:sticky lg:top-32">
            <div className="aspect-[4/3] lg:aspect-square bg-[#0E1624] rounded-lg border border-[#7A3CFF]/30 overflow-hidden relative shadow-[0_0_50px_rgba(122,60,255,0.15)] group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2EF2C4]/5 to-[#7A3CFF]/10 z-10 pointer-events-none"></div>
              <img src="/assets/story-art.jpg" alt="The Sunken Gates" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#2EF2C4]/20 blur-3xl rounded-full"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#7A3CFF]/30 blur-3xl rounded-full"></div>
          </div>
        </AnimatedSection>
      </section>

      <section id="world" className="py-20 lg:py-32 px-6 md:px-12 lg:px-20 bg-[#0E1624] relative overflow-hidden border-t border-[#7A3CFF]/10">
        <AnimatedSection className="max-w-7xl mx-auto text-center mb-16 lg:mb-20">
          <span className="font-inter text-[#7A3CFF] text-xs lg:text-sm font-bold tracking-[0.2em] uppercase mb-4 block">Survival</span>
          <h2 className="font-montserrat font-black text-3xl md:text-4xl lg:text-5xl text-[#F4FFFD]">THE SUNKEN BABEL</h2>
        </AnimatedSection>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[
            { title: '100 POCKET DIMENSIONS', desc: 'Step through the teleporter. Descend through a massive simulation network. From radiant forests to frozen wastelands, every floor offers unique environments and deadly challenges.' },
            { title: 'TACTICAL COMBAT', desc: 'Master strategic, ability-driven combat. Manage your resources, execute precise rotations, and coordinate with your party to defeat the monstrous Level Bosses.' },
            { title: 'ANCIENT GNOSIS', desc: 'Defeat aether-infected monstrosities to harvest Gnosis shards. Unlock forgotten knowledge, powerful equipment, and the secrets of the Ancients.' }
          ].map((feature, index) => (
            <AnimatedSection key={index} delay={index * 200} className="bg-[#0E1624]/80 p-6 lg:p-8 border border-[#7A3CFF]/20 hover:border-[#2EF2C4]/50 transition-all duration-300 group shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(46,242,196,0.15)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7A3CFF] to-[#2EF2C4] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="w-12 h-1 bg-[#7A3CFF] mb-6 lg:mb-8 group-hover:bg-[#2EF2C4] transition-colors"></div>
              <h3 className="font-montserrat font-bold text-lg lg:text-xl text-[#F4FFFD] mb-4 tracking-wide">{feature.title}</h3>
              <p className="font-inter text-[#F4FFFD]/70 text-sm lg:text-base leading-relaxed">{feature.desc}</p>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="py-20 lg:py-32 px-6 md:px-12 lg:px-20 bg-[#0E1624] relative border-t border-[#7A3CFF]/10">
        <AnimatedSection className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div>
            <span className="font-inter text-[#2EF2C4] text-xs lg:text-sm font-bold tracking-[0.2em] uppercase mb-4 block">Development</span>
            <h2 className="font-montserrat font-black text-3xl md:text-4xl lg:text-5xl text-[#F4FFFD]">LATEST UPDATES</h2>
          </div>
          <Link to="/patch-notes" className="bg-[#0E1624] hover:bg-[#7A3CFF]/10 border border-[#7A3CFF]/30 text-[#F4FFFD] font-inter font-bold text-xs lg:text-sm tracking-widest uppercase px-6 py-3 lg:px-8 lg:py-3 transition-all flex items-center gap-2 w-full md:w-auto justify-center hover:border-[#2EF2C4] hover:text-[#2EF2C4] shadow-[0_0_15px_rgba(122,60,255,0.2)]">
            View All Patch Notes <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>

        <AnimatedSection delay={300} className="max-w-7xl mx-auto">
          <Link to="/patch-notes" className="block bg-[#0E1624]/80 border border-[#7A3CFF]/20 p-6 sm:p-8 lg:p-12 flex flex-col md:flex-row gap-8 lg:gap-12 hover:border-[#2EF2C4]/40 transition-all duration-300 cursor-pointer group shadow-xl hover:shadow-[0_0_30px_rgba(46,242,196,0.1)] relative overflow-hidden">
            {latestNote && (
              <>
                {isNewUpdate && <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-lg shadow-[0_0_15px_rgba(239,68,68,0.8)] z-10">NEW UPDATE</div>}
                <div className="md:w-1/4">
                  <span className="inline-block px-3 py-1 bg-[#2EF2C4]/10 text-[#2EF2C4] font-inter font-bold text-xs tracking-wider rounded mb-4 border border-[#2EF2C4]/20">UPDATE {latestNote.version}</span>
                  <h3 className="font-montserrat font-bold text-xl lg:text-2xl text-[#F4FFFD] mb-2 group-hover:text-[#2EF2C4] transition-colors">{latestNote.title}</h3>
                  <p className="font-inter text-[#F4FFFD]/50 text-xs lg:text-sm">{latestNote.date}</p>
                </div>
                <div className="md:w-3/4">
                  <p className="font-inter text-[#F4FFFD]/80 text-sm lg:text-base leading-relaxed mb-6">{latestNote.desc}</p>
                  <ul className="font-inter text-[#F4FFFD]/70 space-y-3 text-sm lg:text-base">
                    {latestNote.added && latestNote.added.slice(0,3).map((item, i) => (
                      <li key={i} className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-[#7A3CFF] group-hover:bg-[#2EF2C4] transition-colors rounded-full mt-1.5 shrink-0 shadow-[0_0_5px_currentColor]"></div> {item}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </Link>
        </AnimatedSection>
      </section>
    </main>
  );
}