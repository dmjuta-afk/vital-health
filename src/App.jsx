import { useState, useRef, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════
   VITÁL v10 — AI Wellness Companion · ABC UP PTY LTD © 2026
   Light theme · Bold black text · All features · Built to last
═══════════════════════════════════════════════════════════════ */

const PAYSTACK = {
  pro_monthly: "https://paystack.shop/pay/1mwfesczze",
  pro_annual:  "https://paystack.shop/pay/chq70ice7y",
  elite_monthly: "https://paystack.shop/pay/u4ikzukjjx",
  elite_annual:  "https://paystack.shop/pay/u4ikzukjjx",
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

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#ECECEF;--surface:#FFFFFF;--surface2:#F4F4F6;--surface3:#EAEAEE;
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
.nav-btn{background:none;border:none;color:var(--text2);font-size:14px;padding:7px 11px;border-radius:var(--r1);white-space:nowrap;font-weight:600;transition:all .15s}
.nav-btn:hover{background:var(--surface2)}
.nav-btn.active{color:var(--gold-dark);background:rgba(201,168,76,.16);font-weight:700}
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

.gate{position:fixed;inset:0;background:rgba(40,40,45,.55);z-index:999;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(6px)}
.gate-box{background:var(--surface);border-radius:var(--r3);width:100%;max-width:540px;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.28)}
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

  // ─── DERIVED ───
  const isPro = userPlan === "pro" || userPlan === "elite";
  const isElite = userPlan === "elite";
  const canChat = isPro || dailyMsgCount < FREE_DAILY_LIMIT;
  const remainingFree = Math.max(0, FREE_DAILY_LIMIT - dailyMsgCount);
  const vitalityScore = useMemo(() => {
    const raw = (parseInt(profile.energy || 5) * 8) + ((10 - parseInt(profile.stress || 5)) * 5) + (parseInt(profile.mood || 5) * 5) + (parseFloat(profile.water || 2) * 6) + (parseFloat(profile.sleep_hours || 7) * 3);
    return Math.min(100, Math.round((raw / 234) * 100));
  }, [profile]);

  // ─── HELPERS ───
  const go = (p) => { setPage(p); window.scrollTo(0, 0); };
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 3000); };

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

  const deleteAccount = () => {
    if (!window.confirm("Delete all your VITÁL data permanently? This cannot be undone.")) return;
    try { ["v10","v10onb","v10goal","v10plan","v10msg","v10streak","v10last"].forEach(k => localStorage.removeItem(k)); } catch {}
    showToast("All data deleted. Restarting...");
    setTimeout(() => window.location.reload(), 1400);
  };

  const selectPlan = (id) => {
    if (id === "free") { go("morning"); return; }
    const link = PAYSTACK[id + (annual ? "_annual" : "_monthly")];
    if (link) window.open(link, "_blank");
  };

  // ─── AI CHAT ───
  const sendChat = async (txt) => {
    const m = (txt || inp).trim();
    if (!m || aiLoading) return;
    if (!canChat) { setShowUpgrade(true); return; }

    setInp("");
    setMsgs(p => [...p, { role: "user", text: m }]);
    setAiLoading(true);
    if (!isPro) incrementMsg();
    updateStreak();

    try {
      const hist = msgs.filter(x => x.role !== "system").map(x => ({ role: x.role === "ai" ? "assistant" : "user", content: x.text }));
      const goalLabel = WELLNESS_GOALS.find(g => g.id === wellnessGoal)?.label || "";
      const profCtx = profileSaved ? `User: energy ${profile.energy}/10, stress ${profile.stress}/10, sleep ${profile.sleep_hours}h. ` : "";
      const goalCtx = goalLabel ? `Primary goal: ${goalLabel}. ` : "";
      const memCtx = isPro && streak > 2 ? `User has practiced ${streak} days — acknowledge naturally. ` : "";
      const sys = `You are VITÁL Intelligence Engine — a warm, wise, emotionally intelligent AI wellness companion. ${profCtx}${goalCtx}${memCtx}Current mode: ${aiMode}. Draw from herbal medicine, Ayurveda, yoga, breathwork, meditation, sleep science, and longevity research. Be warm, concise, genuinely helpful. Keep responses to 2-3 short paragraphs. Never diagnose or advise changing medication. Respond naturally — no disclaimers on every message.${isPro ? " You know this user personally." : ""}`;

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
              onClick={() => { try { localStorage.setItem("v10","y"); } catch {} setAccepted(true); }}>
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
        <div className="gate-box" style={{maxWidth:480}}>
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
              onClick={() => { try { localStorage.setItem("v10onb","y"); localStorage.setItem("v10goal",wellnessGoal); } catch {} setOnboarded(true); showToast("✨ Welcome to your VITÁL journey"); }}>
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
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => go("home")}>VITÁL</div>
        <div className="nav-links">
          {[["home","Home"],["morning","Morning"],["evening","Evening"],["coach","AI Coach"],["exercises","Exercises"],["profile","Profile"],["pricing","Pricing"]].map(([p,l]) => (
            <button key={p} className={"nav-btn " + (page === p ? "active" : "")} onClick={() => go(p)}>{l}</button>
          ))}
        </div>
        <div className="nav-right">
          {streak > 0 && (
            <div style={{display:"flex",alignItems:"center",gap:4,background:"var(--gold-bg)",border:"1px solid var(--gb)",borderRadius:20,padding:"4px 10px",fontSize:12,color:"var(--gold-dark)",fontWeight:700}}>🔥 {streak}</div>
          )}
          {isPro ? (
            <div style={{background:"var(--gold)",borderRadius:20,padding:"4px 12px",fontSize:11,color:"#0A0A0A",fontWeight:700,letterSpacing:1}}>{isElite ? "ELITE" : "PRO"} ✦</div>
          ) : (
            <button className="btn btn-gold btn-sm" onClick={() => go("pricing")}>Get Pro</button>
          )}
        </div>
      </nav>

      {/* TOAST */}
      {toast && (
        <div style={{position:"fixed",top:78,left:"50%",transform:"translateX(-50%)",background:"var(--surface)",border:"1.5px solid var(--gold)",borderRadius:"var(--r2)",padding:"11px 20px",fontSize:13,fontWeight:600,color:"var(--text)",zIndex:500,boxShadow:"var(--shadow2)",maxWidth:"90vw",textAlign:"center"}}>{toast}</div>
      )}

      {/* HOME */}
      {page === "home" && (
        <div className="page">
          <div className="wrap">
            <div className="section" style={{textAlign:"center"}}>
              <div className="lbl">AI Wellness Companion</div>
              <h1 className="h1" style={{maxWidth:760,margin:"0 auto 18px"}}>Your daily ritual for <em>vitality</em>,<br/>guided by intelligence.</h1>
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
          <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
            {[["2","2 min"],["5","5 min"],["10","10 min"],["20","20+ min"]].map(([v,l]) => (
              <button key={v} onClick={() => setMorningTime(v)} className={"btn " + (morningTime === v ? "btn-gold" : "btn-outline") + " btn-sm"} style={{minWidth:78}}>{l}</button>
            ))}
          </div>
          {MORNING_ROUTINES[morningTime] && (
            <div className="card-gold" style={{marginBottom:20}}>
              <div className="lbl">Your Practice</div>
              <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:10}}>
                {MORNING_ROUTINES[morningTime].map((step, i) => (
                  <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{fontSize:24}}>{step.icon}</div>
                    <div>
                      <div style={{fontWeight:700,color:"var(--text)",fontSize:15}}>{step.name} <span style={{color:"var(--gold-dark)",fontSize:12,fontWeight:600}}>· {step.dur}</span></div>
                      <div className="body-sm">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-gold" style={{marginTop:18,width:"100%"}} onClick={() => { updateStreak(); showToast("✨ Morning ritual complete!"); }}>Complete Ritual</button>
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
          <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
            {[["2","2 min"],["5","5 min"],["10","10 min"],["20","20+ min"]].map(([v,l]) => (
              <button key={v} onClick={() => setEveningTime(v)} className={"btn " + (eveningTime === v ? "btn-gold" : "btn-outline") + " btn-sm"} style={{minWidth:78}}>{l}</button>
            ))}
          </div>
          {EVENING_ROUTINES[eveningTime] && (
            <div className="card-gold" style={{marginBottom:20}}>
              <div className="lbl">Your Practice</div>
              <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:10}}>
                {EVENING_ROUTINES[eveningTime].map((step, i) => (
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
          <button className="btn btn-gold" style={{width:"100%"}} onClick={() => { updateStreak(); showToast("🌙 Evening ritual complete. Rest well."); }}>Complete Evening Ritual</button>
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
            {[["yoga","🧘 Yoga"],["breathing","🫁 Breathwork"],["taichi","🌊 Tai Chi"]].map(([v,l]) => (
              <button key={v} onClick={() => setExCat(v)} className={"btn " + (exCat === v ? "btn-gold" : "btn-outline") + " btn-sm"}>{l}</button>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
            {(exCat === "yoga" ? YOGA_DATA : exCat === "breathing" ? BREATH_DATA : TAICHI_DATA).map((ex, i) => (
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
            </div>
          </div>
        </div>
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
          <div className="card" style={{marginBottom:16}}>
            <div className="lbl">Daily Basics</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
              <div><div style={{fontSize:12,color:"var(--text2)",marginBottom:4,fontWeight:600}}>Sleep hours</div><input type="number" step="0.5" className="input" value={profile.sleep_hours} onChange={e => setProfile(p => ({...p, sleep_hours: e.target.value}))} /></div>
              <div><div style={{fontSize:12,color:"var(--text2)",marginBottom:4,fontWeight:600}}>Water (L)</div><input type="number" step="0.5" className="input" value={profile.water} onChange={e => setProfile(p => ({...p, water: e.target.value}))} /></div>
            </div>
          </div>
          <button className="btn btn-gold" style={{width:"100%",padding:14,marginBottom:24}} onClick={() => { setProfileSaved(true); showToast("✓ Profile saved — your AI is now personalised"); setTimeout(() => go("home"), 1100); }}>Save Profile</button>
          <div style={{paddingTop:24,borderTop:"1px solid var(--border)"}}>
            <div className="lbl">Account</div>
            <div style={{marginTop:12,display:"flex",gap:16,flexWrap:"wrap"}}>
              <button onClick={() => setModal("privacy")} style={{background:"none",border:"none",color:"var(--text3)",fontSize:13,cursor:"pointer",fontWeight:600}}>Privacy Policy</button>
              <button onClick={() => setModal("terms")} style={{background:"none",border:"none",color:"var(--text3)",fontSize:13,cursor:"pointer",fontWeight:600}}>Terms of Service</button>
              <button onClick={() => setModal("disclaimer")} style={{background:"none",border:"none",color:"var(--text3)",fontSize:13,cursor:"pointer",fontWeight:600}}>Medical Disclaimer</button>
            </div>
            <button onClick={deleteAccount} style={{marginTop:18,background:"transparent",border:"1.5px solid rgba(214,59,79,.4)",color:"var(--red)",borderRadius:"var(--r1)",padding:"9px 18px",fontSize:12,cursor:"pointer",fontWeight:700}}>Delete My Account & All Data</button>
          </div>
        </div></div></div>
      )}

      {/* PRICING */}
      {page === "pricing" && (
        <div className="page"><div className="wrap"><div className="section">
          <div className="lbl" style={{textAlign:"center"}}>Pricing</div>
          <h2 className="h2" style={{textAlign:"center",marginBottom:14}}>Start free. <em>Scale when ready.</em></h2>
          <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:30}}>
            <button onClick={() => setAnnual(false)} className={"btn " + (!annual ? "btn-gold" : "btn-outline") + " btn-sm"}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={"btn " + (annual ? "btn-gold" : "btn-outline") + " btn-sm"}>Annual · Save 30%</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
            {PLANS.map(plan => (
              <div key={plan.id} className={plan.featured ? "card-gold" : "card"} style={{position:"relative",border: plan.featured ? "2px solid var(--gold)" : undefined}}>
                {plan.badge && <div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:"var(--gold)",color:"#0A0A0A",fontSize:10,padding:"3px 12px",borderRadius:12,fontWeight:700}}>{plan.badge}</div>}
                {plan.fbadge && <div style={{background:"var(--green-bg)",color:"var(--green)",fontSize:10,padding:"3px 10px",borderRadius:10,display:"inline-block",fontWeight:700,marginBottom:8}}>{plan.fbadge}</div>}
                <h3 className="h3" style={{marginBottom:6}}>{plan.tier}</h3>
                <div style={{fontSize:32,fontFamily:"var(--fd)",fontWeight:500,color:"var(--text)",marginBottom:4}}>${annual ? plan.ap : plan.price}<span style={{fontSize:13,color:"var(--text3)",fontWeight:600}}>/mo</span></div>
                {annual && plan.ap > 0 && <div style={{fontSize:11,color:"var(--green)",marginBottom:10,fontWeight:700}}>billed annually</div>}
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
        </div></div></div>
      )}

      {/* UPGRADE MODAL */}
      {showUpgrade && (
        <div className="modal-ov" onClick={() => setShowUpgrade(false)}>
          <div style={{background:"var(--surface)",borderRadius:"var(--r3)",maxWidth:400,width:"100%",padding:28,textAlign:"center",border:"2px solid var(--gold)"}} onClick={e => e.stopPropagation()}>
            <div style={{fontSize:40,marginBottom:12}}>✨</div>
            <h3 className="h3" style={{color:"var(--gold-dark)",marginBottom:10}}>Daily Limit Reached</h3>
            <p className="body-text" style={{marginBottom:20}}>You've used your {FREE_DAILY_LIMIT} free AI messages today. Upgrade to Pro for unlimited coaching.</p>
            <div style={{background:"var(--gold-bg)",borderRadius:"var(--r2)",padding:16,marginBottom:18,border:"1px solid var(--gb)"}}>
              <div style={{color:"var(--gold-dark)",fontSize:16,fontWeight:700,marginBottom:10}}>Pro — $12.99/month</div>
              <div style={{display:"flex",flexDirection:"column",gap:6,fontSize:13,textAlign:"left"}}>
                {["Unlimited AI coaching","AI remembers your journey","Longer, deeper responses","All 9 wellness modes"].map(f => (
                  <div key={f} style={{display:"flex",gap:8,color:"var(--text2)",fontWeight:600}}><span style={{color:"var(--green)",fontWeight:700}}>✓</span> {f}</div>
                ))}
              </div>
            </div>
            <button className="btn btn-gold" style={{width:"100%",padding:13,marginBottom:10}} onClick={() => { setShowUpgrade(false); window.open(PAYSTACK.pro_monthly, "_blank"); }}>Upgrade to Pro Now</button>
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
    </>
  );
}
