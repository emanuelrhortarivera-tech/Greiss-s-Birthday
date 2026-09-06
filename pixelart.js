// =========================================================================
// 🎨 HIGH-DETAIL PROCEDURAL PIXEL ART SPRITE & TILE RENDERER (VER. 3.1)
// =========================================================================
// Incluye salvaguardas para garantizar compatibilidad completa en todos
// los navegadores y dispositivos móviles sin errores de renderizado.
// =========================================================================

class PixelArtAssets {
    constructor() {
        this.cache = {};
        this.tileSize = 32;
    }

    createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        return { canvas, ctx };
    }

    drawPixelGrid(ctx, grid, pixelSize = 2, offsetX = 0, offsetY = 0) {
        grid.forEach((row, rIdx) => {
            row.forEach((color, cIdx) => {
                if (color && color !== 'transparent' && color !== 0) {
                    ctx.fillStyle = color;
                    ctx.fillRect(offsetX + cIdx * pixelSize, offsetY + rIdx * pixelSize, pixelSize, pixelSize);
                }
            });
        });
    }

    // ---------------------------------------------------------------------
    // 🪙 MONEDA DORADA BRILANTE Y GIRATORIA
    // ---------------------------------------------------------------------
    getCoinSprite(frame = 0) {
        const key = `coin_frame_${frame % 4}`;
        if (this.cache[key]) return this.cache[key];

        const { canvas, ctx } = this.createCanvas(32, 32);

        // Fondo de pasto
        ctx.drawImage(this.getTile('grass'), 0, 0);

        const cx = 16;
        const cy = 16;
        const f = frame % 4;

        const radiusX = (f === 0) ? 11 : (f === 1) ? 8 : (f === 2) ? 5 : 8;
        const radiusY = 11;

        const rxOuter = Math.max(1, radiusX + 3);
        const ryOuter = Math.max(1, radiusY + 3);
        const rxInner1 = Math.max(1, radiusX - 2);
        const ryInner1 = Math.max(1, radiusY - 2);
        const rxInner2 = Math.max(1, radiusX - 4);
        const ryInner2 = Math.max(1, radiusY - 4);

        // Aura resplandeciente
        ctx.fillStyle = 'rgba(255, 209, 102, 0.4)';
        ctx.beginPath();
        ctx.ellipse(cx, cy, rxOuter, ryOuter, 0, 0, Math.PI * 2);
        ctx.fill();

        // Borde oscuro exterior de la moneda
        ctx.fillStyle = '#B7791F';
        ctx.beginPath();
        ctx.ellipse(cx, cy, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cuerpo dorado brillante
        ctx.fillStyle = '#FFD166';
        ctx.beginPath();
        ctx.ellipse(cx, cy, rxInner1, ryInner1, 0, 0, Math.PI * 2);
        ctx.fill();

        // Centro resplandeciente
        ctx.fillStyle = '#FFF5B8';
        ctx.beginPath();
        ctx.ellipse(cx - 1, cy - 1, rxInner2, ryInner2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Destello de brillo blanco en la esquina
        ctx.fillStyle = '#FFFFFF';
        if (f === 0 || f === 1) {
            ctx.fillRect(cx - radiusX + 3, cy - 6, 3, 3);
            ctx.fillRect(cx - radiusX + 5, cy - 4, 2, 2);
        } else {
            ctx.fillRect(cx - 1, cy - 7, 2, 4);
        }

        // Estrella interior
        if (f === 0) {
            ctx.fillStyle = '#D48806';
            ctx.font = 'bold 11px Fredoka';
            ctx.textAlign = 'center';
            ctx.fillText('★', cx, cy + 4);
        }

        this.cache[key] = canvas;
        return canvas;
    }

    // ---------------------------------------------------------------------
    // 👗 SPRITE SUAVE DE GREISS
    // ---------------------------------------------------------------------
    getGreissSprite(direction = 'down', frame = 0) {
        const key = `greiss_v3_${direction}_${frame % 4}`;
        if (this.cache[key]) return this.cache[key];

        const { canvas, ctx } = this.createCanvas(32, 40);
        const p = 2; // pixel scale

        const K = '#120C17'; // Pelo negro
        const K_HL = '#2E223B';
        const S = '#C68B59'; // Piel
        const S_SH = '#A66E38';
        const E = '#3D2314'; // Ojos
        const E_HL = '#FFFFFF';
        const R = '#FF758F'; // Rubor
        const RB = '#FF8FA3'; // Moño
        const D_BG = '#F7F1E5'; // Vestido
        const D_BR = '#8D6E63'; // Abrigo
        const D_PR = '#9D4EDD'; // Cinta
        const SH = '#1A120B'; // Zapatos

        let grid = [];
        const f = frame % 4;

        if (direction === 'down') {
            grid = [
                [0,0,0,0,RB,RB,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,K,K,K,K,K,K,K,K,0,0,0,0,0],
                [0,0,K,K,K_HL,K_HL,K,K,K_HL,K,K,K,0,0,0,0],
                [0,K,K,K,S,S,S,S,S,S,K,K,K,0,0,0],
                [0,K,K,S,S,S,S,S,S,S,S,K,K,0,0,0],
                [0,K,K,S,E,E_HL,S,S,E,E_HL,S,K,K,0,0,0],
                [0,K,K,S,S,S,R,R,S,S,S,K,K,0,0,0],
                [0,K,K,K,S,S,S,S,S,S,K,K,K,0,0,0],
                [0,0,K,K,D_BR,D_BG,D_PR,D_PR,D_BG,D_BR,K,K,0,0,0,0],
                [0,0,K,D_BR,D_BR,D_BG,D_BG,D_BG,D_BG,D_BR,D_BR,K,0,0,0,0],
                [0,0,K,D_BR,D_BG,D_BG,D_BG,D_BG,D_BG,D_BG,D_BR,K,0,0,0,0],
                [0,0,K,D_BG,D_BG,D_PR,D_PR,D_PR,D_PR,D_BG,D_BG,K,0,0,0,0],
                [0,0,0,K,D_BG,D_BG,D_BG,D_BG,D_BG,D_BG,K,0,0,0,0,0],
                [0,0,0,K,D_BG,D_BG,D_BG,D_BG,D_BG,D_BG,K,0,0,0,0,0],
                [0,0,0,0,K,K,D_BG,D_BG,K,K,0,0,0,0,0,0],
                [0,0,0,0,S,S_SH,0,0,S,S_SH,0,0,0,0,0,0],
                [0,0,0,0,SH,SH,0,0,SH,SH,0,0,0,0,0,0]
            ];
            if (f === 1) { grid[15][4] = 0; grid[16][4] = 0; }
            if (f === 3) { grid[15][8] = 0; grid[16][8] = 0; }

        } else if (direction === 'up') {
            grid = [
                [0,0,0,0,RB,RB,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,K,K,K,K,K,K,K,K,0,0,0,0,0],
                [0,0,K,K,K_HL,K_HL,K_HL,K_HL,K_HL,K,K,K,0,0,0,0],
                [0,K,K,K,K,K,K,K,K,K,K,K,K,0,0,0],
                [0,K,K,K,K,K,K,K,K,K,K,K,K,0,0,0],
                [0,K,K,K,K,K,K,K,K,K,K,K,K,0,0,0],
                [0,K,K,K,K,K,K,K,K,K,K,K,K,0,0,0],
                [0,0,K,K,K,K,K,K,K,K,K,K,0,0,0,0],
                [0,0,K,K,D_BR,D_BR,D_BR,D_BR,D_BR,D_BR,K,K,0,0,0,0],
                [0,0,K,D_BR,D_BR,D_BR,D_BR,D_BR,D_BR,D_BR,D_BR,K,0,0,0,0],
                [0,0,K,D_BR,D_BG,D_BG,D_BG,D_BG,D_BG,D_BG,D_BR,K,0,0,0,0],
                [0,0,K,D_BG,D_BG,D_PR,D_PR,D_PR,D_PR,D_BG,D_BG,K,0,0,0,0],
                [0,0,0,K,D_BG,D_BG,D_BG,D_BG,D_BG,D_BG,K,0,0,0,0,0],
                [0,0,0,K,D_BG,D_BG,D_BG,D_BG,D_BG,D_BG,K,0,0,0,0,0],
                [0,0,0,0,K,K,D_BG,D_BG,K,K,0,0,0,0,0,0],
                [0,0,0,0,S,S_SH,0,0,S,S_SH,0,0,0,0,0,0],
                [0,0,0,0,SH,SH,0,0,SH,SH,0,0,0,0,0,0]
            ];
            if (f === 1) { grid[15][4] = 0; grid[16][4] = 0; }
            if (f === 3) { grid[15][8] = 0; grid[16][8] = 0; }

        } else if (direction === 'left') {
            grid = [
                [0,0,0,RB,RB,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,K,K,K,K,K,K,K,0,0,0,0,0,0,0],
                [0,K,K,K_HL,K_HL,K,K,K,K,K,0,0,0,0,0,0],
                [0,K,K,S,S,S,S,S,K,K,K,0,0,0,0,0],
                [0,K,K,S,S,S,S,S,S,K,K,0,0,0,0,0],
                [0,K,K,E,E_HL,S,S,S,S,K,K,0,0,0,0,0],
                [0,K,K,S,R,S,S,S,K,K,K,0,0,0,0,0],
                [0,0,K,K,S,S,S,K,K,K,0,0,0,0,0,0],
                [0,0,0,K,D_BR,D_BG,D_BR,K,K,0,0,0,0,0,0,0],
                [0,0,0,K,D_BR,D_BG,D_BG,D_BG,K,0,0,0,0,0,0,0],
                [0,0,0,K,D_BG,D_PR,D_BG,D_BR,K,0,0,0,0,0,0,0],
                [0,0,0,K,D_BG,D_BG,D_BG,K,0,0,0,0,0,0,0,0],
                [0,0,0,0,K,D_BG,D_BG,K,0,0,0,0,0,0,0,0],
                [0,0,0,0,S,S,S,S,0,0,0,0,0,0,0,0],
                [0,0,0,0,SH,SH,SH,SH,0,0,0,0,0,0,0]
            ];
            if (f === 1) { grid[13][4] = 0; grid[14][4] = 0; grid[13][7] = S; grid[14][7] = SH; }
            if (f === 3) { grid[13][7] = 0; grid[14][7] = 0; grid[13][4] = S; grid[14][4] = SH; }

        } else { // right
            grid = [
                [0,0,0,0,0,0,0,0,RB,RB,0,0,0,0,0,0],
                [0,0,0,0,0,0,K,K,K,K,K,K,K,0,0,0],
                [0,0,0,0,0,K,K,K,K_HL,K_HL,K,K,K,K,0,0],
                [0,0,0,0,0,K,K,K,S,S,S,S,S,K,K,0],
                [0,0,0,0,0,0,K,K,S,S,S,S,S,S,K,K],
                [0,0,0,0,0,0,K,K,S,S,S,E,E_HL,K,K],
                [0,0,0,0,0,0,K,K,K,S,S,R,S,K,K,0],
                [0,0,0,0,0,0,0,K,K,K,S,S,S,K,K,0],
                [0,0,0,0,0,0,0,0,K,K,D_BR,D_BG,D_BR,K,0,0],
                [0,0,0,0,0,0,0,0,K,D_BG,D_BG,D_BG,D_BR,K,0],
                [0,0,0,0,0,0,0,0,K,D_BR,D_BG,D_PR,D_BG,K,0],
                [0,0,0,0,0,0,0,0,0,K,D_BG,D_BG,D_BG,K,0,0],
                [0,0,0,0,0,0,0,0,0,0,K,D_BG,D_BG,K,0,0],
                [0,0,0,0,0,0,0,0,0,0,S,S,S,S,0,0],
                [0,0,0,0,0,0,0,0,0,0,SH,SH,SH,SH,0,0]
            ];
            if (f === 1) { grid[13][10] = 0; grid[14][10] = 0; grid[13][13] = S; grid[14][13] = SH; }
            if (f === 3) { grid[13][13] = 0; grid[14][13] = 0; grid[13][10] = S; grid[14][10] = SH; }
        }

        this.drawPixelGrid(ctx, grid, p);
        this.cache[key] = canvas;
        return canvas;
    }

    // ---------------------------------------------------------------------
    // 🎤 MINI NPCS DE BTS
    // ---------------------------------------------------------------------
    getBTSSprite(memberIndex = 0) {
        const key = `bts_v3_${memberIndex}`;
        if (this.cache[key]) return this.cache[key];

        const { canvas, ctx } = this.createCanvas(32, 40);
        const p = 2;
        const S = '#F5D5C0';
        const E = '#1E1E1E';
        const R = '#FFAAA5';

        const btsStyles = [
            { hair: '#9D4EDD', shirt: '#7B2CBF', pants: '#3A0CA3', name: 'RM' },
            { hair: '#3D2314', shirt: '#FF9EAA', pants: '#2B2B2B', name: 'Jin' },
            { hair: '#1A1A1A', shirt: '#4A4E69', pants: '#222222', name: 'Suga' },
            { hair: '#FFB84C', shirt: '#F72585', pants: '#3A0CA3', name: 'J-Hope' },
            { hair: '#F7C8E0', shirt: '#4CC9F0', pants: '#480CA8', name: 'Jimin' },
            { hair: '#6F4E37', shirt: '#805215', pants: '#2B2B2B', name: 'V' },
            { hair: '#141414', shirt: '#2B2B2B', pants: '#111111', name: 'JK' }
        ];

        const style = btsStyles[memberIndex % btsStyles.length];
        const H = style.hair;
        const T = style.shirt;
        const P = style.pants;

        const grid = [
            [0,0,0,H,H,H,H,H,H,H,H,0,0,0,0,0],
            [0,0,H,H,H,H,H,H,H,H,H,H,0,0,0,0],
            [0,0,H,H,S,S,S,S,S,S,H,H,0,0,0,0],
            [0,0,H,S,S,S,S,S,S,S,S,H,0,0,0,0],
            [0,0,H,S,E,E,S,S,E,E,S,H,0,0,0,0],
            [0,0,0,S,S,S,R,R,S,S,S,0,0,0,0,0],
            [0,0,0,0,S,S,S,S,S,S,0,0,0,0,0,0],
            [0,0,0,T,T,T,T,T,T,T,T,0,0,0,0,0],
            [0,0,T,T,T,T,T,T,T,T,T,T,0,0,0,0],
            [0,0,T,T,T,T,T,T,T,T,T,T,0,0,0,0],
            [0,0,0,P,P,P,0,0,P,P,P,0,0,0,0,0],
            [0,0,0,P,P,P,0,0,P,P,P,0,0,0,0,0],
            [0,0,0,E,E,E,0,0,E,E,E,0,0,0,0,0]
        ];

        this.drawPixelGrid(ctx, grid, p);
        this.cache[key] = canvas;
        return canvas;
    }

    // ---------------------------------------------------------------------
    // 🌸 TILES GENERALES Y PROPS
    // ---------------------------------------------------------------------
    getTile(type) {
        if (this.cache[type]) return this.cache[type];
        const { canvas, ctx } = this.createCanvas(32, 32);

        if (type === 'grass') {
            ctx.fillStyle = '#C1E1C1';
            ctx.fillRect(0, 0, 32, 32);
            ctx.fillStyle = '#A3D2A0';
            for (let i = 0; i < 32; i += 8) {
                for (let j = 0; j < 32; j += 8) {
                    if ((i + j) % 16 === 0) ctx.fillRect(i, j, 4, 4);
                }
            }
            ctx.fillStyle = '#81C784';
            ctx.fillRect(4, 6, 2, 6);
            ctx.fillRect(18, 14, 2, 6);
            ctx.fillRect(24, 22, 2, 6);
            ctx.fillRect(10, 26, 2, 5);
            ctx.fillStyle = '#FFFDF9';
            ctx.fillRect(12, 8, 2, 2);
            ctx.fillRect(26, 16, 2, 2);

        } else if (type === 'path') {
            ctx.fillStyle = '#E6D7C3';
            ctx.fillRect(0, 0, 32, 32);
            ctx.fillStyle = '#D1BB9E';
            ctx.strokeRect(1, 1, 14, 14);
            ctx.strokeRect(17, 1, 14, 14);
            ctx.strokeRect(1, 17, 14, 14);
            ctx.strokeRect(17, 17, 14, 14);
            ctx.fillStyle = '#F3E5AB';
            ctx.fillRect(3, 3, 10, 2);
            ctx.fillRect(19, 3, 10, 2);

        } else if (type === 'water') {
            ctx.fillStyle = '#7ED6DF';
            ctx.fillRect(0, 0, 32, 32);
            ctx.fillStyle = '#48DBFB';
            ctx.fillRect(0, 0, 32, 8);
            ctx.fillRect(0, 18, 32, 8);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(4, 10, 10, 2);
            ctx.fillRect(18, 24, 10, 2);

        } else if (type === 'bridge') {
            ctx.fillStyle = '#8D6E63';
            ctx.fillRect(0, 0, 32, 32);
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(0, 0, 32, 4);
            ctx.fillRect(0, 14, 32, 4);
            ctx.fillRect(0, 28, 32, 4);
            ctx.fillStyle = '#FFD166';
            ctx.fillRect(4, 6, 2, 2);
            ctx.fillRect(26, 6, 2, 2);

        } else if (type === 'flower_purple') {
            ctx.drawImage(this.getTile('grass'), 0, 0);
            ctx.fillStyle = '#9D4EDD';
            ctx.beginPath(); ctx.arc(16, 16, 6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FFD166';
            ctx.fillRect(14, 14, 4, 4);

        } else if (type === 'flower_pink') {
            ctx.drawImage(this.getTile('grass'), 0, 0);
            ctx.fillStyle = '#FF8FA3';
            ctx.beginPath(); ctx.arc(16, 16, 6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FFF';
            ctx.fillRect(14, 14, 4, 4);

        } else if (type === 'bush') {
            ctx.drawImage(this.getTile('grass'), 0, 0);
            ctx.fillStyle = '#558B2F';
            ctx.fillRect(4, 6, 24, 22);
            ctx.fillStyle = '#7CB342';
            ctx.fillRect(6, 4, 20, 20);
            ctx.fillStyle = '#FF8FA3';
            ctx.fillRect(10, 14, 4, 4);
            ctx.fillRect(20, 10, 4, 4);

        } else if (type === 'bench') {
            ctx.drawImage(this.getTile('path'), 0, 0);
            ctx.fillStyle = '#6D4C41';
            ctx.fillRect(4, 6, 24, 18);
            ctx.fillStyle = '#3E2723';
            ctx.fillRect(4, 10, 24, 2);
            ctx.fillRect(4, 16, 24, 2);
            ctx.fillRect(6, 24, 4, 6);
            ctx.fillRect(22, 24, 4, 6);

        } else if (type === 'lantern') {
            ctx.drawImage(this.getTile('path'), 0, 0);
            ctx.fillStyle = '#37474F';
            ctx.fillRect(14, 10, 4, 22);
            ctx.fillStyle = '#FFD54F';
            ctx.fillRect(10, 2, 12, 10);
            ctx.fillStyle = '#FFFDF9';
            ctx.fillRect(12, 4, 8, 6);

        } else if (type === 'lightstick') {
            ctx.drawImage(this.getTile('grass'), 0, 0);
            ctx.fillStyle = '#E0E0E0';
            ctx.fillRect(14, 16, 4, 12);
            ctx.fillStyle = '#9D4EDD';
            ctx.beginPath(); ctx.arc(16, 10, 7, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FF8FA3';
            ctx.fillRect(15, 3, 2, 3);

        } else if (type === 'chest_closed') {
            ctx.drawImage(this.getTile('grass'), 0, 0);
            ctx.fillStyle = '#6D4C41';
            ctx.fillRect(4, 8, 24, 20);
            ctx.fillStyle = '#FFD166';
            ctx.fillRect(4, 8, 24, 3);
            ctx.fillRect(4, 25, 24, 3);
            ctx.fillRect(4, 8, 3, 20);
            ctx.fillRect(25, 8, 3, 20);
            ctx.fillRect(14, 14, 4, 6);

        } else if (type === 'chest_open') {
            ctx.drawImage(this.getTile('grass'), 0, 0);
            ctx.fillStyle = '#6D4C41';
            ctx.fillRect(4, 14, 24, 14);
            ctx.fillStyle = '#FFD166';
            ctx.fillRect(2, 4, 28, 6);
            ctx.fillStyle = '#FFF5B8';
            ctx.fillRect(8, 10, 16, 4);
        }

        this.cache[type] = canvas;
        return canvas;
    }

    getTreeSprite(type = 'sakura') {
        const key = `tree_${type}`;
        if (this.cache[key]) return this.cache[key];

        const { canvas, ctx } = this.createCanvas(48, 64);

        ctx.fillStyle = '#4E342E';
        ctx.fillRect(18, 36, 12, 28);
        ctx.fillStyle = '#3E2723';
        ctx.fillRect(22, 36, 4, 28);

        if (type === 'sakura') {
            ctx.fillStyle = '#C77DFF';
            ctx.beginPath(); ctx.arc(24, 24, 22, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#E0AAFF';
            ctx.beginPath(); ctx.arc(20, 18, 16, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#9D4EDD';
            ctx.beginPath(); ctx.arc(28, 28, 14, 0, Math.PI * 2); ctx.fill();
        } else {
            ctx.fillStyle = '#388E3C';
            ctx.beginPath(); ctx.arc(24, 24, 22, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#66BB6A';
            ctx.beginPath(); ctx.arc(20, 18, 16, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#1B5E20';
            ctx.beginPath(); ctx.arc(28, 28, 14, 0, Math.PI * 2); ctx.fill();
        }

        this.cache[key] = canvas;
        return canvas;
    }
}

const gameArt = new PixelArtAssets();
