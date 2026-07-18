import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Generates a 6-character room code — uppercase letters + digits,
// excludes visually-confusable characters (0/O, 1/I/L) so people can
// actually read a code out loud or type it without mixing them up.
function generateMeetingCode(length = 6) {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function Home() {
  const [meetingCode, setMeetingCode] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    const code = meetingCode.trim();
    if (!code) return;
    navigate(`/${code}`);
  };

  const handleNewMeeting = () => {
    const code = generateMeetingCode();
    navigate(`/${code}`);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0D0C10] text-[#F5F1EA] px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl mb-8" style={{ fontFamily: 'Georgia, serif' }}>
          MeetSpace
        </h1>

        {/* Join with a code */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="text"
            value={meetingCode}
            onChange={(e) => setMeetingCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            placeholder="Enter meeting code"
            className="
              flex-1 rounded-full bg-white/5 ring-1 ring-white/10
              px-5 py-3 text-[#F5F1EA] placeholder:text-[#F5F1EA]/40
              outline-none focus:ring-[#E8A33D]/60 transition-shadow
              tracking-widest
            "
          />
          <button
            onClick={handleJoin}
            disabled={!meetingCode.trim()}
            className="
              rounded-full px-6 py-3 font-medium transition-colors shrink-0
              bg-[#E8A33D] text-[#0D0C10] hover:bg-[#f0b45c]
              disabled:bg-white/10 disabled:text-[#F5F1EA]/40 disabled:cursor-not-allowed
            "
          >
            Join
          </button>
        </div>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-[#F5F1EA]/40 uppercase tracking-wide">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Start a brand new meeting */}
        <button
          onClick={handleNewMeeting}
          className="
            w-full rounded-full py-3 font-medium transition-colors
            ring-1 ring-white/15 hover:ring-[#E8A33D]/60 hover:text-[#E8A33D]
          "
        >
          New meeting
        </button>
      </div>
    </div>
  );
}