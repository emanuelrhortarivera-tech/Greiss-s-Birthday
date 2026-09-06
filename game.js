// =========================================================================
// 🎮 GAME ENGINE & CORE LOGIC FOR GREISS'S RPG BIRTHDAY GAME (VER. 4.1)
// =========================================================================

class BirthdayRPGGame {
    constructor() {
        this.tileSize = 32;
        this.mapCols = 32;
        this.mapRows = 24;

        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.canvas.width = 800;
        this.canvas.height = 600;

        // Estado del personaje Greiss
        this.player = {
            x: 16 * 32,
            y: 12 * 32,
            width: 24,
            height: 28,
            speed: 3.2,
            direction: 'down',
            isWalking: false,
            animFrame: 0,
            animTimer: 0
        };

        // Estado del juego
        this.gameState = 'PIN';
        this.memoriesUnlocked = [];
        this.hasKey = false;
        this.coinsCollected = 0;
        this.totalCoins = 12;
        this.coinAnimFrame = 0;
        this.coinAnimTimer = 0;
        this.activeInteraction = null;
        this.loopRunning = false;

        this.keys = {};
        this.petals = [];
        this.initPetals();

        this.initMap();
        this.initEntities();
        this.bindEvents();
    }

    initPetals() {
        this.petals = [];
        for (let i = 0; i < 40; i++) {
            this.petals.push({
                x: Math.random() * (this.mapCols * 32),
                y: Math.random() * (this.mapRows * 32),
                speedY: Math.random() * 0.8 + 0.4,
                speedX: Math.random() * 0.6 - 0.3,
                size: Math.random() * 3 + 2,
                color: Math.random() < 0.5 ? '#E0AAFF' : '#FF8FA3'
            });
        }
    }

    updatePetals() {
        this.petals.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            if (p.y > this.mapRows * 32) {
                p.y = -10;
                p.x = Math.random() * (this.mapCols * 32);
            }
        });
    }

    initMap() {
        const layout = [
            "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
            "TGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGT",
            "TGFFGGPPSPPGGGGGGPPGGFGGGGGGGGGT",
            "TGFFGPPSPPGGGGGGGPPGGFGGGGGGGGGT",
            "TGGGGPPSPPGGGGGGGPPGGGGGGGGGGGGT",
            "TGGGGGPPSPPPPPPPPPPMMPGGGGGGGGGT",
            "TGGGGGPPPPPPPPPPPPPPPPPGGGGGGGGT",
            "TGGGGGGGGGPPSPPGGGGGGGGGGGGGGGGT",
            "TGGGGGGGGGPPSPPGGGGGGGGGGGGGGGGT",
            "TGGGGGGGGGPPSPPGGGGGGGGGGGGGGGGT",
            "TGGPPPPPPPPPSPPPPPPPPPPPPPPPPGGT",
            "TGGPPPPPPPPSPSPPPPPPPPPPPPPPPGGT",
            "TGGGGGGGGGPPSPPGGGGGGGGGGGGGGGGT",
            "TGGGGGGGGGPPSPPGGGGGGGGGGGGGGGGT",
            "TGGGGGGGGGPPSPPGGGGWWWWWWWWGGGGT",
            "TGFFGGGGGPPSPPGGGGGWWWWWWWWGGGGT",
            "TGFFGGGGGPPSPPGGGGGBBBBBBBBGGGGT",
            "TGGGGGGGGGPPSPPGGGGWWWWWWWWGGGGT",
            "TGGGGGGGGGPPSPPGGGGWWWWWWWWGGGGT",
            "TGGGGGGGGGPPSPPGGGGGGGGKCGGGGGGT",
            "TGGGGGGGGGPPSPPGGGGGGGGGGGGGGGGT",
            "TGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGT",
            "TGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGT",
            "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
        ];

        this.map = [];
        for (let r = 0; r < this.mapRows; r++) {
            this.map[r] = [];
            for (let c = 0; c < this.mapCols; c++) {
                const char = layout[r] ? layout[r][c] || 'G' : 'G';
                let tileType = 'grass';
                let isSolid = false;
                let treeType = null;

                if (char === 'T') { tileType = 'grass'; isSolid = true; treeType = 'sakura'; }
                else if (char === 'O') { tileType = 'grass'; isSolid = true; treeType = 'oak'; }
                else if (char === 'P') { tileType = 'path'; }
                else if (char === 'W') { tileType = 'water'; isSolid = true; }
                else if (char === 'B') { tileType = 'bridge'; }
                else if (char === 'U') { tileType = 'bush'; isSolid = true; }
                else if (char === 'F') { tileType = 'flower_purple'; }
                else if (char === 'H') { tileType = 'flower_pink'; }
                else if (char === 'L') { tileType = 'lantern'; isSolid = true; }
                else if (char === 'X') { tileType = 'bench'; isSolid = true; }

                this.map[r][c] = { type: tileType, solid: isSolid, treeType: treeType };
            }
        }
    }

    // ---------------------------------------------------------------------
    // 🪙 POSICIONAMIENTO GARANTIZADO DE MONEDAS 100% TRANSITABLES Y ACCESIBLES
    // ---------------------------------------------------------------------
    initEntities() {
        this.coins = [
            // Zona 1 (📸 El Recuerdo - Top Left)
            { x: 3 * 32, y: 3 * 32, collected: false, memoryTrigger: 1 },
            { x: 5 * 32, y: 2 * 32, collected: false, memoryTrigger: 1 },
            { x: 2 * 32, y: 4 * 32, collected: false, memoryTrigger: 1 },

            // Zona 2 (😂 El Momento Random - Top Right)
            { x: 19 * 32, y: 4 * 32, collected: false, memoryTrigger: 2 },
            { x: 22 * 32, y: 3 * 32, collected: false, memoryTrigger: 2 },
            { x: 24 * 32, y: 5 * 32, collected: false, memoryTrigger: 2 },

            // Zona 3 (💜 Nuestra Amistad - Bottom Left)
            { x: 3 * 32, y: 16 * 32, collected: false, memoryTrigger: 3 },
            { x: 5 * 32, y: 17 * 32, collected: false, memoryTrigger: 3 },
            { x: 2 * 32, y: 18 * 32, collected: false, memoryTrigger: 3 },

            // Zona 4 (🔑 La Llave y Cofre - Puente de Madera y Pasto Accesible)
            { x: 21 * 32, y: 16 * 32, collected: false, memoryTrigger: 4 }, // Sobre el puente transitable
            { x: 21 * 32, y: 20 * 32, collected: false, memoryTrigger: 4 }, // En el pasto junto al cofre
            { x: 24 * 32, y: 21 * 32, collected: false, memoryTrigger: 4 }  // En el pasto junto al cofre
        ];

        this.memeBox = { x: 20 * 32, y: 5 * 32, opened: false };
        this.keyPedestal = { x: 23 * 32, y: 19 * 32, collected: false };
        this.chest = { x: 25 * 32, y: 19 * 32, opened: false };

        this.btsNPCs = [
            { name: "RM", x: 14 * 32, y: 5 * 32, index: 0, dialog: BTS_NPCS_DIALOGS[0] },
            { name: "Jin", x: 22 * 32, y: 6 * 32, index: 1, dialog: BTS_NPCS_DIALOGS[1] },
            { name: "Suga", x: 8 * 32, y: 4 * 32, index: 2, dialog: BTS_NPCS_DIALOGS[2] },
            { name: "J-Hope", x: 10 * 32, y: 16 * 32, index: 3, dialog: BTS_NPCS_DIALOGS[3] },
            { name: "Jimin", x: 18 * 32, y: 12 * 32, index: 4, dialog: BTS_NPCS_DIALOGS[4] },
            { name: "V", x: 6 * 32, y: 18 * 32, index: 5, dialog: BTS_NPCS_DIALOGS[5] },
            { name: "Jungkook", x: 27 * 32, y: 10 * 32, index: 6, dialog: BTS_NPCS_DIALOGS[6] }
        ];
    }

    bindEvents() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key === 'Enter' && this.gameState === 'PIN') {
                this.verifyPIN();
            }
            if ((e.key.toLowerCase() === 'e' || e.key === ' ') && this.gameState === 'PLAYING') {
                this.triggerInteraction();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        const pinInputs = document.querySelectorAll('.pin-digit');
        pinInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value && index < pinInputs.length - 1) {
                    pinInputs[index + 1].focus();
                }
                if (index === 3 && e.target.value) {
                    this.verifyPIN();
                }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !input.value && index > 0) {
                    pinInputs[index - 1].focus();
                }
            });
        });

        const unlockBtn = document.getElementById('unlockBtn');
        if (unlockBtn) unlockBtn.addEventListener('click', () => this.verifyPIN());


        const startBtn = document.getElementById('startAdventureBtn');
        if (startBtn) startBtn.addEventListener('click', () => {
            gameAudio.playClickSound();
            this.switchScreen('gameScreen');
            this.gameState = 'PLAYING';
            setTimeout(() => {
                this.resizeCanvas();
                this.startLoop();
            }, 50);
        });

        const saveMemBtn = document.getElementById('saveMemoryBtn');
        if (saveMemBtn) saveMemBtn.addEventListener('click', () => this.closeMemoryModal());

        const closeMemBtn = document.getElementById('closeMemoryBtn');
        if (closeMemBtn) closeMemBtn.addEventListener('click', () => this.closeMemoryModal());

        const continueBtn = document.getElementById('continueToFinalBtn');
        if (continueBtn) continueBtn.addEventListener('click', () => {
            gameAudio.playClickSound();
            document.getElementById('letterModal').classList.add('hidden');
            this.switchScreen('celebrationScreen');
            this.gameState = 'CELEBRATION';
            this.startConfetti();
            gameAudio.playCelebrationFanfare();
        });

        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) restartBtn.addEventListener('click', () => {
            location.reload();
        });

        const soundBtn = document.getElementById('soundToggleBtn');
        if (soundBtn) soundBtn.addEventListener('click', () => {
            const isEnabled = gameAudio.toggleSound();
            soundBtn.textContent = isEnabled ? '🔊' : '🔇';
        });

        const bindTouchBtn = (id, directionKey) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            const start = (e) => { e.preventDefault(); this.keys[directionKey] = true; };
            const end = (e) => { e.preventDefault(); this.keys[directionKey] = false; };
            btn.addEventListener('touchstart', start, { passive: false });
            btn.addEventListener('touchend', end, { passive: false });
            btn.addEventListener('mousedown', start);
            btn.addEventListener('mouseup', end);
        };

        bindTouchBtn('btnUp', 'w');
        bindTouchBtn('btnDown', 's');
        bindTouchBtn('btnLeft', 'a');
        bindTouchBtn('btnRight', 'd');

        const interactBtn = document.getElementById('btnInteract');
        if (interactBtn) interactBtn.addEventListener('click', () => {
            if (this.gameState === 'PLAYING') this.triggerInteraction();
        });

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    verifyPIN() {
        const pinInputs = document.querySelectorAll('.pin-digit');
        let enteredPin = '';
        pinInputs.forEach(i => enteredPin += i.value);

        if (enteredPin === ACCESS_CODE || enteredPin === '2004') {
            gameAudio.playClickSound();
            const err = document.getElementById('pinError');
            if (err) err.classList.add('hidden');
            this.switchScreen('introScreen');
        } else {
            gameAudio.playErrorSound();
            const errorDiv = document.getElementById('pinError');
            if (errorDiv) {
                errorDiv.textContent = ERROR_CODE_MESSAGE;
                errorDiv.classList.remove('hidden');
            }
            pinInputs.forEach(i => i.value = '');
            if (pinInputs[0]) pinInputs[0].focus();
        }
    }

    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(screenId);
        if (target) target.classList.add('active');
    }

    resizeCanvas() {
        const container = document.getElementById('canvasContainer');
        const w = (container && container.clientWidth > 100) ? container.clientWidth : (window.innerWidth || 800);
        const h = (container && container.clientHeight > 100) ? container.clientHeight : (window.innerHeight - 70 || 600);
        this.canvas.width = Math.min(Math.max(w, 320), 900);
        this.canvas.height = Math.min(Math.max(h, 320), 650);
        if (this.ctx) this.ctx.imageSmoothingEnabled = false;
    }

    updatePlayer() {
        if (this.gameState !== 'PLAYING') return;

        let dx = 0;
        let dy = 0;

        if (this.keys['w'] || this.keys['arrowup']) { dy -= 1; this.player.direction = 'up'; }
        if (this.keys['s'] || this.keys['arrowdown']) { dy += 1; this.player.direction = 'down'; }
        if (this.keys['a'] || this.keys['arrowleft']) { dx -= 1; this.player.direction = 'left'; }
        if (this.keys['d'] || this.keys['arrowright']) { dx += 1; this.player.direction = 'right'; }

        if (dx !== 0 && dy !== 0) {
            dx *= 0.7071;
            dy *= 0.7071;
        }

        this.player.isWalking = (dx !== 0 || dy !== 0);

        if (this.player.isWalking) {
            const nextX = this.player.x + dx * this.player.speed;
            const nextY = this.player.y + dy * this.player.speed;

            if (!this.checkCollision(nextX, this.player.y)) this.player.x = nextX;
            if (!this.checkCollision(this.player.x, nextY)) this.player.y = nextY;

            this.player.animTimer++;
            if (this.player.animTimer % 6 === 0) {
                this.player.animFrame = (this.player.animFrame + 1) % 4;
                if (Math.random() < 0.25) gameAudio.playStepSound();
            }
        } else {
            this.player.animFrame = 0;
        }

        this.coinAnimTimer++;
        if (this.coinAnimTimer % 8 === 0) {
            this.coinAnimFrame = (this.coinAnimFrame + 1) % 4;
        }

        this.updatePetals();
        this.checkProximityAndCollectibles();
    }

    checkCollision(x, y) {
        if (x < 8 || x > (this.mapCols - 1) * 32 - 16) return true;
        if (y < 8 || y > (this.mapRows - 1) * 32 - 16) return true;

        const corners = [
            { c: Math.floor((x + 4) / 32), r: Math.floor((y + 12) / 32) },
            { c: Math.floor((x + 20) / 32), r: Math.floor((y + 12) / 32) },
            { c: Math.floor((x + 4) / 32), r: Math.floor((y + 24) / 32) },
            { c: Math.floor((x + 20) / 32), r: Math.floor((y + 24) / 32) }
        ];

        return corners.some(corner => {
            if (this.map[corner.r] && this.map[corner.r][corner.c]) {
                return this.map[corner.r][corner.c].solid;
            }
            return false;
        });
    }

    // ---------------------------------------------------------------------
    // 🪙 RECOLECCIÓN FLUIDA DE MONEDAS CON DISTANCIA CÓMODA (28px)
    // ---------------------------------------------------------------------
    checkProximityAndCollectibles() {
        this.activeInteraction = null;
        const prompt = document.getElementById('interactPrompt');

        this.coins.forEach(coin => {
            if (!coin.collected && this.getDistance(this.player, coin) < 28) {
                coin.collected = true;
                this.coinsCollected++;
                gameAudio.playCollectSound();

                const cCount = document.getElementById('coinCount');
                if (cCount) cCount.textContent = `${this.coinsCollected}/${this.totalCoins}`;

                if (this.coinsCollected === 3 && !this.isMemoryUnlocked(1)) {
                    this.unlockMemory(1);
                } else if (this.coinsCollected === 6 && !this.isMemoryUnlocked(2)) {
                    this.unlockMemory(2);
                } else if (this.coinsCollected === 9 && !this.isMemoryUnlocked(3)) {
                    this.unlockMemory(3);
                } else if (this.coinsCollected === 12) {
                    this.keyPedestal.collected = true;
                    this.hasKey = true;
                    gameAudio.playKeySound();
                    const invK = document.getElementById('invKey');
                    if (invK) invK.classList.remove('hidden');
                    this.unlockMemory(4);
                }
            }
        });

        if (!this.memeBox.opened && this.getDistance(this.player, this.memeBox) < 32) {
            this.activeInteraction = { type: 'MEME_BOX' };
            if (prompt) {
                prompt.querySelector('.prompt-text').textContent = 'Presiona E / Toca para abrir Caja de Memes 😂';
                prompt.classList.remove('hidden');
            }
            return;
        }

        if (this.getDistance(this.player, this.chest) < 36) {
            if (this.hasKey) {
                this.activeInteraction = { type: 'CHEST' };
                if (prompt) {
                    prompt.querySelector('.prompt-text').textContent = 'Presiona E / Toca para abrir el Cofre Final 🎁';
                    prompt.classList.remove('hidden');
                }
            } else {
                if (prompt) {
                    prompt.querySelector('.prompt-text').textContent = `🔒 Recoge todas las ${this.totalCoins} monedas doradas para obtener la llave (${this.coinsCollected}/${this.totalCoins})`;
                    prompt.classList.remove('hidden');
                }
            }
            return;
        }

        for (let npc of this.btsNPCs) {
            if (this.getDistance(this.player, npc) < 32) {
                this.activeInteraction = { type: 'BTS_NPC', npc: npc };
                if (prompt) {
                    prompt.querySelector('.prompt-text').textContent = `Presiona E / Toca para hablar con ${npc.name} 💜`;
                    prompt.classList.remove('hidden');
                }
                return;
            }
        }

        if (prompt) prompt.classList.add('hidden');
    }

    getDistance(a, b) {
        return Math.hypot((a.x + 12) - (b.x + 16), (a.y + 12) - (b.y + 16));
    }

    triggerInteraction() {
        if (!this.activeInteraction) return;

        if (this.activeInteraction.type === 'MEME_BOX') {
            this.memeBox.opened = true;
            if (!this.isMemoryUnlocked(2)) this.unlockMemory(2);

        } else if (this.activeInteraction.type === 'CHEST') {
            if (this.hasKey) {
                this.chest.opened = true;
                gameAudio.playChestSound();
                this.openFinalLetter();
            }

        } else if (this.activeInteraction.type === 'BTS_NPC') {
            const npc = this.activeInteraction.npc;
            gameAudio.playClickSound();
            alert(`💬 ${npc.name}: "${npc.dialog.text}"`);
        }
    }

    isMemoryUnlocked(id) {
        return this.memoriesUnlocked.includes(id);
    }

    unlockMemory(id) {
        if (this.isMemoryUnlocked(id)) return;
        this.memoriesUnlocked.push(id);
        gameAudio.playMemoryUnlockSound();

        const mCount = document.getElementById('memoryCount');
        if (mCount) mCount.textContent = `${this.memoriesUnlocked.length}/4`;

        const config = RECUERDOS_CONFIG.find(r => r.id === id) || RECUERDOS_CONFIG[0];
        const badge = document.getElementById('modalBadge');
        if (badge) badge.textContent = config.misionTexto || '✨ RECUERDO DESBLOQUEADO ✨';

        const title = document.getElementById('modalTitle');
        if (title) title.textContent = config.titulo;

        const text = document.getElementById('modalText');
        if (text) text.textContent = config.texto;

        const img = document.getElementById('modalImg');
        if (img) img.src = config.imagen;

        this.gameState = 'MEMORY_MODAL';
        const modal = document.getElementById('memoryModal');
        if (modal) modal.classList.remove('hidden');
    }

    closeMemoryModal() {
        gameAudio.playClickSound();
        const modal = document.getElementById('memoryModal');
        if (modal) modal.classList.add('hidden');
        this.gameState = 'PLAYING';
    }

    openFinalLetter() {
        this.gameState = 'LETTER_MODAL';
        const container = document.getElementById('letterTextContainer');
        if (container) container.textContent = FINAL_LETTER;
        const modal = document.getElementById('letterModal');
        if (modal) modal.classList.remove('hidden');
    }

    render() {
        try {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const camX = Math.max(0, Math.min(this.player.x - this.canvas.width / 2, this.mapCols * 32 - this.canvas.width));
            const camY = Math.max(0, Math.min(this.player.y - this.canvas.height / 2, this.mapRows * 32 - this.canvas.height));

            this.ctx.save();
            this.ctx.translate(-Math.floor(camX), -Math.floor(camY));

            // 1. Capa de Suelo
            for (let r = 0; r < this.mapRows; r++) {
                for (let c = 0; c < this.mapCols; c++) {
                    const tile = this.map[r][c];
                    const tileImg = gameArt.getTile(tile.type);
                    this.ctx.drawImage(tileImg, c * 32, r * 32);
                }
            }

            // 2. Monedas Doradas Giratorias 🪙
            const coinSprite = gameArt.getCoinSprite(this.coinAnimFrame);
            this.coins.forEach(coin => {
                if (!coin.collected) {
                    this.ctx.drawImage(coinSprite, coin.x, coin.y);
                }
            });

            // 3. Props y Cofre
            const memeImg = this.memeBox.opened ? gameArt.getTile('bush') : gameArt.getTile('lightstick');
            this.ctx.drawImage(memeImg, this.memeBox.x, this.memeBox.y);

            if (!this.keyPedestal.collected && this.coinsCollected >= 9) {
                this.ctx.drawImage(gameArt.getTile('lightstick'), this.keyPedestal.x, this.keyPedestal.y);
            }

            const chestImg = this.chest.opened ? gameArt.getTile('chest_open') : gameArt.getTile('chest_closed');
            this.ctx.drawImage(chestImg, this.chest.x, this.chest.y);

            // 4. Sombras y Mini NPCs
            this.btsNPCs.forEach(npc => {
                this.ctx.fillStyle = 'rgba(0,0,0,0.25)';
                this.ctx.beginPath();
                this.ctx.ellipse(npc.x + 16, npc.y + 36, 12, 5, 0, 0, Math.PI * 2);
                this.ctx.fill();

                const btsSprite = gameArt.getBTSSprite(npc.index);
                this.ctx.drawImage(btsSprite, npc.x, npc.y);

                this.ctx.fillStyle = '#FFF';
                this.ctx.font = '10px Fredoka';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(npc.name, npc.x + 16, npc.y - 4);
            });

            // Sombra de Greiss
            this.ctx.fillStyle = 'rgba(0,0,0,0.25)';
            this.ctx.beginPath();
            this.ctx.ellipse(this.player.x + 16, this.player.y + 36, 12, 5, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // 5. Sprite de Greiss
            const greissSprite = gameArt.getGreissSprite(this.player.direction, this.player.animFrame);
            this.ctx.drawImage(greissSprite, Math.floor(this.player.x), Math.floor(this.player.y));

            this.ctx.fillStyle = '#FFF';
            this.ctx.font = 'bold 11px Fredoka';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(BIRTHDAY_PERSON, this.player.x + 16, this.player.y - 4);

            // 6. Capa Superior de Árboles
            for (let r = 0; r < this.mapRows; r++) {
                for (let c = 0; c < this.mapCols; c++) {
                    const tile = this.map[r][c];
                    if (tile.treeType) {
                        const treeImg = gameArt.getTreeSprite(tile.treeType);
                        this.ctx.drawImage(treeImg, c * 32 - 8, r * 32 - 32);
                    }
                }
            }

            // 7. Pétalos cayendo
            this.petals.forEach(p => {
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(p.x, p.y, p.size, p.size);
            });

            this.ctx.restore();
        } catch (err) {
            console.error("Error en render loop:", err);
        }
    }

    startLoop() {
        if (this.loopRunning) return;
        this.loopRunning = true;

        const loop = () => {
            this.updatePlayer();
            this.render();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    startConfetti() {
        const canvas = document.getElementById('confettiCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#9D4EDD', '#C77DFF', '#FF8FA3', '#FFD166', '#A0E9FF', '#FFFFFF'];

        for (let i = 0; i < 140; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 3 + 2,
                speedX: Math.random() * 2 - 1,
                rotation: Math.random() * 360
            });
        }

        const renderConfetti = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += 2;

                if (p.y > canvas.height) {
                    p.y = -10;
                    p.x = Math.random() * canvas.width;
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            });

            if (this.gameState === 'CELEBRATION') {
                requestAnimationFrame(renderConfetti);
            }
        };
        requestAnimationFrame(renderConfetti);
    }
}

function bootstrapGame() {
    if (!window.gameInstance) {
        window.gameInstance = new BirthdayRPGGame();
    }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(bootstrapGame, 1);
} else {
    document.addEventListener('DOMContentLoaded', bootstrapGame);
    window.addEventListener('load', bootstrapGame);
}
