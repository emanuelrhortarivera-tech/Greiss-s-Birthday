// =========================================================================
// 🔊 RETRO SOUND SYNTHESIZER (WEB AUDIO API)
// =========================================================================
// Genera efectos de sonido 8-bit integrados en tiempo real sin requerir
// archivos externos obligatorios, garantizando que el juego siempre suene genial.
// =========================================================================

class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.initOnUserGesture();
    }

    initCtx() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    initOnUserGesture() {
        const unlock = () => {
            this.initCtx();
            window.removeEventListener('click', unlock);
            window.removeEventListener('keydown', unlock);
            window.removeEventListener('touchstart', unlock);
        };
        window.addEventListener('click', unlock);
        window.addEventListener('keydown', unlock);
        window.addEventListener('touchstart', unlock);
    }

    toggleSound() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // Reproduce una melodía de notas cuadradas
    playNotes(notes, duration = 0.1, type = 'square', gainVal = 0.1) {
        if (!this.enabled) return;
        this.initCtx();
        if (!this.ctx) return;

        let now = this.ctx.currentTime;
        notes.forEach((freq, index) => {
            if (freq <= 0) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, now + index * duration);

            gain.gain.setValueAtTime(gainVal, now + index * duration);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + (index + 1) * duration - 0.01);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + index * duration);
            osc.stop(now + (index + 1) * duration);
        });
    }

    // Efecto: Pasos al caminar (suave)
    playStepSound() {
        if (!this.enabled) return;
        this.initCtx();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.05);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
    }

    // Efecto: Recoger estrella / objeto
    playCollectSound() {
        this.playNotes([523.25, 659.25, 783.99, 1046.50], 0.06, 'sine', 0.12);
    }

    // Efecto: Desbloquear recuerdo
    playMemoryUnlockSound() {
        this.playNotes([440, 554.37, 659.25, 880, 1108.73], 0.08, 'triangle', 0.15);
    }

    // Efecto: Obtener llave
    playKeySound() {
        this.playNotes([587.33, 739.99, 880, 1174.66], 0.07, 'sine', 0.15);
    }

    // Efecto: Abrir cofre mágico
    playChestSound() {
        this.playNotes([261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50], 0.09, 'square', 0.15);
    }

    // Efecto: Error PIN
    playErrorSound() {
        this.playNotes([200, 150], 0.12, 'sawtooth', 0.15);
    }

    // Efecto: Éxito PIN / Botón
    playClickSound() {
        this.playNotes([440, 880], 0.05, 'sine', 0.1);
    }

    // Efecto: Fanfarria de cumpleaños final
    playCelebrationFanfare() {
        // Notas de feliz cumpleaños estilo 8-bit 🎶
        const melody = [
            261.63, 261.63, 293.66, 261.63, 349.23, 329.63,
            0,
            261.63, 261.63, 293.66, 261.63, 392.00, 349.23,
            0,
            261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66,
            0,
            466.16, 466.16, 440.00, 349.23, 392.00, 349.23
        ];
        this.playNotes(melody, 0.14, 'triangle', 0.15);
    }
}

const gameAudio = new SoundManager();
