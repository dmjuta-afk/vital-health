import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════════
   VITÁL v8 — Complete Rebuild
   ABC UP PTY LTD © 2026
   White theme · Mobile-first · Golden Habit Window
   Fair pricing to reach 10,000+ subscribers ASAP
   priced competitively to reach 10K+
═══════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --void:#08080F;--obs:#0D0D16;--s1:#14141E;--s2:#1B1B28;
  --border:rgba(255,255,255,.08);--border2:rgba(255,255,255,.14);
  --cr:#F5F0E8;--cd:rgba(245,240,232,.88);--cf:rgba(245,240,232,.55);
  --gold:#C9A84C;--gl:#E5C76A;--gd:rgba(201,168,76,.13);--gb:rgba(201,168,76,.28);
  --green:#3DD6A3;--gnd:rgba(61,214,163,.11);--gnb:rgba(61,214,163,.28);
  --blue:#5C9FE8;--purple:#9C80E8;--red:#E85C6E;
  --amber:#F0A800;--amd:rgba(240,168,0,.12);--amdb:rgba(240,168,0,.28);
  --fd:'Playfair Display',Georgia,serif;--fb:'DM Sans',system-ui,sans-serif;
  --r1:6px;--r2:10px;--r3:16px;--r4:20px;
  --shadow:0 1px 4px rgba(0,0,0,.3),0 4px 12px rgba(0,0,0,.2);
  --shadow2:0 4px 20px rgba(0,0,0,.4),0 1px 4px rgba(0,0,0,.2);
}
html{scroll-behavior:smooth;overflow-x:hidden}
body{background:var(--void);color:var(--cr);font-family:var(--fb);overflow-x:hidden;-webkit-font-smoothing:antialiased;font-size:16px;line-height:1.6}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:var(--s2);border-radius:2px}
input,textarea,select{font-family:var(--fb)}
input[type=range]{accent-color:var(--gold);height:6px;cursor:pointer}
a{color:inherit;text-decoration:none}
button{cursor:pointer;font-family:var(--fb)}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border:none;border-radius:var(--r2);font-family:var(--fb);font-weight:500;transition:all .2s;cursor:pointer;white-space:nowrap}
.btn-gold{background:var(--gold);color:var(--obs);padding:12px 24px;font-size:15px}
.btn-gold:hover{background:var(--gl);transform:translateY(-1px);box-shadow:var(--shadow2)}
.btn-gold-lg{background:var(--gold);color:var(--obs);padding:16px 32px;font-size:16px;font-weight:600;border-radius:var(--r2)}
.btn-gold-lg:hover{background:var(--gl);transform:translateY(-1px)}
.btn-green{background:var(--green);color:var(--obs);padding:12px 24px;font-size:15px}
.btn-green:hover{background:rgba(61,214,163,.85);transform:translateY(-1px)}
.btn-outline{background:transparent;color:var(--cd);border:1.5px solid var(--border2);padding:11px 22px;font-size:14px}
.btn-outline:hover{border-color:var(--gb);color:var(--gold)}
.btn-ghost{background:transparent;color:var(--cd);padding:8px 14px;font-size:13px;border:none}
.btn-ghost:hover{color:var(--gold);background:var(--gd)}
.btn-sm{padding:8px 16px;font-size:13px;border-radius:var(--r1)}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none}

/* ── NAV ── */
.nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(8,8,15,.96);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);height:60px;display:flex;align-items:center;padding:0 20px;gap:12px}
.nav-logo{font-family:var(--fd);font-size:22px;font-weight:600;color:var(--gold);letter-spacing:.15em;cursor:pointer;letter-spacing:.05em;flex-shrink:0}
.nav-links{display:flex;gap:2px;overflow-x:auto;flex:1;-ms-overflow-style:none;scrollbar-width:none}
.nav-links::-webkit-scrollbar{display:none}
.nav-btn{background:none;border:none;color:var(--cd);font-size:13px;padding:6px 10px;border-radius:var(--r1);white-space:nowrap;font-weight:400;transition:all .18s}
.nav-btn:hover{color:var(--cr);background:var(--s2)}
.nav-btn.active{color:var(--gold);background:var(--gd);font-weight:500}
.nav-right{display:flex;gap:8px;flex-shrink:0}

/* ── LAYOUT ── */
.page{padding-top:60px;min-height:100vh;background:var(--void);overflow-x:hidden}
.wrap{max-width:1100px;margin:0 auto;padding:0 20px;overflow-x:hidden}
.section{padding:48px 0}
.section-sm{padding:28px 0}
.lbl{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:10px}
.h1{font-family:var(--fd);font-size:clamp(28px,5vw,56px);font-weight:300;line-height:1.1;margin-bottom:14px;color:var(--cr)}
.h2{font-family:var(--fd);font-size:clamp(20px,3.5vw,38px);font-weight:300;line-height:1.15;color:var(--cr)}
.h3{font-family:var(--fd);font-size:clamp(16px,2.5vw,24px);font-weight:300;color:var(--cr)}
.h1 em,.h2 em,.h3 em{font-style:italic;color:var(--gold)}
.body-text{font-size:15px;color:var(--cd);line-height:1.72;font-weight:300}
.body-sm{font-size:13px;color:var(--cf);line-height:1.65}

/* ── CARDS ── */
.card{background:var(--s1);border:1px solid var(--border);border-radius:var(--r3);padding:24px;box-shadow:var(--shadow)}
.card-sm{background:var(--s2);border:1px solid var(--border);border-radius:var(--r2);padding:16px;box-shadow:var(--shadow)}
.card-gold{background:var(--gd);border:1px solid var(--gb);border-radius:var(--r3);padding:24px}
.card-green{background:var(--gnd);border:1px solid var(--gnb);border-radius:var(--r3);padding:24px}

/* ── BADGE/TAG ── */
.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500;letter-spacing:.04em}
.badge-gold{background:var(--gd);color:var(--gold);border:1px solid var(--gb)}
.badge-green{background:var(--gnd);color:var(--green);border:1px solid var(--gnb)}
.badge-blue{background:rgba(156,128,232,.1);color:var(--purple);border:1px solid rgba(156,128,232,.25)}

/* ── GATE ── */
.gate{position:fixed;inset:0;background:rgba(26,24,20,.85);z-index:999;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px)}
.gate-box{background:var(--s1);border-radius:var(--r3);width:100%;max-width:540px;max-height:88vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.18)}
.gate-hd{padding:24px 28px 16px;border-bottom:1px solid var(--border);background:var(--gd)}
.gate-body{padding:20px 28px;overflow-y:auto;flex:1;background:var(--s1)}
.gate-sec{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-top:14px;margin-bottom:4px;margin-top:16px}
.gate-p{font-size:14px;color:var(--cd);line-height:1.72;font-weight:300}
.gate-hi{background:var(--amd);border-left:3px solid var(--amber);padding:12px 16px;margin:14px 0;border-radius:0 var(--r1) var(--r1) 0}
.gate-foot{padding:16px 28px;border-top:1px solid var(--border);background:var(--obs)}
.gate-check{display:flex;align-items:flex-start;gap:11px;margin-bottom:12px;cursor:pointer}
.gate-chk{width:18px;height:18px;border:1.5px solid var(--border2);border-radius:4px;flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center;transition:all .18s;background:var(--s2)}
.gate-chk.on{background:var(--gold);border-color:var(--gold)}
.gate-chk-txt{font-size:13px;color:var(--cd);line-height:1.65;font-weight:300}

/* ── MODAL ── */
.modal-ov{position:fixed;inset:0;background:rgba(26,24,20,.7);z-index:300;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px)}
.modal-box{background:var(--s1);border-radius:var(--r3);width:100%;max-width:500px;max-height:80vh;overflow-y:auto;box-shadow:var(--shadow2)}
.modal-hd{padding:20px 24px 14px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:var(--s1)}
.modal-close{background:none;border:none;font-size:20px;color:var(--cf);cursor:pointer;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:50%}
.modal-close:hover{background:var(--s2);color:var(--cr)}
.modal-body{padding:20px 24px}
.modal-txt{font-size:14px;color:var(--cd);line-height:1.85;white-space:pre-line;font-weight:300}

/* ── TOAST ── */
.toast{position:fixed;bottom:24px;right:20px;background:var(--s1);border:1px solid var(--gnb);color:var(--green);padding:12px 20px;border-radius:var(--r2);font-size:14px;z-index:400;box-shadow:var(--shadow2);animation:slide-up .25s ease}

/* ── EX DETAIL OVERLAY ── */
.ex-ov{position:fixed;top:0;left:0;right:0;bottom:0;background:var(--void);z-index:250;overflow-y:auto}
.ex-ov-inner{max-width:700px;margin:0 auto;padding:0 14px 60px}

/* ── HERO ── */
.hero{padding:48px 0 36px;text-align:center}
.hero-sup{display:inline-flex;align-items:center;gap:8px;background:var(--gd);border:1px solid var(--gb);color:var(--gold);padding:6px 16px;border-radius:20px;font-size:12px;font-weight:500;letter-spacing:.06em;margin-bottom:22px}
.hero-pulse{width:6px;height:6px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
.hero-sub{font-size:16px;color:var(--cd);max-width:520px;margin:0 auto 10px;line-height:1.7;font-weight:300}
.hero-disc{font-size:13px;color:var(--cf);margin-bottom:30px;font-weight:300}
.hero-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.hero-free{font-size:13px;color:var(--green);margin-top:12px;margin-top:14px;font-weight:400}
.hero-stats{display:flex;gap:32px;justify-content:center;margin-top:44px;flex-wrap:wrap;padding:24px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.stat-val{font-family:var(--fd);font-size:28px;font-weight:400;color:var(--gold)}
.stat-lbl{font-size:12px;color:var(--cd);margin-top:3px;font-weight:300}

/* ── GOLDEN HABIT WINDOWS ── */
.habit-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:32px}
.habit-card{border-radius:var(--r3);padding:28px;cursor:pointer;transition:all .25s;border:1.5px solid transparent}
.habit-card.morning{background:linear-gradient(135deg,rgba(201,168,76,.1),rgba(201,168,76,.05));border-color:var(--gb)}
.habit-card.evening{background:linear-gradient(135deg,rgba(92,159,232,.1),rgba(92,159,232,.05));border-color:rgba(92,159,232,.3)}
.habit-card:hover{transform:translateY(-3px);box-shadow:var(--shadow2)}
.habit-icon{font-size:38px;margin-bottom:12px}
.habit-h{font-family:var(--fd);font-size:20px;font-weight:300;margin-bottom:6px;color:var(--cr)}
.habit-desc{font-size:14px;color:var(--cd);line-height:1.65;font-weight:300;margin-bottom:14px}
.habit-items{display:flex;flex-direction:column;gap:5px}
.habit-item{font-size:13px;color:var(--cd);display:flex;align-items:center;gap:7px;font-weight:300}
.habit-chk{color:var(--green);font-size:11px;flex-shrink:0}

/* ── MORNING / EVENING PAGES ── */
.ritual-page{padding:72px 0 40px}
.time-sel{display:flex;gap:8px;flex-wrap:wrap;margin:20px 0}
.time-btn{background:var(--s2);border:1.5px solid var(--border);color:var(--cd);padding:8px 16px;border-radius:20px;font-size:14px;font-weight:400;transition:all .18s}
.time-btn:hover{border-color:var(--gb);color:var(--gold)}
.time-btn.active{background:var(--gd);border-color:var(--gold);color:var(--gold);font-weight:500}
.routine-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:20px}
.routine-card{background:var(--s1);border:1px solid var(--border);border-radius:var(--r2);padding:18px;cursor:pointer;transition:all .2s}
.routine-card:hover{border-color:var(--gold);box-shadow:var(--shadow)}
.routine-icon{font-size:26px;margin-bottom:8px}
.routine-name{font-size:14px;font-weight:500;margin-bottom:3px;color:var(--cr)}
.routine-dur{font-size:12px;color:var(--cf);font-weight:300}
.vitality-ring{display:flex;flex-direction:column;align-items:center}
.score-big{font-family:var(--fd);font-size:64px;font-weight:300;line-height:1}
.score-lbl{font-size:12px;color:var(--cf);letter-spacing:.1em;text-transform:uppercase;margin-top:4px}
.reflection-inp{width:100%;background:var(--s2);border:1px solid var(--border);border-radius:var(--r2);padding:14px 16px;font-size:15px;font-family:var(--fb);color:var(--text);resize:none;outline:none;line-height:1.65;font-weight:300;transition:border-color .2s}
.reflection-inp:focus{border-color:var(--gb);background:var(--s1)}
.reflection-inp::placeholder{color:var(--text3)}

/* ── AI COACH ── */
/* ── FULL SCREEN COACH ── */
.coach-page{position:fixed;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column;background:var(--void);z-index:100;overflow:hidden}
.coach-modes{display:flex;gap:5px;padding:8px 14px 7px;background:var(--void);border-bottom:1px solid rgba(255,255,255,.04);overflow-x:auto;flex-shrink:0;-ms-overflow-style:none;scrollbar-width:none}
.coach-modes::-webkit-scrollbar{display:none}
.mode-btn{background:var(--s2);border:1px solid var(--border);color:var(--cd);padding:6px 14px;border-radius:20px;font-size:12px;font-weight:400;white-space:nowrap;flex-shrink:0;transition:all .18s}
.mode-btn:hover{border-color:var(--gb);color:var(--gold)}
.mode-btn.active{background:rgba(201,168,76,.15);border-color:var(--gold);color:var(--gold);font-weight:600}
.chat-win{display:flex;flex-direction:column;flex:1;overflow:hidden;background:var(--void);border:none}
.chat-top{padding:10px 16px;border-bottom:1px solid rgba(255,255,255,.06);display:flex;align-items:center;justify-content:space-between;background:var(--void);flex-shrink:0}
.chat-av{width:32px;height:32px;border-radius:50%;background:var(--gd);border:1px solid var(--gb);display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.chat-msgs{flex:1;overflow-y:auto;padding:16px 14px 8px;display:flex;flex-direction:column;gap:10px;background:var(--void)}
.chat-msg{display:flex;gap:9px;align-items:flex-end}
.chat-msg.user{flex-direction:row-reverse}
.bubble{max-width:78%;padding:10px 14px;border-radius:18px;font-size:14px;line-height:1.6;font-weight:300;white-space:pre-line}
.bubble.ai{background:rgba(255,255,255,.09);color:var(--cr);border-bottom-left-radius:6px;border:none}
.bubble.user{background:var(--gold);color:#1a1200;font-weight:400;border-bottom-right-radius:6px}
.bubble-av{width:28px;height:28px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px;background:var(--s2);border:1px solid var(--border)}
.typing{display:flex;gap:4px;padding:2px}
.dot{width:6px;height:6px;border-radius:50%;background:var(--cd);animation:bounce 1.2s infinite}
.dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
.chat-prompts{padding:8px 14px;display:flex;gap:6px;overflow-x:auto;background:var(--void);border-top:1px solid rgba(255,255,255,.04);flex-shrink:0;-ms-overflow-style:none;scrollbar-width:none}
.chat-prompts::-webkit-scrollbar{display:none}
.chat-prompt{background:transparent;border:1px solid var(--border);color:var(--cd);padding:6px 13px;border-radius:20px;font-size:12px;white-space:nowrap;flex-shrink:0;transition:all .18s}
.chat-prompt:hover{border-color:var(--gb);color:var(--gold);background:var(--gd)}
.chat-inp-row{padding:10px 12px 14px;border-top:1px solid rgba(255,255,255,.05);display:flex;gap:8px;align-items:center;background:var(--void);flex-shrink:0}
.chat-inp{flex:1;background:var(--s2);border:1px solid var(--border);border-radius:24px;padding:10px 16px;font-size:15px;color:var(--cr);outline:none;transition:border-color .2s;font-family:var(--fb);font-weight:300}
.chat-inp:focus{border-color:var(--gb)}
.chat-inp::placeholder{color:rgba(245,240,232,.25)}
.chat-send{background:var(--gold);color:var(--obs);border:none;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;transition:all .18s}
.chat-send:hover{background:var(--gl)}.chat-send:disabled{opacity:.35;cursor:not-allowed}
.chat-disc{padding:5px 14px 8px;font-size:11px;color:var(--cf);background:var(--void);text-align:center;flex-shrink:0}

/* ── PROFILE PAGE ── */
.profile-page{padding:72px 0 40px;max-width:780px;margin:0 auto;padding-left:14px;padding-right:14px}
.field-lbl{font-size:12px;font-weight:500;color:var(--cd);margin-bottom:6px;letter-spacing:.02em}
.field-inp{width:100%;background:var(--s2);border:1px solid var(--border);border-radius:var(--r1);padding:12px 14px;font-size:15px;color:var(--text);outline:none;transition:border-color .2s;font-family:var(--fb);font-weight:300}
.field-inp:focus{border-color:var(--gb)}
.field-inp::placeholder{color:rgba(245,240,232,.25)}
.slider-row{margin-bottom:22px}
.slider-top{display:flex;justify-content:space-between;margin-bottom:7px}
.slider-lbl{font-size:14px;font-weight:400;color:var(--cr)}
.slider-val{font-size:14px;font-weight:600;color:var(--gold)}
.slider-range{display:flex;justify-content:space-between;font-size:11px;color:var(--cf);margin-top:4px;font-weight:300}
.act-grid{display:flex;gap:8px;flex-wrap:wrap}
.act-btn{background:var(--s2);border:1px solid var(--border);color:var(--cd);padding:9px 16px;border-radius:20px;font-size:13px;font-weight:400;transition:all .18s}
.act-btn:hover{border-color:var(--gb);color:var(--gold)}
.act-btn.active{background:var(--gd);border-color:var(--gold);color:var(--gold);font-weight:500}

/* ── EXERCISES ── */
.ex-page{padding:72px 0 40px;max-width:1060px;margin:0 auto;padding-left:14px;padding-right:14px}
.cat-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px}
.cat-tab{background:var(--s2);border:1px solid var(--border);color:var(--cd);padding:8px 18px;border-radius:20px;font-size:14px;font-weight:400;transition:all .18s}
.cat-tab:hover{border-color:var(--gb);color:var(--gold)}
.cat-tab.active{background:var(--gd);border-color:var(--gold);color:var(--gold);font-weight:500}
.ex-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.ex-card{background:var(--s1);border:1px solid var(--border);border-radius:var(--r2);padding:20px;cursor:pointer;transition:all .2s}
.ex-card:hover{border-color:var(--gb);box-shadow:var(--shadow);transform:translateY(-2px)}
.ex-name{font-size:14px;font-weight:600;margin-bottom:3px;color:var(--cr)}
.ex-level{font-size:10px;color:var(--gold);letter-spacing:.08em;margin-bottom:7px;font-weight:400}
.ex-benefit{font-size:12px;color:var(--green);margin-bottom:9px;font-weight:400}
.ex-step{font-size:11px;color:var(--cd);display:flex;gap:6px;margin-bottom:3px;font-weight:300;line-height:1.5}
.ex-tip{font-size:11px;color:var(--cd);background:var(--s2);padding:8px 10px;border-radius:var(--r1);margin-top:8px;line-height:1.55;font-weight:300}
.ex-warn{font-size:11px;color:rgba(240,168,0,.8);background:var(--amd);border:1px solid var(--amdb);padding:6px 10px;border-radius:var(--r1);margin-top:6px;font-weight:300}
.ex-btns{display:flex;gap:8px;margin-top:12px}

/* ── PRICING ── */
.pricing-page{padding:80px 0 56px;background:var(--void)}
.price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:36px}
.price-card{background:var(--s1);border:1px solid var(--border);border-radius:var(--r3);padding:28px;position:relative;transition:all .25s}
.price-card:hover{transform:translateY(-3px);box-shadow:var(--shadow2)}
.price-card.featured{background:var(--s1);border-color:var(--gold);box-shadow:0 0 0 3px var(--gd)}
.price-popular{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--gold);color:var(--obs);font-size:11px;font-weight:600;padding:4px 16px;border-radius:20px;letter-spacing:.05em;white-space:nowrap}
.price-tier{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--cd);margin-bottom:7px;font-weight:500}
.price-amount{font-family:var(--fd);font-size:40px;font-weight:300;line-height:1;color:var(--cr)}
.price-amount sup{font-size:18px;vertical-align:top;margin-top:7px;color:var(--gold)}
.price-period{font-size:12px;color:var(--cd);margin-bottom:5px;font-weight:300}
.price-annual{font-size:12px;color:var(--green);font-weight:400;margin-bottom:16px}
.price-divider{height:1px;background:var(--border);margin-bottom:14px}
.price-feature{display:flex;align-items:flex-start;gap:7px;font-size:13px;color:var(--cd);margin-bottom:8px;font-weight:300}
.price-chk{color:var(--green);flex-shrink:0;font-size:12px;margin-top:2px;font-weight:600}
.price-x{color:var(--cf);flex-shrink:0;font-size:12px;margin-top:2px}
.toggle-row{display:flex;align-items:center;gap:12px;justify-content:center;margin-bottom:32px}
.toggle{width:44px;height:24px;border-radius:12px;background:var(--border);border:none;position:relative;cursor:pointer;transition:background .2s}
.toggle.on{background:var(--gold)}
.toggle-dot{width:18px;height:18px;border-radius:50%;background:#fff;position:absolute;top:3px;left:3px;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.15)}
.toggle.on .toggle-dot{left:23px}
.toggle-lbl{font-size:14px;color:var(--cd);font-weight:400}
.toggle-lbl.active{color:var(--cr);font-weight:500}
.save-badge{background:var(--gnd);color:var(--green);border:1px solid var(--gnb);padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500}

/* ── REFERRAL ── */
.ref-page{padding:72px 0 40px;max-width:780px;margin:0 auto;padding-left:14px;padding-right:14px}
.ref-link-row{display:flex;gap:10px;margin-top:16px}
.ref-inp{flex:1;background:var(--s2);border:1px solid var(--border);border-radius:var(--r1);padding:11px 14px;font-size:14px;color:var(--text);font-family:var(--fb);outline:none;font-weight:300}
.copy-btn{background:var(--gold);color:var(--obs);border:none;padding:11px 20px;border-radius:var(--r1);font-size:14px;font-weight:500;transition:all .2s;font-family:var(--fb)}
.copy-btn:hover{background:var(--gl)}
.copy-btn.copied{background:var(--green)}
.share-row{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:14px}
.share-btn{background:var(--s2);border:1px solid var(--border);border-radius:var(--r1);padding:11px 8px;text-align:center;font-size:12px;color:var(--cd);cursor:pointer;transition:all .18s;font-family:var(--fb)}
.share-btn:hover{border-color:var(--gb);color:var(--gold);background:var(--gd)}
.ref-stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.ref-stat{background:var(--s1);border:1px solid var(--border);border-radius:var(--r2);padding:18px;text-align:center;box-shadow:var(--shadow)}
.ref-stat-val{font-family:var(--fd);font-size:28px;font-weight:300;color:var(--gold)}
.ref-stat-lbl{font-size:11px;color:var(--cd);letter-spacing:.08em;text-transform:uppercase;margin-top:4px;font-weight:400}

/* ── FOOTER ── */
.footer{border-top:1px solid var(--border);background:var(--void);padding:0;margin-top:40px}
/* .footer-disc removed — replaced with Medical Disclaimer button */
.footer-main{max-width:1100px;margin:0 auto;padding:18px 20px 14px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;border-top:none}
.footer-logo{font-family:var(--fd);font-size:17px;color:var(--gold);letter-spacing:.1em}
.footer-links{display:flex;gap:16px;flex-wrap:wrap}
.footer-link{font-size:12px;color:var(--cf);cursor:pointer;transition:color .18s;font-weight:300}
.footer-link:hover{color:var(--gold)}
.footer-copy{font-size:12px;color:var(--cf);font-weight:300}
.spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
.spinner-dark{width:16px;height:16px;border:2px solid var(--border2);border-top-color:var(--gold);border-radius:50%;animation:spin .7s linear infinite;display:inline-block}


/* ── RESPONSIVE GRIDS ── */
.pf-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.g1{display:grid;grid-template-columns:1fr;gap:14px}
.g2{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.g-auto{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.g-auto-sm{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:11px}
@media(max-width:860px){
  .g3{grid-template-columns:1fr}
  .pf-grid{grid-template-columns:1fr 1fr}
  .g4{grid-template-columns:1fr 1fr}
  .g2{grid-template-columns:1fr}
  .g-auto{grid-template-columns:1fr}
  .ex-grid{grid-template-columns:1fr}
  .habit-grid{grid-template-columns:1fr}
  .price-grid{grid-template-columns:1fr}
  .routine-grid{grid-template-columns:1fr 1fr}
  .ref-stat-grid{grid-template-columns:repeat(3,1fr)}
}
@media(max-width:540px){
  .g4,.g2{grid-template-columns:1fr}
  .pf-grid{grid-template-columns:1fr}
  .g-auto-sm{grid-template-columns:repeat(2,1fr)}
  .age-card-feat{font-size:13px}
  .habit-card{padding:16px}
  .card{padding:14px}
  .routine-grid{grid-template-columns:1fr}
  .ref-stat-grid{grid-template-columns:1fr 1fr}
}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes slide-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

@media(max-width:860px){
  .nav-links{display:none}
  
  /* chat-msgs is now flex:1 - no fixed height needed */
  .wrap{padding:0 14px}
  .section{padding:32px 0}
  .section-sm{padding:24px 0}
  .hero{padding:36px 0 28px;text-align:center}
  .hero-stats{gap:16px;margin-top:28px;padding:18px 0}
  .habit-grid{grid-template-columns:1fr;gap:12px}
  .routine-grid{grid-template-columns:1fr 1fr;gap:10px}
  .ex-grid{grid-template-columns:1fr 1fr;gap:10px}
  .price-grid{grid-template-columns:1fr;gap:14px}
  .ref-stat-grid{grid-template-columns:repeat(3,1fr)}
  .share-row{grid-template-columns:repeat(4,1fr)}
  .stat-val{font-size:22px}
  .score-big{font-size:48px}
  .card{padding:16px}
  .card-gold,.card-green{padding:16px}
  .chat-msgs{height:260px}
  .mode-grid{gap:5px}
  .mode-btn{font-size:11px;padding:5px 10px}
  .time-btn{font-size:13px;padding:7px 13px}
  .ex-card{padding:14px}
}
@media(max-width:540px){
  .routine-grid{grid-template-columns:1fr}
  .ex-grid{grid-template-columns:1fr}
  .habit-card{padding:20px}
  .hero-btns{flex-direction:column;align-items:center}
  .btn-gold-lg{width:100%;max-width:300px}
  .toggle-row{flex-wrap:wrap;gap:8px}
  .price-popular{font-size:10px;padding:3px 12px}
  .ref-link-row{flex-direction:column}
  .ref-inp,.copy-btn{width:100%}
  .hero-sup{font-size:10px;padding:5px 12px}
  .h1{font-size:26px}
  .h2{font-size:20px}
}
`;

/* ══ DATA ══════════════════════════════════════════════ */

const MORNING_ROUTINES = {
  "2": [
    {icon:"🫁",name:"Box Breathing",dur:"2 min",desc:"Inhale 4 · Hold 4 · Exhale 4 · Hold 4",cat:"breathing"},
    {icon:"💧",name:"Hydration Check",dur:"1 min",desc:"Log your water. Set your intention.",cat:"general"},
  ],
  "5": [
    {icon:"🌅",name:"Sun Salutation",dur:"5 min",desc:"3 gentle rounds to wake the body",cat:"yoga"},
    {icon:"🫁",name:"4-7-8 Breathing",dur:"3 min",desc:"Calm anxiety. Set focus.",cat:"breathing"},
    {icon:"🧠",name:"Gratitude Prompt",dur:"2 min",desc:"Name 3 things you are grateful for today",cat:"mind"},
  ],
  "10": [
    {icon:"🧘",name:"Morning Yoga",dur:"7 min",desc:"Sun salutations, warrior poses, gentle stretches",cat:"yoga"},
    {icon:"🫁",name:"Coherence Breathing",dur:"5 min",desc:"5-5 rhythm. Maximizes HRV.",cat:"breathing"},
    {icon:"✍️",name:"Morning Intention",dur:"3 min",desc:"Write one goal. One feeling. One action.",cat:"mind"},
    {icon:"🌿",name:"Herbal Tip",dur:"1 min",desc:"Ashwagandha with breakfast for energy resilience",cat:"herbal"},
  ],
  "20": [
    {icon:"🧘",name:"Full Morning Yoga",dur:"12 min",desc:"Complete sun salutation flow — all levels",cat:"yoga"},
    {icon:"🫁",name:"Pranayama",dur:"6 min",desc:"Nadi Shodhana then Kapalabhati energy breath",cat:"breathing"},
    {icon:"🧠",name:"Meditation",dur:"5 min",desc:"Body scan followed by loving-kindness practice",cat:"mind"},
    {icon:"🌿",name:"Morning Protocol",dur:"2 min",desc:"Ashwagandha + Rhodiola + lemon water ritual",cat:"herbal"},
    {icon:"✍️",name:"Journal Prompt",dur:"3 min",desc:"How do I want to feel today, and why?",cat:"mind"},
  ],
};

const EVENING_ROUTINES = {
  "2": [
    {icon:"🫁",name:"4-7-8 Sleep Breath",dur:"2 min",desc:"4 in · 7 hold · 8 out. Activates rest.",cat:"breathing"},
    {icon:"😴",name:"Sleep Intention",dur:"1 min",desc:"Put your phone down. Close your eyes. Arrive.",cat:"mind"},
  ],
  "5": [
    {icon:"🧘",name:"Evening Wind-Down",dur:"4 min",desc:"Child's pose · Supine twist · Legs up the wall",cat:"yoga"},
    {icon:"🫁",name:"Box Breathing",dur:"3 min",desc:"Slow your nervous system. Prepare for sleep.",cat:"breathing"},
    {icon:"✍️",name:"Day Review",dur:"2 min",desc:"What went well? What am I releasing tonight?",cat:"mind"},
  ],
  "10": [
    {icon:"🧘",name:"Yin Yoga Wind-Down",dur:"8 min",desc:"Hold each pose 2-3 min. Total surrender.",cat:"yoga"},
    {icon:"🫁",name:"4-7-8 Breathing",dur:"4 min",desc:"4 cycles. Deep parasympathetic activation.",cat:"breathing"},
    {icon:"🧠",name:"Guided Body Scan",dur:"5 min",desc:"Progressive muscle release from feet to crown",cat:"meditation"},
    {icon:"🙏",name:"Gratitude Practice",dur:"2 min",desc:"Three things. Specific. Feel them.",cat:"mind"},
  ],
  "20": [
    {icon:"🧘",name:"Full Yin Sequence",dur:"12 min",desc:"Dragon · Butterfly · Sphinx · Savasana",cat:"yoga"},
    {icon:"🫁",name:"NSDR Protocol",dur:"6 min",desc:"Non-Sleep Deep Rest. Navy SEAL technique.",cat:"breathing"},
    {icon:"🧠",name:"Sleep Meditation",dur:"8 min",desc:"Yoga Nidra body scan for deep rest",cat:"meditation"},
    {icon:"🌙",name:"Herbal Wind-Down",dur:"2 min",desc:"Ashwagandha + Magnesium glycinate + chamomile",cat:"herbal"},
    {icon:"✍️",name:"Evening Journal",dur:"5 min",desc:"What did I do well today? What am I releasing?",cat:"mind"},
  ],
};

const AI_MODES = [
  {id:"wellness",icon:"🧬",label:"Wellness Coach"},
  {id:"herbal",icon:"🌿",label:"Herbal Guide"},
  {id:"yoga",icon:"🧘",label:"Yoga"},
  {id:"breathing",icon:"🫁",label:"Breathwork"},
  {id:"meditation",icon:"🧠",label:"Meditation"},
  {id:"ayurveda",icon:"🌸",label:"Ayurveda"},
  {id:"sleep",icon:"💤",label:"Sleep"},
  {id:"senior",icon:"👴",label:"Senior Wellness"},
  {id:"brain",icon:"💡",label:"Brain Wellness"},
];

const AI_PROMPTS = {
  wellness:["Build my morning routine","Why am I always tired?","Improve my HRV","Beat afternoon energy dip"],
  herbal:["Best herbs for stress","Ashwagandha dosage","Natural sleep herbs","Adaptogens for energy"],
  yoga:["Beginner morning yoga","Yoga for back pain","Evening wind-down","Yoga for seniors"],
  breathing:["4-7-8 breathing guide","Box breathing","Wim Hof method","Breathwork for sleep"],
  meditation:["5-min morning meditation","Body scan for sleep","Meditation for focus","Anxiety relief"],
  ayurveda:["What is my dosha?","Ayurvedic morning routine","Foods for my type","Ayurveda for sleep"],
  sleep:["Improve deep sleep","Best sleep herbs","Fix my sleep schedule","Optimal bedtime routine"],
  senior:["Gentle morning stretch","Tai Chi for beginners","Joint pain relief","Heart health habits"],
  brain:["Memory exercise now","Focus ritual","Morning reflection prompt","Gratitude practice"],
};

const INIT_MSG = {role:"ai",text:"Namaste. I am your VITÁL Intelligence Engine.\n\nI draw from Ayurveda, herbal wisdom, yoga, breathwork, meditation, sleep science, and longevity research — all personalised to you.\n\nWhat would you like to explore today?"};

const YOGA_DATA = [
  {name:"Sun Salutation",level:"Beginner · 10 min",benefit:"Energizes the full body, improves circulation",poses:["Mountain Pose — stand tall, feet together","Forward Fold — hinge at hips, soften knees","Plank — shoulders over wrists, core engaged","Chaturanga — lower slowly, elbows in","Upward Dog — chest open, hips low","Downward Dog — hips high, press heels","Step forward, rise to Mountain Pose","Repeat 5 to 12 rounds"],tip:"Move with your breath — inhale to expand, exhale to fold. Begin slowly and build rhythm.",warn:null,yt:"https://www.youtube.com/results?search_query=sun+salutation+yoga+beginners+10+minutes",ytlbl:"Watch Sun Salutation tutorials"},
  {name:"Evening Wind-Down Flow",level:"All levels · 15 min",benefit:"Releases tension and prepares body for sleep",poses:["Child's Pose — forehead to mat, arms long","Seated Forward Fold — lengthen spine first","Supine Twist — both sides, breathe into ribs","Legs Up the Wall — 3 to 5 minutes","Corpse Pose — full surrender, breathe slowly"],tip:"Hold each pose 1 to 3 minutes. Focus on long exhales — twice as long as your inhale.",warn:null,yt:"https://www.youtube.com/results?search_query=evening+yoga+wind+down+bedtime+flow",ytlbl:"Watch Evening Wind-Down Yoga"},
  {name:"Yoga for Back Pain",level:"Gentle · 20 min",benefit:"Decompresses spine and strengthens supporting muscles",poses:["Cat-Cow — 10 slow rounds","Child's Pose — hold 2 minutes","Bridge Pose — gentle version, feet hip-width","Supine Spinal Twist — both sides","Knee-to-Chest — one leg at a time"],tip:"Move very slowly. Never push into pain. Your breath is the guide.",warn:"Stop immediately if sharp pain occurs. Consult your doctor for chronic back conditions.",yt:"https://www.youtube.com/results?search_query=yoga+for+back+pain+relief+gentle+beginners",ytlbl:"Watch Yoga for Back Pain"},
  {name:"Senior Chair Yoga",level:"Gentle · 20 min",benefit:"Mobility, balance, and joint health — no floor needed",poses:["Chair Mountain — sit tall, feet flat","Seated Cat-Cow — hands on knees","Seated Forward Fold — hinge at hips gently","Seated Tree Pose — one foot to ankle","Shoulder Rolls and Neck Circles — gentle","Seated Meditation — 3 minutes of stillness"],tip:"Everything is available chair-assisted. Move only in your pain-free range. Slow and gentle wins.",warn:"Always consult your doctor before starting. If anything hurts, stop.",yt:"https://www.youtube.com/results?search_query=gentle+chair+yoga+for+seniors+beginners",ytlbl:"Watch Chair Yoga for Seniors"},
  {name:"Kids Yoga Adventure",level:"Fun · 10 min",benefit:"Flexibility, body awareness, and a sense of fun",poses:["Tree Pose — balance like a tall tree","Butterfly Pose — flap your wings","Happy Baby — rock side to side","Downward Dog — wag your tail","Warrior II — strong and brave","Star Pose — reach for the sky"],tip:"Use animal names to make it a game! Parental supervision recommended for under 8.",warn:null,yt:"https://www.youtube.com/results?search_query=yoga+for+kids+fun+beginner+adventure",ytlbl:"Watch Kids Yoga Adventures"},
  {name:"Power Yoga Flow",level:"Advanced · 45 min",benefit:"Strength, flexibility, and athletic conditioning",poses:["Warrior I, II, and III sequence","Triangle Pose — both sides","Chair Pose — 30 second holds","Crow Pose — build up slowly","Wheel Pose — warm up well first","Full Vinyasa — 10 rounds"],tip:"Warm up 10 minutes first. Build this practice over weeks. Ego is not your friend here.",warn:"Not suitable for beginners. Stop if you feel sharp pain anywhere.",yt:"https://www.youtube.com/results?search_query=power+yoga+advanced+full+body+flow",ytlbl:"Watch Power Yoga Flow"},
];

const BREATH_DATA = [
  {name:"Box Breathing 4-4-4-4",level:"Stress · Focus · 5 to 10 min",steps:["Inhale slowly for 4 counts","Hold the breath for 4 counts","Exhale completely for 4 counts","Hold empty for 4 counts","Repeat 4 to 8 cycles. Then breathe normally."],science:"Activates parasympathetic nervous system. Reduces cortisol in under 4 minutes. Trusted by Navy SEALs and first responders worldwide.",warn:"May cause mild lightheadedness. Sit or lie down. Stop if dizzy.",yt:"https://www.youtube.com/results?search_query=box+breathing+technique+guided+stress+relief",ytlbl:"Watch Box Breathing guides"},
  {name:"4-7-8 Breathing",level:"Anxiety · Sleep · 3 to 5 min",steps:["Exhale completely through your mouth","Inhale through nose for 4 counts","Hold your breath for 7 counts","Exhale fully through mouth for 8 counts","Repeat for a maximum of 4 cycles"],science:"Extends the exhale to activate the vagus nerve and calm the stress response. Highly effective for anxiety and sleep onset acceleration.",warn:"Maximum 4 cycles when starting. Not recommended for people with respiratory conditions without medical guidance.",yt:"https://www.youtube.com/results?search_query=4-7-8+breathing+technique+sleep+anxiety",ytlbl:"Watch 4-7-8 Breathing tutorials"},
  {name:"Wim Hof Method",level:"Energy · Immune · 15 to 20 min",steps:["Take 30 deep, fast, full breaths","On the last exhale, hold as long as comfortable","Inhale deeply and hold for 15 seconds","This completes one round. Repeat 3 to 4 rounds."],science:"Increases blood alkalinity, activates sympathetic nervous system, and may enhance immune response. Extensively researched at Radboud University.",warn:"NEVER practise near water or while driving. Can cause fainting. Not for pregnant women or people with cardiovascular conditions.",yt:"https://www.youtube.com/results?search_query=wim+hof+breathing+method+guided+beginners",ytlbl:"Watch Wim Hof Method guides"},
  {name:"Heart Coherence 5-5",level:"HRV · Heart Health · 10 to 20 min",steps:["Inhale slowly through nose for 5 counts","Exhale slowly through nose for 5 counts","Target approximately 5.5 breaths per minute","Continue for 10 to 20 minutes"],science:"The single most studied breath pattern for maximizing heart rate variability. Research at HeartMath Institute shows measurable cardiac benefits. Ideal for seniors.",warn:"Very gentle and safe. Ideal for seniors and those with heart conditions. Always consult your doctor if you have cardiac conditions.",yt:"https://www.youtube.com/results?search_query=heart+coherence+breathing+5-5+HRV",ytlbl:"Watch Heart Coherence Breathing"},
  {name:"Nadi Shodhana Pranayama",level:"Balance · Clarity · 10 min",steps:["Sit comfortably. Rest your left hand on your knee.","Use right thumb to close right nostril","Inhale through left nostril for 4 counts","Close both nostrils. Hold for 2 counts.","Release right nostril. Exhale for 4 counts.","Inhale right, hold, exhale left — one cycle","Repeat 5 to 10 cycles"],science:"Alternate nostril breathing balances the left and right hemispheres of the brain. A cornerstone of Ayurvedic wellness. Enhances mental clarity and calm.",warn:"Gentle and safe for almost everyone. Stop if breathing becomes laboured.",yt:"https://www.youtube.com/results?search_query=nadi+shodhana+alternate+nostril+breathing+pranayama",ytlbl:"Watch Nadi Shodhana tutorials"},
  {name:"Kapalabhati Breath",level:"Energy · Detox · 3 to 5 min",steps:["Sit upright. Take one deep, full inhale.","Short, sharp exhales through the nose — one per second","The inhale follows passively and automatically","Do 30 pumps, then hold and inhale deeply","Exhale slowly. Repeat for 3 rounds."],science:"Traditional Ayurvedic cleansing breath. Stimulates the abdominal organs, increases oxygen delivery, and produces rapid energy. A morning classic.",warn:"Avoid if you have high blood pressure, glaucoma, hernia, or are pregnant. Not suitable for beginners — learn Box Breathing first.",yt:"https://www.youtube.com/results?search_query=kapalabhati+breathing+technique+pranayama+beginners",ytlbl:"Watch Kapalabhati Breathing"},
];

const TAICHI_DATA = [
  {name:"Wu Style Tai Chi Foundation",level:"Beginner · 15 min · Ideal for 60+",benefit:"Balance, coordination, and gentle joint movement — proven to reduce falls",poses:["Stand feet shoulder-width apart, knees soft","Arms float gently upward on inhale","Press slowly downward on exhale — feel grounded","Shift weight left, then step right foot sideways","Wave hands like slow clouds — continuous, effortless","Return to centre. Breathe naturally."],tip:"Move like water — slow, continuous, never forced. Any speed is the right speed. Learn just the first two steps this week.",warn:"Zero impact. Safe for most conditions. Check with your doctor first if you have balance disorders or osteoporosis.",yt:"https://www.youtube.com/results?search_query=tai+chi+for+seniors+beginners+gentle+balance",ytlbl:"Watch Tai Chi for Seniors"},
  {name:"8-Form Tai Chi Short Form",level:"Beginner · 10 min · Standing or seated",benefit:"Reduces blood pressure and improves balance",poses:["Commencement — arms rise and settle slowly","Wild Horse Parts Mane — gentle weight shift","White Crane Spreads Wings — one arm rises","Brush Knee and Push — step and press gently","Repulse Monkey — step back, arms flow","Crossing Hands — draw together, close, breathe"],tip:"Learn one section each week. Practise the first two movements for 7 days before adding more. Patience is the heart of this practice.",warn:"Suitable seated if standing is difficult. Excellent for anyone with balance or stability concerns.",yt:"https://www.youtube.com/results?search_query=8+form+tai+chi+beginners+step+by+step",ytlbl:"Watch 8-Form Tai Chi"},
  {name:"Tai Chi for Arthritis",level:"Gentle · 12 min · Joint conditions welcome",benefit:"Reduces arthritis pain and improves range of motion",poses:["Warm-up — gentle neck rolls and shoulder circles","Opening — arms float up and down with breath","Part the Wild Horse Mane — smooth arm movements","Cloud Hands — lateral weight shifts, very slow","Closing — arms descend fully on long exhale","Stand quietly. Breathe. Feel the stillness."],tip:"Developed by Dr Paul Lam specifically for arthritis. Research shows meaningful pain reduction in 12 weeks of consistent practice.",warn:"Safe for most arthritis conditions. Stop if any movement causes sharp pain. Consult your rheumatologist or GP before starting.",yt:"https://www.youtube.com/results?search_query=tai+chi+for+arthritis+Dr+Paul+Lam+beginners",ytlbl:"Watch Tai Chi for Arthritis (Dr Paul Lam)"},
  {name:"Qigong Morning Flow",level:"Gentle · 10 min · All ages welcome",benefit:"Energy cultivation, stress relief, and improved lung health",poses:["Gentle full-body shake — 30 seconds","Loose fists tapping the kidneys on lower back","Opening the chest — arms sweep wide on inhale","Closing the chest — arms cross on exhale","Lifting the sky — push hands up, breathe deeply in","Pushing the mountains — push forward, breathe out"],tip:"Qigong is the sister practice to Tai Chi. Do it first thing in the morning before breakfast — even 5 minutes creates a shift.",warn:"Extremely gentle. Safe for most conditions including early post-surgery recovery. Always check with your doctor after major surgery.",yt:"https://www.youtube.com/results?search_query=qigong+morning+routine+beginners+gentle+flow",ytlbl:"Watch Qigong Morning Flow"},
];

const PLANS = [
  {
    id:"free",tier:"Free",price:0,ap:0,fbadge:"Forever Free",
    desc:"A genuine head start. Real value — no card needed.",
    features:[
      {t:"Daily Vitality Score (morning + evening)",i:true},
      {t:"5 AI wellness messages per day",i:true},
      {t:"Yoga and breathwork library",i:true},
      {t:"Morning and evening ritual guides",i:true},
      {t:"Basic habit and sleep tracking",i:true},
      {t:"Manual health data entry",i:true},
      {t:"Unlimited AI personalization",i:false},
      {t:"Advanced analytics and insights",i:false},
      {t:"AI memory across sessions",i:false},
    ],
    btn:"outline",cta:"Start Free — No Card"
  },
  {
    id:"pro",tier:"Pro",price:12.99,ap:7.99,badge:"Most Popular",featured:true,
    desc:"Everything you need for daily wellness — morning, evening, and beyond.",
    features:[
      {t:"Everything in Free",i:true},
      {t:"Unlimited AI wellness coaching",i:true},
      {t:"AI memory — learns your patterns",i:true},
      {t:"Full Ayurveda dosha assessment",i:true},
      {t:"90-day wellness history",i:true},
      {t:"Advanced sleep optimization",i:true},
      {t:"Herbal and supplement protocols",i:true},
      {t:"Tai Chi and Senior wellness",i:true},
      {t:"Longevity protocols and insights",i:false},
    ],
    btn:"gold",cta:"Start Pro — 14 Days Free"
  },
  {
    id:"elite",tier:"Elite",price:22.99,ap:13.99,
    desc:"For those serious about longevity, performance, and deep personalization.",
    features:[
      {t:"Everything in Pro",i:true},
      {t:"Unlimited wellness history",i:true},
      {t:"Longevity protocols and aging science",i:true},
      {t:"Lab result analysis and guidance",i:true},
      {t:"Monthly expert wellness consultation",i:true},
      {t:"Biological age score and tracking",i:true},
      {t:"Corporate and family accounts",i:true},
      {t:"Priority AI response and support",i:true},
    ],
    btn:"outline",cta:"Start Elite — 14 Days Free"
  },
];

const LEGAL = {
  disclaimer:{title:"Health Disclaimer",body:"VITÁL is a general wellness and lifestyle application only.\n\nNOT A MEDICAL DEVICE\nVITÁL does not diagnose, treat, cure, or prevent any disease or medical condition. It is not a substitute for professional medical advice, diagnosis, or treatment.\n\nCHILDREN UNDER 18 — PARENTAL SUPERVISION REQUIRED\nAll activities including exercises, breathing practices, yoga, Tai Chi, meditation, and AI coach interactions MUST be supervised by a parent or guardian at all times for anyone under 18 years of age. Parents and guardians are solely responsible for determining the suitability of all content for their child.\n\nMEDICATION SAFETY\nVITÁL NEVER advises you to stop, reduce, or change any medication. All suggestions are general lifestyle information only — additions to, never replacements for, your prescribed medical care.\n\nHERBAL AND SUPPLEMENT CONTENT\nHerbs and supplements can interact with medications. Always consult your doctor or pharmacist before using any supplement, herb, or natural remedy.\n\nSENIORS (60+)\nAlways consult your doctor before starting any new exercise, supplement, or dietary protocol.\n\nEXERCISE SAFETY\nStop immediately if you experience pain, dizziness, or discomfort. Consult your doctor before beginning any new exercise program.\n\nMEDICAL EMERGENCIES\nVITÁL is NOT for emergencies. Call your local emergency services immediately.\n\nEXTERNAL LINKS\nVITÁL links to YouTube for educational purposes only. We are not responsible for third-party content.\n\n© 2026 VITÁL Health · hello@vitalhealth.app"},
  terms:{title:"Terms of Service",body:"1. WELLNESS PLATFORM: General wellness information only — not medical advice.\n2. FREE TIER: Forever free with limited features.\n3. SUBSCRIPTIONS: Monthly or annual. 14-day free trial on Pro and Elite. Cancel anytime.\n4. PAYMENTS: Secure global payment processing. All major cards and digital wallets accepted.\n5. POPIA: Full South Africa compliance.\n6. GDPR: Full EU compliance.\n\n© 2026 ABC UP PTY LTD"},
  privacy:{title:"Privacy Policy",body:"DATA: Name, email, age, wellness metrics you choose to enter.\n\nSECURITY: AES-256 encryption. TLS 1.3 in transit. Supabase infrastructure.\n\nCOMPLIANCE: POPIA (South Africa) · GDPR (EU) · HIPAA-aligned wellness handling.\n\nYOUR RIGHTS: Export all data. Delete your account anytime. Opt out of any marketing.\n\nTHIRD PARTIES: Payment processors, Anthropic (AI only), Supabase database. We do NOT sell your data ever.\n\nContact: privacy@vitalhealth.app\n© 2026 ABC UP PTY LTD"},
};

/* ══ MAIN APP ══════════════════════════════════════════ */

export default function App() {
  const [accepted,setAccepted] = useState(()=>{try{return localStorage.getItem("vital8")==="y"}catch{return false}});
  const [checked,setChecked] = useState(false);
  const [page,setPage] = useState("home");
  const [modal,setModal] = useState(null);
  const [toast,setToast] = useState("");
  const [annual,setAnnual] = useState(false);
  const [exDetail,setExDetail] = useState(null);
  const [speaking,setSpeaking] = useState(false);
  const [voiceAvailable] = useState(()=>typeof window!=="undefined"&&"speechSynthesis" in window);

  const speak = (text) => {
    try { window.speechSynthesis.cancel(); } catch(e) {}
    if(speaking){setSpeaking(false);return;}
    const utt = new window.SpeechSynthesisUtterance(text);
    utt.rate = 0.88;
    utt.pitch = 1;
    utt.volume = 1;
    // Prefer a calm female voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v=>v.name.includes('Samantha')||v.name.includes('Karen')||v.name.includes('Moira')||v.name.includes('Victoria'));
    if(preferred) utt.voice = preferred;
    utt.onend = ()=>setSpeaking(false);
    utt.onerror = ()=>setSpeaking(false);
    setSpeaking(true);
    try { window.speechSynthesis.speak(utt); } catch(e) { setSpeaking(false); showToast("Tap browser menu > Allow audio to enable voice"); }
  };

  const stopSpeak = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };
  const [copied,setCopied] = useState(false);

  // Time selection for rituals
  const [morningTime,setMorningTime] = useState("10");
  const [eveningTime,setEveningTime] = useState("10");

  // AI Coach
  const [msgs,setMsgs] = useState([INIT_MSG]);
  const [inp,setInp] = useState("");
  const [aiLoading,setAiLoading] = useState(false);
  const [aiMode,setAiMode] = useState("wellness");
  const endRef = useRef(null);

  // Exercise category
  const [exCat,setExCat] = useState("yoga");

  // Evening reflection
  const [reflection,setReflection] = useState("");
  const [gratitude,setGratitude] = useState("");

  // Health profile (manual, no wearable needed)
  const [profile,setProfile] = useState({
    weight:"",height:"",age:"",sleep_hours:"7",energy:"5",stress:"5",
    mood:"5",water:"2",wake_time:"06:30",bed_time:"22:30",
    mins_available:"10",fitness_level:"moderate",
    bp_sys:"",bp_dia:"",glucose:""
  });
  const [profileSaved,setProfileSaved] = useState(false);

  const go = (p) => { setPage(p); window.scrollTo(0,0); };
  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(""),3000); };
  const accept = () => { try{localStorage.setItem("vital8","y")}catch{} setAccepted(true); };

  // Computed vitality score from profile
  // Normalized vitality score (0-100). Raw max = 234 points.
  const _raw = (
    (parseInt(profile.energy||5) * 8) +
    ((10 - parseInt(profile.stress||5)) * 5) +
    (parseInt(profile.mood||5) * 5) +
    (parseFloat(profile.water||2) * 6) +
    (parseFloat(profile.sleep_hours||7) * 3)
  );
  const vitalityScore = Math.min(100, Math.round((_raw / 234) * 100));

  const sendChat = async (txt) => {
    const m = txt || inp.trim();
    if (!m || aiLoading) return;
    setInp("");
    setMsgs(p=>[...p,{role:"user",text:m}]);
    setAiLoading(true);
    try {
      const hist = msgs.map(x=>({role:x.role==="ai"?"assistant":"user",content:x.text}));
      const userCtx = profileSaved
        ? `User profile: energy ${profile.energy}/10, stress ${profile.stress}/10, sleep ${profile.sleep_hours}h, water ${profile.water}L/day, fitness: ${profile.fitness_level}. `
        : "";
      const sys = `You are VITÁL Intelligence Engine — a warm, wise AI wellness companion. ${userCtx}Current mode: ${aiMode}. Draw from herbal medicine, Ayurveda, yoga, breathwork, meditation, sleep science, and longevity research. Be warm, concise, genuinely helpful. Keep responses to 2-3 short paragraphs. Never diagnose or advise changing medication. Respond naturally — do not add disclaimers or warnings to every message.`;
      // Secure proxy — API key lives server-side only
      const r = await fetch("/api/chat",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          system:sys,
          messages:[...hist,{role:"user",content:m}],
          max_tokens:600
        })
      });
      const d = await r.json();
      if(d.error){throw new Error(d.error);}
      const rawText = d.content?.[0]?.text||"Please try again.";
      // Clean markdown: **bold** → just text, remove excessive newlines
      const cleanText = rawText
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/#{1,3} /g, '')
        .replace(/\n{3,}/g, '\n\n')
        // Strip any trailing disclaimer lines Claude may add
        .replace(/\n*[⚠️🔔].*general wellness.*$/im, '')
        .replace(/\n*[⚠️🔔].*not medical advice.*$/im, '')
        .replace(/\n*[⚠️🔔].*complements.*healthcare.*$/im, '')
        .replace(/\n*[⚠️🔔].*never replaces.*$/im, '')
        .trim();
      // Detect if response mentions a specific practice — add YouTube link
      const ytKeywords = {
        "sun salutation":"sun+salutation+yoga+beginners",
        "cat-cow":"cat+cow+yoga+stretch",
        "downward dog":"downward+dog+yoga+tutorial",
        "child's pose":"child+pose+yoga+restorative",
        "warrior":"warrior+pose+yoga+beginners",
        "box breathing":"box+breathing+technique+guided",
        "4-7-8":"4-7-8+breathing+sleep+anxiety",
        "wim hof":"wim+hof+breathing+method",
        "pranayama":"pranayama+breathing+beginners",
        "nadi shodhana":"nadi+shodhana+alternate+nostril",
        "tai chi":"tai+chi+beginners+gentle",
        "qigong":"qigong+morning+routine",
        "meditation":"guided+meditation+beginners",
        "body scan":"body+scan+meditation+sleep",
        "yoga nidra":"yoga+nidra+deep+relaxation",
      };
      const lowerText = cleanText.toLowerCase();
      let autoYt = null;
      for(const [kw,q] of Object.entries(ytKeywords)){
        if(lowerText.includes(kw)){autoYt="https://www.youtube.com/results?search_query="+q;break;}
      }
      setMsgs(p=>[...p,{role:"ai",text:cleanText,yt:autoYt}]);
    } catch {
      setMsgs(p=>[...p,{role:"ai",text:"Connection error. Please check your internet and try again."}]);
    }
    setAiLoading(false);
    setTimeout(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),80);
  };

  /* ── DISCLAIMER GATE ── */
  if (!accepted) return (
    <>
      <style>{CSS}</style>
      <div className="gate">
        <div className="gate-box">
          <div className="gate-hd">
            <div style={{fontSize:12,fontWeight:600,letterSpacing:".12em",textTransform:"uppercase",color:"var(--amber)",marginBottom:8}}>
              ⚠️ Health Notice
            </div>
            <div style={{fontFamily:"var(--fd)",fontSize:22,fontWeight:300,color:"var(--text)"}}>
              Important Disclaimer
            </div>
          </div>
          <div className="gate-body">
            {[
              ["Not a Medical Device","VITÁL is a general wellness application — not a medical device. It does not provide diagnoses and is not a substitute for professional medical advice, diagnosis, or treatment."],
              ["Medication Safety — Critical","VITÁL NEVER advises you to stop, reduce, or change any medication. VITÁL NEVER overrides your doctor. All suggestions are general wellness information — additions to, not replacements for, your prescribed medical care."],
              ["Herbal Content","Herbal and Ayurvedic recommendations are traditional wellness information only. Herbs can interact with medications. Always consult your doctor or pharmacist before using any supplement."],
              ["Children Under 18","All wellness activities should be supervised by a parent or guardian at all times."],
              ["Seniors Age 60 Plus","Always consult your doctor before any new exercise, supplement, or dietary change — especially if you take regular medication."],
              ["Medical Emergencies","VITÁL is NOT for emergencies. Call 911 or your local emergency services immediately."],
            ].map(([t,b])=>(
              <div key={t}>
                <div className="gate-sec">{t}</div>
                <p className="gate-p">{b}</p>
              </div>
            ))}
            <div className="gate-hi">
              VITÁL is designed to complement — never replace — your healthcare team. Your doctor always comes first.
            </div>
          </div>
          <div className="gate-foot">
            <div className="gate-check" onClick={()=>setChecked(c=>!c)}>
              <div className={`gate-chk${checked?" on":""}`}>
                {checked&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div className="gate-chk-txt">
                I understand VITÁL provides general wellness information only — not medical advice. I will continue all prescribed medications and follow my doctor's guidance. I agree to the Terms, Privacy Policy, and Health Disclaimer.
              </div>
            </div>
            <button
              className="btn btn-gold-lg"
              style={{width:"100%"}}
              disabled={!checked}
              onClick={accept}
            >
              I Understand — Enter VITÁL
            </button>
          </div>
        </div>
      </div>
    </>
  );

  /* ── MAIN APP ── */
  return (
    <>
      <style>{CSS}</style>

      {toast&&<div className="toast">{toast}</div>}

      {modal&&(
        <div className="modal-ov" onClick={()=>setModal(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-hd">
              <div style={{fontFamily:"var(--fd)",fontSize:19,fontWeight:300}}>{LEGAL[modal].title}</div>
              <button className="modal-close" onClick={()=>setModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <p className="modal-txt">{LEGAL[modal].body}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── EXERCISE DETAIL OVERLAY ── */}
      {exDetail&&(
        <div className="ex-ov">
          <div className="ex-ov-inner">
            <div style={{display:"flex",alignItems:"center",padding:"12px 0 16px",borderBottom:"1px solid rgba(255,255,255,.05)",marginBottom:20}}>
              <button onClick={()=>setExDetail(null)} style={{background:"none",border:"none",color:"var(--cd)",fontSize:22,cursor:"pointer",padding:"0 14px 0 0",lineHeight:1}}>{"←"}</button>
              <span style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:300,color:"var(--cr)"}}>{exDetail.name}</span>
            </div>
            <div style={{padding:"0 2px"}}>
              <div className="lbl">{exDetail.level}</div>
              <h2 className="h2" style={{marginBottom:8}}>{exDetail.name}</h2>
              <div style={{fontSize:14,color:"var(--green)",fontWeight:400,marginBottom:22}}>{exDetail.benefit}</div>

              {/* Steps */}
              <div style={{marginBottom:24}}>
                <div style={{fontSize:12,fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:16}}>
                  Step-by-Step Guide
                </div>
                {(exDetail.poses||exDetail.steps||[]).map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:14,marginBottom:16,alignItems:"flex-start"}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:"var(--goldbg)",border:"1px solid var(--goldbdr)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:"var(--gold)",flexShrink:0}}>
                      {i+1}
                    </div>
                    <div style={{fontSize:15,color:"var(--text2)",lineHeight:1.65,paddingTop:3,fontWeight:300}}>
                      {s}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tip */}
              {exDetail.tip&&(
                <div className="card-gold" style={{marginBottom:16}}>
                  <div style={{fontSize:11,fontWeight:600,color:"var(--gold)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>
                    Instructor Tip
                  </div>
                  <p style={{fontSize:14,color:"var(--text2)",fontWeight:300,lineHeight:1.7}}>{exDetail.tip}</p>
                </div>
              )}

              {/* Science */}
              {exDetail.science&&(
                <div className="card-green" style={{marginBottom:16}}>
                  <div style={{fontSize:11,fontWeight:600,color:"var(--green)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>
                    The Science
                  </div>
                  <p style={{fontSize:14,color:"var(--text2)",fontWeight:300,lineHeight:1.7}}>{exDetail.science}</p>
                </div>
              )}

              {/* Warning */}
              {exDetail.warn&&(
                <div style={{background:"var(--amberbg)",border:"1px solid var(--amberddr)",borderRadius:"var(--r2)",padding:"12px 16px",marginBottom:16}}>
                  <div style={{fontSize:11,fontWeight:600,color:"var(--amber)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:5}}>
                    Safety Note
                  </div>
                  <p style={{fontSize:13,color:"var(--amber)",fontWeight:300,lineHeight:1.65}}>{exDetail.warn}</p>
                </div>
              )}

              {/* YouTube */}
              {exDetail.yt&&(
                <div style={{background:"rgba(220,38,38,.05)",border:"1px solid rgba(220,38,38,.15)",borderRadius:"var(--r2)",padding:"18px 20px",marginBottom:24}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#DC2626",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>
                    ▶ Watch on YouTube
                  </div>
                  <p style={{fontSize:14,color:"var(--text2)",marginBottom:14,fontWeight:300,lineHeight:1.65}}>
                    Browse multiple instructors and find a teaching style you enjoy. You are more likely to practise consistently when you genuinely like your teacher.
                  </p>
                  <a
                    href={exDetail.yt}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{display:"inline-flex",alignItems:"center",gap:8,background:"#DC2626",color:"#fff",padding:"11px 22px",borderRadius:"var(--r1)",fontSize:14,fontWeight:500,textDecoration:"none"}}
                  >
                    ▶ {exDetail.ytlbl||"Find tutorials on YouTube"}
                  </a>
                  <p style={{fontSize:11,color:"var(--text3)",marginTop:10,fontWeight:300}}>
                    Opens YouTube in a new tab. External content — choose qualified instructors.
                  </p>
                </div>
              )}

              {/* YouTube — shown prominently above action buttons */}
              {exDetail.yt&&(
                <div style={{marginBottom:16,padding:"14px 16px",background:"rgba(220,38,38,.06)",border:"1px solid rgba(220,38,38,.18)",borderRadius:"var(--r2)"}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#FF6B6B",letterSpacing:".08em",textTransform:"uppercase",marginBottom:8}}>
                    ▶ Watch on YouTube
                  </div>
                  <p style={{fontSize:13,color:"var(--cd)",marginBottom:12,fontWeight:300,lineHeight:1.6}}>
                    Browse instructors and pick a style you enjoy. You will practise more consistently with a teacher you like.
                  </p>
                  <a
                    href={exDetail.yt}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{display:"inline-flex",alignItems:"center",gap:8,background:"#DC2626",color:"#fff",padding:"10px 20px",borderRadius:"var(--r1)",fontSize:14,fontWeight:500,textDecoration:"none"}}
                  >
                    {"►"} {exDetail.ytlbl||"Find tutorials on YouTube"}
                  </a>
                </div>
              )}

              {/* Action buttons */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                <button
                  className="btn btn-gold"
                  onClick={()=>{
                    if(exDetail.cat){setAiMode(exDetail.cat==="breathing"?"breathing":exDetail.cat==="yoga"?"yoga":"senior")}
                    setMsgs([INIT_MSG]);
                    setExDetail(null);
                    go("coach");
                  }}
                >
                  Ask AI Coach
                </button>
                <button
                  className="btn btn-outline"
                  onClick={()=>{stopSpeak();setExDetail(null);}}
                >
                  Back to List
                </button>
              </div>

              {/* Voice read-out option */}
              <button onClick={()=>{if(speaking){stopSpeak();return;}const steps=(exDetail.poses||exDetail.steps||[]).join(". ");const txt="Guide for "+exDetail.name+". "+steps+". Enjoy your practice.";if(typeof window!=="undefined"&&"speechSynthesis" in window){speak(txt);}else{showToast("Voice works when VITAL is on your phone");}}} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:10,background:speaking?"var(--gnd)":"rgba(255,255,255,.06)",border:"1px solid "+(speaking?"var(--gnb)":"rgba(255,255,255,.1)"),color:speaking?"var(--green)":"var(--cd)",padding:"12px",borderRadius:"var(--r2)",fontSize:14,cursor:"pointer",fontFamily:"var(--fb)"}}><span>{speaking?"⏹":"🔊"}</span><span>{speaking?"Tap to stop":"Read guide aloud"}</span></button>
            </div>
          </div>
        </div>
      )}

      {/* ── NAVIGATION ── */}
      {page!=="coach"&&!exDetail&&<nav className="nav">
        <div className="nav-logo" onClick={()=>go("home")}>VITÁL</div>
        <div className="nav-links">
          {[
            ["home","Home"],
            ["morning","🌅 Morning"],
            ["evening","🌙 Evening"],
            ["coach","AI Coach"],
            ["exercises","💪 Exercises"],
            ["profile","👤 My Data"],
            ["pricing","Pricing"],
            ["referral","Referrals"],
          ].map(([p,l])=>(
            <button key={p} className={`nav-btn${page===p?" active":""}`} onClick={()=>go(p)}>{l}</button>
          ))}
        </div>
        <div className="nav-right">
          <button className="btn btn-ghost btn-sm" onClick={()=>go("morning")}>Try Free</button>
          <button className="btn btn-gold btn-sm" onClick={()=>go("pricing")}>Get Pro</button>
        </div>
      </nav>}

      {/* ══════════════════════════════════════════════════
          HOME PAGE
      ══════════════════════════════════════════════════ */}
      {page==="home"&&(
        <div className="page">
          {/* HERO */}
          <div className="wrap">
            <div className="hero">
              <div className="hero-sup">
                <span className="hero-pulse"/>
                Available in 50+ Countries · AI Wellness Platform
              </div>
              <h1 className="h1">
                Ancient wisdom.<br/>
                <em>Future intelligence.</em>
              </h1>
              <p className="hero-sub">
                VITÁL unites Ayurveda, herbal medicine, yoga, breathwork, and modern bioscience into one calming AI companion — for every age, every body, every life.
              </p>

              <div className="hero-btns">
                <button className="btn btn-gold-lg" onClick={()=>go("morning")}>
                  🌅 Start Morning Ritual
                </button>
                <button className="btn btn-outline" onClick={()=>go("pricing")}>
                  See Plans
                </button>
              </div>
              <p className="hero-free">✓ Free forever tier · Pro from $12.99/mo · Cancel anytime</p>
              <div className="hero-stats">
                <div><div className="stat-val">All Ages</div><div className="stat-lbl">Kids · Adults · Seniors</div></div>
                <div><div className="stat-val">9 Modalities</div><div className="stat-lbl">Herbs · Yoga · Ayurveda</div></div>
                <div><div className="stat-val">No Wearable</div><div className="stat-lbl">Needed to benefit</div></div>
                <div><div className="stat-val">4.9 ★</div><div className="stat-lbl">Member Rating</div></div>
              </div>
            </div>
          </div>

          {/* GOLDEN HABIT WINDOWS */}
          <div className="wrap">
            <div className="section-sm">
              <div className="lbl" style={{textAlign:"center"}}>The Golden Habit Window</div>
              <h2 className="h2" style={{textAlign:"center",marginBottom:10}}>
                Win the morning.<br/><em>Own the evening.</em>
              </h2>
              <p className="body-text" style={{textAlign:"center",maxWidth:480,margin:"0 auto 28px",fontSize:15}}>
                If VITÁL becomes the first thing you open in the morning and the last thing before sleep, retention becomes dramatically stronger. That is our mission.
              </p>
              <div className="habit-grid">
                <div className="habit-card morning" onClick={()=>go("morning")}>
                  <div className="habit-icon">🌅</div>
                  <div className="habit-h">Morning Ritual</div>
                  <div className="habit-desc">Begin each day with clarity, energy, and intention. Your AI generates a personalised plan in seconds.</div>
                  <div className="habit-items">
                    {["Vitality score for today","AI daily guidance","Energy and focus planning","Breathwork and movement"].map(i=>(
                      <div key={i} className="habit-item"><span className="habit-chk">✓</span>{i}</div>
                    ))}
                  </div>
                  <div style={{marginTop:18}}>
                    <span className="btn btn-gold btn-sm">Open Morning Ritual →</span>
                  </div>
                </div>
                <div className="habit-card evening" onClick={()=>go("evening")}>
                  <div className="habit-icon">🌙</div>
                  <div className="habit-h">Evening Ritual</div>
                  <div className="habit-desc">Wind down with intention. Breathe. Reflect. Sleep deeply. Tomorrow starts tonight.</div>
                  <div className="habit-items">
                    {["Recovery guidance","Breathing for sleep","Body scan meditation","Gratitude reflection"].map(i=>(
                      <div key={i} className="habit-item"><span className="habit-chk">✓</span>{i}</div>
                    ))}
                  </div>
                  <div style={{marginTop:18}}>
                    <span className="btn btn-outline btn-sm" style={{borderColor:"#B0C4F8",color:"#2563EB"}}>Open Evening Ritual →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FREE TIER */}
          <div style={{background:"var(--greenbg)",borderTop:"1px solid var(--greenbdr)",borderBottom:"1px solid var(--greenbdr)"}}>
            <div className="wrap">
              <div className="section-sm">
                <div className="lbl">Free Forever Tier</div>
                <h2 className="h2" style={{marginBottom:8}}>
                  Start completely <em>free.</em> No card needed.
                </h2>
                <p className="body-text" style={{marginBottom:22,fontSize:15}}>Real value — not a crippled trial. Free users genuinely love VITÁL.</p>
                <div className="g-auto-sm">
                  {[
                    ["🌅","Morning Ritual","Daily AI-powered protocol"],
                    ["🌙","Evening Ritual","Sleep and recovery guidance"],
                    ["🫁","Breathwork","6 guided techniques"],
                    ["🧘","Yoga Library","All levels and ages"],
                    ["🧠","Meditation","Guided sessions"],
                    ["🥋","Tai Chi","Senior-friendly movement"],
                    ["🤖","AI Coach","5 messages per day"],
                    ["👤","Health Profile","Manual entry, no wearable"],
                  ].map(([ic,n,d])=>(
                    <div key={n} className="card-sm" style={{textAlign:"center"}}>
                      <div style={{fontSize:22,marginBottom:7}}>{ic}</div>
                      <div style={{fontSize:13,fontWeight:500,marginBottom:3}}>{n}</div>
                      <div style={{fontSize:12,color:"var(--text3)",fontWeight:300,lineHeight:1.5}}>{d}</div>
                    </div>
                  ))}
                </div>
                <div style={{textAlign:"center",marginTop:22}}>
                  <button className="btn btn-green" onClick={()=>go("morning")}>
                    Create Free Account →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* INTELLIGENCE ENGINE */}
          <div className="wrap">
            <div className="section">
              <div className="lbl">VITÁL Intelligence Engine</div>
              <h2 className="h2" style={{marginBottom:10}}>
                9 ancient and modern<br/><em>wellness modalities.</em>
              </h2>
              <p className="body-text" style={{marginBottom:28,fontSize:15}}>
                One AI that draws from thousands of years of healing wisdom — adapted to your age, your schedule, and your goals.
              </p>
              <div className="g-auto">
                {[
                  ["🌿","Herbal Wellness","200+ evidence-based herbs matched to your biometrics, goals, and age group.","Pro"],
                  ["🧘","Yoga Flows","Personalized sequences for every age and ability — from 5-minute breaks to full flows.","Free"],
                  ["🫁","Breathwork","Box breathing, 4-7-8, Wim Hof, coherence — chosen by your AI for your current state.","Free"],
                  ["🧠","Meditation","Guided meditations, NSDR, body scans, and focus protocols curated for your day.","Free"],
                  ["🌸","Ayurveda","Dosha assessment, daily dinacharya, seasonal protocols rooted in 5,000 years of wisdom.","Pro"],
                  ["😴","Sleep Science","Circadian rhythm optimization and personalized wind-down routines for deep sleep.","Free"],
                  ["💪","Exercise Science","Zone 2 training, strength, and recovery timing matched to your daily readiness.","Pro"],
                  ["🥋","Tai Chi","Proven movement therapy for seniors — balance, joint health, fall prevention.","Free"],
                  ["🔬","Longevity","NAD+ protocols, biological age tracking, and the latest science applied to your body.","Elite"],
                ].map(([ic,n,d,tag])=>(
                  <div key={n} className="card" style={{cursor:"pointer",transition:"all .2s"}}
                    onMouseOver={e=>{e.currentTarget.style.borderColor="var(--gold)";e.currentTarget.style.transform="translateY(-2px)"}}
                    onMouseOut={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.transform="translateY(0)"}}
                  >
                    <div style={{fontSize:26,marginBottom:10}}>{ic}</div>
                    <div style={{fontSize:14,fontWeight:500,marginBottom:6}}>{n}</div>
                    <div className="body-sm" style={{marginBottom:10,lineHeight:1.6}}>{d}</div>
                    <span className={`badge ${tag==="Free"?"badge-green":tag==="Pro"?"badge-gold":"badge-blue"}`}>
                      {tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FOR ALL AGES */}
          <div style={{background:"var(--bg2)",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)"}}>
            <div className="wrap">
              <div className="section">
                <div className="lbl">For Every Age</div>
                <h2 className="h2" style={{marginBottom:28}}>
                  From 5 to 95 —<br/><em>wellness for all.</em>
                </h2>
                <div className="g3" style={{marginTop:28}}>
                  {[
                    {icon:"🧒",name:"Children",range:"Ages 5 to 17",color:"var(--green)",feats:["Fun wellness habits and streak games","Kid-friendly breathing and mindfulness","Sleep routine builder","Age-appropriate yoga adventures","Parent dashboard and supervision"]},
                    {icon:"🧑",name:"Adults",range:"Ages 18 to 59",color:"var(--gold)",feats:["AI morning and evening protocols","Ayurveda dosha assessment","Athletic performance and recovery","Herbal and adaptogen guidance","Burnout prevention tools"]},
                    {icon:"👴",name:"Seniors",range:"Ages 60 and above",color:"var(--purple)",feats:["Gentle yoga and Tai Chi flows","Tai Chi for Arthritis program","Balance and fall prevention","Heart health wellness guidance","Large-text accessible interface"]},
                  ].map(a=>(
                    <div key={a.name} className="card" style={{borderTop:`3px solid ${a.color}`}}>
                      <div style={{fontSize:36,marginBottom:12}}>{a.icon}</div>
                      <div style={{fontFamily:"var(--fd)",fontSize:20,fontWeight:300,marginBottom:3}}>{a.name}</div>
                      <div style={{fontSize:11,color:"var(--text3)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:14,fontWeight:400}}>{a.range}</div>
                      {a.feats.map(f=>(
                        <div key={f} style={{fontSize:14,color:"var(--text2)",display:"flex",gap:8,marginBottom:7,fontWeight:300,alignItems:"flex-start"}}>
                          <span style={{color:"var(--green)",flexShrink:0,fontSize:11,marginTop:3}}>✓</span>{f}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FINAL CTA */}
          <div className="wrap">
            <div className="section" style={{textAlign:"center"}}>
              <h2 className="h2" style={{marginBottom:12}}>
                The world's most trusted<br/><em>AI wellness companion.</em>
              </h2>
              <p className="body-text" style={{fontSize:15,maxWidth:420,margin:"0 auto 28px"}}>
                No wearable needed. No complexity. Just calming, intelligent wellness — every morning and evening.
              </p>
              <div className="hero-btns">
                <button className="btn btn-gold-lg" onClick={()=>go("morning")}>Begin Your Morning Ritual →</button>
                <button className="btn btn-outline" onClick={()=>go("pricing")}>View Pricing</button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          MORNING RITUAL PAGE
      ══════════════════════════════════════════════════ */}
      {page==="morning"&&(
        <div className="page">
          <div className="wrap ritual-page">
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:12}}>
              <div>
                <div className="lbl">Morning Ritual</div>
                <h2 className="h2">
                  Good morning. <em>Let us begin.</em>
                </h2>
              </div>
              <div className="vitality-ring" style={{textAlign:"right"}}>
                <div className="score-big" style={{color:vitalityScore>70?"var(--green)":vitalityScore>40?"var(--gold)":"var(--red)"}}>
                  {vitalityScore}
                </div>
                <div className="score-lbl">Vitality Score</div>
                <button className="btn btn-ghost btn-sm" onClick={()=>go("profile")} style={{marginTop:4,fontSize:12}}>
                  {profileSaved?"Update My Data":"Enter My Data"}
                </button>
              </div>
            </div>

            <div style={{background:"rgba(201,168,76,.07)",border:"1px solid rgba(201,168,76,.15)",borderRadius:"var(--r2)"}} style={{marginBottom:22}}>
              <div className="lbl" style={{marginBottom:5}}>AI Morning Guidance</div>
              <div style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:300,marginBottom:7,color:"var(--text)"}}>
                {vitalityScore>=75
                  ? <>Energy is elevated today. <em>A high performance day awaits.</em></>
                  : vitalityScore>=50
                    ? <>Moderate energy. <em>Gentle movement will help.</em></>
                    : <>Energy is low today. <em>Be kind to yourself.</em></>
                }
              </div>
              <p className="body-sm" style={{marginBottom:0,lineHeight:1.7}}>
                {profileSaved
                  ? `Based on your ${profile.sleep_hours}h sleep, energy ${profile.energy}/10, and stress ${profile.stress}/10 — your AI recommends ${
                      parseInt(profile.energy)<5
                        ? "gentle breathwork and a slow yoga flow today. Ashwagandha with breakfast for resilience."
                        : "an energizing sun salutation and coherence breathing. Good day to push a little further."
                    }`
                  : "Enter your daily feel in My Data for a personalised protocol — takes 60 seconds."
                }
              </p>
            </div>

            <div style={{marginBottom:20}}>
              <div style={{fontSize:14,fontWeight:500,marginBottom:10,color:"var(--text)"}}>
                How much time do you have this morning?
              </div>
              <div className="time-sel">
                {[["2","2 minutes"],["5","5 minutes"],["10","10 minutes"],["20","20 or more"]].map(([v,l])=>(
                  <button key={v} className={`time-btn${morningTime===v?" active":""}`} onClick={()=>setMorningTime(v)}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div style={{fontSize:13,color:"var(--text3)",marginBottom:14,fontWeight:300}}>
              Your {morningTime}-minute morning ritual — {MORNING_ROUTINES[morningTime]?.length} practices
            </div>
            <div className="routine-grid">
              {(MORNING_ROUTINES[morningTime]||MORNING_ROUTINES["10"]).map((r,i)=>(
                <div key={i} className="routine-card" onClick={()=>{
                  setAiMode(r.cat==="yoga"?"yoga":r.cat==="breathing"?"breathing":r.cat==="mind"?"brain":r.cat==="herbal"?"herbal":"wellness");
                  setMsgs([INIT_MSG]);
                  go("coach");
                  showToast("Opening AI coach for: "+r.name);
                }}>
                  <div className="routine-icon">{r.icon}</div>
                  <div className="routine-name">{r.name}</div>
                  <div className="routine-dur">{r.dur}</div>
                  <div className="body-sm" style={{marginTop:6,lineHeight:1.55}}>{r.desc}</div>
                  <div style={{marginTop:10}}>
                    <span className="badge badge-gold">Start →</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{marginTop:20}}>
              <div style={{fontSize:14,fontWeight:500,marginBottom:10}}>🧠 Morning Brain Wellness</div>
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                {[
                  {icon:"✍️",q:"What is one thing I want to achieve today?"},
                  {icon:"🙏",q:"What am I grateful for this morning?"},
                  {icon:"🎯",q:"What feeling do I want to cultivate today?"},
                ].map((p,i)=>(
                  <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"10px 12px",background:"var(--bg)",borderRadius:"var(--r1)",cursor:"pointer"}}
                    onClick={()=>{setAiMode("brain");setMsgs([INIT_MSG]);go("coach");sendChat(p.q)}}
                  >
                    <span style={{fontSize:16,flexShrink:0}}>{p.icon}</span>
                    <span style={{fontSize:14,color:"var(--text2)",fontWeight:300}}>{p.q}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{marginTop:16,display:"flex",gap:11}}>
              <button className="btn btn-gold" style={{flex:1}} onClick={()=>go("coach")}>
                Open AI Coach →
              </button>
              <button className="btn btn-outline" style={{flex:1}} onClick={()=>go("exercises")}>
                Browse Exercises
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          EVENING RITUAL PAGE
      ══════════════════════════════════════════════════ */}
      {page==="evening"&&(
        <div className="page">
          <div className="wrap ritual-page">
            <div className="lbl">Evening Ritual</div>
            <h2 className="h2" style={{marginBottom:8}}>
              Wind down. <em>Recover. Sleep deeply.</em>
            </h2>
            <p className="body-text" style={{marginBottom:22,fontSize:15}}>
              The evening ritual is where tomorrow is built. Recover well tonight.
            </p>

            <div style={{background:"linear-gradient(135deg,#F0F4FF,#E8EDFF)",border:"1px solid #B0C4F8",borderRadius:"var(--r3)",padding:22,marginBottom:22}}>
              <div className="lbl" style={{color:"var(--blue)",marginBottom:5}}>AI Evening Guidance</div>
              <div style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:300,marginBottom:7,color:"var(--text)"}}>
                {profileSaved
                  ? <>Recovery in progress. <em>Your body is ready to restore.</em></>
                  : <>Time to slow down. <em>Rest is productive.</em></>
                }
              </div>
              <p className="body-sm" style={{lineHeight:1.7}}>
                Prioritise your breathing practice tonight. 4-7-8 breathing before sleep reduces time to sleep onset by an average of 40%. Add magnesium glycinate for deeper slow-wave sleep.
              </p>
            </div>

            <div style={{marginBottom:20}}>
              <div style={{fontSize:14,fontWeight:500,marginBottom:10,color:"var(--text)"}}>
                How much time do you have this evening?
              </div>
              <div className="time-sel">
                {[["2","2 minutes"],["5","5 minutes"],["10","10 minutes"],["20","20 or more"]].map(([v,l])=>(
                  <button key={v} className={`time-btn${eveningTime===v?" active":""}`} onClick={()=>setEveningTime(v)}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="routine-grid" style={{marginBottom:20}}>
              {(EVENING_ROUTINES[eveningTime]||EVENING_ROUTINES["10"]).map((r,i)=>(
                <div key={i} className="routine-card" onClick={()=>{
                  setAiMode(r.cat==="yoga"?"yoga":r.cat==="breathing"?"breathing":r.cat==="meditation"?"meditation":r.cat==="mind"?"brain":"wellness");
                  setMsgs([INIT_MSG]);
                  go("coach");
                  showToast("Opening AI coach for: "+r.name);
                }}>
                  <div className="routine-icon">{r.icon}</div>
                  <div className="routine-name">{r.name}</div>
                  <div className="routine-dur">{r.dur}</div>
                  <div className="body-sm" style={{marginTop:6,lineHeight:1.55}}>{r.desc}</div>
                  <div style={{marginTop:10}}>
                    <span className="badge" style={{background:"rgba(37,99,235,.08)",color:"var(--blue)",border:"1px solid rgba(37,99,235,.2)"}}>Begin →</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Reflection */}
            <div className="card" style={{marginBottom:14}}>
              <div style={{fontSize:14,fontWeight:500,marginBottom:14}}>✍️ Evening Reflection</div>
              <div style={{marginBottom:12}}>
                <div className="field-lbl">What went well today?</div>
                <textarea
                  className="reflection-inp"
                  rows={3}
                  placeholder="Write freely — even one sentence counts..."
                  value={reflection}
                  onChange={e=>setReflection(e.target.value)}
                />
              </div>
              <div>
                <div className="field-lbl">I am grateful for...</div>
                <textarea
                  className="reflection-inp"
                  rows={2}
                  placeholder="Three specific things you appreciate today..."
                  value={gratitude}
                  onChange={e=>setGratitude(e.target.value)}
                />
              </div>
              {(reflection||gratitude)&&(
                <button
                  className="btn btn-outline btn-sm"
                  style={{marginTop:12}}
                  onClick={()=>{showToast("✓ Evening reflection saved");}}
                >
                  Save Reflection ✓
                </button>
              )}
            </div>

            {/* Sleep prep tips */}
            <div style={{background:"rgba(61,214,163,.06)",border:"1px solid rgba(61,214,163,.15)",borderRadius:"var(--r2)"}} style={{marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:500,marginBottom:11,color:"var(--green)"}}>🌙 Sleep Optimisation Checklist</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[
                  "Screen-free 30 minutes before bed — blue light disrupts melatonin",
                  "Room temperature between 16 and 19°C for optimal sleep architecture",
                  "Magnesium glycinate 200mg — the gentlest sleep mineral supplement",
                  "Chamomile or ashwagandha tea — traditional wind-down allies",
                  "4-7-8 breathing in bed — typically induces sleep within 2 minutes",
                ].map((t,i)=>(
                  <div key={i} style={{display:"flex",gap:8,fontSize:13,color:"var(--text2)",fontWeight:300,alignItems:"flex-start"}}>
                    <span style={{color:"var(--green)",flexShrink:0,marginTop:2}}>✓</span>{t}
                  </div>
                ))}
              </div>

            </div>

            <button className="btn btn-gold" style={{width:"100%"}} onClick={()=>go("coach")}>
              Ask AI Coach for Evening Guidance →
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          AI COACH PAGE
      ══════════════════════════════════════════════════ */}
            {page==="coach"&&(
        <div className="coach-page">
          {/* App bar with back button */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 14px 7px",background:"var(--void)",borderBottom:"1px solid rgba(255,255,255,.04)",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button
                onClick={()=>go("home")}
                style={{background:"none",border:"none",color:"var(--cd)",fontSize:20,cursor:"pointer",padding:"2px 6px 2px 0",lineHeight:1}}
              >
                {"←"}
              </button>
              <span style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:400,color:"var(--gold)",letterSpacing:".12em"}}>VITÁL</span>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-ghost btn-sm" onClick={()=>go("pricing")} style={{fontSize:12}}>Try Free</button>
              <button className="btn btn-gold btn-sm" onClick={()=>go("pricing")} style={{fontSize:12}}>Get Pro</button>
            </div>
          </div>

          {/* Scrollable mode tabs */}
          <div className="coach-modes">
            {AI_MODES.map(m=>(
              <button
                key={m.id}
                className={`mode-btn${aiMode===m.id?" active":""}`}
                onClick={()=>{setAiMode(m.id);setMsgs([INIT_MSG])}}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>

          <div className="chat-win">


            {/* Messages - fills all remaining space */}
            <div className="chat-msgs">
              {msgs.map((m,i)=>(
                <div key={i} className={`chat-msg${m.role==="user"?" user":""}`}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:m.role==="user"?"flex-end":"flex-start",maxWidth:"86%",gap:3}}>
                    <div className={`bubble${m.role==="user"?" user":" ai"}`}>
                      {m.text}
                    </div>
                    {m.role==="ai"&&i>0&&(
                      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                        <button onClick={()=>{if(typeof window!="undefined"&&"speechSynthesis" in window){speak(m.text);}else{showToast("Voice playback works when VITAL is on your phone");}}} style={{background:"none",border:"none",color:"rgba(245,240,232,.4)",fontSize:11,cursor:"pointer",padding:"2px 4px",display:"flex",alignItems:"center",gap:4,fontFamily:"var(--fb)"}}>
                          <span>🔊 Read aloud</span>
                        </button>
                        {m.yt&&(
                          <a
                            href={m.yt}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{display:"inline-flex",alignItems:"center",gap:4,color:"#FF6B6B",fontSize:11,textDecoration:"none",padding:"2px 4px"}}
                          >
                            ▶ Watch on YouTube
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {aiLoading&&(
                <div className="chat-msg">
                  <div className="bubble-av">{AI_MODES.find(m=>m.id===aiMode)?.icon||"🧬"}</div>
                  <div className="bubble ai">
                    <div className="typing">
                      <div className="dot"/><div className="dot"/><div className="dot"/>
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef}/>
            </div>

            {/* Quick prompt chips - horizontal scroll */}
            <div className="chat-prompts">
              {(AI_PROMPTS[aiMode]||AI_PROMPTS.wellness).map(p=>(
                <button key={p} className="chat-prompt" onClick={()=>sendChat(p)}>{p}</button>
              ))}
            </div>

            {/* Input bar pinned at bottom */}
            <div className="chat-inp-row">
              <input
                className="chat-inp"
                value={inp}
                onChange={e=>setInp(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendChat()}
                placeholder={`Message ${AI_MODES.find(m=>m.id===aiMode)?.label||"VITÁL"}...`}
              />
              <button
                className="chat-send"
                onClick={()=>sendChat()}
                disabled={aiLoading||!inp.trim()}
              >
                {aiLoading?<span className="spinner"/>:"↑"}
              </button>
            </div>

            {/* Tiny disclaimer tab - not intrusive */}
            <div className="chat-disc">
              Wellness info only ·{" "}
              <span
                style={{color:"var(--gold)",cursor:"pointer",textDecoration:"underline"}}
                onClick={()=>setModal("disclaimer")}
              >
                Medical Disclaimer
              </span>
            </div>
          </div>
        </div>
      )}


      {/* ══════════════════════════════════════════════════
          HEALTH PROFILE PAGE (No Wearable Needed)
      ══════════════════════════════════════════════════ */}
      {page==="profile"&&(
        <div className="page">
          <div className="profile-page wrap">
            <div className="lbl">Health Profile</div>
            <h2 className="h2" style={{marginBottom:8}}>
              Your personal <em>wellness data.</em>
            </h2>
            <p className="body-text" style={{marginBottom:6,fontSize:15}}>
              All fields are optional. No wearable needed. Enter what you know — your AI coach uses this to personalise every recommendation.
            </p>
            <p style={{fontSize:13,color:"var(--text3)",marginBottom:24,fontWeight:300}}>
              Data stays on your device only. Never shared. Never sold.
              {" "}<span style={{color:"var(--gold)",cursor:"pointer",textDecoration:"underline"}} onClick={()=>setModal("privacy")}>Privacy Policy</span>
            </p>

            {/* Body Measurements */}
            <div className="card" style={{marginBottom:14}}>
              <div style={{fontSize:14,fontWeight:500,color:"var(--gold)",marginBottom:4}}>
                Body Measurements
                <span style={{fontSize:12,color:"var(--text3)",fontWeight:300,marginLeft:8}}>(optional)</span>
              </div>
              <p className="body-sm" style={{marginBottom:16}}>
                Used to personalise nutrition and exercise recommendations. No requirement to fill these in.
              </p>
              <div className="pf-grid" style={{display:"grid",gap:12}}>
                {[["Weight","weight","kg","e.g. 72"],["Height","height","cm","e.g. 175"],["Resting HR","resting_hr","bpm","e.g. 62"]].map(([lbl,key,unit,ph])=>(
                  <div key={key}>
                    <div className="field-lbl">{lbl} ({unit})</div>
                    <input
                      className="field-inp"
                      placeholder={ph}
                      value={profile[key]||""}
                      onChange={e=>setProfile(p=>({...p,[key]:e.target.value}))}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Readings */}
            <div className="card" style={{marginBottom:14}}>
              <div style={{fontSize:14,fontWeight:500,color:"var(--gold)",marginBottom:4}}>
                Clinical Readings
                <span style={{fontSize:12,color:"var(--text3)",fontWeight:300,marginLeft:8}}>(from your doctor or home monitor — optional)</span>
              </div>
              <p className="body-sm" style={{marginBottom:16}}>
                VITÁL uses this for wellness context only — not clinical interpretation.
              </p>
              <div className="pf-grid" style={{display:"grid",gap:12}}>
                {[["BP Systolic","bp_sys","mmHg","e.g. 120"],["BP Diastolic","bp_dia","mmHg","e.g. 80"],["Blood Glucose","glucose","mmol/L","e.g. 5.4"]].map(([lbl,key,unit,ph])=>(
                  <div key={key}>
                    <div className="field-lbl">{lbl} ({unit})</div>
                    <input
                      className="field-inp"
                      placeholder={ph}
                      value={profile[key]||""}
                      onChange={e=>setProfile(p=>({...p,[key]:e.target.value}))}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Feel Sliders */}
            <div className="card" style={{marginBottom:14}}>
              <div style={{fontSize:14,fontWeight:500,color:"var(--gold)",marginBottom:4}}>How Do You Feel Right Now?</div>
              <p className="body-sm" style={{marginBottom:20}}>
                No wearable needed — these sliders replace wearable data. Update them each morning and evening. Your AI adapts instantly.
              </p>
              {[
                {key:"energy",lbl:"Energy Level",low:"Exhausted",high:"Energised",icon:"⚡"},
                {key:"stress",lbl:"Stress Level",low:"Very calm",high:"Very stressed",icon:"🧠"},
                {key:"mood",lbl:"Mood",low:"Low mood",high:"Great mood",icon:"😊"},
              ].map(s=>(
                <div key={s.key} className="slider-row">
                  <div className="slider-top">
                    <span style={{fontSize:14,fontWeight:400}}>{s.icon} {s.lbl}</span>
                    <span className="slider-val">{profile[s.key]}/10</span>
                  </div>
                  <input
                    type="range" min={1} max={10} step={1}
                    value={profile[s.key]||5}
                    onChange={e=>setProfile(p=>({...p,[s.key]:e.target.value}))}
                    style={{width:"100%"}}
                  />
                  <div className="slider-range">
                    <span>{s.low}</span><span>{s.high}</span>
                  </div>
                </div>
              ))}
              <div className="slider-row">
                <div className="slider-top">
                  <span style={{fontSize:14,fontWeight:400}}>😴 Hours slept last night</span>
                  <span className="slider-val">{profile.sleep_hours}h</span>
                </div>
                <input
                  type="range" min={4} max={10} step={0.5}
                  value={profile.sleep_hours||7}
                  onChange={e=>setProfile(p=>({...p,sleep_hours:e.target.value}))}
                  style={{width:"100%"}}
                />
                <div className="slider-range"><span>4 hours</span><span>10 hours</span></div>
              </div>
              <div className="slider-row" style={{marginBottom:0}}>
                <div className="slider-top">
                  <span style={{fontSize:14,fontWeight:400}}>💧 Water intake today</span>
                  <span className="slider-val">{profile.water}L</span>
                </div>
                <input
                  type="range" min={0} max={4} step={0.25}
                  value={profile.water||2}
                  onChange={e=>setProfile(p=>({...p,water:e.target.value}))}
                  style={{width:"100%"}}
                />
                <div className="slider-range"><span>0 L</span><span>4 L</span></div>
              </div>
            </div>

            {/* Schedule */}
            <div className="card" style={{marginBottom:14}}>
              <div style={{fontSize:14,fontWeight:500,color:"var(--gold)",marginBottom:4}}>Your Schedule</div>
              <p className="body-sm" style={{marginBottom:16}}>
                Your AI will never suggest a 45-minute session if you only have 5 minutes. It adapts to your real life.
              </p>
              <div className="pf-grid" style={{display:"grid",gap:12,marginBottom:16}}>
                {[["I wake up at","wake_time","time"],["I sleep at","bed_time","time"],["Wellness mins per day","mins_available","number"]].map(([lbl,key,type])=>(
                  <div key={key}>
                    <div className="field-lbl">{lbl}</div>
                    <input
                      type={type}
                      className="field-inp"
                      value={profile[key]||""}
                      placeholder={type==="number"?"10":""}
                      onChange={e=>setProfile(p=>({...p,[key]:e.target.value}))}
                    />
                  </div>
                ))}
              </div>
              <div className="field-lbl" style={{marginBottom:10}}>My activity level</div>
              <div className="act-grid">
                {[["sedentary","Mostly sitting"],["light","Light activity"],["moderate","Moderately active"],["active","Very active"],["athlete","Athlete"]].map(([val,lbl])=>(
                  <button
                    key={val}
                    className={`act-btn${profile.fitness_level===val?" active":""}`}
                    onClick={()=>setProfile(p=>({...p,fitness_level:val}))}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn btn-gold-lg"
              style={{width:"100%"}}
              onClick={()=>{setProfileSaved(true);showToast("✓ Profile saved — your AI is now personalised to you!");go("morning")}}
            >
              Save Profile and Personalise My AI →
            </button>
            <p style={{fontSize:12,color:"var(--text3)",textAlign:"center",marginTop:10,fontWeight:300}}>
              All data is stored locally on your device only.
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          EXERCISES PAGE
      ══════════════════════════════════════════════════ */}
      {page==="exercises"&&(
        <div className="page">
          <div className="ex-page wrap">
            <div className="lbl">Wellness Exercise Library</div>
            <h2 className="h2" style={{marginBottom:8}}>
              Your complete <em>wellness toolkit.</em>
            </h2>
            <p className="body-text" style={{marginBottom:8,fontSize:15}}>
              Yoga, breathwork, Tai Chi, and meditation — with beginner guides and YouTube tutorials for every practice.
            </p>


            <div className="cat-tabs">
              {[["yoga","🧘 Yoga (6)"],["breathing","🫁 Breathwork (6)"],["taichi","🥋 Tai Chi (4)"]].map(([id,l])=>(
                <button key={id} className={`cat-tab${exCat===id?" active":""}`} onClick={()=>setExCat(id)}>{l}</button>
              ))}
            </div>

            {exCat==="yoga"&&(
              <div>
                <div style={{fontSize:12,fontWeight:500,color:"var(--gold)",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
                  Yoga Flows
                  <span className="badge badge-green">Free for all members</span>
                </div>
                <div className="ex-grid">
                  {YOGA_DATA.map(y=>(
                    <div key={y.name} className="ex-card" onClick={()=>setExDetail({...y,cat:"yoga"})}>
                      <div className="ex-name">{y.name}</div>
                      <div className="ex-level">{y.level}</div>
                      <div className="ex-benefit">{y.benefit}</div>
                      <div style={{marginBottom:8}}>
                        {y.poses.slice(0,4).map((p,i)=>(
                          <div key={i} className="ex-step">
                            <span style={{color:"var(--gold)",flexShrink:0}}>·</span>
                            <span>{p}</span>
                          </div>
                        ))}
                        {y.poses.length>4&&<div className="ex-step" style={{color:"var(--text3)",fontStyle:"italic"}}>+ {y.poses.length-4} more steps</div>}
                      </div>
                      <div className="ex-tip">💡 {y.tip}</div>
                      {y.warn&&<div className="ex-warn">⚠️ {y.warn}</div>}
                      <div className="ex-btns" style={{gap:7}}>
                        <span className="badge badge-gold" style={{cursor:"pointer"}}>📖 Full Guide →</span>
                        {y.yt&&(
                          <a
                            href={y.yt}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{display:"inline-flex",alignItems:"center",gap:4,background:"rgba(220,38,38,.1)",border:"1px solid rgba(220,38,38,.25)",color:"#FF6B6B",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:500,textDecoration:"none"}}
                            onClick={e=>e.stopPropagation()}
                          >
                            ▶ YouTube
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {exCat==="breathing"&&(
              <div>
                <div style={{fontSize:12,fontWeight:500,color:"var(--gold)",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
                  Breathwork Techniques
                  <span className="badge badge-green">Free for all members</span>
                </div>
                <div className="ex-grid">
                  {BREATH_DATA.map(b=>(
                    <div key={b.name} className="ex-card" onClick={()=>setExDetail({...b,cat:"breathing",poses:b.steps})}>
                      <div className="ex-name">{b.name}</div>
                      <div className="ex-level">{b.level}</div>
                      <div style={{marginBottom:8}}>
                        {b.steps.slice(0,4).map((s,i)=>(
                          <div key={i} className="ex-step">
                            <span style={{color:"var(--green)",fontWeight:600,fontSize:10,flexShrink:0}}>{i+1}.</span>
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                      <div className="ex-tip">🔬 {b.science}</div>
                      <div className="ex-warn">⚠️ {b.warn}</div>
                      <div className="ex-btns" style={{gap:7}}>
                        <span className="badge badge-green" style={{cursor:"pointer"}}>📖 Full Guide →</span>
                        {b.yt&&(
                          <a
                            href={b.yt}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{display:"inline-flex",alignItems:"center",gap:4,background:"rgba(220,38,38,.1)",border:"1px solid rgba(220,38,38,.25)",color:"#FF6B6B",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:500,textDecoration:"none"}}
                            onClick={e=>e.stopPropagation()}
                          >
                            ▶ YouTube
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {exCat==="taichi"&&(
              <div>
                <div style={{fontSize:12,fontWeight:500,color:"var(--gold)",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
                  Tai Chi and Qigong
                  <span className="badge badge-green">Free — Ideal for seniors</span>
                </div>
                <p className="body-sm" style={{marginBottom:16,lineHeight:1.65}}>
                  Tai Chi and Qigong are among the most researched movement practices for older adults — proven to improve balance, reduce fall risk, lower blood pressure, and support joint health. No equipment needed. Can be done standing or seated.
                </p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                  {TAICHI_DATA.map(t=>(
                    <div key={t.name} className="ex-card" onClick={()=>setExDetail({...t,cat:"senior",poses:t.poses})}>
                      <div className="ex-name">{t.name}</div>
                      <div className="ex-level">{t.level}</div>
                      <div className="ex-benefit">{t.benefit}</div>
                      <div style={{marginBottom:8}}>
                        {t.poses.slice(0,4).map((p,i)=>(
                          <div key={i} className="ex-step">
                            <span style={{color:"var(--gold)",flexShrink:0}}>·</span>
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                      <div className="ex-tip">💡 {t.tip}</div>
                      <div className="ex-warn">⚠️ {t.warn}</div>
                      <div className="ex-btns" style={{gap:7}}>
                        <span className="badge badge-gold" style={{cursor:"pointer"}}>📖 Full Guide →</span>
                        {y.yt&&(
                          <a
                            href={y.yt}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{display:"inline-flex",alignItems:"center",gap:4,background:"rgba(220,38,38,.1)",border:"1px solid rgba(220,38,38,.25)",color:"#FF6B6B",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:500,textDecoration:"none"}}
                            onClick={e=>e.stopPropagation()}
                          >
                            ▶ YouTube
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{marginTop:16,textAlign:"center"}}>
              <span style={{fontSize:12,color:"var(--cf)",fontWeight:300}}>Tap any exercise to see the full guide, YouTube tutorials, and voice read-out</span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          PRICING PAGE
      ══════════════════════════════════════════════════ */}
      {page==="pricing"&&(
        <div className="page pricing-page">
          <div className="wrap">
            <div className="section">
              <div style={{textAlign:"center",marginBottom:32}}>
                <div className="lbl" style={{textAlign:"center"}}>Transparent Pricing</div>
                <h2 className="h2" style={{textAlign:"center",marginBottom:10}}>
                  Start free. <em>Scale when ready.</em>
                </h2>
                <p className="body-text" style={{textAlign:"center",fontSize:15,maxWidth:500,margin:"0 auto 8px"}}>
                  Free forever tier. 14-day free trial on Pro and Elite. Cancel anytime.
                </p>
                <p style={{textAlign:"center",fontSize:13,color:"var(--text3)",fontWeight:300}}>
                  14-day free trial on all paid plans. No card required to start free.
                </p>
              </div>

              <div className="toggle-row">
                <span className={`toggle-lbl${!annual?" active":""}`}>Monthly</span>
                <button className={`toggle${annual?" on":""}`} onClick={()=>setAnnual(b=>!b)}>
                  <div className="toggle-dot"/>
                </button>
                <span className={`toggle-lbl${annual?" active":""}`}>Annual</span>
                <span className="save-badge">Save up to 39%</span>
              </div>

              <div className="price-grid">
                {PLANS.map(plan=>(
                  <div key={plan.id} className={`price-card${plan.featured?" featured":""}`}>
                    {plan.fbadge&&<div className="price-popular" style={{background:"var(--green)"}}>{plan.fbadge}</div>}
                    {plan.badge&&<div className="price-popular">{plan.badge}</div>}
                    <div className="price-tier">{plan.tier}</div>
                    {plan.price===0
                      ? <div style={{fontFamily:"var(--fd)",fontSize:36,fontWeight:300,color:"var(--text)",marginBottom:3}}>Free</div>
                      : <div className="price-amount">
                          <sup>$</sup>{annual?plan.ap:plan.price}
                        </div>
                    }
                    <div className="price-period">
                      {plan.price===0?"forever free":`per month · ${annual?"billed annually":"billed monthly"}`}
                    </div>
                    {plan.price>0&&annual&&(
                      <div className="price-annual">
                        = ${(plan.ap*12).toFixed(0)}/year · Save ${((plan.price-plan.ap)*12).toFixed(0)}
                      </div>
                    )}
                    <p className="body-sm" style={{marginBottom:16,marginTop:6,lineHeight:1.55}}>{plan.desc}</p>
                    <div className="price-divider"/>
                    {plan.features.map((f,i)=>(
                      <div key={i} className="price-feature">
                        <span className={f.i?"price-chk":"price-x"}>{f.i?"✓":"○"}</span>
                        <span style={{color:f.i?"var(--text2)":"var(--text3)"}}>{f.t}</span>
                      </div>
                    ))}
                    <button
                      className={`btn btn-${plan.btn} btn-sm`}
                      style={{width:"100%",marginTop:20,padding:"12px",fontSize:14}}
                      onClick={()=>{
                        if(plan.id==="free"){go("morning");}
                        else showToast("Starting 14-day free trial — redirecting to checkout...");
                      }}
                    >
                      {plan.cta}
                    </button>
                  </div>
                ))}
              </div>




            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          REFERRAL PAGE
      ══════════════════════════════════════════════════ */}
      {page==="referral"&&(
        <div className="page">
          <div className="ref-page wrap">
            <div className="lbl">Referral Program</div>
            <div style={{background:"rgba(201,168,76,.07)",border:"1px solid rgba(201,168,76,.15)",borderRadius:"var(--r2)"}} style={{textAlign:"center",marginBottom:20}}>
              <h2 className="h2" style={{marginBottom:10}}>
                Share wellness. <em>Earn rewards.</em>
              </h2>
              <p className="body-text" style={{maxWidth:380,margin:"0 auto",fontSize:15}}>
                Earn R 890 credit for every friend who subscribes to any paid plan. They get their first month free.
              </p>
              <div className="ref-link-row" style={{maxWidth:420,margin:"16px auto 0"}}>
                <input className="ref-inp" readOnly value="https://vitalhealth.app/r/MY2026"/>
                <button
                  className={`copy-btn${copied?" copied":""}`}
                  onClick={()=>{
                    navigator.clipboard.writeText("https://vitalhealth.app/r/MY2026").catch(()=>{});
                    setCopied(true);
                    showToast("✓ Link copied to clipboard!");
                    setTimeout(()=>setCopied(false),2000);
                  }}
                >
                  {copied?"✓ Copied!":"Copy Link"}
                </button>
              </div>
              <div className="share-row" style={{maxWidth:360,margin:"14px auto 0"}}>
                {[["📧","Email"],["💬","WhatsApp"],["🐦","X"],["💼","LinkedIn"]].map(([ic,n])=>(
                  <div key={n} className="share-btn" style={{background:"var(--white)"}} onClick={()=>showToast(`Opening ${n} to share your VITÁL link...`)}>
                    <div style={{fontSize:16,marginBottom:3}}>{ic}</div>
                    <div>{n}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ref-stat-grid" style={{marginBottom:20}}>
              <div className="ref-stat"><div className="ref-stat-val">4</div><div className="ref-stat-lbl">Referrals</div></div>
              <div className="ref-stat"><div className="ref-stat-val" style={{color:"var(--green)"}}>R 1,780</div><div className="ref-stat-lbl">Credits Earned</div></div>
              <div className="ref-stat"><div className="ref-stat-val" style={{color:"var(--blue)"}}>2</div><div className="ref-stat-lbl">Converting</div></div>
            </div>

            <div style={{background:"rgba(61,214,163,.06)",border:"1px solid rgba(61,214,163,.15)",borderRadius:"var(--r2)"}} style={{marginBottom:16}}>
              <div style={{fontSize:14,fontWeight:500,marginBottom:12,color:"var(--green)"}}>Top Referral Tips</div>
              {[
                "Share your morning vitality score — curiosity drives clicks every time",
                "Post your wellness streak milestone — accountability challenges spread fast",
                "WhatsApp your wellness circle — 80% of South Africa is on WhatsApp daily",
                "LinkedIn post about energy, focus, or sleep improvement with VITÁL",
                "Share your AI morning protocol screenshot — people love personalised content",
              ].map((t,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:8,fontSize:14,color:"var(--text2)",fontWeight:300,alignItems:"flex-start"}}>
                  <span style={{color:"var(--green)",flexShrink:0}}>→</span>{t}
                </div>
              ))}
            </div>

            <div className="card">
              <div style={{fontSize:14,fontWeight:500,marginBottom:10}}>Why People Share VITÁL</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[
                  {icon:"🌅",t:"Morning rituals that actually work"},
                  {icon:"🌙",t:"Evening wind-downs that improve sleep"},
                  {icon:"🤖",t:"AI that feels genuinely personal"},
                  {icon:"🥋",t:"Tai Chi my parents can actually use"},
                  {icon:"🫁",t:"Breathwork that calms in 4 minutes"},
                  {icon:"🌿",t:"Herbal guidance I trust"},
                ].map((r,i)=>(
                  <div key={i} style={{display:"flex",gap:9,alignItems:"flex-start",fontSize:13,color:"var(--text2)",fontWeight:300}}>
                    <span style={{fontSize:16,flexShrink:0}}>{r.icon}</span>{r.t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-logo">VITÁL ®</div>
          <div className="footer-links">
            <span className="footer-link" onClick={()=>go("morning")}>Morning</span>
            <span className="footer-link" onClick={()=>go("evening")}>Evening</span>
            <span className="footer-link" onClick={()=>go("exercises")}>Exercises</span>
            <span className="footer-link" onClick={()=>go("pricing")}>Pricing</span>
            <span className="footer-link" onClick={()=>go("referral")}>Referrals</span>
            <span className="footer-link" onClick={()=>setModal("terms")}>Terms</span>
            <span className="footer-link" onClick={()=>setModal("privacy")}>Privacy</span>
            <button
              style={{background:"var(--amd)",border:"1px solid var(--amdb)",color:"var(--amber)",padding:"5px 14px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"var(--fb)",fontWeight:500,letterSpacing:".02em"}}
              onClick={()=>setModal("disclaimer")}
            >
              ⚠️ Medical Disclaimer
            </button>
          </div>
          <div className="footer-copy">
            © 2026 VITÁL Health · hello@vitalhealth.app
          </div>
        </div>
      </footer>
    </>
  );
}
