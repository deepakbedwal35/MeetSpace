import React from 'react';


export default function Lobby({
  username,
  setUsername,
  onJoin,
  videoAvailable,
  localVideoref,
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0D0C10] text-[#F5F1EA] px-6">
      <div className="w-full max-w-md">
        <h2 className="font-serif text-3xl mb-8 text-center" style={{ fontFamily: 'Georgia, serif' }}>
          Enter the room
        </h2>

        {/* Video preview */}
        <div className="aspect-video rounded-2xl overflow-hidden bg-white/5 ring-1 ring-white/10 mb-6">
          {videoAvailable ? (
            <video
              ref={localVideoref}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover scale-x-[-1]"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-sm text-[#F5F1EA]/50">
              Camera off / no access
            </div>
          )}
        </div>

        {/* Username input */}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name"
          className="
            w-full rounded-full bg-white/5 ring-1 ring-white/10
            px-5 py-3 text-[#F5F1EA] placeholder:text-[#F5F1EA]/40
            outline-none focus:ring-[#E8A33D]/60 transition-shadow
            mb-4
          "
        />

        {/* Join button */}
        <button
          onClick={onJoin}
          disabled={!username.trim()}
          className="
            w-full rounded-full py-3 font-medium transition-colors
            bg-[#E8A33D] text-[#0D0C10] hover:bg-[#f0b45c]
            disabled:bg-white/10 disabled:text-[#F5F1EA]/40 disabled:cursor-not-allowed
          "
        >
          Join Room
        </button>
      </div>
    </div>
  );
}