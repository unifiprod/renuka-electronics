(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // split headlines into words that rise into place
  document.querySelectorAll('[data-split]').forEach(function(el){
    var walk=function(node){
      Array.prototype.slice.call(node.childNodes).forEach(function(n){
        if(n.nodeType===3){
          var frag=document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function(t){
            if(!t) return;
            if(/^\s+$/.test(t)){frag.appendChild(document.createTextNode(' '));return;}
            var w=document.createElement('span');w.className='w';
            var i=document.createElement('i');i.textContent=t;w.appendChild(i);frag.appendChild(w);
          });
          node.replaceChild(frag,n);
        } else if(n.nodeType===1){ walk(n); }
      });
    };
    walk(el);
    el.querySelectorAll('.w>i').forEach(function(i,k){ i.style.transitionDelay=(k*70)+'ms'; });
  });

  // reveal: hide only what is below the fold, then release on scroll
  if(!reduce && 'IntersectionObserver' in window){
    var targets=document.querySelectorAll('[data-split],.rv');
    var vh=window.innerHeight;
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.remove('pre'); io.unobserve(e.target);} });
    },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    targets.forEach(function(t){
      var r=t.getBoundingClientRect();
      if(r.top>vh*0.95){ t.classList.add('pre'); io.observe(t); }
    });
    // hero headline: play on load
    var h1=document.querySelector('.hero h1');
    if(h1){ h1.classList.add('pre'); requestAnimationFrame(function(){requestAnimationFrame(function(){h1.classList.remove('pre');});}); }
    var st=document.getElementById('steps');
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){st.classList.add('in');so.disconnect();}});},{threshold:.4});
    so.observe(st);
  } else {
    document.documentElement.classList.add('js-off');
    var st2=document.getElementById('steps'); if(st2) st2.classList.add('in');
  }

  // hero: scenes and tagline tabs move together
  var tabs=Array.prototype.slice.call(document.querySelectorAll('.tab')), scenes=Array.prototype.slice.call(document.querySelectorAll('.scene')), cur=0, timer;
  function show(i){
    cur=i;
    scenes.forEach(function(sc,j){sc.classList.toggle('on',j===i);});
    tabs.forEach(function(t,j){ t.classList.remove('active'); });
    void tabs[i].offsetWidth; tabs[i].classList.add('active');
  }
  function start(){ if(reduce) return; clearInterval(timer); timer=setInterval(function(){show((cur+1)%tabs.length);},5000); }
  tabs.forEach(function(t,i){ t.addEventListener('click',function(){show(i);start();}); });
  start();

  // count-up for 100+
  var c=document.getElementById('count');
  if(c && !reduce && 'IntersectionObserver' in window){
    var to=+c.dataset.to, done=false;
    var co=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting && !done){
          done=true; var t0=performance.now(), d=1600;
          (function f(t){var p=Math.min(1,(t-t0)/d), v=Math.round(to*(1-Math.pow(1-p,3))); c.textContent=v; if(p<1) requestAnimationFrame(f);})(t0);
          co.disconnect();
        }
      });
    },{threshold:.6});
    co.observe(c);
  }

  // header rule on scroll
  var hd=document.querySelector('header');
  var onS=function(){ hd.classList.toggle('scrolled', window.scrollY>8); };
  window.addEventListener('scroll',onS,{passive:true}); onS();
})();

(function(){
  var bg=document.querySelector('.burger'), nav=document.getElementById('mnav');
  if(bg&&nav){
    bg.addEventListener('click',function(){var o=nav.hidden;nav.hidden=!o;bg.setAttribute('aria-expanded',String(o));});
    nav.addEventListener('click',function(e){if(e.target.tagName==='A'){nav.hidden=true;bg.setAttribute('aria-expanded','false');}});
  }
  var demo=document.getElementById('demo'); if(!demo) return;
  var tabs=[].slice.call(demo.querySelectorAll('.dt')), panes=[].slice.call(demo.querySelectorAll('.pane'));
  function go(k){tabs.forEach(function(t){var on=t.dataset.t===k;t.classList.toggle('on',on);t.setAttribute('aria-selected',String(on));});panes.forEach(function(p){p.classList.toggle('on',p.dataset.p===k);});}
  tabs.forEach(function(t){t.addEventListener('click',function(){go(t.dataset.t);});});
  [].forEach.call(document.querySelectorAll('[data-go]'),function(el){el.addEventListener('click',function(){go(el.dataset.go);demo.scrollIntoView({block:'nearest',behavior:'smooth'});});});
  function setOn(b){[].forEach.call(b.parentNode.querySelectorAll('button'),function(x){x.classList.toggle('on',x===b);});}
  var sw=demo.querySelector('.scr-wrap'), br=document.getElementById('br'), bv=document.getElementById('bv');
  br.addEventListener('input',function(){sw.style.setProperty('--b',br.value/100);bv.textContent=br.value+'%';});
  [].forEach.call(demo.querySelectorAll('[data-bl]'),function(b){b.addEventListener('click',function(){sw.style.setProperty('--bl',b.dataset.bl+'px');setOn(b);});});
  var st=document.getElementById('sndStage'), bars=document.getElementById('bars'), note=document.getElementById('sndNote');
  var SND={book:{n:14,sp:1.2,sc:.78,t:'Bookshelf: suits a small room or a desk.'},floor:{n:22,sp:1.5,sc:1,t:'Floor-standing: fills a living room or a classroom.'},pa:{n:32,sp:.9,sc:1.2,t:'PA speaker: carries across a hall or a ground.'}};
  function snd(k){var o=SND[k];bars.innerHTML='';for(var i=0;i<o.n;i++){var e=document.createElement('i');e.style.animationDelay=(-Math.random()*2).toFixed(2)+'s';e.style.animationDuration=(o.sp*(0.7+Math.random()*0.7)).toFixed(2)+'s';bars.appendChild(e);}st.style.setProperty('--sc',o.sc);note.textContent=o.t;}
  [].forEach.call(demo.querySelectorAll('[data-snd]'),function(b){b.addEventListener('click',function(){snd(b.dataset.snd);setOn(b);});});
  snd('floor');
  var FIT={cls:['Projector','Interactive display','Classroom audio'],brd:['Display','Conference audio','Presentation system'],home:['Projector','Surround sound','Immersive entertainment'],aud:['Large-scale projection','PA system','Large-scale audio']};
  var fl=document.getElementById('fitList');
  function fit(k){[].forEach.call(demo.querySelectorAll('.fit-scene'),function(x){x.classList.toggle('on',x.dataset.s===k);});fl.innerHTML='';FIT[k].forEach(function(t){var li=document.createElement('li');li.textContent=t;fl.appendChild(li);});}
  [].forEach.call(demo.querySelectorAll('[data-fit]'),function(b){b.addEventListener('click',function(){fit(b.dataset.fit);setOn(b);});});
  fit('cls');
})();

(function(){
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  [].forEach.call(document.querySelectorAll('.lg-row'),function(r){
    var set=r.querySelector('.lg-set'); if(!set)return;
    var c=set.cloneNode(true); c.setAttribute('aria-hidden','true');
    [].forEach.call(c.querySelectorAll('img'),function(im){im.alt='';});
    r.appendChild(c);
  });
})();



(function(){
  [].forEach.call(document.querySelectorAll('[data-split]'),function(el){
    var is=el.querySelectorAll('.w>i'), l=is[is.length-1];
    if(l && /\.$/.test(l.textContent)){var t=l.textContent; l.textContent=t.slice(0,-1); var d=document.createElement('b'); d.className='dot'; d.style.fontWeight='inherit'; d.textContent='.'; l.appendChild(d);}
  });
  var list=document.querySelector('.sp2-list'); if(!list) return;
  var it=[].slice.call(list.querySelectorAll('.sp2-item')), pn=[].slice.call(document.querySelectorAll('.sp2-pane'));
  function on(i){it.forEach(function(x,k){x.classList.toggle('on',k===i);x.setAttribute('aria-selected',String(k===i));});pn.forEach(function(p,k){p.classList.toggle('on',k===i);});}
  it.forEach(function(x,k){x.addEventListener('click',function(){on(k);});x.addEventListener('focus',function(){on(k);});
    x.addEventListener('mouseenter',function(){if(window.matchMedia&&matchMedia('(hover:hover)').matches)on(k);});});
})();

// v24: soft reveal for card and step headings
(function(){
  if((window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)||!('IntersectionObserver' in window))return;
  var vh=window.innerHeight;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target);}});},{threshold:.2,rootMargin:'0px 0px -5% 0px'});
  [].forEach.call(document.querySelectorAll('main h3, footer h4'),function(h,k){
    if(h.getBoundingClientRect().top<vh*0.95)return;
    h.classList.add('hrv','pre');
    var sib=h.parentElement?[].indexOf.call(h.parentElement.parentElement.children,h.parentElement):0;
    h.style.transitionDelay=(Math.max(0,sib)%4*90)+'ms';
    io.observe(h);
  });
})();

// v26: light / dark mode (header toggle + the hero projector)
(function(){
  var root=document.documentElement, btn=document.querySelector('.theme-tg'), proj=document.querySelector('.hero-proj');
  function label(){
    var d=root.getAttribute('data-theme')==='dark';
    if(btn) btn.setAttribute('aria-label',d?'Switch to light mode':'Switch to dark mode');
    var m=document.querySelector('meta[name="theme-color"]'); if(m) m.setAttribute('content',d?'#0a0f2e':'#070b2b');
  }
  function flip(){
    var d=root.getAttribute('data-theme')==='dark'?'light':'dark';
    root.setAttribute('data-theme',d);

    label();
  }
  if(!root.getAttribute('data-theme')) root.setAttribute('data-theme','light');
  label();
  if(btn) btn.addEventListener('click',flip);
  if(proj){
    proj.addEventListener('click',flip);
    proj.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();flip();}});
  }
})();
