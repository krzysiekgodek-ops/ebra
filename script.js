/* ============================================
   EBRA KALKULATORY — JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Scroll Reveal ----
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Cards reveal
    document.querySelectorAll('.banner-card').forEach((card, i) => {
        card.classList.add('reveal', `rd-${(i % 9) + 1}`);
        revealObserver.observe(card);
    });

    // Other sections
    document.querySelectorAll(
        '.section-intro, .stats-container, .about-left, .about-right, .mini-card'
    ).forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // ---- Header hide/show on scroll ----
    const header = document.getElementById('header');
    let lastY = 0;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y > lastY && y > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        header.style.transition = 'transform 0.4s ease';
        if (y > 50) {
            header.style.background = 'rgba(15,14,12,0.98)';
        } else {
            header.style.background = 'rgba(15,14,12,0.92)';
        }
        lastY = y;
    }, { passive: true });

    // ---- Smooth anchor scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- Particle canvas in hero ----
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');
    const container = document.getElementById('heroParticles');
    if (container) {
        container.appendChild(canvas);

        let W = canvas.width  = container.offsetWidth;
        let H = canvas.height = container.offsetHeight;

        const particles = Array.from({ length: 55 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.5 + 0.4,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            a: Math.random() * 0.5 + 0.1,
        }));

        function drawParticles() {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201,162,39,${p.a})`;
                ctx.fill();
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = W;
                if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H;
                if (p.y > H) p.y = 0;
            });
            requestAnimationFrame(drawParticles);
        }

        drawParticles();

        window.addEventListener('resize', () => {
            W = canvas.width  = container.offsetWidth;
            H = canvas.height = container.offsetHeight;
        });
    }

    // ---- Banner card 3D tilt ----
    document.querySelectorAll('.banner-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top)  / rect.height;
            const tx = (y - 0.5) * -7;
            const ty = (x - 0.5) *  7;
            card.style.transform = `translateY(-5px) scale(1.01) perspective(700px) rotateX(${tx}deg) rotateY(${ty}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = '0.5s cubic-bezier(.4,0,.2,1)';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = '0.1s ease';
        });
    });

    // ---- Click ripple on cards ----
    document.querySelectorAll('.banner-card').forEach(card => {
        card.addEventListener('click', e => {
            const r   = document.createElement('span');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            r.style.cssText = `
                position:absolute;
                width:${size}px;height:${size}px;
                left:${e.clientX - rect.left - size/2}px;
                top:${e.clientY - rect.top - size/2}px;
                border-radius:50%;
                background:rgba(255,255,255,0.07);
                transform:scale(0);
                animation:ripple .6s ease-out forwards;
                pointer-events:none;z-index:20;
            `;
            card.appendChild(r);
            setTimeout(() => r.remove(), 700);
        });
    });

    // Ripple keyframe
    const sty = document.createElement('style');
    sty.textContent = `@keyframes ripple { to { transform:scale(1); opacity:0; } }`;
    document.head.appendChild(sty);

    // ---- Mobile menu toggle ----
    const menuBtn = document.getElementById('menuToggle');
    const nav     = document.querySelector('.header-nav');
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            const open = nav.style.display === 'flex';
            nav.style.cssText = open
                ? ''
                : 'display:flex;flex-direction:column;position:absolute;top:70px;left:0;right:0;background:rgba(15,14,12,0.98);padding:1.5rem 2rem;gap:1.2rem;border-bottom:1px solid rgba(255,255,255,0.07);';
        });
    }

    console.log('%cEBRA Kalkulatory ⚙', 'font-size:22px;font-weight:bold;color:#c9a227;');
    console.log('%c9 kalkulatorów dla rzemieślników pasjonatów', 'color:#a09a8e;');
});
