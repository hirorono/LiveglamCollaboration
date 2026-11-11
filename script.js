        /* INTERACTIVE PARTICLES WITH ANIMATED GOLD FLAKES */
        const canvas = document.getElementById('gold-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedY = Math.random() * -0.6 - 0.2;
                this.speedX = (Math.random() - 0.5) * 0.6;
                this.opacity = Math.random() * 0.7 + 0.3;
                this.color = Math.random() > 0.4 ? '#c49c90' : (Math.random() > 0.5 ? '#d9a9b0' : '#ffffff');
                this.rotation = Math.random() * Math.PI * 2;
                this.rotSpeed = (Math.random() - 0.5) * 0.05;
            }
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.rotation += this.rotSpeed;
                if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
                    this.reset();
                    this.y = canvas.height;
                }
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size * 1.5, this.size * 0.8, Math.PI / 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < 90; i++) particles.push(new Particle());

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        ctx.save();
                        ctx.globalAlpha = (1 - dist / 100) * 0.15;
                        ctx.strokeStyle = '#c49c90';
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            connectParticles();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();

        /* NAVIGATION LOGIC */
        function navigateTo(pageId) {
            const currentPage = document.querySelector('.page-section.active');
            const targetPage = document.getElementById(pageId);
            if (!targetPage || currentPage === targetPage) return;

            if (currentPage) {
                gsap.to(currentPage, {
                    opacity: 0, y: -20, duration: 0.3, ease: 'power2.in',
                    onComplete: () => {
                        currentPage.classList.remove('active');
                        currentPage.style.display = 'none';
                        targetPage.style.display = 'block';
                        targetPage.classList.add('active');
                        gsap.fromTo(targetPage, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 });
                    }
                });
            } else {
                targetPage.style.display = 'block';
                targetPage.classList.add('active');
                gsap.to(targetPage, { opacity: 1, y: 0, duration: 0.5 });
            }

            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            const activeNav = Array.from(document.querySelectorAll('.nav-link')).find(a => a.getAttribute('onclick') && a.getAttribute('onclick').includes(pageId));
            if (activeNav) activeNav.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        /* SHADE FINDER DIAGNOSTIC LOGIC */
        function selectShade(undertone, productMatch) {
            document.getElementById('shade-result').innerHTML = `
                ✨ Stage Undertone Identified: <span style="color:#fff;">${undertone}</span> | Match: <span style="color:var(--liveglam-matcha);">${productMatch}</span>
            `;
        }

        /* PRODUCTS DATA */
        const productsData = [
            { id: 1, name: "Velvet Lip Liquid", price: "₱1,250", desc: "Ultra-pigmented matte liquid lipstick with jojoba oil.", quote: "The gold standard of transfer-proof luxury.", img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80" },
            { id: 2, name: "Goddess Lip Gloss", price: "₱980", desc: "High-shine volume lip oil with hyaluronic acid.", quote: "Non-sticky, sheer brilliance.", img: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=600&q=80" },
            { id: 3, name: "Silk Satin Lipstick", price: "₱1,150", desc: "Creamy satin finish rich in vitamin E.", quote: "Classic elegance for daily hydration.", img: "https://images.unsplash.com/photo-1591360236480-4ed861025fa1?auto=format&fit=crop&w=600&q=80" },
            { id: 4, name: "Luminous Gel Blush", price: "₱1,350", desc: "Buildable cheek tint providing a radiant flush.", quote: "Melts seamlessly into skin.", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80" },
            { id: 5, name: "Diamond Glow Liquid Highlighter", price: "₱1,450", desc: "Micro-fine light-reflecting glass skin illuminator.", quote: "Radiance captured in a bottle.", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80" },
            { id: 6, name: "Hydra-Luxe Skin Tint Foundation", price: "₱1,850", desc: "Breathable serum coverage with SPF 30 photoprotection.", quote: "Your natural complexion, elevated.", img: "https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?auto=format&fit=crop&w=600&q=80" },
            { id: 7, name: "Matcha & Gold Flake Setting Spray", price: "₱1,200", desc: "Anti-hulas setting mist infused with gold flakes & green tea.", quote: "Locks makeup in place for 24 hours.", img: "https://images.unsplash.com/photo-1608248597263-0057e5db6046?auto=format&fit=crop&w=600&q=80" },
            { id: 8, name: "Sculpt & Precision Contour Stick", price: "₱1,100", desc: "Dual-ended cream sculpting stick for facial symmetry.", quote: "Effortless dimension in one swipe.", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80" },
            { id: 9, name: "Midnight Recovery Bio-Oil", price: "₱2,100", desc: "Overnight cellular renewal elixir with rosehip and squalane.", quote: "Restores skin barrier overnight.", img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80" },
            { id: 10, name: "Opulent Eyeshadow Palette", price: "₱2,400", desc: "18 buttery mattes, molten foils, and duochrome shades.", quote: "Versatile pigment intensity.", img: "https://images.unsplash.com/photo-1583241800698-e8ab01c85b27?auto=format&fit=crop&w=600&q=80" },
            { id: 11, name: "Micro-Precision Eyebrow Definer", price: "₱850", desc: "Ultra-fine waterproof brow pencil with built-in spoolie.", quote: "Creates natural hair-like strokes.", img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80" },
            { id: 12, name: "Volumizing Lash Lifting Mascara", price: "₱1,050", desc: "Smudge-proof tubing formula for dramatic length.", quote: "Zero clumping, maximum impact.", img: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=600&q=80" },
            { id: 13, name: "Velvet Translucent Setting Powder", price: "₱1,300", desc: "Oil-controlling blurring powder with light dispersion.", quote: "Creates a soft-focus filter.", img: "https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=600&q=80" },
            { id: 14, name: "Plumping Peptide Lip Serum", price: "₱1,180", desc: "Nourishing balm infused with tri-peptides for fullness.", quote: "Restores volume and elasticity.", img: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80" },
            { id: 15, name: "Cleanse & Glow Micellar Water", price: "₱890", desc: "Gentle makeup remover with chamomile and niacinamide.", quote: "Purifies without drying skin.", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80" },
            { id: 16, name: "Radiance C Eye Cream", price: "₱1,650", desc: "Brightening eye complex targeting dark circles and puffiness.", quote: "Awakens tired eyes instantly.", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80" },
            { id: 17, name: "Satin Finish Bronzing Powder", price: "₱1,280", desc: "Warm sun-kissed bronzer with fine radiance micro-particles.", quote: "Instant golden hour warmth.", img: "https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&w=600&q=80" },
            { id: 18, name: "Pro Sculpting Makeup Brush Set", price: "₱2,800", desc: "12-piece synthetic vegan brush collection with gold ferrule.", quote: "Precision tools for makeup artists.", img: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80" },
            { id: 19, name: "Nourishing Collagen Primer", price: "₱1,400", desc: "Hydrating pore-minimizing base layer for smooth application.", quote: "Creates an even canvas for makeup.", img: "https://images.unsplash.com/photo-1567928269937-ae146e45b428?auto=format&fit=crop&w=600&q=80" },
            { id: 20, name: "Lip Contour Precision Pencil", price: "₱780", desc: "Long-wear waterproof lip liner for defined lip lines.", quote: "Prevents lipstick feathering.", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80" }
        ];

        function renderProducts() {
            const container = document.getElementById('products-grid');
            if(!container) return;
            container.innerHTML = productsData.map(p => `
                <div class="card product-card">
                    <img src="${p.img}" alt="${p.name}" class="product-img">
                    <h3 style="color:#fff; font-size:1.05rem;">${p.name}</h3>
                    <div class="product-price">${p.price}</div>
                    <p style="color:var(--text-muted); font-size:0.8rem; margin-bottom:10px;">${p.desc}</p>
                    <blockquote style="font-style:italic; font-size:0.75rem; color:var(--liveglam-matcha); margin-bottom:15px;">"${p.quote}"</blockquote>
                    <button class="btn-card" onclick="showInfoModal('${p.name}', 'Available for immediate order in select LiveGlam boutiques.')">Buy Now</button>
                </div>
            `).join('');
        }
        renderProducts();

        /* =====================================================================
           VOTING ARENA - EDIT YOUR CONTESTANTS HERE
           ---------------------------------------------------------------------
           For each person change:
             name     -> the name shown on the card
             category -> the small label under the name
             handle   -> optional (e.g. "@yourname"), leave "" to hide it
             img      -> path to your photo (see below)
             votes    -> starting vote count

           HOW TO USE YOUR OWN PHOTOS:
             1. Put your photos in the SAME folder as index.html
                (or in an "images" folder).
             2. Set img to the file name, e.g.  img: "images/maria.jpg"
             3. File names are case-sensitive: "Maria.JPG" is not "maria.jpg".

           IMPORTANT: keep the commas and quotes exactly as in the examples.
           ===================================================================== */
        const creatorsData = [
            { id: 1, name: "Elle",    handle: "", category: "Cosmetic Collaborations",         img: "image1.jpg", votes: 1420, hasVoted: false },
            { id: 2, name: "Diane",   handle: "", category: "Cosmetic Collaborations",         img: "image2.jpg", votes: 1280, hasVoted: false },
            { id: 3, name: "Nicole",  handle: "", category: "Skincare Promoter",               img: "image3.jpg", votes: 1150, hasVoted: false },
            { id: 4, name: "Ariane",  handle: "", category: "Model, Artist",                   img: "image4.jpg", votes: 1390, hasVoted: false },
            { id: 5, name: "Sam",     handle: "", category: "Cosmetic Collaborations",         img: "image5.jpg", votes: 940,  hasVoted: false },
            { id: 6, name: "Yella",   handle: "", category: "Beauty Products Collaborations",  img: "image6.jpg", votes: 1610, hasVoted: false },
            { id: 7, name: "Byen",    handle: "", category: "Model",                           img: "image7.jpg", votes: 1080, hasVoted: false },
            { id: 8, name: "Briyana", handle: "", category: "Model",                           img: "image8.jpg", votes: 1250, hasVoted: false }
        ];

        /* Shown automatically if a photo file is missing or the name is misspelled */
        const FALLBACK_IMG = "data:image/svg+xml;utf8," + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#2a1f22"/><circle cx="60" cy="46" r="20" fill="#c49c90"/><path d="M20 112c4-26 22-38 40-38s36 12 40 38z" fill="#c49c90"/></svg>'
        );

        let globalHasVotedAny = false;

        function renderCreators() {
            const container = document.getElementById('creators-grid');
            if(!container) return;
            container.innerHTML = creatorsData.map(c => `
                <div class="card creator-card">
                    <div>
                        <img src="${c.img}" alt="${c.name}" class="creator-avatar" onerror="this.onerror=null;this.src=FALLBACK_IMG;">
                        <div class="creator-info-group">
                            <h3 style="color:#fff; font-size:1.05rem; margin-bottom:4px;">${c.name}</h3>
                            <div style="color:var(--liveglam-matcha); font-size:0.75rem; font-weight:600; text-transform:uppercase; margin-bottom:4px;">${c.category}</div>
                            <div style="color:var(--text-muted); font-size:0.8rem; margin-bottom:6px;">${c.handle}</div>
                            <div style="color:var(--liveglam-gold); font-size:0.85rem; font-weight:700;"><i class="fa-solid fa-heart"></i> ${c.votes} Votes</div>
                        </div>
                    </div>
                    <button class="btn-vote" id="vote-btn-${c.id}" ${globalHasVotedAny ? 'disabled' : ''} onclick="castNormalVote(${c.id})">
                        ${c.hasVoted ? 'Voted Successfully' : (globalHasVotedAny ? 'Already Voted' : 'Tap to Vote')}
                    </button>
                </div>
            `).join('');
        }
        renderCreators();

        /* NORMAL VOTING METHOD: Once they tap to vote they can't vote anymore */
        function castNormalVote(id) {
            if(globalHasVotedAny) return;

            const creator = creatorsData.find(c => c.id === id);
            if(!creator) return;

            globalHasVotedAny = true;
            creator.hasVoted = true;
            creator.votes += 1;

            renderCreators();
            showInfoModal('Vote Recorded!', `Your vote for ${creator.name} has been successfully registered. Thank you for participating in the LiveGlam Creator Arena!`);
        }

        /* OPEN HOME COLLABORATION FORM WITH TAP ANIMATION & GLOW EFFECT */
        function openHomeCollaborationForm(btnElement) {
            if (btnElement) {
                // Add temporary pulsating glow class
                btnElement.classList.add('glowing');

                // GSAP Tap Animation Effect
                gsap.timeline()
                    .to(btnElement, { scale: 0.92, duration: 0.1, ease: "power2.in" })
                    .to(btnElement, { scale: 1.1, duration: 0.2, ease: "back.out(2)" })
                    .to(btnElement, { scale: 1.0, duration: 0.15, onComplete: () => {
                        document.getElementById('shipping-modal').classList.add('active');
                        setTimeout(() => btnElement.classList.remove('glowing'), 1500);
                    }});
            } else {
                document.getElementById('shipping-modal').classList.add('active');
            }
        }

        /* GLOBAL CREATOR APPLICANT STORAGE */
        let currentApplicant = {};

        /* HANDLE UGC PAID COLLABORATION FORM SUBMISSION -> OPEN VERIFICATION MODAL */
        function handleShippingSubmit(event) {
            event.preventDefault();

            const ugcTypes = Array.from(document.querySelectorAll('input[name="ugc_type"]:checked')).map(cb => cb.value);
            const ugcPlatforms = Array.from(document.querySelectorAll('input[name="ugc_platform"]:checked')).map(cb => cb.value);

            currentApplicant = {
                name: document.getElementById('ship-name').value,
                email: document.getElementById('ship-email').value,
                socialPlatform: document.getElementById('ship-social-platform').value,
                social: document.getElementById('ship-social').value,
                ugcType: ugcTypes.join(', '),
                platforms: ugcPlatforms.join(', '),
                address: [
                    document.getElementById('ship-address').value,
                    document.getElementById('ship-city').value,
                    document.getElementById('ship-state').value,
                    document.getElementById('ship-zip').value,
                    document.getElementById('ship-country').value
                ].join(', ')
            };

            // Close Form Modal and Open Verification Modal
            closeModal('shipping-modal');
            document.getElementById('verification-modal').classList.add('active');
        }

        /* COMPLETE VERIFICATION WITH SELECTED METHOD */
        function completeVerification(method) {
            const statusMsg = document.getElementById('verification-status-msg');
            statusMsg.style.display = 'block';
            statusMsg.style.background = 'rgba(217, 169, 176, 0.15)';
            statusMsg.style.borderColor = 'var(--liveglam-matcha)';
            statusMsg.style.color = 'var(--liveglam-matcha)';
            statusMsg.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Connecting to ${method} for identity verification...`;

            setTimeout(() => {
                closeModal('verification-modal');
                statusMsg.style.display = 'none';
                showInfoModal(
                    'Application & Verification Complete!',
                    `Congratulations ${currentApplicant.name || 'Creator'}! Your identity was successfully verified via ${method}. Your application for LiveGlam UGC Paid Collaborations on ${currentApplicant.socialPlatform || 'Socials'} (${currentApplicant.social || '@handle'}) is now under priority review. We will contact you at ${currentApplicant.email || 'your email'}, and your creator kit will be prepared for shipping to: ${currentApplicant.address || 'your address'}.`
                );
            }, 1800);
        }

        /* MODAL UTILITIES */
        function showInfoModal(title, text) {
            document.getElementById('modal-title').innerText = title;
            document.getElementById('modal-body').innerText = text;
            document.getElementById('info-modal').classList.add('active');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }
    

    /* LIVEGLAM UPGRADE LAYER: additive effects only, no existing function is touched */
    (function () {
        const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
        const mk = (tag, id) => { const e = document.createElement(tag); if (id) e.id = id; document.body.appendChild(e); return e; };
        const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

        const bar = mk('div', 'lg-progress');
        const onScroll = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')'; };
        addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); onScroll();
        if (rm) return;

        const SPOT = '.card,.blog-card,.charity-card,.delegate-card,.video-card,.stat-card,.brochure-panel,.article-block,.side-article-card,.featured-article';
        const COLORS = ['#c49c90', '#f3d4d8', '#d9a9b0', '#ffffff', '#ff8fb8'];

        function spark(x, y, spread, life) {
            const s = document.createElement('i'); s.className = 'lg-spark';
            const a = Math.random() * 6.283, d = spread * (.4 + Math.random() * .6);
            s.style.cssText = 'left:' + x + 'px;top:' + y + 'px;--c:' + COLORS[Math.random() * 5 | 0] + ';--dx:' + Math.cos(a) * d + 'px;--dy:' + Math.sin(a) * d + 'px';
            document.body.appendChild(s); setTimeout(() => s.remove(), life || 800);
        }
        addEventListener('pointerdown', e => { for (let i = 0; i < 12; i++) spark(e.clientX, e.clientY, 70); });

        if (fine) {
            const aura = mk('div', 'lg-aura'); let tx = 0, ty = 0, ax = 0, ay = 0, last = 0, mag = null;
            (function loop() { ax += (tx - ax) * .12; ay += (ty - ay) * .12; aura.style.transform = 'translate(' + ax + 'px,' + ay + 'px)'; requestAnimationFrame(loop); })();
            addEventListener('mousemove', e => {
                tx = e.clientX; ty = e.clientY; aura.style.opacity = 1;
                const px = e.clientX / innerWidth - .5, py = e.clientY / innerHeight - .5;
                $$('.glass-orb').forEach((o, i) => o.style.translate = (px * (i + 1) * -40) + 'px ' + (py * (i + 1) * -40) + 'px');
                const now = performance.now(); if (now - last > 50) { last = now; spark(e.clientX, e.clientY, 22, 650); }
                const t = e.target.closest ? e.target : null; if (!t) return;
                const c = t.closest(SPOT);
                if (c) { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); }
                const b = t.closest('.btn-cta,.btn-card,.btn-vote');
                if (mag && mag !== b) { mag.style.translate = ''; mag = null; }
                if (b) { const r = b.getBoundingClientRect(); b.style.translate = ((e.clientX - r.left - r.width / 2) * .18) + 'px ' + ((e.clientY - r.top - r.height / 2) * .3) + 'px'; mag = b; }
            }, { passive: true });
        }

        const hero = document.querySelector('.hero');
        if (hero) {
            const ic = ['fa-star', 'fa-gem', 'fa-heart', 'fa-crown', 'fa-wand-magic-sparkles'];
            for (let i = 0; i < 14; i++) {
                const f = document.createElement('i'); f.className = 'lg-float fa-solid ' + ic[i % 5];
                f.style.cssText = 'left:' + (4 + Math.random() * 92) + '%;top:' + (25 + Math.random() * 65) + '%;font-size:' + (10 + Math.random() * 16) + 'px;--d:' + (7 + Math.random() * 7) + 's;--dl:' + (-Math.random() * 10) + 's';
                hero.appendChild(f);
            }
        }

        const hb = mk('div', 'lg-hearts'), hc = ['#ff4d8d', '#c49c90', '#ff8fb8', '#d9a9b0'];
        setInterval(() => {
            if (document.hidden) return;
            const h = document.createElement('i'); h.className = 'lg-heart fa-solid fa-heart';
            h.style.cssText = 'color:' + hc[Math.random() * 4 | 0] + ';--s:' + (12 + Math.random() * 16) + 'px;--x:' + ((Math.random() - .5) * 50) + 'px;--t:' + (3.5 + Math.random() * 2) + 's;left:' + (30 + Math.random() * 40) + '%';
            hb.appendChild(h); setTimeout(() => h.remove(), 6000);
        }, 1400);

        const counts = new Map();
        const io = new IntersectionObserver(es => es.forEach(en => {
            if (!en.isIntersecting) return;
            const t = en.target; io.unobserve(t); t.classList.add('lg-in');
            setTimeout(() => t.classList.remove('lg-reveal', 'lg-in'), 1400 + (parseFloat(t.style.getPropertyValue('--rd')) || 0) * 1000);
        }), { threshold: .12 });
        $$('.section-title,.section-subtitle,.magazine-container,.blog-card,.charity-card,.delegate-card,.video-card,.stat-card,.brochure-panel,.article-block,.shade-finder-box,.card,.side-article-card').forEach(el => {
            const n = counts.get(el.parentNode) || 0; counts.set(el.parentNode, n + 1);
            el.style.setProperty('--rd', (n % 4) * .1 + 's'); el.classList.add('lg-reveal'); io.observe(el);
        });

        $$('.stat-number').forEach(n => {
            const t = n.textContent.trim(), m = t.match(/[\d.]+/); if (!m) return;
            const end = parseFloat(m[0]), pre = t.slice(0, m.index), suf = t.slice(m.index + m[0].length);
            const o = new IntersectionObserver(([en]) => {
                if (!en.isIntersecting) return; o.disconnect(); const s = performance.now();
                (function f(now) { const p = Math.min(1, (now - s) / 1600); n.textContent = pre + Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(f); else n.textContent = t; })(s);
            }, { threshold: .6 });
            o.observe(n);
        });
    })();
    

    /* BOUTIQUE: animated backdrop toggle + category filters */
    (function () {
        const page = document.getElementById('cosmetics-page');
        const sync = () => document.body.classList.toggle('boutique-on', page.classList.contains('active'));
        new MutationObserver(sync).observe(page, { attributes: true, attributeFilter: ['class'] });
        sync();
        const map = { lips: [1,2,3,14,20], face: [4,5,6,7,8,13,17,19], eyes: [10,11,12,16], skin: [9,15], tools: [18] };
        document.getElementById('bq-chips').addEventListener('click', e => {
            const b = e.target.closest('.bq-chip'); if (!b) return;
            document.querySelectorAll('.bq-chip').forEach(c => c.classList.toggle('on', c === b));
            const f = b.dataset.f;
            document.querySelectorAll('#products-grid .product-card').forEach((card, i) => {
                const id = productsData[i] && productsData[i].id;
                card.classList.toggle('bq-hide', f !== 'all' && !map[f].includes(id));
            });
        });
    })();
    

    /* MAINTENANCE NOTICE: Reddit & Instagram verify options and footer Instagram/email links are temporarily unavailable */
    (function () {
        const MSG = 'This option is currently under maintenance. We will fix it as soon as possible. Please choose another option.';

        document.addEventListener('click', function (e) {
            // Verification modal: Reddit button
            const vb = e.target.closest('.verify-btn');
            if (vb) {
                const call = vb.getAttribute('onclick') || '';
                if (/completeVerification\('(Reddit|Instagram)'\)/.test(call)) {
                    e.preventDefault(); e.stopImmediatePropagation();
                    const box = document.getElementById('verification-status-msg');
                    box.style.display = 'block';
                    box.style.background = 'rgba(217, 169, 176, 0.15)';
                    box.style.borderColor = 'var(--liveglam-matcha)';
                    box.style.color = 'var(--liveglam-matcha)';
                    box.innerHTML = '<i class="fa-solid fa-screwdriver-wrench"></i> ' + MSG;
                    return;
                }
            }

            // Footer Instagram and Email links
            const a = e.target.closest('.footer-social-icons a');
            if (a) {
                const href = a.getAttribute('href') || '';
                if (href.indexOf('instagram.com') > -1 || href.indexOf('mailto:') === 0) {
                    e.preventDefault(); e.stopImmediatePropagation();
                    showInfoModal('Under Maintenance', MSG);
                }
            }
        }, true);
    })();
    