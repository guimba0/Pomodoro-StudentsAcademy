import{u as ue,r as t,d as v,j as o}from"./index-BWjoERgv.js";import{u as de}from"./useTitle-4RYMiaAG.js";const m=25,pe=5,fe=15,u=4,d=110,q=Math.PI*d,z=240,$=130,F=z/2,E=$;function ge(){de("Timer Pomodoro");const{user:K}=ue(),s=!!K,[n,c]=t.useState("idle"),[N,x]=t.useState(m*60),[g,S]=t.useState("focus"),[P,j]=t.useState(null),[y,A]=t.useState(0),[U,W]=t.useState(0),[J,C]=t.useState(!1),[L,i]=t.useState(""),[h,O]=t.useState(null),[I,Q]=t.useState(!1),[B,Y]=t.useState(null),[a,H]=t.useState(null),p=t.useRef(m*60),V=t.useRef(!1),Z=t.useRef(null),b=t.useRef(!1),w=t.useRef(0);t.useEffect(()=>{w.current=y},[y]);const k=e=>e==="focus"?m*60:e==="shortBreak"?pe*60:fe*60,ee=e=>e==="focus"?"Tempo de Foco":e==="shortBreak"?"Pausa Curta":"Pausa Longa",G=e=>e%u===0?"longBreak":"shortBreak",f=t.useCallback(()=>{try{const e=new(window.AudioContext||window.webkitAudioContext),r=e.createOscillator(),l=e.createGain();r.connect(l),l.connect(e.destination),r.type="sine",r.frequency.setValueAtTime(880,e.currentTime),l.gain.setValueAtTime(.5,e.currentTime),l.gain.exponentialRampToValueAtTime(.001,e.currentTime+.8),r.start(e.currentTime),r.stop(e.currentTime+.8)}catch{}},[]),oe=e=>{Y(e),setTimeout(()=>W(r=>r+e),600),setTimeout(()=>Y(null),3200)},R=t.useCallback(async()=>{if(!s)return;const e=await v("/pomodoro/progresso");e&&!e.erro&&(O(e),H({estagio:e.arvoreEstagio,morta:e.arvoreMorta,focosCompletos:e.focosCompletos}))},[s]),re=t.useCallback(async()=>{const e=await v("/pomodoro/start",{method:"POST",body:JSON.stringify({tipo:"FOCUS"})});if(e.erro){i("Erro ao iniciar sessão: "+e.erro);return}j(e.id);const r=e.tempoRestanteSegundos??k("focus");b.current=!1,x(r),p.current=k("focus"),r>0?(c("running"),e.recuperada&&(C(!0),i("Sessão recuperada! Você tem "+Math.ceil(r/60)+" minutos restantes."))):(c("completed"),i("Foco já concluído! Clique em Finalizar para receber suas recompensas."))},[]),te=t.useCallback(()=>{b.current=!1,c("running")},[]),ae=t.useCallback(async()=>{f();const e=await v("/pomodoro/finish",{method:"POST"});if(e.erro){i("Erro ao finalizar: "+e.erro),c("idle");return}oe(5);const r=w.current+1;A(r);const l=G(r);S(l),j(null),c("idle");const X=k(l);x(X),p.current=X;let T=`Foco concluído! +${e.pontosGanhos} pontos`;e.tomatesGanhos>0&&(T+=`, +${e.tomatesGanhos} tomates`),r%u===0?T+=`. Você completou ${u} ciclos! Aproveite sua pausa longa`:T+=". Hora de uma pausa curta",i(T),R()},[f,R]),_=t.useCallback(()=>{f();const e=w.current+1;A(e);const r=G(e);S(r),c("idle");const l=k(r);x(l),p.current=l,e%u===0?i(`Você completou ${u} ciclos! Aproveite sua pausa longa`):i("Foco concluído! Hora de uma pausa curta")},[f]),D=t.useCallback(()=>{f(),S("focus"),c("idle");const e=m*60;x(e),p.current=e,i(w.current===0?"Pausa concluída! Hora de focar":"Descansou bem? Hora de focar")},[f]),se=t.useCallback(async()=>{(n==="running"||n==="paused")&&(s&&P&&await v("/pomodoro/reset",{method:"POST"}),j(null)),c("idle"),x(m*60),p.current=m*60,S("focus"),A(0),s&&W(0),C(!1),b.current=!1},[s,n,P]);t.useEffect(()=>{s&&!V.current&&(V.current=!0,v("/pomodoro/current").then(e=>{if(e&&!e.erro&&e.id){const r=e.tempoRestanteSegundos??0;j(e.id),x(r),p.current=m*60,C(!0),r>0?(c("running"),i("Sessão recuperada! Você tem "+Math.ceil(r/60)+" minutos restantes.")):(c("completed"),i("Foco já concluído! Clique em Finalizar para receber suas recompensas."))}else v("/pomodoro/progresso").then(r=>{r&&!r.erro&&(O(r),H({estagio:r.arvoreEstagio,morta:r.arvoreMorta,focosCompletos:r.focosCompletos}),r.arvoreMorta&&i("Sessão anterior falhou por abandono. Sua árvore morreu. Inicie um novo foco para plantar uma nova."))})}).catch(()=>{}))},[s]),t.useEffect(()=>{R()},[R]),t.useEffect(()=>{if(n!=="running")return;b.current=!1;const e=setInterval(()=>{x(r=>r<=1?(clearInterval(e),0):r-1)},1e3);return Z.current=e,()=>clearInterval(e)},[n]),t.useEffect(()=>{n!=="running"||N>0||b.current||(b.current=!0,g==="focus"?s?(f(),c("completed"),i("Foco concluído! Clique em Finalizar para receber suas recompensas.")):_():D())},[N,n,g,s,f,_,D]);const M=N,ne=p.current>0?M/p.current:1,ie=q*(1-ne),ce=()=>a?a.morta?"💀":a.estagio==="TREE"?"🌳":a.estagio==="SEEDLING"?"🌿":"🌱":"🌱",le=()=>a?a.morta?"Morta":a.estagio==="TREE"?"Árvore":a.estagio==="SEEDLING"?"Muda":"Semente":"Semente";return o.jsxs("div",{className:"pomodoro-page",style:{position:"relative"},children:[o.jsx("style",{children:`
        @keyframes subirSumir {
          0%   { opacity: 0; transform: translateY(20px) scale(0.7); }
          20%  { opacity: 1; transform: translateY(0px) scale(1); }
          70%  { opacity: 1; transform: translateY(-20px) scale(1.05); }
          100% { opacity: 0; transform: translateY(-140px) scale(1.2); }
        }
        @keyframes subirMensagem {
          0%   { opacity: 0; transform: translateX(-50%) translateY(-40px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0px); }
        }

        .card-wrapper {
          display: flex;
          align-items: stretch;
        }

        .timer-card {
          background: var(--color-primary-dark);
          border-radius: 24px 0 0 24px;
          padding: 110px 35px 110px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.2),
            0 0 8px 2px rgba(0,0,0,0.25),
            0 0 20px 6px rgba(0,0,0,0.15),
            0 0 40px 10px rgba(0,0,0,0.08);
          min-width: 300px;
        }

        .botao-arvore {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          background: #5a0e0e;
          border: none;
          border-radius: 0 24px 24px 0;
          cursor: pointer;
          flex-shrink: 0;
          padding: 0;
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.2),
            0 0 8px 2px rgba(0,0,0,0.25),
            0 0 20px 6px rgba(0,0,0,0.15),
            0 0 40px 10px rgba(0,0,0,0.08);
          transition: background 0.2s;
        }

        .botao-arvore:hover { background: #6e1010; }
        .botao-arvore:active { background: #4a0b0b; transform: translateY(1px); }

        .botao-arvore-icone {
          writing-mode: vertical-rl;
          color: rgba(255,255,255,0.75);
          font-size: 16px;
          font-weight: 900;
          user-select: none;
          letter-spacing: 4px;
          transition: color 0.2s;
          line-height: 1;
        }

        .botao-arvore:hover .botao-arvore-icone { color: rgba(255,255,255,1); }

        .arvore-painel {
          width: 0;
          overflow: hidden;
          transition: width 0.4s ease;
          background: rgba(0,0,0,0.3);
          border-radius: 0 24px 24px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.2),
            0 0 8px 2px rgba(0,0,0,0.25),
            0 0 20px 6px rgba(0,0,0,0.15),
            0 0 40px 10px rgba(0,0,0,0.08);
        }

        .arvore-painel.aberto { width: 260px; }

        .arvore-conteudo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 20px;
          color: white;
          text-align: center;
        }

        .arvore-icone-grande {
          font-size: 4rem;
          line-height: 1;
        }

        .arvore-label {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .arvore-stats {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.65);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .arvore-stats span {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }

        .arvore-stats .valor {
          color: white;
          font-weight: 600;
        }

        .arvore-morta { color: #ff6b6b; }
        .arvore-viva { color: #4caf50; }
      `}),s&&o.jsxs("div",{style:{position:"absolute",top:"12px",right:"24px",display:"flex",alignItems:"center",gap:"8px",fontSize:"1.2rem"},children:[o.jsx("span",{style:{fontSize:"1.3rem"},children:"🍅"}),o.jsx("span",{style:{color:"rgba(255,255,255,0.5)"},children:":"}),o.jsx("span",{style:{fontWeight:"bold"},children:U}),B&&o.jsxs("span",{style:{position:"absolute",top:"-50px",right:"-10px",color:"#FFD700",fontWeight:"900",fontSize:"1.3rem",zIndex:"9999",textShadow:"0 0 5px rgba(255,215,0,0.8), 0 0 10px rgba(255,215,0,0.6), 2px 2px 0 #000",animation:"subirSumir 3s ease-out forwards",pointerEvents:"none"},children:["+",B," 🍅"]})]}),J&&o.jsx("div",{style:{position:"absolute",top:"12px",left:"24px",background:"#ffc107",color:"#000",padding:"4px 12px",borderRadius:"20px",fontSize:"0.8rem",fontWeight:"bold"},children:"↩ Sessão recuperada"}),o.jsxs("div",{className:"card-wrapper",children:[o.jsxs("div",{className:"timer-card",children:[o.jsxs("div",{style:{position:"relative",width:`${z}px`,margin:"-20px auto 2px"},children:[o.jsxs("svg",{width:z,height:$,viewBox:`0 0 ${z} ${$}`,style:{display:"block"},children:[o.jsx("path",{d:`M ${F-d} ${E} A ${d} ${d} 0 0 1 ${F+d} ${E}`,fill:"none",stroke:"rgba(30,20,20,0.55)",strokeWidth:5,strokeLinecap:"round"}),o.jsx("path",{d:`M ${F-d} ${E} A ${d} ${d} 0 0 1 ${F+d} ${E}`,fill:"none",stroke:"#FFFFFF",strokeWidth:5,strokeLinecap:"round",strokeDasharray:q,strokeDashoffset:ie,style:{transition:"stroke-dashoffset 1s linear"}})]}),o.jsxs("div",{style:{position:"absolute",bottom:"0px",left:"50%",transform:"translateX(-50%)",fontSize:"3.7rem",fontWeight:"700",fontFamily:'"Share Tech Mono", "Courier New", monospace',color:"white",lineHeight:1,whiteSpace:"nowrap",letterSpacing:"2px"},children:[String(Math.floor(M/60)).padStart(2,"0"),":",String(M%60).padStart(2,"0")]})]}),o.jsx("p",{style:{fontSize:"1.1rem",margin:"6px 0 10px",fontWeight:"600"},children:ee(g)}),o.jsx("div",{style:{display:"flex",gap:"10px",justifyContent:"center",margin:"4px 0"},children:Array.from({length:u}).map((e,r)=>o.jsx("div",{style:{width:"13px",height:"13px",borderRadius:"50%",backgroundColor:r<y%u?"#4caf50":"transparent",border:"2px solid",borderColor:r<y%u?"#4caf50":"rgba(255,255,255,0.35)",transition:"all 0.3s ease"}},r))}),o.jsxs("p",{style:{fontSize:"0.7rem",color:"rgba(255,255,255,0.4)",margin:"0 0 20px"},children:[y%u,"/",u," ciclos completos"]}),o.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"14px"},children:[n==="idle"&&o.jsx("button",{onClick:g==="focus"&&s?re:te,style:{padding:"10px 28px",fontSize:"1rem",fontWeight:"bold",backgroundColor:"#28a745",color:"white",border:"none",borderRadius:"5px",cursor:"pointer"},children:g==="focus"?"Iniciar Foco":"Iniciar "+(g==="shortBreak"?"Pausa Curta":"Pausa Longa")}),n==="completed"&&s&&o.jsx("button",{onClick:ae,style:{padding:"10px 28px",fontSize:"1rem",fontWeight:"bold",backgroundColor:"#28a745",color:"white",border:"none",borderRadius:"5px",cursor:"pointer"},children:"Finalizar e Receber Recompensas"}),(n==="running"||n==="paused")&&o.jsxs("div",{style:{display:"flex",gap:"10px",justifyContent:"center"},children:[o.jsx("button",{onClick:se,style:{padding:"10px 28px",fontSize:"1rem",fontWeight:"bold",backgroundColor:"#dc3545",color:"white",border:"none",borderRadius:"5px",cursor:"pointer"},children:"Reiniciar"}),o.jsx("button",{onClick:()=>c(e=>e==="running"?"paused":"running"),style:{padding:"10px 28px",fontSize:"1rem",fontWeight:"bold",backgroundColor:n==="running"?"#ffc107":"#28a745",color:"white",border:"none",borderRadius:"5px",cursor:"pointer"},children:n==="running"?"Pausar":"Retomar"})]})]})]}),o.jsx("button",{className:"botao-arvore",onClick:()=>Q(e=>!e),title:I?"Fechar árvore":"Ver árvore",children:o.jsx("span",{className:"botao-arvore-icone",children:I?"◀  ||":"||  ▶"})}),o.jsx("div",{className:`arvore-painel ${I?"aberto":""}`,children:s?o.jsxs("div",{className:"arvore-conteudo",children:[o.jsx("div",{className:"arvore-icone-grande",children:ce()}),o.jsx("div",{className:`arvore-label ${a!=null&&a.morta?"arvore-morta":"arvore-viva"}`,children:le()}),(a==null?void 0:a.morta)&&o.jsx("div",{style:{color:"#ff6b6b",fontSize:"0.85rem",fontWeight:600},children:"Sua árvore morreu por abandono. Inicie um novo foco para plantar uma nova."}),o.jsxs("div",{className:"arvore-stats",children:[o.jsxs("span",{children:["Focos completos: ",o.jsx("span",{className:"valor",children:(a==null?void 0:a.focosCompletos)??0})]}),o.jsxs("span",{children:["Pontos: ",o.jsx("span",{className:"valor",children:(h==null?void 0:h.pontos)??0})]}),o.jsxs("span",{children:["🍅 Tomates: ",o.jsx("span",{className:"valor",children:(h==null?void 0:h.tomates)??0})]})]})]}):o.jsx("p",{style:{color:"rgba(255,255,255,0.3)",fontSize:"0.85rem",textAlign:"center",padding:"16px",whiteSpace:"nowrap"},children:"Faça login para ter sua árvore"})})]}),L&&o.jsxs("div",{style:{position:"fixed",top:"25px",left:"50%",transform:"translateX(-50%)",background:"#a61d1d",borderRadius:"14px",padding:"16px 18px",minWidth:"320px",maxWidth:"500px",zIndex:"9999",animation:"subirMensagem 0.35s ease-out",boxShadow:"0 10px 25px rgba(0,0,0,0.28)"},children:[o.jsx("p",{style:{color:"white",fontSize:"0.97rem",margin:"0 0 16px",textAlign:"left",lineHeight:"1.4"},children:L}),o.jsx("div",{style:{display:"flex",justifyContent:"flex-end"},children:o.jsx("button",{onClick:()=>{i(""),C(!1)},style:{background:"#c62828",color:"white",border:"none",borderRadius:"8px",padding:"8px 18px",fontWeight:"bold",cursor:"pointer",boxShadow:"0 3px 8px rgba(0,0,0,0.2)"},children:"OK"})})]})]})}export{ge as default};
