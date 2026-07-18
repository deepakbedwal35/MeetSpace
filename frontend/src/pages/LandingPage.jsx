import React from 'react';
import { useNavigate } from 'react-router-dom';

// One shared visual language for a "tile" — used both in the hero
// mockup and, conceptually, mirrors the real meeting grid in the app.
// speaking=true gets the amber ring pulse; everything else stays quiet.
function Tile({ gradient, speaking, delay = '0s' }) {
  
  return (
    <div
      className="relative aspect-video rounded-xl overflow-hidden"
      style={{
        background: gradient,
        animation: `breathe 6s ease-in-out ${delay} infinite`,
      }}
    >
      {speaking && (
        <div className="absolute inset-0 rounded-xl ring-2 ring-[#E8A33D] animate-pulse" />
      )}
      <div className="absolute bottom-2 left-2 h-2 w-2 rounded-full bg-[#E8A33D]" />
    </div>
  );
}

export default function Landing() {
      let navigate = useNavigate();
  return (
    <div className="min-h-screen w-full bg-[#0D0C10] text-[#F5F1EA] overflow-hidden">
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.015); filter: brightness(1.06); }
        }
        @keyframes pop {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.3); opacity: 1; }
        }
        @keyframes flow {
          0%, 100% { transform: translateX(0); opacity: 0.5; }
          50% { transform: translateX(3px); opacity: 1; }
        }
        @keyframes dash {
          to { stroke-dashoffset: -14; }
        }
        .font-display { font-family: 'Georgia', 'Iowan Old Style', serif; }
      `}</style>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <span className="font-display text-xl tracking-tight">MeetSpace</span>
        <div className="flex items-center gap-3">
          <button onClick={()=>navigate('/login')} className="px-4 py-2 cursor-pointer text-sm text-[#F5F1EA]/80 hover:text-[#F5F1EA] transition-colors">
            Log in
          </button>
          <button onClick={()=>navigate("/signup")} className="px-4 cursor-pointer py-2 rounded-full bg-[#E8A33D] text-[#0D0C10] text-sm font-medium hover:bg-[#f0b45c] transition-colors">
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-6 md:px-12 pt-10 md:pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#E8A33D] mb-4">
            Video, without the friction
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight mb-5">
            Meet, actually together.
          </h1>
          <p className="text-[#F5F1EA]/70 text-base md:text-lg mb-8 max-w-md">
            Peer-to-peer video calls that stay fast and private —
            no relay server standing between you and the people you're talking to.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={()=>navigate('/home')} className="px-6 py-3 rounded-full bg-[#E8A33D] text-[#0D0C10] font-medium hover:bg-[#f0b45c] transition-colors">
              Start a meeting
            </button>
            <button className="px-6 py-3 rounded-full ring-1 ring-white/15 hover:ring-white/30 transition-colors">
              See how it works
            </button>
          </div>
        </div>

        {/* Signature visual: a live tile grid, same visual language as the app itself */}
        <div className="grid grid-cols-2 gap-3">
          <Tile gradient="linear-gradient(135deg,#3a2e4d,#1c1730)" speaking delay="0s" />
          <Tile gradient="linear-gradient(135deg,#2d3b45,#141c22)" delay="1.2s" />
          <Tile gradient="linear-gradient(135deg,#453227,#1f150f)" delay="2.4s" />
          <Tile gradient="linear-gradient(135deg,#2c3d2f,#121a13)" delay="0.6s" />
        </div>
      </main>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 md:px-12 pb-24">
        <p className="text-xs tracking-[0.2em] uppercase text-[#E8A33D] mb-3">
          How it works
        </p>
        <h2 className="font-display text-3xl md:text-4xl mb-12 max-w-lg">
          Three steps, no server watching your call.
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 — join a room */}
          <div>
            <div className="aspect-[4/3] rounded-xl bg-white/5 ring-1 ring-white/10 mb-5 flex items-center justify-center overflow-hidden">
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-[#E8A33D]/20 ring-1 ring-[#E8A33D]/50 flex items-center justify-center">
                  <div
                    className="h-2.5 w-2.5 rounded-full bg-[#E8A33D]"
                    style={{ animation: 'pop 1.8s ease-in-out infinite' }}
                  />
                </div>
                <div className="h-px w-16 bg-white/15" />
                <span className="text-[11px] text-[#F5F1EA]/50 tracking-wide">
                  room created
                </span>
              </div>
            </div>
            <span className="text-xs text-[#E8A33D] font-medium">01</span>
            <h3 className="text-lg mb-1 mt-1">Open a room</h3>
            <p className="text-sm text-[#F5F1EA]/60">
              Pick a name, share the link. No install, no account needed to join.
            </p>
          </div>

          {/* Step 2 — camera/mic connect */}
          <div>
            <div className="aspect-[4/3] rounded-xl bg-white/5 ring-1 ring-white/10 mb-5 flex items-center justify-center overflow-hidden">
              <div className="flex items-center gap-3">
                <div
                  className="h-14 w-14 rounded-lg bg-gradient-to-br from-[#3a2e4d] to-[#1c1730] ring-1 ring-white/10"
                  style={{ animation: 'breathe 3s ease-in-out infinite' }}
                />
                <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
                  <path
                    d="M2 8h24m0 0l-6-6m6 6l-6 6"
                    stroke="#E8A33D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ animation: 'flow 2s ease-in-out infinite' }}
                  />
                </svg>
                <div
                  className="h-14 w-14 rounded-lg bg-gradient-to-br from-[#2d3b45] to-[#141c22] ring-1 ring-white/10"
                  style={{ animation: 'breathe 3s ease-in-out 0.4s infinite' }}
                />
              </div>
            </div>
            <span className="text-xs text-[#E8A33D] font-medium">02</span>
            <h3 className="text-lg mb-1 mt-1">Camera and mic connect</h3>
            <p className="text-sm text-[#F5F1EA]/60">
              Your browser negotiates the call automatically — usually under a second.
            </p>
          </div>

          {/* Step 3 — direct peer-to-peer, no relay server */}
          <div>
            <div className="aspect-[4/3] rounded-xl bg-white/5 ring-1 ring-white/10 mb-5 flex items-center justify-center overflow-hidden">
              <div className="relative flex items-center justify-between w-32">
                <div className="h-9 w-9 rounded-full bg-[#E8A33D]/15 ring-1 ring-[#E8A33D]/50" />
                <div className="h-9 w-9 rounded-full bg-[#E8A33D]/15 ring-1 ring-[#E8A33D]/50" />
                <svg
                  className="absolute left-9 top-1/2 -translate-y-1/2"
                  width="56"
                  height="2"
                >
                  <line
                    x1="0" y1="1" x2="56" y2="1"
                    stroke="#E8A33D"
                    strokeWidth="1.5"
                    strokeDasharray="3 4"
                    style={{ animation: 'dash 1.2s linear infinite' }}
                  />
                </svg>
              </div>
            </div>
            <span className="text-xs text-[#E8A33D] font-medium">03</span>
            <h3 className="text-lg mb-1 mt-1">Talk, peer-to-peer</h3>
            <p className="text-sm text-[#F5F1EA]/60">
              Video flows directly between browsers. Our server only helps you find each other.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}