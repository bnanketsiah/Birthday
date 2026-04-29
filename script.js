const q = id => document.getElementById(id);
const wait = ms => new Promise(res => setTimeout(res, ms));

document.addEventListener("DOMContentLoaded", () => {
    // Canvas setup
    const matrixCanvas = q('matrixCanvas');
    const starryCanvas = q('starryCanvas');
    const ctxMatrix = matrixCanvas.getContext('2d');
    const ctxStar = starryCanvas.getContext('2d');

    function resize() {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
        starryCanvas.width = window.innerWidth;
        starryCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // ---------------- Phase 1: Matrix Rain ----------------
    const letters = 'HAPPYBIRTHDAYBIANCA1234567890'.split('');
    const fontSize = 20;
    let columns = Math.floor(window.innerWidth / fontSize);
    let drops = Array(columns).fill(1);
    let matrixInterval;

    function drawMatrix() {
        ctxMatrix.fillStyle = 'rgba(5, 5, 5, 0.1)';
        ctxMatrix.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        ctxMatrix.fillStyle = '#ff69b4';
        ctxMatrix.font = fontSize + 'px monospace';
        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctxMatrix.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }

    // ---------------- Phase 2: Starry Night ----------------
    const stars = Array(300).fill().map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3
    }));
    function drawStars() {
        ctxStar.clearRect(0, 0, starryCanvas.width, starryCanvas.height);
        ctxStar.fillStyle = 'white';
        stars.forEach(star => {
            ctxStar.beginPath();
            ctxStar.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctxStar.fill();
            star.x += star.dx;
            star.y += star.dy;
            if (star.x < 0) star.x = starryCanvas.width;
            if (star.x > starryCanvas.width) star.x = 0;
            if (star.y < 0) star.y = starryCanvas.height;
            if (star.y > starryCanvas.height) star.y = 0;
        });
        requestAnimationFrame(drawStars);
    }

    // ---------------- Timeline Sequences ----------------
    q('start-btn').addEventListener('click', async () => {
        q('start-screen').style.opacity = '0';
        setTimeout(() => q('start-screen').classList.add('hidden'), 500);

        // Start Matrix
        matrixInterval = setInterval(drawMatrix, 50);

        // Countdown
        const cd = q('countdown');
        for (let i = 3; i >= 1; i--) {
            cd.innerText = i;
            cd.style.transform = 'scale(0.5)';
            cd.style.opacity = '0';
            setTimeout(() => { cd.style.transform = 'scale(1)'; cd.style.opacity = '1'; }, 50);
            await wait(1000);
        }
        cd.classList.add('hidden');
        await wait(500);

        // Flashing Text synced to "beat"
        const flash = q('flashing-text');
        flash.classList.remove('hidden');
        const words = ["HAPPY", "BIRTHDAY", "BIANCA", "WISHING", "YOU", "THE BEST"];
        for (let w of words) {
            flash.innerText = w;
            flash.style.transform = 'scale(1.2)';
            setTimeout(() => flash.style.transform = 'scale(1)', 50);
            await wait(700);
        }
        flash.classList.add('hidden');

        // Phase 2: Transition
        clearInterval(matrixInterval);
        matrixCanvas.classList.add('hidden');
        q('phase1').classList.add('hidden');

        q('phase2').classList.remove('hidden');
        const heartPulse = q('heart-pulse');
        heartPulse.classList.remove('hidden');

        await wait(1500);

        // Background changes to starry night
        drawStars();
        starryCanvas.classList.remove('hidden');
        heartPulse.classList.add('hidden');

        // Mascot appears
        const mascot = q('mascot-container');
        mascot.classList.remove('hidden');

        await wait(4000);

        mascot.classList.add('hidden');
        await wait(1000);

        // Phase 3: Book
        q('phase2').classList.add('hidden');
        q('phase3').classList.remove('hidden');
    });

    // ---------------- Book Interactions ----------------
    const book = q('book');
    const pageCover = q('page-cover');
    const page1 = q('page1');
    const page2 = q('page2');
    const typewriterElement = q('typewriter-container');
    let typeWriterTimeout;

    function startTypewriter(text) {
        clearTimeout(typeWriterTimeout);
        typewriterElement.innerHTML = '';
        typewriterElement.classList.remove('hidden');

        function typeWriter(i) {
            if (i < text.length) {
                typewriterElement.innerHTML += text.charAt(i);
                typeWriterTimeout = setTimeout(() => typeWriter(i + 1), 60);
            }
        }
        typeWriter(0);
    }

    let currentZ = 5;

    q('open-book').addEventListener('click', () => {
        book.classList.add('open');
        pageCover.classList.add('flipped');
        pageCover.style.zIndex = currentZ++;
        setTimeout(() => startTypewriter("Wishing you the happiest of birthdays today! ✨"), 500);
    });

    q('turn-page1').addEventListener('click', () => {
        page1.classList.add('flipped');
        page1.style.zIndex = currentZ++;
        typewriterElement.innerHTML = '';
        setTimeout(() => startTypewriter("Cheers to another year of great memories together. 💖"), 500);
    });

    q('turn-page2').addEventListener('click', () => {
        page2.classList.add('flipped');
        page2.style.zIndex = currentZ++;
        typewriterElement.innerHTML = '';
        setTimeout(() => startTypewriter("Are you ready for your surprise? 🎁"), 500);
    });

    q('close-book-btn').addEventListener('click', async () => {
        typewriterElement.classList.add('hidden');

        // Naturally close the book by flipping the final page over to the left
        const pageBack = q('page-back');
        pageBack.classList.add('flipped');
        pageBack.style.zIndex = currentZ++;

        // Wait for the flip animation
        await wait(1800);

        // Trigger Grand Finale
        q('book-container').style.opacity = '0';
        setTimeout(() => {
            q('phase3').classList.add('hidden');
            q('phase4').classList.remove('hidden');
            createHeartMosaic();
        }, 1000);
    });

    // ---------------- Heart Mosaic ----------------
    function createHeartMosaic() {
        const container = q('mosaic-container');
        const totalPieces = 120;

        // Determine scale based on screen size so it looks good on mobile too
        const isMobile = window.innerWidth < 768;
        const scale = isMobile ? 8 : 16;

        const photoOptions = [
            "photo_1_2026-04-29_00-41-58.jpg",
            "photo_2_2026-04-29_00-41-58.jpg",
            "photo_3_2026-04-29_00-41-58.jpg",
            "photo_4_2026-04-29_00-41-58.jpg",
            "photo_5_2026-04-29_00-41-58.jpg",
            "photo_6_2026-04-29_00-41-58.jpg",
            "photo_7_2026-04-29_00-41-58.jpg",
            "photo_8_2026-04-29_00-41-58.jpg",
            "photo_9_2026-04-29_00-41-58.jpg",
            "photo_10_2026-04-29_00-41-58.jpg"
        ];

        for (let i = 0; i < totalPieces; i++) {
            const piece = document.createElement('div');
            piece.className = 'mosaic-piece';

            // Parametric heart equation
            const t = (i / totalPieces) * Math.PI * 2;
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

            piece.style.setProperty('--x', `${x * scale}px`);
            piece.style.setProperty('--y', `${y * scale}px`);
            piece.style.transform = `translate(0px, 0px) scale(0) rotate(${Math.random() * 360}deg)`;

            const randomPhoto = photoOptions[Math.floor(Math.random() * photoOptions.length)];
            piece.style.backgroundImage = `url('${randomPhoto}')`;

            container.appendChild(piece);

            setTimeout(() => {
                piece.style.opacity = 1;
                piece.style.transform = `translate(var(--x), var(--y)) scale(1) rotate(0deg)`;

                // Allow interactions once this piece has settled
                setTimeout(() => {
                    piece.classList.add('formed');
                }, 2500);
            }, 100 + (i * 25)); // Spiral sequential burst
        }

        // Reveal birthday message in the middle after entire heart is formed
        setTimeout(() => {
            q('heart-message').classList.remove('hidden');
        }, 100 + (totalPieces * 25) + 1500);
    }
});
