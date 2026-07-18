import React, { useState, useEffect, useRef } from "react";
import { Video } from "lucide-react";



function PeerMesh() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height, dpr;

    const nodeCount = 7;
    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
      angle: (Math.PI * 2 * i) / nodeCount,
      radius: 0,
      speed: 0.15 + Math.random() * 0.1,
      offset: Math.random() * Math.PI * 2,
      r: 4 + Math.random() * 3,
    }));

    function resize() {
      dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes.forEach((n) => (n.radius = Math.min(width, height) * 0.32));
    }
    resize();
    window.addEventListener("resize", resize);

    let raf;
    let t = 0;
    function draw() {
      t += 0.006;
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      const pts = nodes.map((n) => {
        const a = n.angle + t * n.speed;
        const wobble = Math.sin(t * 2 + n.offset) * 8;
        return {
          x: cx + Math.cos(a) * (n.radius + wobble),
          y: cy + Math.sin(a) * (n.radius + wobble),
          r: n.r,
        };
      });

      // connecting lines, pulse via opacity
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < width * 0.4) {
            const pulse = (Math.sin(t * 3 + i + j) + 1) / 2;
            ctx.strokeStyle = `rgba(129, 140, 248, ${0.06 + pulse * 0.12})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // center hub
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#4F46E5";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(79, 70, 229, 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // hub-to-node lines
      pts.forEach((p) => {
        ctx.strokeStyle = "rgba(129, 140, 248, 0.18)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      });

      // nodes
      pts.forEach((p, i) => {
        const pulse = (Math.sin(t * 4 + i) + 1) / 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 231, 255, ${0.7 + pulse * 0.3})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(129, 140, 248, ${0.25 + pulse * 0.25})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}

export default function AuthleftPanel() {

  return (
    // <div className="">
    
      <div
        className="hidden lg:flex lg:w-[44%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "#0B0F1A" }}
      >
        <div className="absolute inset-0">
          <PeerMesh />
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Video className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span
            className="text-white text-lg tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
          >
            MeetSpace
          </span>
        </div>

        <div className="relative z-10 max-w-sm">
          <p
            className="text-xs tracking-widest uppercase mb-4"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: "#818CF8" }}
          >
            Live · peer connected
          </p>
          <h1
            className="text-white text-4xl leading-tight mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
          >
            Every call, perfectly in sync.
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
            Low-latency rooms built on real-time signaling — no plugins,
            no downloads, just a link.
          </p>
        </div>

        <div className="relative z-10 flex gap-6 text-xs" style={{ color: "#64748B" }}>
          <span>© 2026 MeetSpace</span>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
  
  );
}