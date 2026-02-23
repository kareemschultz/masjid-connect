You are working on MasjidConnect GY — a Next.js 16 Islamic community PWA for Guyana.
Repo: /home/karetech/v0-masjid-connect-gy/
Permanently dark. NEVER use light-mode classes.

After ALL tasks, rebuild & redeploy:
  cd /home/karetech/v0-masjid-connect-gy
  docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest .
  docker stop kt-masjidconnect-prod && docker rm kt-masjidconnect-prod
  docker run -d --name kt-masjidconnect-prod --restart always --network pangolin --ip 172.20.0.24 --env-file .env.local ghcr.io/kareemschultz/v0-masjid-connect-gy:latest
  docker network connect kt-net-apps kt-masjidconnect-prod
  docker network connect kt-net-databases kt-masjidconnect-prod
  git add -A && git commit -m "feat: onboarding per-step animations — crescent, sparkle, compass, lantern, confetti" && git push origin main

=== TASK: PER-STEP ANIMATIONS IN ONBOARDING WIZARD ===

File: components/onboarding-wizard.tsx

Add subtle, themed background animations to each step of the onboarding wizard.
Each animation is absolutely positioned inside the step's outer div, pointer-events-none.
Use only CSS classes + inline style animations — no new libraries.

The keyframes already exist in app/globals.css:
  @keyframes twinkle { 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.3)} }
  @keyframes float-crescent { ... }
  @keyframes gentle-pulse { ... }

Add these new keyframes to app/globals.css if not present:
  @keyframes float-up { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes spin-slow { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
  @keyframes confetti-fall { 0%{opacity:0;transform:translateY(-20px) rotate(0deg)} 50%{opacity:1} 100%{opacity:0;transform:translateY(20px) rotate(180deg)} }

--- STEP 1: Welcome step ---
Find: {currentStepKey === 'welcome' && (
       <div className="flex flex-1 flex-col items-center justify-center px-8 py-6">

Add INSIDE that div, as the FIRST child:
<div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
  {/* Floating crescent top-right */}
  <div className="absolute right-6 top-8 text-emerald-500/20 text-5xl" style={{animation:'float-crescent 4s ease-in-out infinite'}}>☽</div>
  {/* Twinkling stars */}
  {[[15,20],[80,35],[10,65],[85,15],[70,75]].map(([x,y],i)=>(
    <div key={i} className="absolute h-1 w-1 rounded-full bg-emerald-400/40"
      style={{left:`${x}%`,top:`${y}%`,animation:`twinkle ${1.5+i*0.4}s ease-in-out infinite`,animationDelay:`${i*0.3}s`}} />
  ))}
</div>

--- STEP 2: Name step ---
Find: {currentStepKey === 'name' && (
       <div className="flex flex-1 flex-col items-center justify-center px-8">

Add INSIDE that div as FIRST child:
<div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
  {/* Soft amber glints */}
  {[[20,25],[75,20],[15,70],[80,60],[50,85]].map(([x,y],i)=>(
    <div key={i} className="absolute h-1.5 w-1.5 rounded-full bg-amber-400/30"
      style={{left:`${x}%`,top:`${y}%`,animation:`gentle-pulse ${2+i*0.5}s ease-in-out infinite`,animationDelay:`${i*0.4}s`}} />
  ))}
  {/* Subtle sparkle lines */}
  <div className="absolute top-16 left-8 h-px w-12 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" style={{animation:'float-up 3s ease-in-out infinite'}} />
  <div className="absolute bottom-20 right-10 h-px w-8 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" style={{animation:'float-up 3.5s ease-in-out infinite',animationDelay:'1s'}} />
</div>

--- STEP 3: Prayer Settings step ---
Find: {currentStepKey === 'prayer' && (
       <div className="flex flex-1 flex-col px-5 pt-6">

Add INSIDE that div as FIRST child:
<div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
  {/* Compass ring top-right */}
  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-emerald-500/10"
    style={{animation:'spin-slow 20s linear infinite'}} />
  <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full border border-emerald-500/8"
    style={{animation:'spin-slow 15s linear infinite reverse'}} />
  {/* Cardinal dots */}
  {[0,90,180,270].map((deg,i)=>(
    <div key={i} className="absolute right-2 top-2 h-1 w-1 rounded-full bg-emerald-400/20"
      style={{transform:`rotate(${deg}deg) translateY(-14px)`,animation:`twinkle ${2+i*0.3}s ease-in-out infinite`}} />
  ))}
</div>

--- STEP 4: Ramadan step ---
Find: {currentStepKey === 'ramadan' && (
       <div className="flex flex-1 flex-col px-5 pt-6">

Add INSIDE that div as FIRST child:
<div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
  {/* Large crescent */}
  <div className="absolute right-4 top-4 text-6xl text-orange-500/15" style={{animation:'float-crescent 5s ease-in-out infinite'}}>☽</div>
  {/* Stars around it */}
  {[[75,8],[85,18],[68,22],[82,30]].map(([x,y],i)=>(
    <div key={i} className="absolute text-xs text-orange-400/25"
      style={{left:`${x}%`,top:`${y}%`,animation:`twinkle ${1.5+i*0.5}s ease-in-out infinite`,animationDelay:`${i*0.4}s`}}>✦</div>
  ))}
  {/* Lantern glow bottom-left */}
  <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-orange-500/5 blur-3xl" />
</div>

--- STEP 5: Done step ---
Find: {currentStepKey === 'done' && (
       <div className="flex flex-1 flex-col px-6 pt-6">

Add INSIDE that div as FIRST child:
<div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
  {/* Confetti sparkles */}
  {[
    {x:10,y:10,delay:0,color:'bg-emerald-400/30'},
    {x:85,y:15,delay:0.3,color:'bg-teal-400/30'},
    {x:20,y:80,delay:0.6,color:'bg-amber-400/30'},
    {x:80,y:70,delay:0.9,color:'bg-emerald-400/25'},
    {x:50,y:5,delay:0.2,color:'bg-teal-400/25'},
    {x:15,y:45,delay:0.7,color:'bg-amber-400/20'},
    {x:88,y:45,delay:0.4,color:'bg-emerald-400/20'},
  ].map((dot,i)=>(
    <div key={i} className={`absolute h-2 w-2 rounded-full ${dot.color}`}
      style={{left:`${dot.x}%`,top:`${dot.y}%`,animation:`confetti-fall 3s ease-in-out infinite`,animationDelay:`${dot.delay}s`}} />
  ))}
  {/* Radial glow behind CTA */}
  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-40 w-64 rounded-full bg-emerald-500/5 blur-3xl" />
</div>

=== IMPORTANT NOTES ===
- The absolute div must sit INSIDE the step container so it clips properly
- The step containers already have overflow handling via the parent modal
- Use aria-hidden="true" on all decorative elements
- Test that the animations don't interfere with tap targets (pointer-events-none ensures this)
- Keep all animations subtle — opacity 0.15-0.30 max, nothing distracting during form input

=== CHANGELOG ===
Append to CHANGELOG.md:
## v2.5.0 — Feb 23, 2026
- Onboarding: Per-step themed animations (crescent+stars on welcome, amber sparkles on name, compass ring on prayer, Ramadan lantern+crescent, confetti on done)
- Onboarding: iOS PWA install expanded to full 3-step guide with numbered badges
- Onboarding: Google Sign-In removed from done step (moved to name step in Sprint 6)
