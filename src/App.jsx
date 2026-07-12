import { useState, useRef, useMemo, useEffect } from "react";
import { track } from "@vercel/analytics";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE (cloud accounts + permanent data) ───
const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_KEY;
// If env vars are missing the app still runs fully in local-only mode (never breaks)
const supabase = (SB_URL && SB_KEY) ? createClient(SB_URL, SB_KEY) : null;
const CLOUD_ON = !!supabase;

// ─── POSTHOG ANALYTICS ─── (free funnel events; this key is write-only & safe in public code)
if (typeof window !== "undefined" && !window.__vitalPostHog) {
  window.__vitalPostHog = true;
  try {
    const phs = document.createElement("script");
    phs.textContent = `!function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="rn sn init kn Qr wn Cn yn capture calculateEventProperties Rn register register_once register_for_session unregister unregister_for_session An getFeatureFlag getFeatureFlagPayload getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync Fn identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty On En createPersonProfile setInternalOrTestUser Ln gn $n opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing In debug Kr Pn getPageViewId captureTraceFeedback captureTraceMetric vn".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init("phc_kDCUBZYuFnUrAAETf3JNHUwebQtzCfdtcRBijMmt8Q5M",{api_host:"https://us.i.posthog.com",defaults:"2026-05-30",person_profiles:"identified_only",disable_session_recording:true});`;
    document.head.appendChild(phs);
  } catch {}
}

/* ═══════════════════════════════════════════════════════════════
   VITÁL v10 — AI Wellness Companion · ABC UP PTY LTD © 2026
   Light theme · Bold black text · All features · Built to last
═══════════════════════════════════════════════════════════════ */

const PAYSTACK = {
  // Founder pricing (first 100 — used while FOUNDER_MODE is on)
  founder_monthly: "https://paystack.shop/pay/lul6fb7ney",
  founder_annual:  "https://paystack.shop/pay/zti9jqkavw",
  // Regular pricing (used after FOUNDER_MODE is turned off)
  pro_monthly: "https://paystack.shop/pay/e5ib6ecwbc",
  pro_annual:  "https://paystack.shop/pay/pw8hour4r9",
};

const WELLNESS_GOALS = [
  {id:"stress",label:"Stress & Anxiety",icon:"🧘"},
  {id:"sleep",label:"Better Sleep",icon:"💤"},
  {id:"energy",label:"Energy & Vitality",icon:"⚡"},
  {id:"burnout",label:"Burnout Recovery",icon:"🌱"},
  {id:"focus",label:"Focus & Clarity",icon:"🧠"},
  {id:"longevity",label:"Healthy Ageing",icon:"🌿"},
  {id:"recovery",label:"Pain & Recovery",icon:"💪"},
  {id:"general",label:"General Wellness",icon:"✨"},
];

const FREE_DAILY_LIMIT = 5;

// ─── FOUNDER LAUNCH ─── (first 100 subscribers lock their rate forever)
// Flip FOUNDER_MODE to false once the first 100 founding members are reached.
const FOUNDER_MODE = true;
const FOUNDER_SPOTS = 100;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#E2E2E6;--surface:#FFFFFF;--surface2:#F4F4F6;--surface3:#EAEAEE;
  --text:#0A0A0A;--text2:#1C1C1C;--text3:#555555;
  --border:rgba(0,0,0,.12);--border2:rgba(0,0,0,.22);
  --gold:#C9A84C;--gold-dark:#8A6D1B;--gold-bg:#FBF6E8;--gb:rgba(201,168,76,.28);
  --green:#1FA877;--green-bg:#E6F6EF;
  --blue:#3B7DD8;--purple:#7B5FD0;--red:#D63B4F;--amber:#C77D00;
  --fd:'Playfair Display',Georgia,serif;--fb:'DM Sans',system-ui,sans-serif;
  --r1:6px;--r2:10px;--r3:16px;--r4:22px;
  --shadow:0 1px 3px rgba(0,0,0,.10),0 4px 14px rgba(0,0,0,.06);
  --shadow2:0 8px 30px rgba(0,0,0,.12);
}
html{scroll-behavior:smooth;overflow-x:hidden}
body{background:var(--bg);color:var(--text);font-family:var(--fb);font-size:16px;line-height:1.6;font-weight:500;overflow-x:hidden;-webkit-font-smoothing:antialiased}
button{cursor:pointer;font-family:var(--fb)}
input,textarea,select{font-family:var(--fb)}
::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:none;border-radius:var(--r2);font-family:var(--fb);font-weight:700;transition:all .2s;cursor:pointer;white-space:nowrap;line-height:1}
.btn-gold{background:var(--gold);color:#0A0A0A;padding:13px 26px;font-size:15px}
.btn-gold:hover{background:#D8B85C;transform:translateY(-1px);box-shadow:var(--shadow)}
.btn-gold:disabled{opacity:.45;cursor:not-allowed;transform:none;box-shadow:none}
.btn-gold-lg{background:var(--gold);color:#0A0A0A;padding:16px 32px;font-size:16px;font-weight:700}
.btn-gold-lg:hover{background:#D8B85C;transform:translateY(-1px);box-shadow:var(--shadow2)}
.btn-outline{background:var(--surface);color:var(--text);border:2px solid var(--border2);padding:11px 24px;font-size:14px;font-weight:700}
.btn-outline:hover{border-color:var(--gold);color:var(--gold-dark)}
.btn-sm{padding:9px 18px;font-size:13px;border-radius:var(--r1)}
.btn-green{background:var(--green);color:#fff;padding:13px 26px;font-size:15px;font-weight:700}
.btn-green:hover{background:#1A9268}

.nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(255,255,255,.97);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);height:62px;display:flex;align-items:center;padding:0 16px;gap:10px;box-shadow:0 1px 8px rgba(0,0,0,.06)}
.nav-logo{font-family:var(--fd);font-size:24px;font-weight:600;color:var(--gold-dark);letter-spacing:.06em;cursor:pointer;flex-shrink:0}
.nav-links{display:flex;gap:2px;overflow-x:auto;flex:1;scrollbar-width:none}
.nav-links::-webkit-scrollbar{display:none}
.nav-btn{background:none;border:none;color:#0A0A0A;font-size:14px;padding:7px 11px;border-radius:var(--r1);white-space:nowrap;font-weight:700;transition:all .15s}
.nav-btn:hover{background:var(--gold-bg);color:var(--gold-dark)}
.nav-btn.active{color:#0A0A0A;background:var(--gold);font-weight:700}
.nav-right{display:flex;gap:8px;align-items:center;flex-shrink:0}

.page{padding-top:62px;min-height:100vh;background:var(--bg);padding-bottom:40px;animation:fadeUp .3s ease}
.wrap{max-width:1080px;margin:0 auto;padding:0 20px}
.section{padding:42px 0}
.section-sm{padding:20px 0}
.lbl{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold-dark);font-weight:700;margin-bottom:12px}
.h1{font-family:var(--fd);font-size:clamp(30px,5.5vw,52px);font-weight:500;line-height:1.1;color:var(--text)}
.h2{font-family:var(--fd);font-size:clamp(22px,4vw,36px);font-weight:500;line-height:1.15;color:var(--text)}
.h3{font-family:var(--fd);font-size:clamp(17px,2.5vw,22px);font-weight:600;color:var(--text)}
.h1 em,.h2 em,.h3 em{font-style:italic;color:var(--gold-dark)}
.body-text{font-size:15px;color:var(--text2);line-height:1.7;font-weight:500}
.body-sm{font-size:13px;color:var(--text3);line-height:1.6;font-weight:500}

.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r3);padding:24px;box-shadow:var(--shadow);transition:all .2s}
.card-gold{background:var(--gold-bg);border:1.5px solid var(--gold);border-radius:var(--r3);padding:24px;box-shadow:var(--shadow)}
.card-green{background:var(--green-bg);border:1.5px solid var(--green);border-radius:var(--r3);padding:24px}

.gate{position:fixed;inset:0;background:rgba(40,40,45,.55);z-index:999;display:flex;align-items:flex-start;justify-content:center;padding:16px;backdrop-filter:blur(6px);overflow-y:auto}
.gate-box{background:var(--surface);border-radius:var(--r3);width:100%;max-width:540px;max-height:calc(100vh - 32px);margin:auto;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.28)}
.gate-hd{padding:24px 28px 18px;border-bottom:1px solid var(--border);background:var(--gold-bg)}
.gate-body{padding:20px 28px;overflow-y:auto;flex:1}
.gate-sec{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold-dark);margin-top:16px;margin-bottom:5px}
.gate-p{font-size:14px;color:var(--text2);line-height:1.7;font-weight:500}
.gate-hi{background:#FDF2E0;border-left:4px solid var(--amber);padding:12px 16px;margin:14px 0;border-radius:0 var(--r1) var(--r1) 0}
.gate-foot{padding:18px 28px;border-top:1px solid var(--border);background:var(--surface2)}
.gate-check{display:flex;align-items:flex-start;gap:11px;margin-bottom:14px;cursor:pointer}
.gate-chk{width:20px;height:20px;border:2px solid var(--border2);border-radius:5px;flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center;transition:all .15s;background:var(--surface)}
.gate-chk.on{background:var(--gold);border-color:var(--gold)}
.gate-chk-txt{font-size:13px;color:var(--text2);line-height:1.6;font-weight:600}

.input{width:100%;background:var(--surface);border:1.5px solid var(--border2);border-radius:var(--r2);padding:12px 14px;color:var(--text);font-size:14px;font-weight:500;outline:none;transition:border .15s}
.input:focus{border-color:var(--gold)}
.slider{width:100%;height:6px;-webkit-appearance:none;background:var(--surface3);border-radius:3px;outline:none}
.slider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:var(--gold);cursor:pointer;box-shadow:var(--shadow)}
.slider::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:var(--gold);cursor:pointer;border:none}

.modal-ov{position:fixed;inset:0;background:rgba(40,40,45,.55);z-index:800;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(5px)}

.readaloud{background:var(--gold);color:#0A0A0A;border:none;border-radius:var(--r1);padding:8px 16px;font-size:14px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:6px;box-shadow:var(--shadow)}
.readaloud:hover{background:#D8B85C;transform:translateY(-1px)}

`;

// ─── MORNING RITUALS — 3 themes, each with steps per time length ───
// Themes rotate daily so the practice feels fresh; users can also scroll to choose.
const MORNING_THEMES = [
  {
    id:"ground", name:"Grounding", icon:"🌱", blurb:"Steady, centred, calm start",
    times:{
      "2":[
        {icon:"🫁",name:"Box Breathing",dur:"2 min",desc:"Inhale 4 · Hold 4 · Exhale 4 · Hold 4",cat:"breathing"},
        {icon:"💧",name:"Hydration & Intention",dur:"1 min",desc:"Drink water. Name one intention for today.",cat:"general"},
      ],
      "5":[
        {icon:"🦶",name:"Grounding Stand",dur:"1 min",desc:"Feet flat, feel the floor. Three slow breaths.",cat:"mind"},
        {icon:"🫁",name:"Coherence Breathing",dur:"3 min",desc:"In for 5, out for 5. Settle the nervous system.",cat:"breathing"},
        {icon:"📝",name:"One Intention",dur:"1 min",desc:"Write the single most important thing for today.",cat:"mind"},
      ],
      "10":[
        {icon:"🧘",name:"Gentle Wake-Up Stretch",dur:"4 min",desc:"Neck rolls, shoulder circles, slow side bends",cat:"yoga"},
        {icon:"🫁",name:"Coherence Breathing",dur:"4 min",desc:"5-5 rhythm to ground and centre",cat:"breathing"},
        {icon:"📝",name:"Morning Intention",dur:"2 min",desc:"One goal, one feeling, one action for the day",cat:"mind"},
      ],
      "20":[
        {icon:"🧘",name:"Grounding Yoga Flow",dur:"10 min",desc:"Mountain, forward fold, low lunge, gentle twists",cat:"yoga"},
        {icon:"🫁",name:"Nadi Shodhana",dur:"6 min",desc:"Alternate nostril breathing for balance",cat:"breathing"},
        {icon:"🧠",name:"Grounding Meditation",dur:"4 min",desc:"Body scan from feet to crown, slow and present",cat:"mind"},
      ],
    },
  },
  {
    id:"energize", name:"Energizing", icon:"⚡", blurb:"Wake the body, lift the mood",
    times:{
      "2":[
        {icon:"🌬️",name:"Energizing Breath",dur:"1 min",desc:"10 quick, full breaths to wake up",cat:"breathing"},
        {icon:"🙆",name:"Big Stretch",dur:"1 min",desc:"Reach tall, open the chest, shake it out",cat:"yoga"},
      ],
      "5":[
        {icon:"🌅",name:"Sun Salutation",dur:"3 min",desc:"3 rounds to energise the whole body",cat:"yoga"},
        {icon:"🌬️",name:"Bellows Breath",dur:"1 min",desc:"Short, lively breaths for a natural lift",cat:"breathing"},
        {icon:"💪",name:"Power Pose",dur:"1 min",desc:"Stand tall, arms wide, breathe. Own the day.",cat:"mind"},
      ],
      "10":[
        {icon:"🌅",name:"Morning Sun Flow",dur:"6 min",desc:"Sun salutations into gentle warrior poses",cat:"yoga"},
        {icon:"🌬️",name:"Kapalabhati Breath",dur:"2 min",desc:"Energising skull-shining breath (gentle pace)",cat:"breathing"},
        {icon:"☀️",name:"Gratitude Boost",dur:"2 min",desc:"Three things you're excited about today",cat:"mind"},
      ],
      "20":[
        {icon:"🌅",name:"Full Sun Salutation Flow",dur:"12 min",desc:"Complete energising flow, all levels",cat:"yoga"},
        {icon:"🌬️",name:"Energising Pranayama",dur:"5 min",desc:"Bellows breath then bright breath of joy",cat:"breathing"},
        {icon:"💪",name:"Intention & Movement",dur:"3 min",desc:"Set a bold intention, then shake and dance it in",cat:"mind"},
      ],
    },
  },
  {
    id:"clarity", name:"Clarity & Focus", icon:"🧠", blurb:"Clear the mind, sharpen focus",
    times:{
      "2":[
        {icon:"🫁",name:"4-7-8 Breathing",dur:"1 min",desc:"Calm the mind, sharpen attention",cat:"breathing"},
        {icon:"🎯",name:"Top Priority",dur:"1 min",desc:"Name your one focus for the day",cat:"mind"},
      ],
      "5":[
        {icon:"🧠",name:"Focus Meditation",dur:"3 min",desc:"Rest attention on the breath, return gently",cat:"mind"},
        {icon:"🫁",name:"4-7-8 Breathing",dur:"1 min",desc:"Settle the mind before the day begins",cat:"breathing"},
        {icon:"🎯",name:"Three Priorities",dur:"1 min",desc:"Write your top 3 for today, in order",cat:"mind"},
      ],
      "10":[
        {icon:"🧠",name:"Mindful Sitting",dur:"5 min",desc:"Quiet focus practice to clear mental fog",cat:"mind"},
        {icon:"🫁",name:"Nadi Shodhana",dur:"3 min",desc:"Balance both hemispheres for clarity",cat:"breathing"},
        {icon:"🎯",name:"Day Plan",dur:"2 min",desc:"Map your 3 priorities and first small step",cat:"mind"},
      ],
      "20":[
        {icon:"🧠",name:"Clarity Meditation",dur:"8 min",desc:"Breath focus, then open awareness practice",cat:"mind"},
        {icon:"🫁",name:"Nadi Shodhana",dur:"6 min",desc:"Alternate nostril breathing for mental balance",cat:"breathing"},
        {icon:"🎯",name:"Intentional Planning",dur:"4 min",desc:"Priorities, energy check, and one thing to let go",cat:"mind"},
      ],
    },
  },
];

// ─── EVENING RITUALS — 3 themes ───
const EVENING_THEMES = [
  {
    id:"unwind", name:"Unwind", icon:"🌇", blurb:"Release the day's tension",
    times:{
      "2":[
        {icon:"🫁",name:"4-7-8 Sleep Breath",dur:"2 min",desc:"4 in · 7 hold · 8 out. Let the day go.",cat:"breathing"},
        {icon:"📵",name:"Screen Down",dur:"1 min",desc:"Phone away. One slow exhale to arrive.",cat:"mind"},
      ],
      "5":[
        {icon:"🧘",name:"Evening Wind-Down",dur:"3 min",desc:"Child's pose, supine twist, gentle folds",cat:"yoga"},
        {icon:"🫁",name:"Box Breathing",dur:"2 min",desc:"Slow the nervous system after a busy day",cat:"breathing"},
      ],
      "10":[
        {icon:"🧘",name:"Yin Wind-Down",dur:"6 min",desc:"Hold gentle poses, soften with each breath",cat:"yoga"},
        {icon:"🫁",name:"4-7-8 Breathing",dur:"2 min",desc:"Deep calming breath to release tension",cat:"breathing"},
        {icon:"📝",name:"Day Release",dur:"2 min",desc:"What went well? What are you setting down tonight?",cat:"mind"},
      ],
      "20":[
        {icon:"🧘",name:"Full Yin Sequence",dur:"12 min",desc:"Dragon, butterfly, sphinx — deep release",cat:"yoga"},
        {icon:"🫁",name:"Extended 4-7-8",dur:"4 min",desc:"Several rounds for full-body calm",cat:"breathing"},
        {icon:"📝",name:"Evening Journal",dur:"4 min",desc:"Reflect, release, and set tomorrow's intention",cat:"mind"},
      ],
    },
  },
  {
    id:"deeprest", name:"Deep Rest", icon:"🌙", blurb:"Prepare for deep sleep",
    times:{
      "2":[
        {icon:"🫁",name:"4-7-8 Sleep Breath",dur:"2 min",desc:"The classic breath for falling asleep",cat:"breathing"},
        {icon:"😴",name:"Settle In",dur:"1 min",desc:"Soften the body from head to toe",cat:"mind"},
      ],
      "5":[
        {icon:"🛌",name:"Legs Up The Wall",dur:"3 min",desc:"Calms the nervous system, eases the body",cat:"yoga"},
        {icon:"🫁",name:"4-7-8 Breathing",dur:"2 min",desc:"Slow the breath, invite sleep",cat:"breathing"},
      ],
      "10":[
        {icon:"🧠",name:"Body Scan",dur:"5 min",desc:"Release each part of the body in turn",cat:"meditation"},
        {icon:"🫁",name:"4-7-8 Breathing",dur:"3 min",desc:"Deep parasympathetic wind-down",cat:"breathing"},
        {icon:"🌙",name:"Sleep Intention",dur:"2 min",desc:"Let go of today. Welcome rest.",cat:"mind"},
      ],
      "20":[
        {icon:"🧠",name:"Yoga Nidra",dur:"10 min",desc:"Guided deep-rest body scan for sleep",cat:"meditation"},
        {icon:"🫁",name:"NSDR Wind-Down",dur:"6 min",desc:"Non-sleep deep rest to ease into the night",cat:"breathing"},
        {icon:"🌙",name:"Herbal Wind-Down",dur:"4 min",desc:"Calming tea ritual, then settle the mind",cat:"herbal"},
      ],
    },
  },
  {
    id:"gratitude", name:"Gratitude & Reflect", icon:"🙏", blurb:"End the day with warmth",
    times:{
      "2":[
        {icon:"🙏",name:"Three Gratitudes",dur:"1 min",desc:"Name three good things from today",cat:"mind"},
        {icon:"🫁",name:"Calming Breath",dur:"1 min",desc:"Three slow breaths to close the day",cat:"breathing"},
      ],
      "5":[
        {icon:"🙏",name:"Gratitude Practice",dur:"2 min",desc:"Three things, specific — really feel them",cat:"mind"},
        {icon:"🧘",name:"Gentle Stretch",dur:"2 min",desc:"Soft neck and shoulder release",cat:"yoga"},
        {icon:"🫁",name:"Calming Breath",dur:"1 min",desc:"Slow exhales to wind down",cat:"breathing"},
      ],
      "10":[
        {icon:"📝",name:"Reflection Journal",dur:"4 min",desc:"What went well? What did you learn today?",cat:"mind"},
        {icon:"🙏",name:"Gratitude Practice",dur:"3 min",desc:"Three specific gratitudes, felt fully",cat:"mind"},
        {icon:"🫁",name:"Calming Breath",dur:"2 min",desc:"Settle into a peaceful evening",cat:"breathing"},
      ],
      "20":[
        {icon:"📝",name:"Evening Journal",dur:"8 min",desc:"Reflect on the day, release, and give thanks",cat:"mind"},
        {icon:"🙏",name:"Loving-Kindness",dur:"6 min",desc:"Send warm wishes to yourself and others",cat:"meditation"},
        {icon:"🫁",name:"Calming Breath",dur:"4 min",desc:"Long, slow exhales to prepare for rest",cat:"breathing"},
      ],
    },
  },
];
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

const INIT_MSG = {role:"ai",text:"Namaste. I am your VITÁL Intelligence Engine.\n\nI draw from Ayurveda, herbal wisdom, yoga, breathwork, meditation, sleep science, and longevity research — all personalised to you.\n\nWhat would you like to explore today?"};

// Tappable suggestion chips per AI mode — quick starts, users can still type their own
const AI_SUGGESTIONS = {
  wellness: ["I feel stressed and tense", "How can I boost my energy?", "Help me build a daily routine", "I'm feeling burnt out"],
  herbal: ["Herbs for better sleep", "Natural remedies for stress", "What helps with low energy?", "Herbs for immunity"],
  yoga: ["Yoga for back pain", "Morning yoga routine", "Yoga for better sleep", "Gentle yoga for beginners"],
  breathing: ["Breathing to calm anxiety", "Breathwork for sleep", "A quick energy breath", "Breathing for focus"],
  meditation: ["A 5-minute meditation", "How do I quiet my mind?", "Meditation for anxiety", "Help me start meditating"],
  ayurveda: ["What is my dosha?", "Ayurveda for digestion", "Balancing my energy", "An Ayurvedic morning routine"],
  sleep: ["I can't fall asleep", "How to sleep more deeply", "A wind-down routine", "I keep waking at night"],
  senior: ["Gentle exercises for seniors", "Improving my balance", "Easy stretches for stiff joints", "Staying active safely"],
  brain: ["How to improve focus", "Reduce brain fog", "Habits for memory", "Calm a racing mind"],
};

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

const MEDITATION_DATA = [
  {name:"Mindful Breath Meditation",level:"Beginner · 5 to 10 min",benefit:"Calms the mind and builds focus — the perfect starting point",poses:["Sit comfortably, spine tall, hands resting","Close your eyes, take three slow breaths","Rest your attention on the natural breath","When the mind wanders, gently return to the breath","No judgement — returning IS the practice","Start with 5 minutes, build slowly"],tip:"You are not trying to empty your mind — just noticing when it drifts and returning. That is the whole skill.",warn:null,yt:"https://www.youtube.com/results?search_query=mindful+breathing+meditation+for+beginners+guided",ytlbl:"Watch Mindful Breath Meditation"},
  {name:"Body Scan Meditation",level:"All levels · 10 to 15 min",benefit:"Releases physical tension and deepens body awareness",poses:["Lie down or sit comfortably","Bring attention to the top of your head","Slowly move awareness down through the body","Notice sensations without trying to change them","Soften any area holding tension","Finish at the toes, resting in whole-body awareness"],tip:"Wonderful before sleep — many people drift off before they finish. That is perfectly fine.",warn:null,yt:"https://www.youtube.com/results?search_query=body+scan+meditation+guided+relaxation",ytlbl:"Watch Body Scan Meditation"},
  {name:"Loving-Kindness Meditation",level:"All levels · 10 min",benefit:"Cultivates warmth, compassion and emotional resilience",poses:["Sit comfortably and breathe naturally","Bring to mind someone you care about","Silently wish them: may you be happy, may you be well","Extend the same wishes to yourself","Then to a neutral person, then to all beings","Rest in the feeling of goodwill"],tip:"If self-kindness feels hard, start with someone easy to love and let the warmth spread naturally to yourself.",warn:null,yt:"https://www.youtube.com/results?search_query=loving+kindness+meditation+guided+metta",ytlbl:"Watch Loving-Kindness Meditation"},
  {name:"Guided Visualisation",level:"Beginner · 10 min",benefit:"Reduces stress by guiding the mind to a place of calm",poses:["Settle comfortably and close your eyes","Picture a peaceful place — beach, forest, mountain","Notice the colours, sounds and warmth there","Let yourself fully arrive in this calm space","Breathe slowly, soaking in the peace","Carry the calm with you as you return"],tip:"The more senses you involve — sound, smell, temperature — the more real and restful it becomes.",warn:null,yt:"https://www.youtube.com/results?search_query=guided+visualization+meditation+relaxation",ytlbl:"Watch Guided Visualisation"},
  {name:"Mantra Meditation",level:"All levels · 10 to 20 min",benefit:"Quietens mental chatter through gentle repetition",poses:["Choose a calming word or sound (peace, so-hum, om)","Sit comfortably and close your eyes","Silently repeat the mantra with each breath","When the mind wanders, return to the mantra","Let the repetition become effortless","Sit quietly for a moment before opening your eyes"],tip:"The mantra is an anchor, not a chant. Soft, internal repetition is enough to steady a busy mind.",warn:null,yt:"https://www.youtube.com/results?search_query=mantra+meditation+for+beginners+guided",ytlbl:"Watch Mantra Meditation"},
  {name:"5-Minute Stress Reset",level:"Beginner · 5 min",benefit:"A quick reset for an overwhelming moment, anywhere",poses:["Pause and take one long, slow exhale","Drop your shoulders, unclench your jaw","Breathe in for 4, out for 6, five times","Name one thing you can see, hear and feel","Set one small intention for the next hour","Carry on, a little calmer"],tip:"Perfect between meetings or in a stressful moment — short, discreet, and genuinely effective.",warn:null,yt:"https://www.youtube.com/results?search_query=5+minute+meditation+stress+relief+guided",ytlbl:"Watch 5-Minute Stress Reset"},
];

const CARDIO_DATA = [
  {name:"The VITÁL 25 Circuit",level:"Intermediate · 5 to 8 min",benefit:"Full-body strength and cardio in one quick, equipment-free circuit",poses:["Warm up: 30 seconds marching on the spot, arm circles","25 squats — feet shoulder-width, sit back, chest up","25 press-ups — full, on knees, or against a wall","25 lunges — alternating legs, knee tracking over toes","Rest 60 seconds, breathe slowly","Optional: repeat the circuit once more if you feel strong"],tip:"Quality beats speed. Slow, controlled reps build more strength and protect your joints. If 25 is too many today, do what you can — see the Build-Up circuit.",warn:"Stop if you feel sharp pain, dizziness or chest discomfort. New to exercise or have a health condition? Check with your doctor first.",yt:"https://www.youtube.com/results?search_query=bodyweight+circuit+squats+pushups+lunges+beginner+form",ytlbl:"Watch circuit form guides"},
  {name:"Build-Up to 25",level:"Beginner · 5 min",benefit:"The same circuit, scaled — build gradually from 5 reps to the full 25",poses:["Week 1: 5 squats, 5 wall press-ups, 5 lunges — daily","Week 2: 10 of each, rest as needed between moves","Week 3: 15 of each — press-ups on knees if wall feels easy","Week 4: 20 of each, focus on smooth controlled form","Week 5: the full 25 Circuit — you earned it","Progress at your own pace; repeat a week any time"],tip:"Consistency beats intensity. Five perfect reps daily will take you further than 25 painful ones once a week.",warn:"Build gradually — muscle soreness is normal, joint pain is not. Ease off if pain persists.",yt:"https://www.youtube.com/results?search_query=beginner+bodyweight+workout+progression+no+equipment",ytlbl:"Watch beginner progressions"},
  {name:"5-Minute Morning Energiser",level:"All levels · 5 min",benefit:"Raises heart rate and energy without equipment — better than coffee",poses:["1 min: march or jog on the spot, swing the arms","1 min: 20 jumping jacks (or step-jacks, low impact)","1 min: 15 squats, steady pace","1 min: high knees or brisk marching","1 min: slow stretch — reach up tall, gentle forward fold","Shake it out. Drink water. Go own the day."],tip:"Do this before checking your phone in the morning — movement first changes the whole day's energy.",warn:"Keep impact low (step instead of jump) if you have joint concerns.",yt:"https://www.youtube.com/results?search_query=5+minute+morning+workout+no+equipment+energizing",ytlbl:"Watch morning energisers"},
  {name:"Gentle Strength (Low-Impact)",level:"Gentle · 8 min · Joint-friendly & 60+",benefit:"Builds practical, everyday strength with zero jumping or floor work",poses:["10 sit-to-stands from a sturdy chair (the most useful exercise there is)","10 wall press-ups — hands on wall, body straight","10 counter-top calf raises, slow up and down","10 standing knee lifts each side, hold a chair for balance","30-second gentle wall sit (or skip)","Finish: shoulder rolls and a slow, tall stretch"],tip:"Strength is the closest thing we have to an anti-ageing medicine — and the chair sit-to-stand is its king. A little, daily, changes everything.",warn:"Hold a stable support for balance moves. Stop if anything causes sharp pain.",yt:"https://www.youtube.com/results?search_query=gentle+strength+exercises+seniors+low+impact+home",ytlbl:"Watch gentle strength guides"},
  {name:"Core Foundations",level:"Beginner · 6 min",benefit:"A stable core supports your back, posture and every other movement",poses:["30-second plank — on knees is perfectly valid","15 glute bridges — squeeze at the top, lower slowly","10 dead bugs each side — lower back stays pressed down","20-second side plank each side (knees down to scale)","15 slow standing torso twists","Rest, breathe, repeat once if you like"],tip:"A strong core is built with control, not speed. If your back arches or strains, scale the move down — that's wisdom, not weakness.",warn:"Skip or modify if you have back issues, and keep movements pain-free.",yt:"https://www.youtube.com/results?search_query=beginner+core+workout+plank+glute+bridge+form",ytlbl:"Watch core form guides"},
  {name:"7-Minute Full Body",level:"Intermediate · 7 min",benefit:"The classic science-backed circuit — maximum effect, minimum time",poses:["30 seconds each, 10 seconds rest between:","Jumping jacks · wall sit · press-ups · crunches","Step-ups (stairs or sturdy step) · squats · plank","High knees · lunges · side plank (each side)","Move briskly but with control","Cool down: slow breathing, gentle stretch"],tip:"Seven focused minutes beats an hour you never do. Tick it daily and watch the streak — and your strength — build.",warn:"This one is brisk: scale any move down, and stop if you feel dizzy or unwell.",yt:"https://www.youtube.com/results?search_query=7+minute+workout+full+body+follow+along",ytlbl:"Watch 7-minute workouts"},
];

const PLANS = [
  {
    id:"free",tier:"Free",price:0,ap:0,fbadge:"Forever Free",
    desc:"A genuine head start. Real value — no card needed.",
    features:[
      {t:"Daily Vitality Score (morning + evening)",i:true},
      {t:"5 AI wellness messages per day",i:true},
      {t:"Full library: yoga, breath, cardio, meditation & more",i:true},
      {t:"Daily morning & evening ritual",i:true},
      {t:"Mood, energy & stress check-in + streaks",i:true},
      {t:"Unlimited AI coaching",i:false},
      {t:"AI memory & infinite fresh guidance",i:false},
      {t:"Progress history, trends & reports",i:false},
    ],
    btn:"outline",cta:"Start Free — No Card"
  },
  {
    id:"pro",tier:"Pro",price:239,ap:199,fprice:149,fyear:1490,fmonthUsd:9,fyearUsd:90,regUsd:14,badge:"Most Popular",featured:true,
    desc:"Everything VITÁL offers — your complete AI wellness companion.",
    features:[
      {t:"Everything in Free",i:true},
      {t:"Unlimited AI wellness coaching",i:true},
      {t:"AI remembers your goal & journey",i:true},
      {t:"Deepest, most detailed AI guidance",i:true},
      {t:"Ask AI for unlimited fresh exercises & routines",i:true},
      {t:"All 9 wellness modes (incl. Senior & Brain)",i:true},
      {t:"Choose from all daily ritual themes",i:true},
      {t:"Longevity & healthy-ageing focus",i:true},
      {t:"Reflection & gratitude journal",i:true},
      {t:"Progress history, trends & weekly reports",i:true},
      {t:"Export health summary for your doctor (CSV)",i:true},
      {t:"Priority support",i:true},
    ],
    btn:"gold",cta:"Start Pro"
  },
];

// Elite plan parked for later (revive when lab analysis / human coaching features are built):
// { id:"elite", tier:"Elite", price:22.99, ... }


const LEGAL = {
  disclaimer:{title:"Health Disclaimer",body:"VITÁL is a general wellness and lifestyle application only.\n\nNOT A MEDICAL DEVICE\nVITÁL does not diagnose, treat, cure, or prevent any disease or medical condition. It is not a substitute for professional medical advice, diagnosis, or treatment.\n\nCHILDREN UNDER 18 — PARENTAL SUPERVISION REQUIRED\nAll activities including exercises, breathing practices, yoga, Tai Chi, meditation, and AI coach interactions MUST be supervised by a parent or guardian at all times for anyone under 18 years of age. Parents and guardians are solely responsible for determining the suitability of all content for their child.\n\nMEDICATION SAFETY\nVITÁL NEVER advises you to stop, reduce, or change any medication. All suggestions are general lifestyle information only — additions to, never replacements for, your prescribed medical care.\n\nHERBAL AND SUPPLEMENT CONTENT\nHerbs and supplements can interact with medications. Always consult your doctor or pharmacist before using any supplement, herb, or natural remedy.\n\nSENIORS (60+)\nAlways consult your doctor before starting any new exercise, supplement, or dietary protocol.\n\nEXERCISE SAFETY\nStop immediately if you experience pain, dizziness, or discomfort. Consult your doctor before beginning any new exercise program.\n\nMEDICAL EMERGENCIES\nVITÁL is NOT for emergencies. Call your local emergency services immediately.\n\nEXTERNAL LINKS\nVITÁL links to YouTube for educational purposes only. We are not responsible for third-party content.\n\n© 2026 VITÁL Health · hello@vitalhealth.app"},
  terms:{title:"Terms of Service",body:"1. WELLNESS PLATFORM: General wellness information only — not medical advice.\n2. FREE TIER: Forever free with limited features.\n3. SUBSCRIPTIONS: Monthly or annual. 14-day free trial on Pro and Elite. Cancel anytime.\n4. PAYMENTS: Secure global payment processing. All major cards and digital wallets accepted.\n5. POPIA: Full South Africa compliance.\n6. GDPR: Full EU compliance.\n\n© 2026 ABC UP PTY LTD"},
  privacy:{title:"Privacy Policy",body:"DATA: Name, email, age, wellness metrics you choose to enter.\n\nSECURITY: AES-256 encryption. TLS 1.3 in transit. Supabase infrastructure.\n\nCOMPLIANCE: POPIA (South Africa) · GDPR (EU) · HIPAA-aligned wellness handling.\n\nYOUR RIGHTS: Export all data. Delete your account anytime. Opt out of any marketing.\n\nTHIRD PARTIES: Payment processors, Anthropic (AI only), Supabase database. We do NOT sell your data ever.\n\nContact: privacy@vitalhealth.app\n© 2026 ABC UP PTY LTD"},
};


// ─── TREND CHART (inline SVG, no libraries — cannot break) ───
function TrendChart({ data, color, label, max = 10, unit = "" }) {
  // data: array of {key, value} ; value may be undefined for missing days
  const vals = data.filter(d => d.value != null);
  if (vals.length === 0) {
    return (
      <div style={{padding:"20px 0",textAlign:"center",color:"var(--text3)",fontSize:13,fontWeight:600}}>
        No {label.toLowerCase()} data yet — log a few days to see your trend.
      </div>
    );
  }
  const W = 300, H = 90, pad = 6;
  const n = data.length;
  const bw = (W - pad * 2) / n;
  const avg = (vals.reduce((s, d) => s + d.value, 0) / vals.length);
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
        <span style={{fontSize:14,fontWeight:700,color:"var(--text)"}}>{label}</span>
        <span style={{fontSize:12,fontWeight:600,color:"var(--text3)"}}>avg {avg.toFixed(1)}{unit}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",display:"block"}}>
        {data.map((d, i) => {
          if (d.value == null) return null;
          const h = Math.max(3, (d.value / max) * (H - 16));
          return (
            <rect key={i} x={pad + i * bw + 1} y={H - h - 2} width={Math.max(2, bw - 2)} height={h} rx={2} fill={color} opacity={0.85} />
          );
        })}
      </svg>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--text3)",fontWeight:600,marginTop:2}}>
        <span>{data[0]?.label || ""}</span>
        <span>{data[data.length - 1]?.label || ""}</span>
      </div>
    </div>
  );
}

export default function App() {
  // ─── STATE ───
  const [accepted, setAccepted] = useState(() => { try { return localStorage.getItem("v10") === "y"; } catch { return false; } });
  const [checked, setChecked] = useState(false);
  const [onboarded, setOnboarded] = useState(() => { try { return localStorage.getItem("v10onb") === "y"; } catch { return false; } });
  const [wellnessGoal, setWellnessGoal] = useState(() => { try { return localStorage.getItem("v10goal") || ""; } catch { return ""; } });
  const [page, setPage] = useState("home");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [annual, setAnnual] = useState(false);
  const [exDetail, setExDetail] = useState(null);
  const [exCat, setExCat] = useState("yoga");
  const [speaking, setSpeaking] = useState(false);
  const [morningTime, setMorningTime] = useState("5");
  const [eveningTime, setEveningTime] = useState("5");
  // Daily-rotating ritual themes (null = use today's auto-rotation; number = user's chosen index)
  const [morningThemePick, setMorningThemePick] = useState(null);
  const [eveningThemePick, setEveningThemePick] = useState(null);
  // Large-text accessibility mode (persisted) — friendlier for older eyes
  const [bigText, setBigText] = useState(() => { try { return localStorage.getItem("v10bigtext") === "y"; } catch { return false; } });
  // ─── CLOUD ACCOUNT STATE ───
  const [session, setSession] = useState(null);          // Supabase session (null = signed out)
  const [authChecked, setAuthChecked] = useState(!CLOUD_ON); // has initial session check finished
  const [showAuth, setShowAuth] = useState(false);        // auth modal open
  const [authMode, setAuthMode] = useState("signup");     // signup | login | reset
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authMsg, setAuthMsg] = useState("");
  const [syncState, setSyncState] = useState("idle");     // idle | syncing | saved | error
  const cloudLoaded = useRef(false);                       // guard: don't push before first pull
  const toggleBigText = () => { const v = !bigText; setBigText(v); try { localStorage.setItem("v10bigtext", v ? "y" : "n"); } catch {} ev("bigtext_toggled", { on: v }); };
  const [reflection, setReflection] = useState("");
  const [gratitude, setGratitude] = useState("");

  // Plan & usage
  const [userPlan, setUserPlan] = useState(() => { try { return localStorage.getItem("v10plan") || "free"; } catch { return "free"; } });
  const [dailyMsgCount, setDailyMsgCount] = useState(() => {
    try { const d = JSON.parse(localStorage.getItem("v10msg") || "{}"); return d.date === new Date().toDateString() ? d.count : 0; } catch { return 0; }
  });
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Streak
  const [streak, setStreak] = useState(() => { try { return parseInt(localStorage.getItem("v10streak") || "0"); } catch { return 0; } });
  const [lastCheckin, setLastCheckin] = useState(() => { try { return localStorage.getItem("v10last") || ""; } catch { return ""; } });

  // AI Coach
  const [msgs, setMsgs] = useState([INIT_MSG]);
  const [inp, setInp] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMode, setAiMode] = useState("wellness");
  const endRef = useRef(null);

  // Profile
  const [profile, setProfile] = useState({ energy: "5", stress: "5", mood: "5", sleep_hours: "7", water: "2", fitness_level: "moderate" });
  const [profileSaved, setProfileSaved] = useState(false);
  const [morningDone, setMorningDone] = useState(false);
  const [eveningDone, setEveningDone] = useState(false);
  const [devUnlock, setDevUnlock] = useState(false);
  const [logoTaps, setLogoTaps] = useState(0);

  // ─── DAILY LOG (persistent history — the premium foundation) ───
  // Stored as { "YYYY-MM-DD": {mood,energy,stress,sleep,water,morning,evening,note}, ... }
  const [dailyLog, setDailyLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem("v10log") || "{}"); } catch { return {}; }
  });
  // Key memories the AI should remember (Pro/Elite) — array of short strings
  const [memories, setMemories] = useState(() => {
    try { return JSON.parse(localStorage.getItem("v10mem") || "[]"); } catch { return []; }
  });
  const [report, setReport] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [installEvent, setInstallEvent] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  // ─── DERIVED ───
  const isPro = userPlan === "pro" || userPlan === "elite";
  // Elite is parked; all its features are now in Pro, so isElite-gated features work for Pro subscribers
  const isElite = isPro;
  const canChat = isPro || dailyMsgCount < FREE_DAILY_LIMIT;
  const remainingFree = Math.max(0, FREE_DAILY_LIMIT - dailyMsgCount);
  const vitalityScore = useMemo(() => {
    const raw = (parseInt(profile.energy || 5) * 8) + ((10 - parseInt(profile.stress || 5)) * 5) + (parseInt(profile.mood || 5) * 5) + (parseFloat(profile.water || 2) * 6) + (parseFloat(profile.sleep_hours || 7) * 3);
    return Math.min(100, Math.round((raw / 234) * 100));
  }, [profile]);

  // ─── PWA INSTALL PROMPT ───
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallEvent(e);
      // Show our install banner only if not already installed/dismissed this session
      try {
        const dismissed = localStorage.getItem("v10installDismissed");
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
        if (!dismissed && !isStandalone) setShowInstall(true);
      } catch { setShowInstall(true); }
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const triggerInstall = async () => {
    if (!installEvent) { setShowInstall(false); return; }
    installEvent.prompt();
    try { await installEvent.userChoice; } catch {}
    setInstallEvent(null);
    setShowInstall(false);
  };
  const dismissInstall = () => {
    setShowInstall(false);
    try { localStorage.setItem("v10installDismissed", "y"); } catch {}
  };

  // Day index for daily rotation — same for everyone on a given date, changes each day
  const dayIndex = () => {
    const d = new Date();
    const start = new Date(d.getFullYear(), 0, 0);
    return Math.floor((d - start) / 86400000);
  };
  // Resolve which theme to show: user's pick if chosen, else today's auto-rotation
  const morningTheme = MORNING_THEMES[morningThemePick != null ? morningThemePick : dayIndex() % MORNING_THEMES.length];
  const eveningTheme = EVENING_THEMES[eveningThemePick != null ? eveningThemePick : dayIndex() % EVENING_THEMES.length];

  // ─── HELPERS ───
  const go = (p) => { setPage(p); window.scrollTo(0, 0); };
  // Safe analytics event tracker — never breaks the app if analytics fails
  const ev = (name, data) => { try { track(name, data); } catch {} try { if (window.posthog && window.posthog.capture) window.posthog.capture(name, data); } catch {} };
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  // ═══════════ CLOUD SYNC ENGINE ═══════════
  // Local state stays the source of truth for speed/offline; the cloud is the permanent record.

  // Bundle every piece of user data into one object for the cloud
  const collectState = () => ({
    v: 1,
    goal: wellnessGoal,
    onboarded,
    streak,
    lastCheckin,
    dailyLog,
    memories,
    bigText,
  });

  // Apply a cloud bundle back into local state + localStorage
  const applyState = (d) => {
    if (!d || typeof d !== "object") return;
    try {
      if (d.goal) { setWellnessGoal(d.goal); localStorage.setItem("v10goal", d.goal); }
      if (d.onboarded) { setOnboarded(true); localStorage.setItem("v10onb", "y"); }
      if (typeof d.streak === "number") { setStreak(d.streak); localStorage.setItem("v10streak", String(d.streak)); }
      if (d.lastCheckin) { setLastCheckin(d.lastCheckin); localStorage.setItem("v10last", d.lastCheckin); }
      if (d.dailyLog && typeof d.dailyLog === "object") { setDailyLog(d.dailyLog); localStorage.setItem("v10log", JSON.stringify(d.dailyLog)); }
      if (Array.isArray(d.memories)) { setMemories(d.memories); localStorage.setItem("v10mem", JSON.stringify(d.memories)); }
      if (typeof d.bigText === "boolean") { setBigText(d.bigText); localStorage.setItem("v10bigtext", d.bigText ? "y" : "n"); }
    } catch {}
  };

  // Merge rule: keep the higher streak and the union of logs/memories — never lose data
  const mergeState = (cloud, local) => {
    if (!cloud) return local;
    return {
      v: 1,
      goal: local.goal || cloud.goal,
      onboarded: local.onboarded || cloud.onboarded,
      streak: Math.max(cloud.streak || 0, local.streak || 0),
      lastCheckin: (local.lastCheckin || "") > (cloud.lastCheckin || "") ? local.lastCheckin : cloud.lastCheckin,
      dailyLog: { ...(cloud.dailyLog || {}), ...(local.dailyLog || {}) },
      memories: Array.from(new Set([...(cloud.memories || []), ...(local.memories || [])])).slice(-40),
      bigText: local.bigText,
    };
  };

  // Watch auth session (login / logout / refresh)
  useEffect(() => {
    if (!CLOUD_ON) return;
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data?.session || null);
      setAuthChecked(true);
    }).catch(() => { if (alive) setAuthChecked(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) cloudLoaded.current = false; // reset on sign-out
    });
    return () => { alive = false; sub?.subscription?.unsubscribe?.(); };
  }, []);

  // On sign-in: pull cloud data, merge with whatever is on this device, save the merge back
  useEffect(() => {
    if (!CLOUD_ON || !session?.user) return;
    let alive = true;
    (async () => {
      setSyncState("syncing");
      try {
        const { data, error } = await supabase
          .from("user_data")
          .select("data, plan")
          .eq("user_id", session.user.id)
          .maybeSingle();
        if (error) throw error;
        if (!alive) return;

        const local = collectState();
        const merged = mergeState(data?.data, local);
        applyState(merged);

        // Plan comes from the cloud (server-side truth for Pro access)
        const cloudPlan = data?.plan || "free";
        setUserPlan(cloudPlan);
        try { localStorage.setItem("v10plan", cloudPlan); } catch {}

        await supabase.from("user_data").upsert({
          user_id: session.user.id,
          data: merged,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

        cloudLoaded.current = true;
        if (alive) { setSyncState("saved"); ev("cloud_synced"); }
      } catch {
        if (alive) setSyncState("error");
      }
    })();
    return () => { alive = false; };
  }, [session?.user?.id]);

  // Auto-save to cloud whenever data changes (debounced, only after first pull)
  useEffect(() => {
    if (!CLOUD_ON || !session?.user || !cloudLoaded.current) return;
    const t = setTimeout(async () => {
      try {
        setSyncState("syncing");
        await supabase.from("user_data").upsert({
          user_id: session.user.id,
          data: collectState(),
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
        setSyncState("saved");
      } catch { setSyncState("error"); }
    }, 1200);
    return () => clearTimeout(t);
  }, [dailyLog, memories, streak, lastCheckin, wellnessGoal, bigText, session?.user?.id]);

  // ─── AUTH ACTIONS ───
  const doSignup = async () => {
    if (!CLOUD_ON) return;
    setAuthBusy(true); setAuthMsg("");
    try {
      const { error } = await supabase.auth.signUp({ email: authEmail.trim(), password: authPass });
      if (error) throw error;
      ev("account_created");
      setAuthMsg("✓ Check your email to confirm your account, then log in.");
      setAuthMode("login");
    } catch (e) {
      setAuthMsg(e?.message || "Could not create account. Please try again.");
    }
    setAuthBusy(false);
  };

  const doLogin = async () => {
    if (!CLOUD_ON) return;
    setAuthBusy(true); setAuthMsg("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: authEmail.trim(), password: authPass });
      if (error) throw error;
      ev("account_login");
      setShowAuth(false); setAuthPass(""); setAuthMsg("");
      showToast("✓ Signed in — your data is saved to the cloud");
    } catch (e) {
      setAuthMsg(e?.message || "Could not sign in. Check your email and password.");
    }
    setAuthBusy(false);
  };

  const doReset = async () => {
    if (!CLOUD_ON) return;
    setAuthBusy(true); setAuthMsg("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(authEmail.trim(), { redirectTo: window.location.origin });
      if (error) throw error;
      setAuthMsg("✓ Password reset link sent — check your email.");
    } catch (e) {
      setAuthMsg(e?.message || "Could not send reset email.");
    }
    setAuthBusy(false);
  };

  const doLogout = async () => {
    if (!CLOUD_ON) return;
    try { await supabase.auth.signOut(); } catch {}
    ev("account_logout");
    showToast("Signed out. Your data is safe in the cloud.");
  };

  // Date key helpers
  const todayKey = () => {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  };
  const prettyDate = (key) => {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  // Save today's snapshot into the persistent daily log
  const logToday = (patch) => {
    const key = todayKey();
    setDailyLog(prev => {
      const next = { ...prev, [key]: { ...(prev[key] || {}), ...patch, ts: Date.now() } };
      try { localStorage.setItem("v10log", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // Add an AI memory (deduped, capped at 40, newest last)
  const addMemory = (text) => {
    const t = (text || "").trim();
    if (!t) return;
    setMemories(prev => {
      if (prev.some(x => x.toLowerCase() === t.toLowerCase())) return prev;
      const next = [...prev, t].slice(-40);
      try { localStorage.setItem("v10mem", JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const removeMemory = (i) => {
    setMemories(prev => {
      const next = prev.filter((_, idx) => idx !== i);
      try { localStorage.setItem("v10mem", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // Sorted log entries (oldest → newest), each {key, ...data}
  const logEntries = useMemo(() => {
    return Object.keys(dailyLog).sort().map(k => ({ key: k, ...dailyLog[k] }));
  }, [dailyLog]);

  // Build a last-N-days series for a metric: [{key,label,value}], missing days = null
  const chartData = (metric, days) => {
    const out = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      const entry = dailyLog[key];
      const raw = entry && entry[metric] != null ? parseFloat(entry[metric]) : null;
      out.push({ key, label: prettyDate(key), value: isNaN(raw) ? null : raw });
    }
    return out;
  };

  const incrementMsg = () => {
    if (isPro) return;
    const today = new Date().toDateString();
    const n = dailyMsgCount + 1;
    setDailyMsgCount(n);
    try { localStorage.setItem("v10msg", JSON.stringify({ date: today, count: n })); } catch {}
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    if (lastCheckin === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const n = lastCheckin === yesterday ? streak + 1 : 1;
    setStreak(n); setLastCheckin(today);
    try { localStorage.setItem("v10streak", String(n)); localStorage.setItem("v10last", today); } catch {}
    if (n > 1 && n % 7 === 0) setTimeout(() => showToast("🔥 " + n + "-day streak! Wonderful."), 700);
  };

  const speak = (text) => {
    try {
      if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
      const u = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ""));
      u.rate = 0.95; u.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(u); setSpeaking(true);
    } catch { showToast("Voice unavailable on this device"); }
  };

  // Generate AI weekly wellness report (Pro/Elite)
  const generateReport = async () => {
    if (reportLoading) return;
    setReportLoading(true);
    try {
      const recent = logEntries.slice(-7);
      const summary = recent.map(e => `${prettyDate(e.key)}: mood ${e.mood ?? "-"}/10, energy ${e.energy ?? "-"}/10, stress ${e.stress ?? "-"}/10, sleep ${e.sleep ?? "-"}h${e.morning ? ", morning ritual done" : ""}${e.evening ? ", evening ritual done" : ""}`).join("\n");
      const goalLabel = WELLNESS_GOALS.find(g => g.id === wellnessGoal)?.label || "general wellness";
      const sys = `You are VITÁL's wellness report writer. Write a warm, encouraging weekly wellness summary (about 150 words) for someone whose goal is ${goalLabel}. Use their data to note trends, celebrate wins (streaks, consistency, improvements), and offer ONE gentle, specific suggestion for next week. Be supportive and human, never clinical. Do not diagnose. Speak directly to them as "you".`;
      const userMsg = `Here is my wellness data for the past week:\n${summary}\n\nMy current streak is ${streak} days. Please write my weekly report.`;
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: sys, messages: [{ role: "user", content: userMsg }], max_tokens: 400 })
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      const raw = d.content?.[0]?.text || "Could not generate report. Please try again.";
      setReport(raw.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/#{1,3} /g, "").trim());
    } catch {
      setReport("Could not generate your report right now. Please check your connection and try again.");
    }
    setReportLoading(false);
  };

  // Export wellness history as CSV (Elite) — for sharing with a doctor
  const exportCSV = () => {
    try {
      const rows = [["Date", "Mood (1-10)", "Energy (1-10)", "Stress (1-10)", "Sleep (hrs)", "Water (L)", "Morning ritual", "Evening ritual", "Reflection", "Gratitude"]];
      logEntries.forEach(e => {
        rows.push([
          e.key,
          e.mood ?? "", e.energy ?? "", e.stress ?? "", e.sleep ?? "", e.water ?? "",
          e.morning ? "Yes" : "", e.evening ? "Yes" : "",
          (e.reflection || "").replace(/"/g, "'"), (e.gratitude || "").replace(/"/g, "'")
        ]);
      });
      const csv = rows.map(r => r.map(c => `"${String(c)}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vital-wellness-history-" + todayKey() + ".csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("✓ Wellness history downloaded");
    } catch {
      showToast("Could not export. Please try again.");
    }
  };

  // Full backup — download ALL app data as a JSON file (every user, never lose data)
  const backupData = () => {
    try {
      const data = {
        version: "v10",
        exported: new Date().toISOString(),
        goal: wellnessGoal,
        plan: userPlan,
        streak, lastCheckin,
        dailyLog,
        memories,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vital-backup-" + todayKey() + ".json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("\u2713 Backup downloaded — keep it safe");
    } catch {
      showToast("Could not create backup. Please try again.");
    }
  };

  // Restore from a backup file
  const restoreData = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if (d.dailyLog) { setDailyLog(d.dailyLog); try { localStorage.setItem("v10log", JSON.stringify(d.dailyLog)); } catch {} }
        if (d.memories) { setMemories(d.memories); try { localStorage.setItem("v10mem", JSON.stringify(d.memories)); } catch {} }
        if (d.goal) { setWellnessGoal(d.goal); try { localStorage.setItem("v10goal", d.goal); } catch {} }
        if (typeof d.streak === "number") { setStreak(d.streak); try { localStorage.setItem("v10streak", String(d.streak)); } catch {} }
        if (d.lastCheckin) { setLastCheckin(d.lastCheckin); try { localStorage.setItem("v10last", d.lastCheckin); } catch {} }
        showToast("\u2713 Backup restored successfully");
      } catch {
        showToast("Could not read that file. Make sure it's a VIT\u00c1L backup.");
      }
    };
    reader.readAsText(file);
  };

  const deleteAccount = () => {
    if (!window.confirm("Delete all your VITÁL data permanently? This cannot be undone.")) return;
    try { ["v10","v10onb","v10goal","v10plan","v10msg","v10streak","v10last","v10log","v10mem"].forEach(k => localStorage.removeItem(k)); } catch {}
    showToast("All data deleted. Restarting...");
    setTimeout(() => window.location.reload(), 1400);
  };

  const selectPlan = (id) => {
    if (id === "free") { ev("plan_selected", { plan: "free" }); go("morning"); return; }
    // Require an account before paying — this is how we link the payment to the person
    if (CLOUD_ON && !session?.user) {
      ev("auth_required_for_checkout");
      setAuthMode("signup"); setAuthMsg("Create your free account first — this links your subscription to you, so Pro unlocks on every device."); setShowAuth(true);
      return;
    }
    const billing = annual ? "annual" : "monthly";
    ev("checkout_started", { plan: id, billing, founder: FOUNDER_MODE, email: session?.user?.email });
    // During founder mode, send buyers to the founder-priced links; otherwise regular
    const prefix = FOUNDER_MODE ? "founder" : "pro";
    const link = PAYSTACK[prefix + (annual ? "_annual" : "_monthly")];
    if (link) {
      window.open(link, "_blank");
      showToast("Complete payment with the SAME email you signed up with — Pro unlocks within minutes.");
    }
  };

  // ─── AI CHAT ───
  const sendChat = async (txt) => {
    const m = (txt || inp).trim();
    if (!m || aiLoading) return;
    if (!canChat) { ev("paywall_shown", { reason: "daily_limit" }); setShowUpgrade(true); return; }

    setInp("");
    setMsgs(p => [...p, { role: "user", text: m }]);
    ev("ai_message_sent", { mode: aiMode, plan: userPlan });
    setAiLoading(true);
    if (!isPro) incrementMsg();
    updateStreak();

    // Auto-capture meaningful facts as memories (Pro/Elite only)
    if (isPro) {
      const low = m.toLowerCase();
      const cues = ["i struggle with", "i have trouble", "i can't", "i cant", "i feel", "i'm dealing with", "im dealing with", "my goal is", "i want to", "i suffer from", "i was diagnosed", "i take ", "i'm trying to", "im trying to", "i love", "i hate", "i prefer", "helps me", "i usually"];
      if (m.length > 12 && m.length < 220 && cues.some(c => low.includes(c))) {
        addMemory(m.replace(/\s+/g, " ").trim());
      }
    }

    try {
      const hist = msgs.filter(x => x.role !== "system").map(x => ({ role: x.role === "ai" ? "assistant" : "user", content: x.text }));
      const goalLabel = WELLNESS_GOALS.find(g => g.id === wellnessGoal)?.label || "";
      const profCtx = profileSaved ? `User: energy ${profile.energy}/10, stress ${profile.stress}/10, sleep ${profile.sleep_hours}h. ` : "";
      const goalCtx = goalLabel ? `Primary goal: ${goalLabel}. ` : "";
      const streakCtx = isPro && streak > 2 ? `User has practiced ${streak} days — acknowledge naturally when relevant. ` : "";
      // Real remembered facts (Pro/Elite)
      const memCtx = isPro && memories.length > 0
        ? `Things you remember about this user: ${memories.slice(-12).join("; ")}. Reference these naturally when relevant, like a companion who truly knows them. `
        : "";
      // Recent trend awareness (Pro/Elite)
      const recent = isPro ? logEntries.slice(-5) : [];
      const trendCtx = recent.length >= 2
        ? `Recent check-ins: ${recent.map(e => `${prettyDate(e.key)} mood ${e.mood ?? "-"}, energy ${e.energy ?? "-"}, stress ${e.stress ?? "-"}`).join(" | ")}. If you notice a pattern, gently mention it. `
        : "";
      const sys = `You are VITÁL Intelligence Engine — a warm, wise, emotionally intelligent AI wellness companion. ${profCtx}${goalCtx}${streakCtx}${memCtx}${trendCtx}Current mode: ${aiMode}. Draw from herbal medicine, Ayurveda, yoga, breathwork, meditation, sleep science, and longevity research. Be warm, concise, genuinely helpful. Keep responses to 2-3 short paragraphs. Never diagnose or advise changing medication. Respond naturally — no disclaimers on every message.${isPro ? " You know this user personally." : ""}`;

      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: sys, messages: [...hist, { role: "user", content: m }], max_tokens: isPro ? 800 : 500 })
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      const raw = d.content?.[0]?.text || "Please try again.";
      const clean = raw.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").replace(/#{1,3} /g, "").replace(/\n{3,}/g, "\n\n").trim();

      const ytMap = { "sun salutation":"sun+salutation+yoga", "cat-cow":"cat+cow+stretch", "downward dog":"downward+dog+yoga", "box breathing":"box+breathing+guided", "4-7-8":"4-7-8+breathing+sleep", "wim hof":"wim+hof+breathing", "pranayama":"pranayama+beginners", "tai chi":"tai+chi+beginners", "qigong":"qigong+morning", "meditation":"guided+meditation", "yoga nidra":"yoga+nidra+sleep" };
      const low = clean.toLowerCase();
      let yt = null;
      for (const [k, q] of Object.entries(ytMap)) { if (low.includes(k)) { yt = "https://www.youtube.com/results?search_query=" + q; break; } }

      setMsgs(p => [...p, { role: "ai", text: clean, yt }]);
    } catch {
      setMsgs(p => [...p, { role: "ai", text: "Connection error. Please check your internet and try again." }]);
    }
    setAiLoading(false);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };


  // ═══ DISCLAIMER GATE ═══
  if (!accepted) return (
    <>
      <style>{CSS}</style>
      <div className="gate">
        <div className="gate-box">
          <div className="gate-hd">
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <span style={{fontSize:22}}>⚠️</span>
              <div className="lbl" style={{margin:0}}>Health Notice</div>
            </div>
            <h2 className="h2" style={{fontSize:24}}>Important Disclaimer</h2>
          </div>
          <div className="gate-body">
            <div className="gate-sec">Not a Medical Device</div>
            <p className="gate-p">VITÁL is a general wellness application — not a medical device. It does not provide diagnoses and is not a substitute for professional medical advice, diagnosis, or treatment.</p>
            <div className="gate-hi">
              <div className="gate-sec" style={{marginTop:0,color:"var(--amber)"}}>Medication Safety — Critical</div>
              <p className="gate-p">VITÁL NEVER advises you to stop, reduce, or change any medication. VITÁL NEVER overrides your doctor. All suggestions are additions to — not replacements for — your prescribed medical care.</p>
            </div>
            <div className="gate-sec">Herbal Content</div>
            <p className="gate-p">Herbal and Ayurvedic recommendations are traditional wellness information only. Herbs can interact with medications. Always consult your doctor or pharmacist before using any supplement.</p>
            <div className="gate-sec">Children Under 18</div>
            <p className="gate-p">All wellness activities should be supervised by a parent or guardian at all times.</p>
            <div className="gate-sec">Seniors Age 60 Plus</div>
            <p className="gate-p">Always consult your doctor before any new exercise, supplement, or dietary change — especially if you take regular medication.</p>
            <div className="gate-sec">Medical Emergencies</div>
            <p className="gate-p">VITÁL is NOT for emergencies. Call your local emergency services immediately.</p>
            <p className="gate-p" style={{marginTop:14,fontStyle:"italic"}}>VITÁL is designed to complement — never replace — your healthcare team. Your doctor always comes first.</p>
          </div>
          <div className="gate-foot">
            <div className="gate-check" onClick={() => setChecked(c => !c)}>
              <div className={"gate-chk " + (checked ? "on" : "")}>
                {checked && <span style={{color:"#0A0A0A",fontSize:13,fontWeight:700,lineHeight:1}}>✓</span>}
              </div>
              <div className="gate-chk-txt">I understand VITÁL provides general wellness information only — not medical advice. I will continue all prescribed medications and follow my doctor's guidance. I agree to the Terms, Privacy Policy, and Health Disclaimer.</div>
            </div>
            <button className="btn btn-gold" style={{width:"100%",padding:"14px"}} disabled={!checked}
              onClick={() => { try { localStorage.setItem("v10","y"); } catch {} ev("disclaimer_accepted"); setAccepted(true); }}>
              I Understand — Enter VITÁL
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // ═══ ONBOARDING ═══
  if (!onboarded) return (
    <>
      <style>{CSS}</style>
      <div className="gate">
        <div className="gate-box" style={{maxWidth:480,overflow:"visible",maxHeight:"none"}}>
          <div style={{padding:"32px 28px 16px",textAlign:"center"}}>
            <div style={{fontSize:42,marginBottom:10}}>🌿</div>
            <h2 className="h2" style={{fontSize:26,marginBottom:8}}>Welcome to <em>VITÁL</em></h2>
            <p className="body-text" style={{color:"var(--text3)"}}>What matters most to you right now? We'll personalise everything around your goal.</p>
          </div>
          <div style={{padding:"4px 24px 24px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
              {WELLNESS_GOALS.map(g => (
                <button key={g.id} onClick={() => setWellnessGoal(g.id)}
                  style={{padding:"15px 10px",textAlign:"center",
                    border: wellnessGoal === g.id ? "2px solid var(--gold)" : "1.5px solid var(--border)",
                    background: wellnessGoal === g.id ? "var(--gold-bg)" : "var(--surface)",
                    color: wellnessGoal === g.id ? "var(--gold-dark)" : "var(--text2)",
                    borderRadius:"var(--r2)",cursor:"pointer",fontFamily:"var(--fb)",fontSize:12.5,
                    fontWeight: wellnessGoal === g.id ? 700 : 600,transition:"all .15s"}}>
                  <div style={{fontSize:24,marginBottom:5}}>{g.icon}</div>
                  <div>{g.label}</div>
                </button>
              ))}
            </div>
            <button className="btn btn-gold" style={{width:"100%",padding:"14px",fontSize:15}} disabled={!wellnessGoal}
              onClick={() => { try { localStorage.setItem("v10onb","y"); localStorage.setItem("v10goal",wellnessGoal); } catch {} ev("signup_completed", { goal: wellnessGoal }); setOnboarded(true); showToast("✨ Welcome to your VITÁL journey"); }}>
              Begin My Journey →
            </button>
            <p className="body-sm" style={{textAlign:"center",marginTop:10}}>You can change this anytime in Profile</p>
          </div>
        </div>
      </div>
    </>
  );


  // ═══ MAIN APP ═══
  return (
    <div style={{zoom: bigText ? 1.15 : 1}}>
      <style>{CSS}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => { const n = logoTaps + 1; setLogoTaps(n); if (n >= 5) { setDevUnlock(true); showToast("🔧 Test Mode unlocked in Profile"); } go("home"); }}>VITÁL</div>
        <div className="nav-links">
          {[["home","Home"],["morning","Morning"],["evening","Evening"],["coach","AI Coach"],["exercises","Exercises"],["progress","Progress"],["profile","Profile"],["pricing","Pricing"]].map(([p,l]) => (
            <button key={p} className={"nav-btn " + (page === p ? "active" : "")} onClick={() => go(p)}>{l}</button>
          ))}
        </div>
        <div className="nav-right">
          {streak > 0 && (
            <div style={{display:"flex",alignItems:"center",gap:4,background:"var(--gold-bg)",border:"1px solid var(--gb)",borderRadius:20,padding:"4px 10px",fontSize:12,color:"var(--gold-dark)",fontWeight:700}}>🔥 {streak}</div>
          )}
          {isPro ? (
            <div style={{background:"var(--gold)",borderRadius:20,padding:"4px 12px",fontSize:11,color:"#0A0A0A",fontWeight:700,letterSpacing:1}}>PRO ✦</div>
          ) : (
            <button className="btn btn-gold btn-sm" onClick={() => go("pricing")}>Get Pro</button>
          )}
        </div>
      </nav>

      {/* TOAST */}
      {toast && (
        <div style={{position:"fixed",top:78,left:"50%",transform:"translateX(-50%)",background:"var(--surface)",border:"1.5px solid var(--gold)",borderRadius:"var(--r2)",padding:"11px 20px",fontSize:13,fontWeight:600,color:"var(--text)",zIndex:500,boxShadow:"var(--shadow2)",maxWidth:"90vw",textAlign:"center"}}>{toast}</div>
      )}

      {/* INSTALL BANNER */}
      {showInstall && (
        <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:600,background:"var(--surface)",borderTop:"2px solid var(--gold)",boxShadow:"0 -4px 20px rgba(0,0,0,.15)",padding:"14px 18px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <img src="/icon-192.png" alt="VITÁL" style={{width:42,height:42,borderRadius:10,flexShrink:0}} />
          <div style={{flex:1,minWidth:140}}>
            <div style={{fontSize:14,fontWeight:700,color:"var(--text)"}}>Install VITÁL</div>
            <div style={{fontSize:12,color:"var(--text3)",fontWeight:500}}>Add to your home screen for instant access</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-gold btn-sm" onClick={() => triggerInstall()}>Install</button>
            <button onClick={() => dismissInstall()} style={{background:"none",border:"none",color:"var(--text3)",fontSize:13,cursor:"pointer",fontWeight:600,padding:"0 6px"}}>Not now</button>
          </div>
        </div>
      )}

      {/* HOME */}
      {page === "home" && (
        <div className="page">
          <div className="wrap">
            <div className="section" style={{textAlign:"center"}}>
              <div className="lbl">AI Wellness Companion</div>
              <h1 className="h1" style={{maxWidth:760,margin:"0 auto 18px"}}>Your daily ritual for <em>vitality</em>,<br/>guided by intelligence.</h1>
              <button className="btn btn-gold" style={{padding:"14px 28px",fontSize:16,marginBottom:10}} onClick={() => { ev("today_ritual_tapped"); go(new Date().getHours() < 15 ? "morning" : "evening"); }}>🌿 Start today's ritual →</button>
              {CLOUD_ON && !session?.user && streak > 0 && (
                <div style={{maxWidth:520,margin:"14px auto 0",background:"var(--gold-bg)",border:"1.5px solid var(--gb)",borderRadius:"var(--r2)",padding:"12px 16px"}}>
                  <div style={{fontSize:13.5,color:"var(--text2)",fontWeight:600,marginBottom:8}}>🔥 You're on a {streak}-day streak — but it's only saved on this device.</div>
                  <button className="btn btn-gold btn-sm" onClick={() => { setAuthMode("signup"); setAuthMsg(""); setShowAuth(true); ev("auth_opened", { from: "streak_banner" }); }}>Save it forever — free account</button>
                </div>
              )}
              <p className="body-text" style={{maxWidth:580,margin:"0 auto 28px"}}>Yoga, breathwork, Ayurveda, meditation and longevity science — woven into a single, gentle daily practice that knows you personally.</p>
              <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                <button className="btn btn-gold-lg" onClick={() => go("morning")}>Begin Today's Ritual</button>
                <button className="btn btn-outline" onClick={() => go("coach")}>Talk to AI Coach</button>
              </div>
              {wellnessGoal && (
                <div style={{marginTop:28,padding:"12px 20px",background:"var(--gold-bg)",border:"1px solid var(--gb)",borderRadius:"var(--r2)",display:"inline-block"}}>
                  <span style={{fontSize:13,color:"var(--gold-dark)",fontWeight:600}}>Your focus: <strong>{WELLNESS_GOALS.find(g => g.id === wellnessGoal)?.label}</strong></span>
                </div>
              )}
            </div>

            {profileSaved && (
              <div className="section-sm">
                <div className="card-gold" style={{textAlign:"center"}}>
                  <div className="lbl" style={{margin:"0 auto 14px"}}>Today's Vitality</div>
                  <div style={{fontSize:60,fontFamily:"var(--fd)",fontWeight:500,color: vitalityScore >= 70 ? "var(--green)" : vitalityScore >= 50 ? "var(--gold-dark)" : "var(--amber)",lineHeight:1}}>{vitalityScore}</div>
                  <div className="body-sm" style={{marginTop:6}}>out of 100</div>
                  {streak > 0 && <div className="body-text" style={{marginTop:16}}>🔥 {streak} day{streak !== 1 ? "s" : ""} of consistency</div>}
                </div>
              </div>
            )}

            <div className="section" style={{paddingTop:0}}>
              <div className="lbl">Quick Practice</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14,marginTop:12}}>
                {[{p:"morning",icon:"☀️",t:"Morning Ritual",d:"Start the day with intention"},{p:"evening",icon:"🌙",t:"Evening Wind-Down",d:"Reflect and reset before sleep"},{p:"coach",icon:"🌿",t:"AI Wellness Coach",d:"Personalised guidance, anytime"},{p:"exercises",icon:"🧘",t:"Practice Library",d:"Yoga · Breathwork · Tai Chi"}].map(item => (
                  <div key={item.p} className="card" style={{cursor:"pointer"}} onClick={() => go(item.p)}>
                    <div style={{fontSize:28,marginBottom:10}}>{item.icon}</div>
                    <div style={{fontFamily:"var(--fd)",fontSize:19,color:"var(--text)",marginBottom:6,fontWeight:600}}>{item.t}</div>
                    <div className="body-sm">{item.d}</div>
                  </div>
                ))}
              </div>
            </div>

            {!isPro && dailyMsgCount >= 3 && (
              <div className="section-sm">
                <div className="card-gold" style={{textAlign:"center"}}>
                  <div style={{fontSize:24,marginBottom:8}}>✨</div>
                  <h3 className="h3" style={{marginBottom:10}}>Ready for unlimited?</h3>
                  <p className="body-text" style={{maxWidth:420,margin:"0 auto 16px"}}>Pro members get unlimited AI coaching, deeper personalisation, and longer guidance sessions.</p>
                  <button className="btn btn-gold" onClick={() => go("pricing")}>See Plans</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MORNING */}
      {page === "morning" && (
        <div className="page"><div className="wrap"><div className="section">
          <div className="lbl">Morning Ritual</div>
          <h2 className="h2" style={{marginBottom:18}}>Begin with <em>intention</em>.</h2>
          <p className="body-text" style={{marginBottom:24,maxWidth:600}}>A gentle start to your day. Choose how much time you have.</p>
          <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
            {[["2","2 min"],["5","5 min"],["10","10 min"],["20","20+ min"]].map(([v,l]) => (
              <button key={v} onClick={() => setMorningTime(v)} className={"btn " + (morningTime === v ? "btn-gold" : "btn-outline") + " btn-sm"} style={{minWidth:78}}>{l}</button>
            ))}
          </div>

          {/* Theme picker — today's theme pre-selected; choosing alternatives is a Pro feature */}
          <div className="lbl" style={{marginBottom:8}}>Today's Practice {!isPro && <span style={{color:"var(--text3)",fontWeight:600,textTransform:"none",letterSpacing:0}}>· fresh theme daily</span>}</div>
          <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:6,marginBottom:18,scrollbarWidth:"none"}}>
            {MORNING_THEMES.map((t, i) => {
              const active = (morningThemePick != null ? morningThemePick : dayIndex() % MORNING_THEMES.length) === i;
              const locked = !isPro && !active;
              return (
                <button key={t.id} onClick={() => { if (locked) { ev("paywall_shown", { reason: "ritual_themes" }); go("pricing"); return; } setMorningThemePick(i); }}
                  style={{whiteSpace:"nowrap",flexShrink:0,padding:"10px 16px",borderRadius:"var(--r2)",cursor:"pointer",textAlign:"left",opacity: locked ? 0.55 : 1,
                    border: active ? "2px solid var(--gold)" : "1.5px solid var(--border)",
                    background: active ? "var(--gold-bg)" : "var(--surface)"}}>
                  <div style={{fontSize:14,fontWeight:700,color: active ? "var(--gold-dark)" : "var(--text)"}}>{t.icon} {t.name} {locked && "🔒"}</div>
                  <div style={{fontSize:11,color:"var(--text3)",fontWeight:600}}>{t.blurb}</div>
                </button>
              );
            })}
          </div>

          {morningTheme.times[morningTime] && (
            <div className="card-gold" style={{marginBottom:20}}>
              <div className="lbl">{morningTheme.icon} {morningTheme.name}</div>
              <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:10}}>
                {morningTheme.times[morningTime].map((step, i) => (
                  <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{fontSize:24}}>{step.icon}</div>
                    <div>
                      <div style={{fontWeight:700,color:"var(--text)",fontSize:15}}>{step.name} <span style={{color:"var(--gold-dark)",fontSize:12,fontWeight:600}}>· {step.dur}</span></div>
                      <div className="body-sm">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-gold" style={{marginTop:18,width:"100%",background: morningDone ? "var(--green)" : "var(--gold)",color: morningDone ? "#fff" : "#0A0A0A"}} onClick={() => { if (morningDone) return; updateStreak(); setMorningDone(true); logToday({ morning: true }); ev("ritual_completed", { type: "morning", theme: morningTheme.id }); showToast("✨ Morning ritual complete! 🔥 Streak updated."); }}>{morningDone ? "✓ Completed Today" : "Complete Ritual"}</button>
              {morningDone && (
                <div style={{marginTop:14,padding:"14px 16px",background:"var(--green-bg)",border:"1px solid var(--green)",borderRadius:"var(--r2)",textAlign:"center"}}>
                  <div style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:8}}>Beautiful start to your day 🌿</div>
                  <button className="btn btn-outline btn-sm" onClick={() => go("coach")}>Ask your AI Coach what's next →</button>
                  <button className="btn btn-outline btn-sm" style={{marginLeft:8}} onClick={async () => { ev("streak_shared", { streak }); const txt = "Day " + streak + " of my wellness streak with VITÁL 🌿 Small daily rituals, real energy. Free to start: https://myvital.app"; try { if (navigator.share) { await navigator.share({ text: txt }); } else { await navigator.clipboard.writeText(txt); showToast("✓ Copied — paste it anywhere!"); } } catch {} }}>🔥 Share your streak</button>
                </div>
              )}
            </div>
          )}
          <div className="card" style={{textAlign:"center"}}>
            <div style={{fontSize:24,marginBottom:8}}>🌿</div>
            <h3 className="h3" style={{marginBottom:8}}>Need personalised guidance?</h3>
            <button className="btn btn-outline" onClick={() => go("coach")}>Open AI Coach</button>
          </div>
        </div></div></div>
      )}

      {/* EVENING */}
      {page === "evening" && (
        <div className="page"><div className="wrap"><div className="section">
          <div className="lbl">Evening Wind-Down</div>
          <h2 className="h2" style={{marginBottom:18}}>Release the day. <em>Rest deeply.</em></h2>
          <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
            {[["2","2 min"],["5","5 min"],["10","10 min"],["20","20+ min"]].map(([v,l]) => (
              <button key={v} onClick={() => setEveningTime(v)} className={"btn " + (eveningTime === v ? "btn-gold" : "btn-outline") + " btn-sm"} style={{minWidth:78}}>{l}</button>
            ))}
          </div>

          {/* Theme picker — today's theme pre-selected; choosing alternatives is a Pro feature */}
          <div className="lbl" style={{marginBottom:8}}>Tonight's Practice {!isPro && <span style={{color:"var(--text3)",fontWeight:600,textTransform:"none",letterSpacing:0}}>· fresh theme daily</span>}</div>
          <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:6,marginBottom:18,scrollbarWidth:"none"}}>
            {EVENING_THEMES.map((t, i) => {
              const active = (eveningThemePick != null ? eveningThemePick : dayIndex() % EVENING_THEMES.length) === i;
              const locked = !isPro && !active;
              return (
                <button key={t.id} onClick={() => { if (locked) { ev("paywall_shown", { reason: "ritual_themes" }); go("pricing"); return; } setEveningThemePick(i); }}
                  style={{whiteSpace:"nowrap",flexShrink:0,padding:"10px 16px",borderRadius:"var(--r2)",cursor:"pointer",textAlign:"left",opacity: locked ? 0.55 : 1,
                    border: active ? "2px solid var(--gold)" : "1.5px solid var(--border)",
                    background: active ? "var(--gold-bg)" : "var(--surface)"}}>
                  <div style={{fontSize:14,fontWeight:700,color: active ? "var(--gold-dark)" : "var(--text)"}}>{t.icon} {t.name} {locked && "🔒"}</div>
                  <div style={{fontSize:11,color:"var(--text3)",fontWeight:600}}>{t.blurb}</div>
                </button>
              );
            })}
          </div>

          {eveningTheme.times[eveningTime] && (
            <div className="card-gold" style={{marginBottom:20}}>
              <div className="lbl">{eveningTheme.icon} {eveningTheme.name}</div>
              <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:10}}>
                {eveningTheme.times[eveningTime].map((step, i) => (
                  <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{fontSize:24}}>{step.icon}</div>
                    <div>
                      <div style={{fontWeight:700,color:"var(--text)",fontSize:15}}>{step.name} <span style={{color:"var(--gold-dark)",fontSize:12,fontWeight:600}}>· {step.dur}</span></div>
                      <div className="body-sm">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="card" style={{marginBottom:14}}>
            <div className="lbl">Evening Reflection</div>
            <textarea className="input" value={reflection} onChange={e => setReflection(e.target.value)} placeholder="What went well today?" style={{minHeight:80,resize:"vertical",marginTop:8}} />
          </div>
          <div className="card" style={{marginBottom:14}}>
            <div className="lbl">Three Gratitudes</div>
            <textarea className="input" value={gratitude} onChange={e => setGratitude(e.target.value)} placeholder="Three things you're grateful for..." style={{minHeight:80,resize:"vertical",marginTop:8}} />
          </div>
          <button className="btn btn-gold" style={{width:"100%",background: eveningDone ? "var(--green)" : "var(--gold)",color: eveningDone ? "#fff" : "#0A0A0A"}} onClick={() => { if (eveningDone) return; updateStreak(); setEveningDone(true); logToday({ evening: true, reflection: reflection.slice(0,500), gratitude: gratitude.slice(0,500) }); showToast("🌙 Evening ritual complete. Rest well."); }}>{eveningDone ? "✓ Completed Tonight" : "Complete Evening Ritual"}</button>
          <div className="card-green" style={{marginTop:20}}>
            <div className="lbl" style={{color:"var(--green)"}}>Sleep Optimisation Checklist</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:10}}>
              {["Phone on Do Not Disturb","Bedroom cool (16-19°C)","No screens 30 min before bed","Last meal 3+ hours ago"].map((t,i) => (
                <div key={i} style={{display:"flex",gap:8,alignItems:"center",fontSize:13,color:"var(--text2)",fontWeight:600}}><span style={{color:"var(--green)",fontWeight:700}}>✓</span> {t}</div>
              ))}
            </div>
          </div>
        </div></div></div>
      )}


      {/* AI COACH */}
      {page === "coach" && (
        <div className="page" style={{height:"100vh",display:"flex",flexDirection:"column",paddingTop:62,paddingBottom:0}}>
          <div style={{display:"flex",gap:6,overflowX:"auto",padding:"10px 14px",borderBottom:"1px solid var(--border)",background:"var(--surface)",flexShrink:0}}>
            {AI_MODES.map(mode => (
              <button key={mode.id} onClick={() => { setAiMode(mode.id); setMsgs([INIT_MSG]); }}
                style={{whiteSpace:"nowrap",padding:"7px 13px",border: aiMode === mode.id ? "2px solid var(--gold)" : "1.5px solid var(--border)",background: aiMode === mode.id ? "var(--gold-bg)" : "var(--surface)",color: aiMode === mode.id ? "var(--gold-dark)" : "var(--text2)",borderRadius:20,fontSize:12.5,cursor:"pointer",flexShrink:0,fontWeight:700}}>
                {mode.icon} {mode.label}
              </button>
            ))}
          </div>
          {!isPro && (
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 14px",background: remainingFree === 0 ? "#FCE8EB" : "var(--gold-bg)",borderBottom:"1px solid var(--border)",fontSize:12,fontWeight:600}}>
              <span style={{color: remainingFree === 0 ? "var(--red)" : "var(--gold-dark)"}}>{remainingFree === 0 ? "✦ Daily limit reached — upgrade for unlimited" : "✦ " + remainingFree + " free message" + (remainingFree !== 1 ? "s" : "") + " remaining today"}</span>
              <button onClick={() => go("pricing")} style={{background:"var(--gold)",border:"none",color:"#0A0A0A",borderRadius:6,padding:"4px 12px",fontSize:11,cursor:"pointer",fontWeight:700}}>Upgrade</button>
            </div>
          )}
          <div style={{flex:1,overflowY:"auto",padding:"16px 14px",display:"flex",flexDirection:"column",gap:12,background:"var(--bg)"}}>
            {msgs.map((m, i) => (
              <div key={i} style={{alignSelf: m.role === "user" ? "flex-end" : "flex-start",maxWidth:"88%",padding:"13px 16px",borderRadius:16,background: m.role === "user" ? "var(--gold)" : "var(--surface)",border: m.role === "user" ? "none" : "1px solid var(--border)",color: m.role === "user" ? "#0A0A0A" : "var(--text)",fontSize:14.5,lineHeight:1.7,whiteSpace:"pre-wrap",fontWeight:500,boxShadow:"var(--shadow)"}}>
                {m.text}
                {m.yt && <a href={m.yt} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:10,color:"var(--gold-dark)",fontSize:13,fontWeight:700,borderBottom:"2px solid var(--gb)"}}>▶ Watch on YouTube</a>}
                {m.role === "ai" && i > 0 && (
                  <div style={{display:"flex",gap:8,marginTop:12}}>
                    <button className="readaloud" onClick={() => speak(m.text)}>🔊 {speaking ? "Stop" : "Read Aloud"}</button>
                  </div>
                )}
              </div>
            ))}
            {aiLoading && <div style={{alignSelf:"flex-start",color:"var(--text3)",fontSize:14,padding:"10px 16px"}}><span style={{animation:"pulse 1.5s infinite"}}>● ● ●</span></div>}
            <div ref={endRef} />
          </div>
          {msgs.length <= 1 && AI_SUGGESTIONS[aiMode] && (
            <div style={{display:"flex",gap:8,overflowX:"auto",padding:"10px 14px 2px",background:"var(--bg)",scrollbarWidth:"none"}}>
              {AI_SUGGESTIONS[aiMode].map((s, i) => (
                <button key={i} onClick={() => { ev("suggestion_tapped", { mode: aiMode }); sendChat(s); }} disabled={!canChat || aiLoading}
                  style={{whiteSpace:"nowrap",padding:"8px 14px",border:"1.5px solid var(--gb)",background:"var(--surface)",color:"var(--gold-dark)",borderRadius:20,fontSize:13,fontWeight:600,cursor:"pointer",flexShrink:0}}>
                  {s}
                </button>
              ))}
            </div>
          )}
          <div style={{padding:"10px 14px 14px",borderTop:"1px solid var(--border)",background:"var(--surface)",display:"flex",gap:8}}>
            <input className="input" value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder={canChat ? "Ask anything wellness..." : "Upgrade to continue"} disabled={!canChat || aiLoading} style={{flex:1,borderRadius:24}} />
            <button onClick={() => sendChat()} disabled={!canChat || aiLoading || !inp.trim()} className="btn btn-gold" style={{padding:"11px 20px"}}>Send</button>
          </div>
        </div>
      )}

      {/* EXERCISES */}
      {page === "exercises" && (
        <div className="page"><div className="wrap"><div className="section">
          <div className="lbl">Practice Library</div>
          <h2 className="h2" style={{marginBottom:18}}>Wisdom in <em>movement</em>.</h2>
          <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
            {[["yoga","🧘 Yoga"],["breathing","🫁 Breathwork"],["taichi","🌊 Tai Chi"],["meditation","🧠 Meditation"],["cardio","💪 Cardio & Strength"]].map(([v,l]) => (
              <button key={v} onClick={() => setExCat(v)} className={"btn " + (exCat === v ? "btn-gold" : "btn-outline") + " btn-sm"}>{l}</button>
            ))}
          </div>

          {/* Infinite content via AI — the real reason static guides never run out */}
          <div className={isPro ? "card-gold" : "card"} style={{marginBottom:18,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
            <div style={{fontSize:30}}>✨</div>
            <div style={{flex:1,minWidth:180}}>
              <div style={{fontWeight:700,color:"var(--text)",fontSize:15,marginBottom:2}}>{isPro ? "Want something different?" : "Never run out of practices"}</div>
              <div className="body-sm">{isPro ? "Ask your AI Coach for a fresh routine tailored to exactly how you feel right now — unlimited variations." : "Pro members can ask the AI Coach for unlimited fresh routines, personalised to their body, mood and goals. The library never runs dry."}</div>
            </div>
            {isPro ? (
              <button className="btn btn-gold btn-sm" onClick={() => { ev("ai_alternatives_used", { cat: exCat }); setAiMode(exCat === "breathing" ? "breathing" : exCat === "meditation" ? "meditation" : exCat === "taichi" || exCat === "cardio" ? "wellness" : "yoga"); setMsgs([INIT_MSG]); setInp("Give me a fresh " + exCat + " routine that's different from the usual — tailored to how I feel today."); go("coach"); }}>Ask AI for a fresh routine</button>
            ) : (
              <button className="btn btn-gold btn-sm" onClick={() => { ev("paywall_shown", { reason: "ai_alternatives" }); go("pricing"); }}>Unlock with Pro</button>
            )}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
            {(exCat === "yoga" ? YOGA_DATA : exCat === "breathing" ? BREATH_DATA : exCat === "taichi" ? TAICHI_DATA : exCat === "meditation" ? MEDITATION_DATA : CARDIO_DATA).map((ex, i) => (
              <div key={i} className="card" style={{cursor:"pointer"}} onClick={() => setExDetail(ex)}>
                <h3 className="h3" style={{fontSize:18,marginBottom:6}}>{ex.name}</h3>
                <div style={{fontSize:12,color:"var(--gold-dark)",marginBottom:8,fontWeight:700}}>{ex.level}</div>
                <p className="body-sm" style={{marginBottom:10}}>{ex.benefit || ex.science || ""}</p>
                <span style={{fontSize:13,color:"var(--gold-dark)",fontWeight:700}}>View guide →</span>
              </div>
            ))}
          </div>
        </div></div></div>
      )}

      {/* EXERCISE DETAIL */}
      {exDetail && (
        <div className="modal-ov" onClick={() => setExDetail(null)}>
          <div style={{background:"var(--surface)",borderRadius:"var(--r3)",maxWidth:560,width:"100%",maxHeight:"88vh",overflowY:"auto",padding:24}} onClick={e => e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <h2 className="h2" style={{fontSize:22}}>{exDetail.name}</h2>
              <button onClick={() => setExDetail(null)} style={{background:"none",border:"none",fontSize:22,color:"var(--text3)",cursor:"pointer"}}>×</button>
            </div>
            <div style={{fontSize:13,color:"var(--gold-dark)",marginBottom:14,fontWeight:700}}>{exDetail.level}</div>
            <p className="body-text" style={{marginBottom:18}}>{exDetail.benefit || exDetail.science}</p>
            <div className="lbl">Step-by-Step Guide</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:10,marginBottom:18}}>
              {(exDetail.poses || exDetail.steps || []).map((s, i) => (
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:"var(--gold)",color:"#0A0A0A",fontSize:12,fontWeight:700,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>{i + 1}</div>
                  <div style={{fontSize:14,color:"var(--text2)",lineHeight:1.6,fontWeight:500}}>{s}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <button className="readaloud" onClick={() => speak((exDetail.benefit || exDetail.science || "") + ". " + (exDetail.poses || exDetail.steps || []).join(". "))}>🔊 {speaking ? "Stop" : "Read Guide Aloud"}</button>
              <button className="btn btn-outline btn-sm" onClick={() => { setExDetail(null); go("coach"); }}>🌿 Ask AI Coach</button>
              {exDetail.yt && (
                <a href={exDetail.yt} target="_blank" rel="noopener noreferrer" onClick={() => ev("youtube_opened", { exercise: exDetail.name })}
                  style={{display:"inline-flex",alignItems:"center",gap:6,background:"#FF0000",color:"#fff",borderRadius:"var(--r1)",padding:"9px 16px",fontSize:13,fontWeight:700,textDecoration:"none"}}>
                  ▶ {exDetail.ytlbl || "Watch on YouTube"}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PROGRESS */}
      {page === "progress" && (
        <div className="page"><div className="wrap"><div className="section">
          <div className="lbl">Your Progress</div>
          <h2 className="h2" style={{marginBottom:8}}>How you're <em>evolving</em>.</h2>
          <p className="body-text" style={{marginBottom:24,maxWidth:600}}>Your wellness journey, tracked over time. The more you check in, the clearer your patterns become.</p>

          {/* Summary stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:12,marginBottom:24}}>
            {[
              {label:"Day streak",value:streak,icon:"🔥"},
              {label:"Days logged",value:logEntries.length,icon:"📊"},
              {label:"Rituals done",value:logEntries.filter(e => e.morning || e.evening).length,icon:"✨"},
            ].map(s => (
              <div key={s.label} className="card" style={{textAlign:"center",padding:18}}>
                <div style={{fontSize:22,marginBottom:4}}>{s.icon}</div>
                <div style={{fontSize:28,fontFamily:"var(--fd)",fontWeight:600,color:"var(--gold-dark)",lineHeight:1}}>{s.value}</div>
                <div className="body-sm" style={{marginTop:4}}>{s.label}</div>
              </div>
            ))}
          </div>

          {!isPro ? (
            <div className="card-gold" style={{textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:8}}>📈</div>
              <h3 className="h3" style={{marginBottom:10}}>Unlock your full history</h3>
              <p className="body-text" style={{maxWidth:440,margin:"0 auto 16px"}}>
                Free shows your last 7 days. Upgrade to Pro to see your complete trends, patterns, and progress over time.
              </p>
              <button className="btn btn-gold" onClick={() => go("pricing")}>See Pro Plans</button>
              <div style={{marginTop:24,textAlign:"left"}}>
                <div className="lbl">Last 7 days</div>
                <div style={{display:"flex",flexDirection:"column",gap:18,marginTop:12}}>
                  <TrendChart data={chartData("mood", 7)} color="#1FA877" label="Mood" max={10} />
                  <TrendChart data={chartData("energy", 7)} color="#C9A84C" label="Energy" max={10} />
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="lbl">Your trends (last 30 days)</div>
              <div style={{display:"flex",flexDirection:"column",gap:20,marginTop:14}}>
                <TrendChart data={chartData("mood", 30)} color="#1FA877" label="Mood" max={10} />
                <TrendChart data={chartData("energy", 30)} color="#C9A84C" label="Energy" max={10} />
                <TrendChart data={chartData("stress", 30)} color="#D63B4F" label="Stress" max={10} />
                <TrendChart data={chartData("sleep", 30)} color="#3B7DD8" label="Sleep" max={12} unit="h" />
              </div>
            </div>
          )}

          {/* Recent entries list */}
          {logEntries.length > 0 && (
            <div className="card" style={{marginTop:16}}>
              <div className="lbl">Recent check-ins</div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:10}}>
                {logEntries.slice(-7).reverse().map(e => (
                  <div key={e.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid var(--border)",fontSize:13}}>
                    <span style={{fontWeight:700,color:"var(--text)"}}>{prettyDate(e.key)}</span>
                    <span style={{color:"var(--text3)",fontWeight:600,display:"flex",gap:10,flexWrap:"wrap"}}>
                      {e.mood != null && <span>😊 {e.mood}</span>}
                      {e.energy != null && <span>⚡ {e.energy}</span>}
                      {e.sleep != null && <span>💤 {e.sleep}h</span>}
                      {e.morning && <span>☀️</span>}
                      {e.evening && <span>🌙</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {logEntries.length === 0 && (
            <div className="card" style={{textAlign:"center",marginTop:16}}>
              <p className="body-text">No check-ins yet. Visit your <strong>Profile</strong> to log how you feel, or complete a morning/evening ritual — your progress will appear here.</p>
              <button className="btn btn-outline" style={{marginTop:14}} onClick={() => go("profile")}>Log my first check-in</button>
            </div>
          )}

          {/* Weekly report (Pro/Elite) */}
          {isPro && logEntries.length >= 2 && (
            <div className="card-gold" style={{marginTop:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div className="lbl" style={{margin:0}}>Weekly Wellness Report</div>
                <button className="readaloud" style={{padding:"6px 14px",fontSize:13}} onClick={() => generateReport()} disabled={reportLoading}>{reportLoading ? "Generating..." : "✨ Generate"}</button>
              </div>
              {report ? (
                <div style={{marginTop:14}}>
                  <div style={{fontSize:14,color:"var(--text)",lineHeight:1.7,whiteSpace:"pre-wrap",fontWeight:500}}>{report}</div>
                  <button className="btn btn-outline btn-sm" style={{marginTop:14}} onClick={() => speak(report)}>🔊 {speaking ? "Stop" : "Read aloud"}</button>
                </div>
              ) : (
                <p className="body-sm" style={{marginTop:10}}>Tap Generate for a personalised AI summary of your week — trends, wins, and a gentle suggestion for the days ahead.</p>
              )}
            </div>
          )}

          {/* What VITÁL remembers (Pro/Elite) — trust & control */}
          {isPro && (
            <div className="card" style={{marginTop:16}}>
              <div className="lbl">What VITÁL remembers about you</div>
              {memories.length === 0 ? (
                <p className="body-sm" style={{marginTop:8}}>As you chat with your AI Coach, it remembers what matters to you here — so guidance stays personal. Nothing is shared; it lives only on your device.</p>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:10}}>
                  {memories.slice().reverse().map((mem, ri) => {
                    const i = memories.length - 1 - ri;
                    return (
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,padding:"8px 10px",background:"var(--surface2)",borderRadius:"var(--r1)"}}>
                        <span style={{fontSize:13,color:"var(--text2)",fontWeight:500,lineHeight:1.5}}>{mem}</span>
                        <button onClick={() => removeMemory(i)} style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:16,flexShrink:0,lineHeight:1}}>×</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Doctor export (Elite) */}
          {isElite && logEntries.length >= 1 && (
            <div className="card-green" style={{marginTop:16}}>
              <div className="lbl" style={{color:"var(--green)"}}>Export for your doctor</div>
              <p className="body-sm" style={{marginTop:8,marginBottom:12}}>Download your wellness history as a spreadsheet (CSV) to share with your healthcare practitioner. Includes all your logged mood, energy, stress, sleep and rituals.</p>
              <button className="btn btn-green btn-sm" onClick={() => exportCSV()}>⬇ Download my wellness history (CSV)</button>
            </div>
          )}

        </div></div></div>
      )}

      {/* PROFILE */}
      {page === "profile" && (
        <div className="page"><div className="wrap"><div className="section">
          <div className="lbl">Health Profile</div>
          <h2 className="h2" style={{marginBottom:14}}>Your <em>wellness baseline</em>.</h2>
          <p className="body-text" style={{marginBottom:24,maxWidth:600}}>No wearable needed. All fields are optional. The more you share, the better your AI Coach can personalise.</p>
          <div className="card" style={{marginBottom:16}}>
            <div className="lbl">Your Wellness Goal</div>
            <select className="input" value={wellnessGoal} onChange={e => { setWellnessGoal(e.target.value); try { localStorage.setItem("v10goal", e.target.value); } catch {} }} style={{marginTop:8}}>
              {WELLNESS_GOALS.map(g => <option key={g.id} value={g.id}>{g.icon} {g.label}</option>)}
            </select>
          </div>
          <div className="card" style={{marginBottom:16}}>
            <div className="lbl">How are you feeling today?</div>
            <div style={{display:"flex",flexDirection:"column",gap:16,marginTop:12}}>
              {[{key:"energy",lbl:"Energy",lo:"Drained",hi:"Energised"},{key:"stress",lbl:"Stress",lo:"Calm",hi:"Stressed"},{key:"mood",lbl:"Mood",lo:"Low",hi:"Great"}].map(s => (
                <div key={s.key}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6,fontWeight:600}}>
                    <span style={{color:"var(--text2)"}}>{s.lbl}</span>
                    <span style={{color:"var(--gold-dark)",fontWeight:700}}>{profile[s.key]}/10</span>
                  </div>
                  <input type="range" min="1" max="10" className="slider" value={profile[s.key]} onChange={e => setProfile(p => ({...p, [s.key]: e.target.value}))} />
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--text3)",marginTop:3,fontWeight:600}}><span>{s.lo}</span><span>{s.hi}</span></div>
                </div>
              ))}
            </div>
          </div>
          {CLOUD_ON && (
            <div className="card" style={{marginBottom:14}}>
              <div className="lbl">Your Account</div>
              {session?.user ? (
                <>
                  <div style={{fontWeight:700,color:"var(--text)",fontSize:15,marginTop:6}}>{session.user.email}</div>
                  <p className="body-sm" style={{marginTop:4}}>
                    ☁️ Your progress is saved permanently and syncs across all your devices.
                    {syncState === "syncing" && <span style={{color:"var(--gold-dark)",fontWeight:600}}> Saving…</span>}
                    {syncState === "saved" && <span style={{color:"var(--green)",fontWeight:600}}> All changes saved.</span>}
                    {syncState === "error" && <span style={{color:"var(--text3)",fontWeight:600}}> Offline — will save when reconnected.</span>}
                  </p>
                  <button className="btn btn-outline btn-sm" style={{marginTop:12}} onClick={doLogout}>Sign out</button>
                </>
              ) : (
                <>
                  <p className="body-sm" style={{marginTop:6}}>
                    <strong>Your data is only on this device.</strong> Create a free account to save your streak, history and AI memory permanently — and use VITÁL on any device.
                  </p>
                  <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
                    <button className="btn btn-gold btn-sm" onClick={() => { setAuthMode("signup"); setAuthMsg(""); setShowAuth(true); ev("auth_opened", { from: "profile" }); }}>Create free account</button>
                    <button className="btn btn-outline btn-sm" onClick={() => { setAuthMode("login"); setAuthMsg(""); setShowAuth(true); }}>Sign in</button>
                  </div>
                </>
              )}
            </div>
          )}
          <div className="card" style={{marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
            <div>
              <div style={{fontWeight:700,color:"var(--text)",fontSize:15}}>Large text</div>
              <div className="body-sm">Bigger, easier-to-read text across the whole app</div>
            </div>
            <button className={"btn btn-sm " + (bigText ? "btn-gold" : "btn-outline")} onClick={toggleBigText}>{bigText ? "On" : "Off"}</button>
          </div>
          <div className="card" style={{marginBottom:16}}>
            <div className="lbl">Daily Basics</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
              <div><div style={{fontSize:12,color:"var(--text2)",marginBottom:4,fontWeight:600}}>Sleep hours</div><input type="number" step="0.5" className="input" value={profile.sleep_hours} onChange={e => setProfile(p => ({...p, sleep_hours: e.target.value}))} /></div>
              <div><div style={{fontSize:12,color:"var(--text2)",marginBottom:4,fontWeight:600}}>Water (L)</div><input type="number" step="0.5" className="input" value={profile.water} onChange={e => setProfile(p => ({...p, water: e.target.value}))} /></div>
            </div>
          </div>
          <button className="btn btn-gold" style={{width:"100%",padding:14,marginBottom:24}} onClick={() => { setProfileSaved(true); logToday({ mood: profile.mood, energy: profile.energy, stress: profile.stress, sleep: profile.sleep_hours, water: profile.water }); showToast("✓ Saved — today's check-in logged"); setTimeout(() => go("home"), 1100); }}>Save Profile</button>
          <div style={{paddingTop:24,borderTop:"1px solid var(--border)"}}>
            <div className="lbl">Account</div>

            <div style={{marginTop:12,marginBottom:16,padding:"16px",background:"var(--surface2)",borderRadius:"var(--r2)"}}>
              <div style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:6}}>Never lose your data</div>
              <p className="body-sm" style={{marginBottom:12}}>Your history is saved on this device. Back it up to a file so you can keep it forever or move it to a new phone.</p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <button className="btn btn-gold btn-sm" onClick={() => backupData()}>⬇ Back up my data</button>
                <label className="btn btn-outline btn-sm" style={{cursor:"pointer"}}>
                  ⬆ Restore from backup
                  <input type="file" accept="application/json,.json" style={{display:"none"}} onChange={e => { restoreData(e.target.files[0]); e.target.value = ""; }} />
                </label>
              </div>
            </div>

            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              <button onClick={() => setModal("privacy")} style={{background:"none",border:"none",color:"var(--text3)",fontSize:13,cursor:"pointer",fontWeight:600}}>Privacy Policy</button>
              <button onClick={() => setModal("terms")} style={{background:"none",border:"none",color:"var(--text3)",fontSize:13,cursor:"pointer",fontWeight:600}}>Terms of Service</button>
              <button onClick={() => setModal("disclaimer")} style={{background:"none",border:"none",color:"var(--text3)",fontSize:13,cursor:"pointer",fontWeight:600}}>Medical Disclaimer</button>
            </div>
            <button onClick={deleteAccount} style={{marginTop:18,background:"transparent",border:"1.5px solid rgba(214,59,79,.4)",color:"var(--red)",borderRadius:"var(--r1)",padding:"9px 18px",fontSize:12,cursor:"pointer",fontWeight:700}}>Delete My Account & All Data</button>

            {devUnlock && (
            <div style={{marginTop:24,paddingTop:20,borderTop:"1px dashed var(--border2)"}}>
              <div className="lbl">🔧 Test Mode (founder only)</div>
              <p className="body-sm" style={{marginBottom:10}}>Switch your plan to preview paid features.</p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[["free","Free"],["pro","Pro"]].map(([id,l]) => (
                  <button key={id} onClick={() => { setUserPlan(id); try { localStorage.setItem("v10plan", id); } catch {} showToast("Plan set to " + l + " (test)"); }}
                    className={"btn " + (userPlan === id ? "btn-gold" : "btn-outline") + " btn-sm"}>{l}</button>
                ))}
              </div>
              <p className="body-sm" style={{marginTop:8}}>Current plan: <strong style={{color:"var(--gold-dark)"}}>{userPlan.toUpperCase()}</strong></p>
            </div>
            )}
          </div>
        </div></div></div>
      )}

      {/* PRICING */}
      {page === "pricing" && (
        <div className="page"><div className="wrap"><div className="section">
          <div className="lbl" style={{textAlign:"center"}}>Pricing</div>
          <h2 className="h2" style={{textAlign:"center",marginBottom:14}}>Start free. <em>Scale when ready.</em></h2>
          {FOUNDER_MODE && (
            <div style={{maxWidth:560,margin:"0 auto 24px",background:"var(--gold-bg)",border:"1.5px solid var(--gold)",borderRadius:"var(--r3)",padding:"16px 20px",textAlign:"center"}}>
              <div style={{fontSize:13,fontWeight:700,color:"var(--gold-dark)",letterSpacing:".04em",marginBottom:6}}>🌟 FOUNDING MEMBER OFFER — FIRST {FOUNDER_SPOTS} ONLY</div>
              <p className="body-sm" style={{color:"var(--text2)"}}>Lock in founder pricing <strong>forever</strong>. As we add new features, the price rises for future members — but never for you. Our thank-you for believing early.</p>
            </div>
          )}
          <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:30}}>
            <button onClick={() => setAnnual(false)} className={"btn " + (!annual ? "btn-gold" : "btn-outline") + " btn-sm"}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={"btn " + (annual ? "btn-gold" : "btn-outline") + " btn-sm"}>Annual · Best Value</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
            {PLANS.map(plan => (
              <div key={plan.id} className={plan.featured ? "card-gold" : "card"} style={{position:"relative",border: plan.featured ? "2px solid var(--gold)" : undefined}}>
                {plan.badge && <div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:"var(--gold)",color:"#0A0A0A",fontSize:10,padding:"3px 12px",borderRadius:12,fontWeight:700}}>{plan.badge}</div>}
                {FOUNDER_MODE && plan.fprice && <div style={{background:"var(--gold-dark)",color:"#fff",fontSize:10,padding:"3px 10px",borderRadius:10,display:"inline-block",fontWeight:700,marginBottom:8,letterSpacing:".03em"}}>🌟 FOUNDER PRICE</div>}
                {plan.fbadge && <div style={{background:"var(--green-bg)",color:"var(--green)",fontSize:10,padding:"3px 10px",borderRadius:10,display:"inline-block",fontWeight:700,marginBottom:8}}>{plan.fbadge}</div>}
                <h3 className="h3" style={{marginBottom:6}}>{plan.tier}</h3>
                {FOUNDER_MODE && plan.fprice ? (
                  <>
                    <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:2,flexWrap:"wrap"}}>
                      <span style={{fontSize:30,fontFamily:"var(--fd)",fontWeight:500,color:"var(--text)"}}>R{annual ? plan.fyear : plan.fprice}<span style={{fontSize:13,color:"var(--text3)",fontWeight:600}}>{annual ? "/yr" : "/mo"}</span></span>
                      <span style={{fontSize:13,color:"var(--text3)",fontWeight:600}}>±${annual ? plan.fyearUsd : plan.fmonthUsd}</span>
                      <span style={{fontSize:15,color:"var(--text3)",fontWeight:600,textDecoration:"line-through"}}>R{annual ? plan.ap * 12 : plan.price}</span>
                    </div>
                    <div style={{fontSize:11,color:"var(--gold-dark)",marginBottom:10,fontWeight:700}}>{annual ? "≈ R" + Math.round(plan.fyear/12) + "/mo — locked forever" : "Founder rate — locked forever"}</div>
                  </>
                ) : (
                  <>
                    <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                      <span style={{fontSize:30,fontFamily:"var(--fd)",fontWeight:500,color:"var(--text)"}}>{plan.price === 0 ? "Free" : "R" + (annual ? plan.ap : plan.price)}{plan.price > 0 && <span style={{fontSize:13,color:"var(--text3)",fontWeight:600}}>/mo</span>}</span>
                      {plan.regUsd > 0 && <span style={{fontSize:13,color:"var(--text3)",fontWeight:600}}>±${plan.regUsd}</span>}
                    </div>
                    {annual && plan.ap > 0 && <div style={{fontSize:11,color:"var(--green)",marginBottom:10,fontWeight:700}}>billed annually</div>}
                  </>
                )}
                <p className="body-sm" style={{marginBottom:16}}>{plan.desc}</p>
                <div style={{height:1,background:"var(--border)",margin:"14px 0"}} />
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:13}}>
                      <span style={{color: f.i ? "var(--green)" : "var(--text3)",flexShrink:0,fontWeight:700}}>{f.i ? "✓" : "○"}</span>
                      <span style={{color: f.i ? "var(--text2)" : "var(--text3)",fontWeight:500}}>{f.t}</span>
                    </div>
                  ))}
                </div>
                <button className={"btn btn-" + plan.btn} style={{width:"100%",padding:12}} onClick={() => selectPlan(plan.id)}>{plan.cta}</button>
              </div>
            ))}
          </div>
          <p className="body-sm" style={{textAlign:"center",marginTop:24}}>Cancel anytime · Secure payment via Paystack · Receipts emailed automatically</p>
          <p className="body-sm" style={{textAlign:"center",marginTop:6,fontSize:12}}>Billed in South African Rand (ZAR). USD shown (±) is approximate.</p>
          <p className="body-sm" style={{textAlign:"center",marginTop:10,fontSize:12.5,fontWeight:600}}>For comparison: Calm ~R320/mo · Headspace ~R240/mo · <span style={{color:"var(--gold-dark)",fontWeight:700}}>VITÁL Founder R149/mo — locked forever</span></p>
        </div></div></div>
      )}

      {/* AUTH MODAL */}
      {showAuth && CLOUD_ON && (
        <div className="modal-bg" onClick={() => setShowAuth(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth:420}}>
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:34,marginBottom:8}}>☁️</div>
              <h3 className="h3">{authMode === "signup" ? "Save your progress forever" : authMode === "login" ? "Welcome back" : "Reset your password"}</h3>
              <p className="body-sm" style={{marginTop:6}}>
                {authMode === "signup"
                  ? "Free account. Your streak, history and AI memory sync to every device — and are never lost."
                  : authMode === "login"
                  ? "Sign in to restore your wellness journey."
                  : "We'll email you a secure link to set a new password."}
              </p>
            </div>

            <input className="input" type="email" autoComplete="email" placeholder="Email address" value={authEmail}
              onChange={e => setAuthEmail(e.target.value)} style={{width:"100%",marginBottom:10}} />

            {authMode !== "reset" && (
              <input className="input" type="password" autoComplete={authMode === "signup" ? "new-password" : "current-password"}
                placeholder={authMode === "signup" ? "Create a password (min 6 characters)" : "Password"} value={authPass}
                onChange={e => setAuthPass(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !authBusy) { authMode === "signup" ? doSignup() : doLogin(); } }}
                style={{width:"100%",marginBottom:10}} />
            )}

            {authMsg && (
              <div style={{fontSize:13,fontWeight:600,marginBottom:10,padding:"10px 12px",borderRadius:"var(--r2)",
                background: authMsg.startsWith("✓") ? "var(--green-bg)" : "var(--gold-bg)",
                color: authMsg.startsWith("✓") ? "var(--green)" : "var(--gold-dark)"}}>{authMsg}</div>
            )}

            <button className="btn btn-gold" style={{width:"100%",padding:13,marginBottom:10}} disabled={authBusy || !authEmail || (authMode !== "reset" && !authPass)}
              onClick={() => { authMode === "signup" ? doSignup() : authMode === "login" ? doLogin() : doReset(); }}>
              {authBusy ? "Please wait…" : authMode === "signup" ? "Create free account" : authMode === "login" ? "Sign in" : "Send reset link"}
            </button>

            <div style={{textAlign:"center",fontSize:13,color:"var(--text3)",fontWeight:600}}>
              {authMode === "signup" && <span>Already have an account? <button onClick={() => { setAuthMode("login"); setAuthMsg(""); }} style={{background:"none",border:"none",color:"var(--gold-dark)",fontWeight:700,cursor:"pointer",fontSize:13}}>Sign in</button></span>}
              {authMode === "login" && <span>New here? <button onClick={() => { setAuthMode("signup"); setAuthMsg(""); }} style={{background:"none",border:"none",color:"var(--gold-dark)",fontWeight:700,cursor:"pointer",fontSize:13}}>Create an account</button> · <button onClick={() => { setAuthMode("reset"); setAuthMsg(""); }} style={{background:"none",border:"none",color:"var(--text3)",fontWeight:700,cursor:"pointer",fontSize:13}}>Forgot password?</button></span>}
              {authMode === "reset" && <button onClick={() => { setAuthMode("login"); setAuthMsg(""); }} style={{background:"none",border:"none",color:"var(--gold-dark)",fontWeight:700,cursor:"pointer",fontSize:13}}>Back to sign in</button>}
            </div>

            <button className="btn btn-outline btn-sm" style={{width:"100%",marginTop:14}} onClick={() => setShowAuth(false)}>Maybe later</button>
          </div>
        </div>
      )}

      {/* UPGRADE MODAL */}
      {showUpgrade && (
        <div className="modal-ov" onClick={() => setShowUpgrade(false)}>
          <div style={{background:"var(--surface)",borderRadius:"var(--r3)",maxWidth:400,width:"100%",padding:28,textAlign:"center",border:"2px solid var(--gold)"}} onClick={e => e.stopPropagation()}>
            <div style={{fontSize:40,marginBottom:12}}>✨</div>
            <h3 className="h3" style={{color:"var(--gold-dark)",marginBottom:10}}>Daily Limit Reached</h3>
            <p className="body-text" style={{marginBottom:20}}>You've used your {FREE_DAILY_LIMIT} free AI messages today. Upgrade to Pro for unlimited coaching.</p>
            <div style={{background:"var(--gold-bg)",borderRadius:"var(--r2)",padding:16,marginBottom:18,border:"1px solid var(--gb)"}}>
              {FOUNDER_MODE ? (
                <div style={{color:"var(--gold-dark)",fontSize:16,fontWeight:700,marginBottom:10}}>
                  <div style={{fontSize:10,letterSpacing:".04em",marginBottom:4}}>🌟 FOUNDING MEMBER — FIRST {FOUNDER_SPOTS}</div>
                  Pro — R149<span style={{fontSize:13,fontWeight:600}}>/mo</span> <span style={{fontSize:12,color:"var(--text3)",fontWeight:600}}>±$9</span> <span style={{fontSize:13,textDecoration:"line-through",color:"var(--text3)",fontWeight:600}}>R239</span>
                  <div style={{fontSize:11,fontWeight:600,color:"var(--text3)",marginTop:2}}>Locked forever — price rises later for new members</div>
                </div>
              ) : (
                <div style={{color:"var(--gold-dark)",fontSize:16,fontWeight:700,marginBottom:10}}>Pro — R239/month <span style={{fontSize:12,color:"var(--text3)",fontWeight:600}}>±$14</span></div>
              )}
              <div style={{display:"flex",flexDirection:"column",gap:6,fontSize:13,textAlign:"left"}}>
                {["Unlimited AI coaching","AI remembers your journey","Longer, deeper responses","All 9 wellness modes"].map(f => (
                  <div key={f} style={{display:"flex",gap:8,color:"var(--text2)",fontWeight:600}}><span style={{color:"var(--green)",fontWeight:700}}>✓</span> {f}</div>
                ))}
              </div>
            </div>
            <button className="btn btn-gold" style={{width:"100%",padding:13,marginBottom:10}} onClick={() => { if (CLOUD_ON && !session?.user) { ev("auth_required_for_checkout"); setShowUpgrade(false); setAuthMode("signup"); setAuthMsg("Create your free account first — this links your subscription to you, so Pro unlocks on every device."); setShowAuth(true); return; } ev("checkout_started", { plan: "pro", billing: "monthly", from: "paywall_modal", founder: FOUNDER_MODE, email: session?.user?.email }); setShowUpgrade(false); window.open(FOUNDER_MODE ? PAYSTACK.founder_monthly : PAYSTACK.pro_monthly, "_blank"); }}>{FOUNDER_MODE ? "Claim Founder Price — R149/mo" : "Upgrade to Pro Now"}</button>
            <button onClick={() => setShowUpgrade(false)} style={{background:"none",border:"none",color:"var(--text3)",fontSize:13,cursor:"pointer",fontWeight:600}}>Continue with free plan</button>
          </div>
        </div>
      )}

      {/* LEGAL MODALS */}
      {modal && LEGAL[modal] && (
        <div className="modal-ov" onClick={() => setModal(null)}>
          <div style={{background:"var(--surface)",borderRadius:"var(--r3)",maxWidth:600,width:"100%",maxHeight:"86vh",overflowY:"auto",padding:24}} onClick={e => e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 className="h3">{LEGAL[modal].title}</h3>
              <button onClick={() => setModal(null)} style={{background:"none",border:"none",fontSize:22,color:"var(--text3)",cursor:"pointer"}}>×</button>
            </div>
            <div style={{fontSize:13.5,color:"var(--text2)",lineHeight:1.7,whiteSpace:"pre-wrap",fontWeight:500}}>{LEGAL[modal].body}</div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{padding:"30px 20px",background:"var(--surface)",borderTop:"1px solid var(--border)",textAlign:"center"}}>
        <div className="nav-logo" style={{marginBottom:10}}>VITÁL ®</div>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:16}}>
          {[["morning","Morning"],["evening","Evening"],["exercises","Exercises"],["pricing","Pricing"]].map(([p,l]) => (
            <button key={p} onClick={() => go(p)} style={{background:"none",border:"none",color:"var(--text3)",fontSize:12,cursor:"pointer",fontWeight:600}}>{l}</button>
          ))}
          <button onClick={() => setModal("terms")} style={{background:"none",border:"none",color:"var(--text3)",fontSize:12,cursor:"pointer",fontWeight:600}}>Terms</button>
          <button onClick={() => setModal("privacy")} style={{background:"none",border:"none",color:"var(--text3)",fontSize:12,cursor:"pointer",fontWeight:600}}>Privacy</button>
          <button onClick={() => setModal("disclaimer")} style={{background:"none",border:"none",color:"var(--text3)",fontSize:12,cursor:"pointer",fontWeight:600}}>⚠️ Disclaimer</button>
        </div>
        <div style={{fontSize:11,color:"var(--text3)",fontWeight:600}}>© 2026 VITÁL · ABC UP PTY LTD · hello@myvital.app</div>
      </footer>
    </div>
  );
}
