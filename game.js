/**
 * THE MUTINY - Cursed Arena Survival Game
 * Core JavaScript Logic
 */

// --- AUDIO SYNTHESIZER ENGINE (Web Audio API) ---
class SoundFXEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    // Play a retro-style laser/bullet sound
    playShoot() {
        if (this.muted) return;
        this.init();
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    }

    // Play a heavy shotgun/blunderbuss blast sound
    playBlunderbuss() {
        if (this.muted) return;
        this.init();
        const ctx = this.ctx;
        const bufferSize = ctx.sampleRate * 0.35; // 0.35 seconds
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        // Fill buffer with white noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = buffer;

        // Bandpass filter to make it sound punchy and deep
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 180;
        filter.Q.value = 1.2;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.8, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

        noiseNode.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noiseNode.start();
        noiseNode.stop(ctx.currentTime + 0.35);
    }

    // Melee sword slice
    playSword() {
        if (this.muted) return;
        this.init();
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

        // Filter to make it less harsh
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1500;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.12);
    }

    // Heavy crash/explosion sound (Anchor / Rum flask)
    playExplosion() {
        if (this.muted) return;
        this.init();
        const ctx = this.ctx;
        const bufferSize = ctx.sampleRate * 0.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.9, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        noiseNode.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        // Add a low oscillator rumble as well
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(20, ctx.currentTime + 0.4);
        oscGain.gain.setValueAtTime(0.5, ctx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);

        noiseNode.start();
        noiseNode.stop(ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    }

    // Lightning chain zap
    playLightning() {
        if (this.muted) return;
        this.init();
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        // Vibrato/frequency modulation
        osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.1);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    }

    // Player hit damage sound
    playPlayerHurt() {
        if (this.muted) return;
        this.init();
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.25);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.25);
    }

    // Enemy pop/death
    playEnemyDeath() {
        if (this.muted) return;
        this.init();
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(250, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    }

    // Weapon pickup arpeggio
    playPickup() {
        if (this.muted) return;
        this.init();
        const ctx = this.ctx;
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        
        notes.forEach((freq, idx) => {
            const timeOffset = idx * 0.06;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + timeOffset);
            
            gain.gain.setValueAtTime(0.0, ctx.currentTime + timeOffset);
            gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + timeOffset + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + timeOffset + 0.2);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime + timeOffset);
            osc.stop(ctx.currentTime + timeOffset + 0.2);
        });
    }

    // Wave horn sound
    playWaveHorn() {
        if (this.muted) return;
        this.init();
        const ctx = this.ctx;
        
        // Detuned brass sound using two triangle oscillators
        [100, 101.5].forEach(freq => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(freq * 0.9, ctx.currentTime + 0.8);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(100, ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);
            filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.8);

            gain.gain.setValueAtTime(0.0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.8);
        });
    }
}

const SoundFX = new SoundFXEngine();

// --- CONSTANTS & CONFIGURATION ---
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
// Combat arena playable boundary limits
const ARENA_X_MIN = 80;
const ARENA_X_MAX = 1120;
const ARENA_Y_MIN = 80;
const ARENA_Y_MAX = 720;

const WEAPONS = {
    flintlock: {
        id: "flintlock",
        name: "Rusty Flintlock",
        curse: "None. Standard issue. Pathetic damage.",
        cooldown: 400,
        damage: 15,
        type: "flintlock"
    },
    blunderbuss: {
        id: "blunderbuss",
        name: "Boom-erang Blunderbuss",
        curse: "Massive recoil flings you backward violently!",
        cooldown: 800,
        damage: 12, // 12 damage * 8 pellets
        type: "blunderbuss"
    },
    cutlass: {
        id: "cutlass",
        name: "Double-Edge Cutlass",
        curse: "Swinging drains 1 HP. Slain mutineers have a 35% chance to heal you +5 HP.",
        cooldown: 200,
        damage: 42,
        type: "cutlass"
    },
    anchor: {
        id: "anchor",
        name: "Heavy Anchor",
        curse: "Reduces movement speed by 45% and roots you in place for 0.4s when thrown.",
        cooldown: 1300,
        damage: 90,
        type: "anchor"
    },
    flask: {
        id: "flask",
        name: "Drunken Rum Flask",
        curse: "Drunken fumes wobble and sway your controls erratically.",
        cooldown: 700,
        damage: 28,
        type: "flask"
    },
    harpoon: {
        id: "harpoon",
        name: "Static Harpoon",
        curse: "Chaining lightning shocks and freezes you in place for 0.15s per strike.",
        cooldown: 950,
        damage: 55,
        type: "harpoon"
    }
};

const ENEMY_TYPES = {
    deckhand: {
        name: "Deckhand",
        health: 30,
        speed: 2.2,
        damage: 10,
        radius: 18,
        color: "#fa5252",
        points: 10
    },
    monkey: {
        name: "Powder Monkey",
        health: 15,
        speed: 3.8,
        damage: 25,
        radius: 14,
        color: "#fd7e14",
        points: 15,
        exploder: true
    },
    brute: {
        name: "Brute Mutineer",
        health: 100,
        speed: 1.3,
        damage: 30,
        radius: 26,
        color: "#e64980",
        points: 40
    },
    ghost: {
        name: "Ghost Captain",
        health: 45,
        speed: 1.8,
        damage: 15,
        radius: 20,
        color: "#22b8cf",
        points: 30,
        ranged: true,
        shootCooldown: 2200
    }
};

// --- GAME STATE ---
const state = {
    gameState: 'MENU', // 'MENU', 'PLAYING', 'GAMEOVER'
    player: null,
    enemies: [],
    projectiles: [],
    crates: [],
    particles: [],
    fireZones: [],
    lightningChains: [],
    shockwaves: [],
    wave: 0,
    waveActive: false,
    waveTimer: 0,
    totalEnemiesInWave: 0,
    enemiesKilledInWave: 0,
    waveRestTimer: 0,
    survivalTimer: 0, // In seconds
    kills: 0,
    highScoreTime: 0, // Stored locally
    screenShake: { x: 0, y: 0, amount: 0, duration: 0 },
    keys: {},
    mouse: { x: 0, y: 0, isDown: false },
    canvas: null,
    ctx: null,
    lastTime: 0,
    weaponUsage: {}, // Tracks which weapon used most
    epitaphs: [
        "Feedin' the fishes would be a step up from this...",
        "Betrayed by a crew that couldn't even scrub the deck right.",
        "They wanted the Captain's hat. Now they have it.",
        "Drowned in blood, steel, and cheap pirate rum.",
        "A glorious mutiny, but a poor day for you.",
        "Legend says his ghostly boots are still stuck to the deck.",
        "One blunderbuss blast too many, it seems."
    ]
};

// --- SCREEN SHAKE FX ---
function triggerScreenShake(amount, duration) {
    if (amount > state.screenShake.amount) {
        state.screenShake.amount = amount;
        state.screenShake.duration = duration;
    }
}

function updateScreenShake() {
    if (state.screenShake.duration > 0) {
        state.screenShake.amount *= 0.92; // decay
        state.screenShake.duration -= 1;
        state.screenShake.x = (Math.random() * 2 - 1) * state.screenShake.amount;
        state.screenShake.y = (Math.random() * 2 - 1) * state.screenShake.amount;
    } else {
        state.screenShake.x = 0;
        state.screenShake.y = 0;
        state.screenShake.amount = 0;
    }
}

// --- PARTICLE SYSTEM ---
class Particle {
    constructor(x, y, vx, vy, color, size, life, type = 'normal') {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.initialLife = life;
        this.life = life;
        this.type = type; // 'normal', 'text', 'smoke', 'sparkle', 'lightning'
        this.alpha = 1;
        this.text = ""; // For damage numbers
        this.gravity = 0;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life -= 1;
        this.alpha = Math.max(0, this.life / this.initialLife);

        if (this.type === 'smoke') {
            this.size += 0.15; // Smoke expands
            this.vx *= 0.95;
            this.vy *= 0.95;
        } else if (this.type === 'normal') {
            this.vx *= 0.97;
            this.vy *= 0.97;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        if (this.type === 'text') {
            ctx.fillStyle = this.color;
            ctx.font = 'bold 16px Outfit';
            ctx.textAlign = 'center';
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

function spawnSplatter(x, y, color, count = 8, speedScale = 4) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 0.7 + 0.3) * speedScale;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const size = Math.random() * 3 + 2;
        const life = Math.random() * 20 + 20;
        state.particles.push(new Particle(x, y, vx, vy, color, size, life));
    }
}

function spawnSmoke(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.5;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const size = Math.random() * 6 + 4;
        const life = Math.random() * 25 + 15;
        const gray = Math.floor(Math.random() * 40 + 80);
        const color = `rgb(${gray}, ${gray}, ${gray})`;
        state.particles.push(new Particle(x, y, vx, vy, color, size, life, 'smoke'));
    }
}

function spawnSparks(x, y, color = '#ffd700', count = 10) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const size = Math.random() * 2 + 1.5;
        const life = Math.random() * 15 + 10;
        state.particles.push(new Particle(x, y, vx, vy, color, size, life, 'sparkle'));
    }
}

function spawnFloatingText(x, y, text, color) {
    const p = new Particle(x, y, (Math.random() * 2 - 1) * 0.5, -2, color, 0, 45, 'text');
    p.text = text;
    p.gravity = 0.05;
    state.particles.push(p);
}

// --- PLAYER CLASS ---
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = 20;
        this.maxHealth = 100;
        this.health = 100;
        this.baseSpeed = 4.2;
        this.activeWeapon = WEAPONS.flintlock;
        this.shootCooldownTimer = 0;
        this.rootTimer = 0; // Thrown Anchor roots
        this.stunTimer = 0; // Lightning shock freeze
        this.flashTimer = 0; // Red flash on damage
        this.angle = 0; // Aim angle
    }

    takeDamage(amount) {
        if (this.health <= 0) return;
        this.health = Math.max(0, this.health - amount);
        this.flashTimer = 10;
        triggerScreenShake(8, 15);
        SoundFX.playPlayerHurt();
        spawnSplatter(this.x, this.y, '#ff4b4b', 12, 5);
        spawnFloatingText(this.x, this.y - 25, `-${amount} HP`, '#ff4b4b');
        
        // Shake HUD panel dynamically
        const hud = document.getElementById('hud');
        if (hud) {
            hud.classList.add('shake-hud');
            setTimeout(() => hud.classList.remove('shake-hud'), 300);
        }

        if (this.health <= 0) {
            endGame();
        }
    }

    update() {
        // Cooldowns
        if (this.shootCooldownTimer > 0) this.shootCooldownTimer -= 16.67; // approx ms per frame
        if (this.rootTimer > 0) this.rootTimer -= 16.67;
        if (this.stunTimer > 0) this.stunTimer -= 16.67;
        if (this.flashTimer > 0) this.flashTimer -= 1;

        // Aiming angle
        this.angle = Math.atan2(state.mouse.y - this.y, state.mouse.x - this.x);

        // Movement logic
        let moveX = 0;
        let moveY = 0;

        if (state.keys['w'] || state.keys['arrowup']) moveY -= 1;
        if (state.keys['s'] || state.keys['arrowdown']) moveY += 1;
        if (state.keys['a'] || state.keys['arrowleft']) moveX -= 1;
        if (state.keys['d'] || state.keys['arrowright']) moveX += 1;

        // Apply movement forces if not stunned/rooted
        if (this.rootTimer <= 0 && this.stunTimer <= 0) {
            let speed = this.baseSpeed;

            // --- CURSE: Heavy Anchor reduces speed by 45% ---
            if (this.activeWeapon.id === 'anchor') {
                speed *= 0.55;
            }

            if (moveX !== 0 && moveY !== 0) {
                // Normalize diagonal
                const length = Math.sqrt(moveX * moveX + moveY * moveY);
                moveX /= length;
                moveY /= length;
            }

            // --- CURSE: Rum Flask Wobble ---
            if (this.activeWeapon.id === 'flask' && (moveX !== 0 || moveY !== 0)) {
                let targetAngle = Math.atan2(moveY, moveX);
                // Wavy movement based on oscillator
                targetAngle += Math.sin(Date.now() / 150) * 0.9;
                moveX = Math.cos(targetAngle);
                moveY = Math.sin(targetAngle);
            }

            // Simple inertia acceleration
            this.vx += moveX * 0.6;
            this.vy += moveY * 0.6;
        }

        // Friction / drag
        this.vx *= 0.85;
        this.vy *= 0.85;

        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;

        // Keep inside boundary limits
        if (this.x < ARENA_X_MIN) { this.x = ARENA_X_MIN; this.vx = 0; }
        if (this.x > ARENA_X_MAX) { this.x = ARENA_X_MAX; this.vx = 0; }
        if (this.y < ARENA_Y_MIN) { this.y = ARENA_Y_MIN; this.vy = 0; }
        if (this.y > ARENA_Y_MAX) { this.y = ARENA_Y_MAX; this.vy = 0; }

        // Automatically attack if mouse is held down
        if (state.mouse.isDown && this.shootCooldownTimer <= 0 && this.rootTimer <= 0 && this.stunTimer <= 0) {
            this.fireWeapon();
        }
    }

    fireWeapon() {
        const weapon = this.activeWeapon;
        this.shootCooldownTimer = weapon.cooldown;

        // Track weapon usage
        state.weaponUsage[weapon.name] = (state.weaponUsage[weapon.name] || 0) + 1;

        if (weapon.id === 'flintlock') {
            SoundFX.playShoot();
            // Single straight projectile
            const vx = Math.cos(this.angle) * 12;
            const vy = Math.sin(this.angle) * 12;
            // Spawn just in front of player
            const px = this.x + Math.cos(this.angle) * this.radius;
            const py = this.y + Math.sin(this.angle) * this.radius;
            state.projectiles.push(new Projectile(px, py, vx, vy, weapon.damage, 'player', 6));
        }
        else if (weapon.id === 'blunderbuss') {
            SoundFX.playBlunderbuss();
            triggerScreenShake(12, 10);
            
            // CONE BLAST: 8 pellets spreading
            const pelletCount = 8;
            const spread = 0.35; // total spread arc in radians
            const baseAngle = this.angle;
            
            for (let i = 0; i < pelletCount; i++) {
                const angleOffset = (Math.random() - 0.5) * spread;
                const finalAngle = baseAngle + angleOffset;
                const speed = Math.random() * 5 + 9; // varied speeds
                const vx = Math.cos(finalAngle) * speed;
                const vy = Math.sin(finalAngle) * speed;
                const px = this.x + Math.cos(baseAngle) * this.radius;
                const py = this.y + Math.sin(baseAngle) * this.radius;
                
                // pellets have shorter lifetime (range limit)
                const p = new Projectile(px, py, vx, vy, weapon.damage, 'player', 4);
                p.life = Math.random() * 12 + 10; 
                p.color = '#ffd43b';
                state.projectiles.push(p);
            }

            // --- CURSE: Heavy Recoil pushback ---
            const pushMagnitude = 18;
            this.vx -= Math.cos(baseAngle) * pushMagnitude;
            this.vy -= Math.sin(baseAngle) * pushMagnitude;

            // Muzzle particles
            spawnSmoke(this.x + Math.cos(baseAngle) * 30, this.y + Math.sin(baseAngle) * 30, 8);
        }
        else if (weapon.id === 'cutlass') {
            SoundFX.playSword();
            
            // MELEE SWING: Check all enemies inside a forward arc
            const swingRadius = 95;
            const swingAngleRange = 1.6; // ~90 degrees
            
            // Swing effect arc graphic properties
            state.shockwaves.push({
                x: this.x,
                y: this.y,
                type: 'slash',
                radius: swingRadius,
                maxRadius: swingRadius,
                angle: this.angle,
                spread: swingAngleRange,
                life: 6,
                maxLife: 6
            });

            // Strike check
            state.enemies.forEach(enemy => {
                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= swingRadius + enemy.radius) {
                    const angleToEnemy = Math.atan2(dy, dx);
                    // Angle difference normalized to -PI to PI
                    let diff = angleToEnemy - this.angle;
                    while (diff < -Math.PI) diff += Math.PI * 2;
                    while (diff > Math.PI) diff -= Math.PI * 2;
                    
                    if (Math.abs(diff) <= swingAngleRange / 2) {
                        enemy.takeDamage(weapon.damage);
                        // slight knockback
                        const kx = Math.cos(angleToEnemy) * 6;
                        const ky = Math.sin(angleToEnemy) * 6;
                        enemy.vx += kx;
                        enemy.vy += ky;
                    }
                }
            });

            // --- CURSE: Cutlass health drain ---
            this.takeDamage(1); 
        }
        else if (weapon.id === 'anchor') {
            SoundFX.playShoot();
            // Thrown heavy anchor projectile
            const vx = Math.cos(this.angle) * 7.5;
            const vy = Math.sin(this.angle) * 7.5;
            const targetX = state.mouse.x;
            const targetY = state.mouse.y;
            
            const p = new Projectile(this.x, this.y, vx, vy, weapon.damage, 'player', 15);
            p.type = 'anchor';
            p.targetX = targetX;
            p.targetY = targetY;
            p.color = '#868e96';
            state.projectiles.push(p);

            // --- CURSE: Thrown Anchor roots player in place ---
            this.vx = 0;
            this.vy = 0;
            this.rootTimer = 400; // 0.4 seconds root
            spawnSmoke(this.x, this.y, 4);
        }
        else if (weapon.id === 'flask') {
            SoundFX.playShoot();
            // Lobbed flask
            const vx = Math.cos(this.angle) * 8.5;
            const vy = Math.sin(this.angle) * 8.5;
            const targetX = state.mouse.x;
            const targetY = state.mouse.y;

            const p = new Projectile(this.x, this.y, vx, vy, weapon.damage, 'player', 10);
            p.type = 'flask';
            p.targetX = targetX;
            p.targetY = targetY;
            p.color = '#e67700';
            state.projectiles.push(p);
        }
        else if (weapon.id === 'harpoon') {
            SoundFX.playShoot();
            // Fires piercing harpoon
            const vx = Math.cos(this.angle) * 14;
            const vy = Math.sin(this.angle) * 14;
            const p = new Projectile(this.x, this.y, vx, vy, weapon.damage, 'player', 7);
            p.type = 'harpoon';
            p.color = '#15aabf';
            state.projectiles.push(p);
        }
    }

    draw(ctx) {
        ctx.save();

        // Stunned blue electricity visual effect
        if (this.stunTimer > 0) {
            ctx.strokeStyle = '#22b8cf';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 6 + Math.sin(Date.now() / 30) * 4, 0, Math.PI * 2);
            ctx.stroke();

            // Tiny lightning sparks
            if (Math.random() < 0.4) {
                spawnSparks(this.x, this.y, '#3bc9db', 1);
            }
        }

        // Draw Player body as a duck
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Flash Red on taking damage
        if (this.flashTimer > 0) {
            ctx.fillStyle = '#ff6b6b';
        } else {
            ctx.fillStyle = '#ffd93d'; // Duck yellow
        }

        ctx.strokeStyle = '#412b14';
        ctx.lineWidth = 2.5;

        // Duck body
        ctx.beginPath();
        ctx.ellipse(0, 0, this.radius * 1.15, this.radius * 0.9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Duck head
        ctx.beginPath();
        ctx.arc(this.radius * 0.9, -this.radius * 0.2, this.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Wing
        ctx.fillStyle = '#f5c32c';
        ctx.beginPath();
        ctx.ellipse(-4, 4, this.radius * 0.45, this.radius * 0.22, -0.65, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Bill
        ctx.fillStyle = '#ff9f43';
        ctx.beginPath();
        ctx.moveTo(this.radius * 1.45, -4);
        ctx.lineTo(this.radius * 2.1, 0);
        ctx.lineTo(this.radius * 1.45, 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.radius * 0.85, -this.radius * 0.35, 5, 0, Math.PI * 2);
        ctx.fill();

        // Pirate bandanna crest
        ctx.fillStyle = '#c92a2a';
        ctx.beginPath();
        ctx.moveTo(-this.radius, -5);
        ctx.lineTo(-this.radius - 14, -14);
        ctx.lineTo(-this.radius - 8, 2);
        ctx.closePath();
        ctx.fill();

        // Active weapon floating by the duck
        ctx.fillStyle = '#495057';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.fillRect(12, 18, 18, 6);
        ctx.strokeRect(12, 18, 18, 6);

        ctx.restore();

        // Thrown Anchor root chain graphic
        if (this.rootTimer > 0) {
            ctx.strokeStyle = '#868e96';
            ctx.lineWidth = 3.5;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + 40);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
}

// --- PROJECTILE CLASS ---
class Projectile {
    constructor(x, y, vx, vy, damage, owner = 'player', radius = 5) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.damage = damage;
        this.owner = owner; // 'player', 'enemy'
        this.radius = radius;
        this.life = 120; // 2 seconds
        this.type = 'bullet'; // 'bullet', 'anchor', 'flask', 'harpoon'
        this.color = '#fff';
        
        // Thrown specific
        this.targetX = 0;
        this.targetY = 0;
        this.startY = y;
        this.startX = x;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 1;

        if (this.type === 'anchor' || this.type === 'flask') {
            // Check distance to target
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Explode/land when close to target or life expires
            if (dist < 15 || this.life < 10) {
                this.life = 0;
                this.onImpact();
            }
        }
    }

    onImpact() {
        if (this.type === 'anchor') {
            SoundFX.playExplosion();
            triggerScreenShake(20, 20);
            
            // Mega Golden Shockwave
            state.shockwaves.push({
                x: this.x,
                y: this.y,
                radius: 10,
                maxRadius: 180,
                life: 18,
                maxLife: 18,
                damage: this.damage,
                type: 'anchor'
            });

            // Anchor smoke & sparks
            spawnSmoke(this.x, this.y, 20);
            spawnSparks(this.x, this.y, '#ffd700', 30);
        }
        else if (this.type === 'flask') {
            SoundFX.playExplosion();
            triggerScreenShake(10, 15);
            
            // Spawn Fire Zone
            state.fireZones.push({
                x: this.x,
                y: this.y,
                radius: 110,
                damage: this.damage, // DPS
                life: 240, // 4 seconds
                maxLife: 240
            });

            spawnSmoke(this.x, this.y, 10);
            spawnSparks(this.x, this.y, '#f76707', 20);
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;

        ctx.beginPath();
        if (this.type === 'anchor') {
            // Draw a heavy anchor shape
            ctx.translate(this.x, this.y);
            ctx.rotate(this.life * 0.05); // Spin
            ctx.lineWidth = 3;
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI, false);
            ctx.moveTo(0, -12);
            ctx.lineTo(0, 8);
            ctx.stroke();
        } else if (this.type === 'flask') {
            // Draw round bottle flask
            ctx.fillStyle = '#d9480f';
            ctx.strokeStyle = '#ffd8a8';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        } else if (this.type === 'harpoon') {
            // Piercing arrow/harpoon
            const angle = Math.atan2(this.vy, this.vx);
            ctx.translate(this.x, this.y);
            ctx.rotate(angle);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(-12, 0);
            ctx.lineTo(12, 0);
            ctx.lineTo(6, -6);
            ctx.moveTo(12, 0);
            ctx.lineTo(6, 6);
            ctx.stroke();
        } else {
            // Simple Bullet
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

// --- ENEMY CLASS ---
class Enemy {
    constructor(x, y, config) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.type = config.name;
        this.maxHealth = config.health * (1 + (state.wave - 1) * 0.15); // Escalating Health
        this.health = this.maxHealth;
        this.speed = config.speed * (1 + (state.wave - 1) * 0.05);  // Escalating Speed
        this.damage = config.damage * (1 + (state.wave - 1) * 0.1);  // Escalating Damage
        this.radius = config.radius;
        this.color = config.color;
        this.points = config.points;
        this.exploder = config.exploder || false;
        this.ranged = config.ranged || false;
        this.shootCooldown = config.shootCooldown || 2000;
        this.shootTimer = Math.random() * this.shootCooldown;
        this.flashTimer = 0;
        
        // Explosion charge timer for Powder Monkey
        this.chargeTimer = 0;
        this.maxCharge = 25; // frames (approx 0.4s fuse)
    }

    takeDamage(amount) {
        if (this.health <= 0) return;
        this.health = Math.max(0, this.health - amount);
        this.flashTimer = 8;
        
        SoundFX.playEnemyDeath(); // small pop sound
        spawnSplatter(this.x, this.y, this.color, 5, 3.5);
        spawnFloatingText(this.x, this.y - 20, Math.round(amount), '#fff');

        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        state.kills += 1;
        state.enemiesKilledInWave += 1;
        SoundFX.playExplosion(); // bigger death sound
        spawnSplatter(this.x, this.y, this.color, 18, 6.5);
        spawnFloatingText(this.x, this.y - 30, `+${this.points} pts`, '#ffd700');

        // --- CURSE REWARD: Double-Edge Cutlass life-steal check ---
        if (state.player.activeWeapon.id === 'cutlass' && Math.random() < 0.35) {
            const healAmount = 5;
            state.player.health = Math.min(state.player.maxHealth, state.player.health + healAmount);
            spawnFloatingText(state.player.x, state.player.y - 30, `+${healAmount} HP`, '#40c057');
            SoundFX.playPickup();
        }

        // Chance to drop weapon chest on death (5% base + scaled)
        if (Math.random() < 0.08) {
            spawnCrate(this.x, this.y);
        }
    }

    update() {
        if (this.flashTimer > 0) this.flashTimer -= 1;

        const player = state.player;
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Movement logic
        if (this.exploder && dist < this.radius + player.radius + 15) {
            // Charging explosion: freeze and flash red rapidly
            this.vx *= 0.5;
            this.vy *= 0.5;
            this.chargeTimer += 1;
            
            if (this.chargeTimer >= this.maxCharge) {
                this.explode();
            }
        }
        else if (this.ranged) {
            // Stay at a distance and shoot
            const idealDist = 320;
            if (dist > idealDist + 40) {
                this.vx += (dx / dist) * 0.15;
                this.vy += (dy / dist) * 0.15;
            } else if (dist < idealDist - 40) {
                this.vx -= (dx / dist) * 0.15;
                this.vy -= (dy / dist) * 0.15;
            } else {
                // strafe/wander around player slightly
                this.vx += (-dy / dist) * 0.08;
                this.vy += (dx / dist) * 0.08;
            }

            // Fire ghostly bullet
            this.shootTimer -= 16.67;
            if (this.shootTimer <= 0) {
                this.shootTimer = this.shootCooldown;
                this.shootRangedProjectile(dx, dy, dist);
            }
        }
        else {
            // Standard chaser behavior
            this.vx += (dx / dist) * 0.12;
            this.vy += (dy / dist) * 0.12;
        }

        // Apply friction
        this.vx *= 0.92;
        this.vy *= 0.92;

        // Apply velocity & speed limit
        let currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (currentSpeed > this.speed) {
            this.vx = (this.vx / currentSpeed) * this.speed;
            this.vy = (this.vy / currentSpeed) * this.speed;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Avoid overlap with other enemies (repulsion)
        state.enemies.forEach(other => {
            if (other === this) return;
            const odx = other.x - this.x;
            const ody = other.y - this.y;
            const odist = Math.sqrt(odx * odx + ody * ody);
            const minDist = this.radius + other.radius;
            if (odist < minDist && odist > 0) {
                const push = (minDist - odist) * 0.08;
                this.x -= (odx / odist) * push;
                this.y -= (ody / odist) * push;
                other.x += (odx / odist) * push;
                other.y += (ody / odist) * push;
            }
        });

        // Melee damage check on touch
        if (!this.exploder && dist < this.radius + player.radius) {
            player.takeDamage(Math.round(this.damage / 60)); // DPS scaled over frames
        }
    }

    shootRangedProjectile(dx, dy, dist) {
        if (state.gameState !== 'PLAYING') return;
        const speed = 5.5;
        const vx = (dx / dist) * speed;
        const vy = (dy / dist) * speed;
        
        // Ghost projectile
        const p = new Projectile(this.x, this.y, vx, vy, this.damage, 'enemy', 5);
        p.color = '#22b8cf';
        state.projectiles.push(p);
    }

    explode() {
        const player = state.player;
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        SoundFX.playExplosion();
        triggerScreenShake(15, 12);
        spawnSmoke(this.x, this.y, 12);
        spawnSparks(this.x, this.y, '#fd7e14', 15);

        // Explosion radius
        const explosionRadius = 90;
        if (dist <= explosionRadius + player.radius) {
            const damageMult = (explosionRadius - dist) / explosionRadius;
            player.takeDamage(Math.round(this.damage * damageMult));
            
            // Push player back
            const angle = Math.atan2(dy, dx);
            player.vx += Math.cos(angle) * 10;
            player.vy += Math.sin(angle) * 10;
        }

        // Damage other nearby enemies!
        state.enemies.forEach(enemy => {
            if (enemy === this) return;
            const edx = enemy.x - this.x;
            const edy = enemy.y - this.y;
            const edist = Math.sqrt(edx * edx + edy * edy);
            if (edist <= explosionRadius + enemy.radius) {
                const damageMult = (explosionRadius - edist) / explosionRadius;
                enemy.takeDamage(this.damage * damageMult * 0.8);
            }
        });

        // Instantly kill self (silent delete)
        this.health = 0;
        state.enemiesKilledInWave += 1;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Flashing animation
        if (this.flashTimer > 0) {
            ctx.fillStyle = '#fff';
        } else if (this.exploder && this.chargeTimer > 0) {
            // Alternating flash for Powder Monkey fuse
            const t = Math.floor(Date.now() / 60) % 2;
            ctx.fillStyle = t === 0 ? '#ff0000' : this.color;
        } else {
            ctx.fillStyle = this.color;
        }

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Visual characteristics per type
        if (this.type === 'Deckhand') {
            // Draw red bandanna knot
            ctx.fillStyle = '#ff3333';
            ctx.beginPath();
            ctx.arc(-this.radius + 3, -3, 5, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'Powder Monkey') {
            // Draw black bomb fuse line
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, -this.radius);
            ctx.quadraticCurveTo(8, -this.radius - 8, 4, -this.radius - 16);
            ctx.stroke();
            
            // Fuse spark
            ctx.fillStyle = '#ffe066';
            ctx.beginPath();
            ctx.arc(4, -this.radius - 16, 3, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'Brute Mutineer') {
            // Draw spikes / armored studs
            ctx.fillStyle = '#343a40';
            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
                const sx = Math.cos(angle) * (this.radius + 1);
                const sy = Math.sin(angle) * (this.radius + 1);
                ctx.beginPath();
                ctx.arc(sx, sy, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (this.type === 'Ghost Captain') {
            // Ghostly tail outline
            ctx.strokeStyle = '#a5d8ff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius + 4, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Draw simple health bar if damaged
        if (this.health < this.maxHealth && this.health > 0) {
            const barW = this.radius * 2;
            const barH = 5;
            const bx = -this.radius;
            const by = -this.radius - 12;
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(bx, by, barW, barH);
            
            ctx.fillStyle = '#ff4b4b';
            const hw = barW * (this.health / this.maxHealth);
            ctx.fillRect(bx, by, hw, barH);
        }

        ctx.restore();
    }
}

// --- CRATE / WEAPON DROP CLASS ---
class Crate {
    constructor(x, y, weapon) {
        this.x = x;
        this.y = y;
        this.radius = 16;
        this.weapon = weapon; // Cursed weapon template
        this.life = 700; // auto despawn if uncollected (approx 11 seconds)
        this.pulse = 0;
    }

    update() {
        this.life -= 1;
        this.pulse += 0.05;
        
        // Spawn shiny particles around chest
        if (Math.random() < 0.05) {
            spawnSparks(this.x, this.y, '#ffd700', 2);
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        const glow = 8 + Math.sin(this.pulse) * 4;
        ctx.shadowBlur = glow;
        ctx.shadowColor = '#ffd700';

        // Outer chest box
        ctx.fillStyle = '#d9a700';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        
        const size = this.radius;
        ctx.fillRect(-size, -size * 0.7, size * 2, size * 1.4);
        ctx.strokeRect(-size, -size * 0.7, size * 2, size * 1.4);

        // Center bands / metal strapping
        ctx.fillStyle = '#5c4308';
        ctx.fillRect(-size * 0.3, -size * 0.7, size * 0.6, size * 1.4);
        
        // Keyhole lock
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

function spawnCrate(x, y) {
    // Select a random cursed weapon (excluding flintlock)
    const list = Object.keys(WEAPONS).filter(k => k !== 'flintlock');
    // If player holds a weapon, try to drop a *different* one
    const pWeaponId = state.player ? state.player.activeWeapon.id : 'flintlock';
    let filteredList = list.filter(k => k !== pWeaponId);
    if (filteredList.length === 0) filteredList = list;
    
    const choice = filteredList[Math.floor(Math.random() * filteredList.length)];
    state.crates.push(new Crate(x, y, WEAPONS[choice]));
}

// --- PROJECTILE & WEAPON MECHANICS (Harpoon Chaining, Shockwaves) ---

function triggerLightningChain(startX, startY, fromEnemy, sourceDamage, maxChains = 3) {
    let currentX = startX;
    let currentY = startY;
    let hitList = new Set();
    if (fromEnemy) hitList.add(fromEnemy);

    let lastEnemy = fromEnemy;

    for (let c = 0; c < maxChains; c++) {
        // Find closest enemy not hit yet
        let closest = null;
        let minDist = 220; // chaining distance limit

        state.enemies.forEach(enemy => {
            if (hitList.has(enemy)) return;
            const dx = enemy.x - currentX;
            const dy = enemy.y - currentY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
                minDist = dist;
                closest = enemy;
            }
        });

        if (closest) {
            hitList.add(closest);
            closest.takeDamage(sourceDamage);
            
            // Add lightning chain line to list for render
            state.lightningChains.push({
                x1: currentX,
                y1: currentY,
                x2: closest.x,
                y2: closest.y,
                life: 10,
                maxLife: 10
            });

            // --- CURSE: Static Harpoon Stun freeze ---
            state.player.vx = 0;
            state.player.vy = 0;
            state.player.stunTimer += 150; // +0.15s per shock chain

            currentX = closest.x;
            currentY = closest.y;
            lastEnemy = closest;
        } else {
            break;
        }
    }

    if (hitList.size > 1) {
        SoundFX.playLightning();
    }
}

// --- GAME LOGIC LOOPS ---

function initGame() {
    state.player = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    state.enemies = [];
    state.projectiles = [];
    state.crates = [];
    state.particles = [];
    state.fireZones = [];
    state.lightningChains = [];
    state.shockwaves = [];
    state.wave = 0;
    state.waveActive = false;
    state.waveTimer = 0;
    state.waveRestTimer = 0;
    state.survivalTimer = 0;
    state.kills = 0;
    state.weaponUsage = {};

    // Load High score safely
    try {
        const storedScore = localStorage.getItem('mutiny_highscore_time');
        state.highScoreTime = storedScore ? parseFloat(storedScore) : 0;
    } catch (err) {
        state.highScoreTime = 0;
    }

    // Show HUD, Hide Menus
    const hud = document.getElementById('hud');
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over-screen');

    if (hud) hud.classList.remove('hidden');
    if (startScreen) {
        startScreen.classList.add('hidden');
        startScreen.classList.remove('active');
    }
    if (gameOverScreen) {
        gameOverScreen.classList.add('hidden');
        gameOverScreen.classList.remove('active');
    }

    state.gameState = 'PLAYING';
    state.lastTime = 0;
    SoundFX.playWaveHorn();

    startNextWave();
}

function startNextWave() {
    state.wave += 1;
    state.waveActive = true;
    state.enemiesKilledInWave = 0;
    state.waveTimer = 0;

    // Formulate total enemies based on wave scaling
    const deckCount = 6 + state.wave * 3;
    const monkeyCount = state.wave >= 2 ? 2 + state.wave * 1.5 : 0;
    const bruteCount = state.wave >= 3 ? Math.floor(state.wave * 1.2) : 0;
    const ghostCount = state.wave >= 4 ? Math.floor(state.wave * 1.0) : 0;

    state.totalEnemiesInWave = Math.floor(deckCount + monkeyCount + bruteCount + ghostCount);

    // Dynamic wave labels
    document.getElementById('wave-title').innerText = `WAVE ${state.wave}`;
    const subs = [
        "CREW MUTINY IMMINENT",
        "STORMING THE CAPTAIN'S CABIN",
        "SCURVY BILGE RAT SQUAD",
        "THE FIRST MATE'S OFFENSIVE",
        "ELITE PHANTOM FLEET",
        "NO QUARTER GIVEN",
        "THE CAPTAIN'S DOOMSDAY"
    ];
    document.getElementById('wave-sub').innerText = subs[(state.wave - 1) % subs.length];

    // Spawn queue
    let spawnQueue = [];
    for (let i = 0; i < Math.floor(deckCount); i++) spawnQueue.push('deckhand');
    for (let i = 0; i < Math.floor(monkeyCount); i++) spawnQueue.push('monkey');
    for (let i = 0; i < Math.floor(bruteCount); i++) spawnQueue.push('brute');
    for (let i = 0; i < Math.floor(ghostCount); i++) spawnQueue.push('ghost');

    // Shuffle queue
    spawnQueue.sort(() => Math.random() - 0.5);

    // Stagger enemy spawning
    spawnQueue.forEach((type, idx) => {
        setTimeout(() => {
            if (state.gameState !== 'PLAYING' || !state.waveActive) return;
            spawnEnemy(type);
        }, idx * 600 + 1000);
    });

    // Award a random weapon drop crate at the start of each wave
    setTimeout(() => {
        if (state.gameState === 'PLAYING') {
            spawnCrate(CANVAS_WIDTH / 2 + (Math.random() * 400 - 200), CANVAS_HEIGHT / 2 + (Math.random() * 250 - 125));
            spawnFloatingText(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "WEAPON DROP!", '#ffd700');
            SoundFX.playPickup();
        }
    }, 1500);

    SoundFX.playWaveHorn();
}

function spawnEnemy(type) {
    const config = ENEMY_TYPES[type];
    
    // Spawn along perimeter of the arena to avoid instant overlaps with player
    let x, y;
    const side = Math.floor(Math.random() * 4);
    
    if (side === 0) { // Top
        x = Math.random() * (ARENA_X_MAX - ARENA_X_MIN) + ARENA_X_MIN;
        y = ARENA_Y_MIN + 10;
    } else if (side === 1) { // Bottom
        x = Math.random() * (ARENA_X_MAX - ARENA_X_MIN) + ARENA_X_MIN;
        y = ARENA_Y_MAX - 10;
    } else if (side === 2) { // Left
        x = ARENA_X_MIN + 10;
        y = Math.random() * (ARENA_Y_MAX - ARENA_Y_MIN) + ARENA_Y_MIN;
    } else { // Right
        x = ARENA_X_MAX - 10;
        y = Math.random() * (ARENA_Y_MAX - ARENA_Y_MIN) + ARENA_Y_MIN;
    }

    state.enemies.push(new Enemy(x, y, config));
}

function updateGame(deltaTime) {
    if (state.gameState !== 'PLAYING') return;

    // Tick clocks
    state.survivalTimer += deltaTime / 1000;

    // Update screen shake
    updateScreenShake();

    // Player update
    state.player.update();

    // Projectile update
    for (let i = state.projectiles.length - 1; i >= 0; i--) {
        const p = state.projectiles[i];
        p.update();

        // Bounds check
        if (p.x < ARENA_X_MIN || p.x > ARENA_X_MAX || p.y < ARENA_Y_MIN || p.y > ARENA_Y_MAX || p.life <= 0) {
            state.projectiles.splice(i, 1);
            continue;
        }

        // Collision Checks
        if (p.owner === 'player') {
            let hit = false;
            for (let j = state.enemies.length - 1; j >= 0; j--) {
                const enemy = state.enemies[j];
                const dx = enemy.x - p.x;
                const dy = enemy.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < enemy.radius + p.radius) {
                    hit = true;
                    if (p.type === 'bullet') {
                        enemy.takeDamage(enemy.health);
                    } else {
                        enemy.takeDamage(p.damage);
                    }

                    // Harpoon chain spark check
                    if (p.type === 'harpoon') {
                        triggerLightningChain(enemy.x, enemy.y, enemy, p.damage);
                    }
                    break; 
                }
            }
            // Bullets destroy on hit, piercing harpoons/anchors do not
            if (hit && p.type !== 'harpoon') {
                state.projectiles.splice(i, 1);
            }
        } else {
            // Enemy projectile hits player
            const dx = state.player.x - p.x;
            const dy = state.player.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < state.player.radius + p.radius) {
                state.player.takeDamage(p.damage);
                state.projectiles.splice(i, 1);
            }
        }
    }

    // Enemies update
    for (let i = state.enemies.length - 1; i >= 0; i--) {
        const enemy = state.enemies[i];
        enemy.update();

        if (enemy.health <= 0) {
            state.enemies.splice(i, 1);
        }
    }

    // Weapon Crates update & collect
    for (let i = state.crates.length - 1; i >= 0; i--) {
        const crate = state.crates[i];
        crate.update();

        // Check pickup distance
        const dx = state.player.x - crate.x;
        const dy = state.player.y - crate.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < state.player.radius + crate.radius) {
            // Drop old weapon and pick up new
            const old = state.player.activeWeapon;
            state.player.activeWeapon = crate.weapon;
            state.player.shootCooldownTimer = crate.weapon.cooldown;
            
            // Pop text notification
            spawnFloatingText(state.player.x, state.player.y - 30, `EQUIPPED ${crate.weapon.name}!`, '#ffd700');
            SoundFX.playPickup();

            // Clear crate
            state.crates.splice(i, 1);
        } else if (crate.life <= 0) {
            state.crates.splice(i, 1);
        }
    }

    // Fire zones (Rum Flask AOE)
    for (let i = state.fireZones.length - 1; i >= 0; i--) {
        const zone = state.fireZones[i];
        zone.life -= 1;

        // Visual fire particles
        if (Math.random() < 0.15) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * zone.radius;
            const fx = zone.x + Math.cos(angle) * dist;
            const fy = zone.y + Math.sin(angle) * dist;
            state.particles.push(new Particle(fx, fy, 0, -Math.random() * 1.5 - 0.5, '#f76707', Math.random() * 3 + 2, 20));
        }

        // Damage calculation (applied to enemies inside)
        state.enemies.forEach(enemy => {
            const dx = enemy.x - zone.x;
            const dy = enemy.y - zone.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= zone.radius + enemy.radius) {
                enemy.takeDamage(zone.damage / 60); // DOT DPS
            }
        });

        // Self damage from fire if standing in it
        const pdx = state.player.x - zone.x;
        const pdy = state.player.y - zone.y;
        const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
        if (pdist <= zone.radius + state.player.radius) {
            state.player.takeDamage(0.12); // subtle hazard DPS
        }

        if (zone.life <= 0) {
            state.fireZones.splice(i, 1);
        }
    }

    // Shockwaves (Anchor / Slash visual effect update)
    for (let i = state.shockwaves.length - 1; i >= 0; i--) {
        const sw = state.shockwaves[i];
        sw.life -= 1;
        
        // Expand radius
        const ratio = 1 - (sw.life / sw.maxLife);
        sw.radius = sw.maxRadius * ratio;

        if (sw.type === 'anchor') {
            // Apply damage/knockback to enemies on expansion check
            state.enemies.forEach(enemy => {
                const dx = enemy.x - sw.x;
                const dy = enemy.y - sw.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // If enemy is caught by the expanding edge of the shockwave
                if (dist <= sw.radius && dist >= sw.radius - 20) {
                    enemy.takeDamage(sw.damage * 0.05); // quick tick
                    // Huge knockback
                    const angle = Math.atan2(dy, dx);
                    enemy.vx += Math.cos(angle) * 7.5;
                    enemy.vy += Math.sin(angle) * 7.5;
                }
            });
        }

        if (sw.life <= 0) {
            state.shockwaves.splice(i, 1);
        }
    }

    // Lightning lines decay
    for (let i = state.lightningChains.length - 1; i >= 0; i--) {
        state.lightningChains[i].life -= 1;
        if (state.lightningChains[i].life <= 0) {
            state.lightningChains.splice(i, 1);
        }
    }

    // Particles update
    for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.update();
        if (p.life <= 0) {
            state.particles.splice(i, 1);
        }
    }

    // Check Wave Progression
    if (state.waveActive && state.enemies.length === 0 && state.enemiesKilledInWave >= state.totalEnemiesInWave) {
        state.waveActive = false;
        state.waveRestTimer = 4000; // 4 seconds downtime
        spawnFloatingText(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "WAVE CLEARED!", '#22b8cf');
        SoundFX.playPickup();
    }

    if (!state.waveActive) {
        state.waveRestTimer -= deltaTime;
        if (state.waveRestTimer <= 0) {
            startNextWave();
        }
    }

    // Update HTML overlay elements (Captain's Log UI)
    updateHUD();
}

function updateHUD() {
    // Health bar fill & text
    const hpPercent = Math.max(0, (state.player.health / state.player.maxHealth) * 100);
    const healthFill = document.getElementById('health-fill');
    const healthText = document.getElementById('health-text');
    
    if (healthFill) {
        healthFill.style.width = `${hpPercent}%`;
        // Low HP styling
        if (hpPercent < 30) {
            healthFill.classList.add('flash-red');
        } else {
            healthFill.classList.remove('flash-red');
        }
    }
    if (healthText) healthText.innerText = `${Math.ceil(state.player.health)} / ${state.player.maxHealth}`;

    // Score & Kills
    const timeVal = document.getElementById('time-val');
    if (timeVal) {
        const minutes = Math.floor(state.survivalTimer / 60);
        const seconds = Math.floor(state.survivalTimer % 60);
        timeVal.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    const killsVal = document.getElementById('kills-val');
    if (killsVal) killsVal.innerText = state.kills;

    // Active Weapon details
    const wpName = document.getElementById('weapon-display-name');
    const wpCurse = document.getElementById('weapon-curse-desc');
    if (wpName) wpName.innerText = state.player.activeWeapon.name.toUpperCase();
    if (wpCurse) wpCurse.innerText = state.player.activeWeapon.curse;

    // Wave progress gauge
    const waveProgressFill = document.getElementById('wave-progress-fill');
    if (waveProgressFill) {
        if (state.waveActive) {
            const progress = (state.enemiesKilledInWave / state.totalEnemiesInWave) * 100;
            waveProgressFill.style.width = `${progress}%`;
        } else {
            // countdown rest percent
            const progress = (state.waveRestTimer / 4000) * 100;
            waveProgressFill.style.width = `${progress}%`;
        }
    }
}

function endGame() {
    state.gameState = 'GAMEOVER';
    triggerScreenShake(25, 30);
    SoundFX.playExplosion();

    // Check high score safely
    if (state.survivalTimer > state.highScoreTime) {
        state.highScoreTime = state.survivalTimer;
        try {
            localStorage.setItem('mutiny_highscore_time', state.survivalTimer.toString());
        } catch (err) {
            // ignore storage errors on restricted file contexts
        }
    }

    // Update Game Over display texts
    const minutes = Math.floor(state.survivalTimer / 60);
    const seconds = Math.floor(state.survivalTimer % 60);
    const timeStr = `${minutes}m ${seconds}s`;
    
    const hsMin = Math.floor(state.highScoreTime / 60);
    const hsSec = Math.floor(state.highScoreTime % 60);
    const hsStr = `${hsMin}m ${hsSec}s`;

    document.getElementById('final-time').innerText = timeStr;
    document.getElementById('final-kills').innerText = state.kills;
    document.getElementById('final-wave').innerText = state.wave;
    document.getElementById('high-score-time').innerText = hsStr;

    // Find favorite weapon
    let fave = 'Rusty Flintlock';
    let maxCount = 0;
    for (let key in state.weaponUsage) {
        if (state.weaponUsage[key] > maxCount) {
            maxCount = state.weaponUsage[key];
            fave = key;
        }
    }
    document.getElementById('final-weapon').innerText = fave;

    // Set a hilarious epitaph
    const epitaphText = document.getElementById('epitaph-text');
    if (epitaphText) {
        const choice = state.epitaphs[Math.floor(Math.random() * state.epitaphs.length)];
        epitaphText.innerText = `"${choice}"`;
    }

    // Render transitions
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('game-over-screen').classList.add('active');
}

// --- RENDER FUNCTION ---
function renderGame() {
    const ctx = state.ctx;
    
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Apply Screen Shake
    ctx.save();
    ctx.translate(state.screenShake.x, state.screenShake.y);

    // --- DRAW BACKGROUND: PIRATE DECK MAP ---
    ctx.fillStyle = '#1e1b18'; // Dark wood border
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Ship Deck floor planks
    const deckPadding = 45;
    ctx.fillStyle = '#3c2f2f'; // Warm wood floor
    ctx.fillRect(deckPadding, deckPadding, CANVAS_WIDTH - deckPadding*2, CANVAS_HEIGHT - deckPadding*2);

    // Plank lines
    ctx.strokeStyle = '#2b2020';
    ctx.lineWidth = 4;
    for (let x = deckPadding + 60; x < CANVAS_WIDTH - deckPadding; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, deckPadding);
        ctx.lineTo(x, CANVAS_HEIGHT - deckPadding);
        ctx.stroke();
    }

    // Deck borders (rope / railing)
    ctx.strokeStyle = '#d4af37'; // gold trim
    ctx.lineWidth = 6;
    ctx.strokeRect(ARENA_X_MIN, ARENA_Y_MIN, ARENA_X_MAX - ARENA_X_MIN, ARENA_Y_MAX - ARENA_Y_MIN);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(ARENA_X_MIN - 6, ARENA_Y_MIN - 6, (ARENA_X_MAX - ARENA_X_MIN) + 12, (ARENA_Y_MAX - ARENA_Y_MIN) + 12);

    // Draw detail hatches/decoration
    ctx.fillStyle = '#1c1414';
    ctx.fillRect(150, 150, 80, 80); // hatch top-left
    ctx.strokeRect(150, 150, 80, 80);
    ctx.fillStyle = '#2b2020';
    ctx.fillRect(155, 155, 70, 70);
    
    ctx.fillStyle = '#1c1414';
    ctx.fillRect(970, 570, 80, 80); // hatch bottom-right
    ctx.strokeRect(970, 570, 80, 80);
    ctx.fillStyle = '#2b2020';
    ctx.fillRect(975, 575, 70, 70);

    // Fire zones (Rum Flask AOE)
    state.fireZones.forEach(zone => {
        const radGrd = ctx.createRadialGradient(zone.x, zone.y, 10, zone.x, zone.y, zone.radius);
        radGrd.addColorStop(0, 'rgba(255, 110, 0, 0.45)');
        radGrd.addColorStop(0.5, 'rgba(230, 40, 0, 0.25)');
        radGrd.addColorStop(1, 'rgba(230, 40, 0, 0)');
        
        ctx.fillStyle = radGrd;
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // Lightning chain lines
    state.lightningChains.forEach(chain => {
        ctx.strokeStyle = '#e0f7fa';
        ctx.lineWidth = Math.random() * 3 + 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00e5ff';
        
        ctx.beginPath();
        ctx.moveTo(chain.x1, chain.y1);
        
        // Jagged lightning drawing math
        const dx = chain.x2 - chain.x1;
        const dy = chain.y2 - chain.y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const segments = Math.floor(dist / 20);
        
        for (let i = 1; i < segments; i++) {
            const ratio = i / segments;
            const px = chain.x1 + dx * ratio + (Math.random() - 0.5) * 16;
            const py = chain.y1 + dy * ratio + (Math.random() - 0.5) * 16;
            ctx.lineTo(px, py);
        }
        
        ctx.lineTo(chain.x2, chain.y2);
        ctx.stroke();
        ctx.shadowBlur = 0; // reset shadow
    });

    // Shockwaves / Melee visual slices
    state.shockwaves.forEach(sw => {
        ctx.save();
        if (sw.type === 'slash') {
            // Draw sword swipe arc
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 4;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#fff';
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.radius, sw.angle - sw.spread/2, sw.angle + sw.spread/2);
            ctx.stroke();
        } else {
            // Anchor shockwave circle
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
            ctx.lineWidth = 5 * (sw.life / sw.maxLife);
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ffd700';
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
    });

    // Crates
    state.crates.forEach(c => c.draw(ctx));

    // Projectiles
    state.projectiles.forEach(p => p.draw(ctx));

    // Enemies
    state.enemies.forEach(e => e.draw(ctx));

    // Player
    if (state.player) {
        state.player.draw(ctx);
    }

    // Particles
    state.particles.forEach(p => p.draw(ctx));

    ctx.restore(); // Pop screen shake offset
}

// --- CORE TICK ENGINE ---
function gameTick(currentTime) {
    if (state.lastTime === 0) state.lastTime = currentTime;
    const elapsed = currentTime - state.lastTime;
    state.lastTime = currentTime;

    // Fixed updates
    updateGame(elapsed);
    renderGame();

    requestAnimationFrame(gameTick);
}

// --- INITIALIZATION & BINDINGS ---
window.addEventListener('DOMContentLoaded', () => {
    state.canvas = document.getElementById('game-canvas');
    state.ctx = state.canvas.getContext('2d');
    
    // Set internal resolution size
    state.canvas.width = CANVAS_WIDTH;
    state.canvas.height = CANVAS_HEIGHT;

    // Load high score initial display safely
    try {
        const storedScore = localStorage.getItem('mutiny_highscore_time');
        state.highScoreTime = storedScore ? parseFloat(storedScore) : 0;
    } catch (err) {
        state.highScoreTime = 0;
    }

    // --- MOUSE & AIM LISTENERS ---
    const getCanvasMousePos = (e) => {
        const rect = state.canvas.getBoundingClientRect();
        // Translate bounding client coordinates to canvas internal coordinate systems
        return {
            x: ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
            y: ((e.clientY - rect.top) / rect.height) * CANVAS_HEIGHT
        };
    };

    window.addEventListener('mousemove', (e) => {
        const pos = getCanvasMousePos(e);
        state.mouse.x = pos.x;
        state.mouse.y = pos.y;
    });

    window.addEventListener('mousedown', (e) => {
        if (state.gameState !== 'PLAYING') return;
        if (e.button === 0) { // Left Click
            state.mouse.isDown = true;
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (e.button === 0) {
            state.mouse.isDown = false;
        }
    });

    // Prevent context menu on right click in canvas
    state.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // --- KEYBOARD CONTROLS ---
    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        state.keys[key] = true;
        
        if (state.gameState === 'MENU' && (key === 'enter' || key === ' ')) {
            initGame();
            return;
        }

        // Initialize sound context on first user key/interaction
        if (state.gameState === 'PLAYING') {
            SoundFX.init();
        }
    });

    window.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        state.keys[key] = false;
    });

    // --- BUTTON BINDINGS ---
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            SoundFX.init();
            initGame();
        });
    }

    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            SoundFX.init();
            initGame();
        });
    }

    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            const isMuted = SoundFX.toggleMute();
            muteBtn.innerText = isMuted ? "🔇 SOUND: MUTED" : "🔊 SOUND: ON";
            
            // clear active blur to focus back on gameplay
            muteBtn.blur();
        });
    }

    // Start request animation loop
    requestAnimationFrame(gameTick);
});
