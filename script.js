// Gaurav Swami portfolio — HTML/CSS/JS only, live GitHub data
const USERNAME = "gourav-swami";
const EMAIL = "gouravswami9785@gmail.com";
const WHATSAPP = "919785377685";

// Curated descriptions because GitHub API descriptions are empty
const CURATED = {
  "ExamGpt": {
    desc: "AI exam tutor for NEET, JEE & custom exams. Monorepo with Next.js 16 web, Expo mobile, Express + tRPC + Inngest server, Prisma DB and shared AI model registry.",
    tags: ["JavaScript", "Next.js", "tRPC", "Prisma", "AI"]
  },
  "sparrow-": {
    desc: "Hedwigs-style AI integrations platform (Next.js 15, TypeScript). Clerk auth, Supabase, Prisma, 20+ integrations — Gmail, Slack, Jira, Linear, Notion, Drive.",
    tags: ["TypeScript", "Next.js", "Clerk", "Supabase"],
    demo: "https://www.hedwigs.site"
  },
  "Leetcode-Dsa-": {
    desc: "Data Structures & Algorithms practice in C++ — LeetCode solutions covering arrays, DP, graphs, trees, greedy and number theory.",
    tags: ["C++", "DSA", "LeetCode"]
  },
  "java_projects": {
    desc: "Collection of Java projects exploring OOP, collections, file handling and mini console apps.",
    tags: ["Java", "OOP"]
  },
  "python_project": {
    desc: "Python mini-projects and automation scripts — fundamentals, file handling and small utilities.",
    tags: ["Python"]
  },
  "project": {
    desc: "Java starter project — core Java concepts, OOP structure and clean code practice.",
    tags: ["Java"]
  }
};

function esc(s){return String(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}

async function loadGitHub(){
  const grid = document.getElementById("projectGrid");
  const status = document.getElementById("liveStatus");
  try{
    const [userRes, repoRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`),
      fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=20`)
    ]);
    if(!repoRes.ok) throw new Error("API error "+repoRes.status);
    const repos = await repoRes.json();
    const user = userRes.ok ? await userRes.json() : null;

    const count = user ? user.public_repos : repos.length;
    document.getElementById("repoCountTop").textContent = count;
    document.getElementById("statRepos").textContent = count;
    if(repos.length){
      const latest = new Date(repos[0].pushed_at).toLocaleDateString("en-IN",{month:"short",year:"numeric"});
      document.getElementById("statUpdated").textContent = latest;
    }

    // priority order: biggest/most interesting first
    const order = ["ExamGpt","sparrow-","Leetcode-Dsa-","java_projects","python_project","project"];
    repos.sort((a,b)=> order.indexOf(a.name) - order.indexOf(b.name) || b.size - a.size);

    grid.innerHTML = repos.map(r=>{
      const c = CURATED[r.name] || {};
      const desc = esc(r.description || c.desc || "Project by Gaurav Swami — code, docs and experiments on GitHub.");
      const lang = esc(r.language || "Code");
      const tags = (c.tags || (r.language?[r.language]:[])).map(t=>`<span>${esc(t)}</span>`).join("");
      const demo = c.demo || (r.homepage && r.homepage.startsWith("http") ? r.homepage : (r.homepage ? "https://"+r.homepage : null));
      return `<article class="card proj reveal visible">
        <div class="proj-top"><span class="lang">${lang}</span><span class="proj-meta">★ ${r.stargazers_count} · ⑂ ${r.forks_count}</span></div>
        <h3><a href="${r.html_url}" target="_blank" rel="noopener">${esc(r.name)}</a></h3>
        <p>${desc}</p>
        <div class="proj-tags">${tags}</div>
        <div class="proj-links">
          <a href="${r.html_url}" target="_blank" rel="noopener">Code →</a>
          ${demo?`<a href="${demo}" target="_blank" rel="noopener">Live Demo →</a>`:""}
        </div>
        <div class="proj-meta">updated ${new Date(r.pushed_at).toLocaleDateString("en-IN")}</div>
      </article>`;
    }).join("");

    status.textContent = "● live via GitHub API";
    status.classList.remove("off");
    observeReveals();
    bindMagicCards(grid);
  }catch(e){
    status.textContent = "● offline — showing cached projects";
    status.classList.add("off");
    // fallback static render from curated data
    grid.innerHTML = Object.entries(CURATED).map(([name,c])=>`
      <article class="card proj reveal visible">
        <div class="proj-top"><span class="lang">${esc(c.tags[0])}</span></div>
        <h3><a href="https://github.com/${USERNAME}/${name}" target="_blank" rel="noopener">${esc(name)}</a></h3>
        <p>${esc(c.desc)}</p>
        <div class="proj-tags">${c.tags.map(t=>`<span>${esc(t)}</span>`).join("")}</div>
        <div class="proj-links"><a href="https://github.com/${USERNAME}/${name}" target="_blank" rel="noopener">Code →</a></div>
      </article>`).join("");
    bindMagicCards(grid);
  }
}

// typing effect
function typeLoop(el, words){
  let wi=0, ci=0, del=false;
  (function tick(){
    const w = words[wi];
    el.textContent = w.slice(0, ci);
    if(!del){ ci++; if(ci>w.length){ del=true; return setTimeout(tick,1400);} }
    else{ ci--; if(ci===0){ del=false; wi=(wi+1)%words.length; } }
    setTimeout(tick, del?40:80);
  })();
}

// Magic UI-inspired depth: spotlight + 3D tilt (vanilla JS, no libs)
const canTilt = window.matchMedia("(hover:hover)").matches &&
                !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function bindMagicCards(scope=document){
  scope.querySelectorAll(".card:not([data-magic])").forEach(card=>{
    card.dataset.magic = "1";
    let raf = null;
    card.addEventListener("mousemove", (e)=>{
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", (px*100).toFixed(1)+"%");
      card.style.setProperty("--my", (py*100).toFixed(1)+"%");
      card.style.setProperty("--glow-opacity", "1");
      card.style.setProperty("--border-opacity", "1");
      if(!canTilt) return;
      if(raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>{
        const rX = ((0.5 - py) * 8).toFixed(2);   // max ~4deg
        const rY = ((px - 0.5) * 10).toFixed(2);  // max ~5deg
        card.style.transform = `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-4px) scale(1.01)`;
        card.classList.add("tilting");
      });
    });
    card.addEventListener("mouseleave", ()=>{
      if(raf) cancelAnimationFrame(raf);
      card.style.setProperty("--glow-opacity", "0");
      card.style.setProperty("--border-opacity", "0");
      card.classList.remove("tilting");
      card.style.transition = "transform .5s cubic-bezier(.2,.8,.2,1), border-color .25s, box-shadow .25s";
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
      setTimeout(()=>{ card.style.transition = ""; }, 500);
    });
  });
}

// Custom cursor: dot (instant) + ring (smooth lag) + name magnetic hover
function initCustomCursor(){
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  const heroName = document.getElementById("heroName");
  if(!dot || !ring) return;
  const fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!fine || reduced){ dot.style.display = "none"; ring.style.display = "none"; return; }

  let mx = innerWidth/2, my = innerHeight/2, rx = mx, ry = my;
  let shown = false;
  dot.style.opacity = "0"; ring.style.opacity = "0";

  addEventListener("mousemove", (e)=>{
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx+"px"; dot.style.top = my+"px";
    if(!shown){ shown = true; dot.style.opacity = "1"; ring.style.opacity = "1"; }
  }, {passive:true});
  document.addEventListener("mouseleave", ()=>{ dot.style.opacity = "0"; ring.style.opacity = "0"; shown = false; });
  document.addEventListener("mouseenter", ()=>{ dot.style.opacity = "1"; ring.style.opacity = "1"; shown = true; });

  (function loop(){
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.left = rx+"px"; ring.style.top = ry+"px";
    requestAnimationFrame(loop);
  })();

  addEventListener("mousedown", ()=>{ dot.classList.add("is-down"); ring.classList.add("is-down"); });
  addEventListener("mouseup", ()=>{ dot.classList.remove("is-down"); ring.classList.remove("is-down"); });

  // ring bada karo jab links / buttons / cards par hover ho
  document.querySelectorAll("a, button, .card, input, textarea").forEach(el=>{
    el.addEventListener("mouseenter", ()=> ring.classList.add("is-hover"));
    el.addEventListener("mouseleave", ()=> ring.classList.remove("is-hover"));
  });

  // ---- Naam par hover = cursor react + letters move ----
  if(heroName){
    // har letter ko alag span me todo taaki wave/magnetic ho sake
    heroName.innerHTML = heroName.innerHTML.split("<br>").map(part=>{
      const tmp = document.createElement("div");
      tmp.innerHTML = part;
      const text = tmp.textContent;
      const accent = part.includes("accent");
      const letters = [...text].map((ch,i)=>`<span class="letter" style="animation-delay:${i*35}ms;${accent?"color:var(--accent)":""}">${ch===" "?"&nbsp;":esc(ch)}</span>`).join("");
      return `<span class="name-line">${letters}</span>`;
    }).join("<br>");

    const letters = heroName.querySelectorAll(".letter");
    heroName.addEventListener("mouseenter", ()=> ring.classList.add("is-name-hover"));
    heroName.addEventListener("mouseleave", ()=>{
      ring.classList.remove("is-name-hover");
      letters.forEach(l=>{ l.style.transform = ""; });
    });
    // magnetic: mouse ke paas wale letters thoda door bhaagte hain
    heroName.addEventListener("mousemove", (e)=>{
      letters.forEach(l=>{
        const r = l.getBoundingClientRect();
        const cx = r.left + r.width/2, cy = r.top + r.height/2;
        const dx = cx - e.clientX, dy = cy - e.clientY;
        const dist = Math.hypot(dx,dy) || 1;
        const radius = 90;
        if(dist < radius){
          const force = (radius - dist) / radius; // 0..1
          l.style.transform = `translate(${(-dx/dist*force*-18).toFixed(1)}px, ${(-dy/dist*force*-18).toFixed(1)}px)`;
        } else {
          l.style.transform = "";
        }
      });
    });
  }
}

// nav + reveal + form
function observeReveals(){
  const els = document.querySelectorAll(".reveal:not(.visible)");
  const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){e.target.classList.add("visible"); io.unobserve(e.target);} }),{threshold:.1});
  els.forEach(el=>io.observe(el));
}

document.addEventListener("DOMContentLoaded", ()=>{
  document.getElementById("year").textContent = new Date().getFullYear();
  initCustomCursor();
  loadGitHub();
  bindMagicCards();
  typeLoop(document.getElementById("typing"), ["Full-Stack Developer","Java · Python · C++ · JS/TS","DSA Learner","AI Tools Builder"]);
  typeLoop(document.getElementById("typing2"), ["npm run build -- future"]);
  observeReveals();

  const ham = document.getElementById("hamburger");
  const links = document.getElementById("navLinks");
  ham.addEventListener("click", ()=> links.classList.toggle("open"));
  links.querySelectorAll("a").forEach(a=>a.addEventListener("click", ()=> links.classList.remove("open")));

  document.getElementById("contactForm").addEventListener("submit", (e)=>{
    e.preventDefault();
    const n = document.getElementById("fName").value.trim();
    const em = document.getElementById("fEmail").value.trim();
    const m = document.getElementById("fMsg").value.trim();
    const subject = encodeURIComponent(`Portfolio contact from ${n}`);
    const body = encodeURIComponent(`Name: ${n}\nEmail: ${em}\n\n${m}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  });
});
