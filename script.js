const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const cheerSound = document.getElementById('cheerSound');
const popcornContainer = document.getElementById('popcorn-container');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

function createPopcornParticle() {
    if (!popcornContainer) return;

    const popcorn = document.createElement('div');
    popcorn.classList.add('popcorn');

    const randomX = (Math.random() - 0.5) * 300;
    const randomY = -(Math.random() * 150 + 200);
    const randomRotate = Math.random() * 720 + 360;
    const randomDelay = Math.random() * 0.3;
    const randomDuration = Math.random() * 0.5 + 1.0;

    popcorn.style.setProperty('--tx', `${randomX}px`);
    popcorn.style.setProperty('--ty', `${randomY}px`);
    popcorn.style.setProperty('--rotate-end', `${randomRotate}deg`);
    popcorn.style.animationDelay = `${randomDelay}s`;
    popcorn.style.animationDuration = `${randomDuration}s`;

    popcorn.addEventListener('animationend', () => {
        popcorn.remove();
    });

    popcornContainer.appendChild(popcorn);
}

function createPopcornEffect(count = 30) {
    for (let i = 0; i < count; i++) {
        createPopcornParticle();
    }
}

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ja-JP';

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };

    recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            }
        }

        const transcriptToCheck = finalTranscript.trim().toLowerCase().replace(/\s+/g, '');

        if (transcriptToCheck.includes('chickenjockey') || transcriptToCheck.includes('チキンジョッキー')) {
             if (cheerSound.paused) {
                console.log("Attempting to play sound. Source:", cheerSound.currentSrc || cheerSound.src);
                cheerSound.currentTime = 0;
                cheerSound.play().then(() => {
                    console.log("Audio played successfully!");
                    createPopcornEffect();
                }).catch(e => {
                    console.error("Audio play failed:", e);
                    console.error("Audio element details:", {
                        src: cheerSound.src,
                        currentSrc: cheerSound.currentSrc,
                        networkState: cheerSound.networkState,
                        readyState: cheerSound.readyState,
                        error: cheerSound.error
                    });
                });
             }
        }
    };

} else {
    console.warn('お使いのブラウザは音声認識に対応していません。');
    if (startButton) startButton.disabled = true;
    if (stopButton) stopButton.disabled = true;
}

if (startButton) {
    startButton.onclick = () => {
        if (recognition) {
            try {
                recognition.lang = navigator.language || 'ja-JP';
                recognition.start();
                console.log('Speech recognition started.');
            } catch (e) {
                 console.error('Recognition start error:', e);
            }
        }
    };
}

if (stopButton) {
    stopButton.onclick = () => {
        if (recognition) {
            recognition.stop();
            console.log('Speech recognition stopped.');
        }
    };
}