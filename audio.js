import {getAreChipsFrying, getShiftInProgress, getShiftTimeRemaining} from './constantsAndGlobalVars.js';

let fryingAudio = null;
let isFrying = false;

const ambientAudioFiles = [
    './resources/audio/ambience1.mp3',
    './resources/audio/ambience2.mp3',
    './resources/audio/ambience3.mp3',
    './resources/audio/ambience4.mp3',
    './resources/audio/ambience5.mp3',
    './resources/audio/ambience6.mp3'
];

export const audioFiles = [
    './resources/audio/ambience1.mp3',
    './resources/audio/ambience2.mp3',
    './resources/audio/ambience3.mp3',
    './resources/audio/ambience4.mp3',
    './resources/audio/ambience5.mp3',
    './resources/audio/ambience6.mp3',
    './resources/audio/frying.mp3',
    './resources/audio/peeling.mp3',
    './resources/audio/chopping.mp3'
];

let currentAudio = null;
let nextAudio = null;
let fadeIntervals = [];
const fadeDuration = 5000; // 5 seconds
const crossfadeDuration = 5000; // 5 seconds

function playAudio(audioElement) {
    audioElement.play().catch(error => console.error('Error playing audio:', error));
}

function fadeAudio(audioElement, startVolume, endVolume, duration, onFinish) {
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = (endVolume - startVolume) / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
        if (currentStep >= steps) {
            clearInterval(fadeInterval);
            if (endVolume === 0) {
                audioElement.pause();
            }
            if (onFinish) onFinish();
        } else {
            audioElement.volume = startVolume + (currentStep * volumeStep);
            currentStep++;
        }
    }, stepDuration);

    fadeIntervals.push(fadeInterval);
}

function selectRandomAudioFile() {
    const randomIndex = Math.floor(Math.random() * ambientAudioFiles.length);
    return audioFiles[randomIndex];
}

export function startAmbientTrack() {
    nextAudio = new Audio(selectRandomAudioFile());
    nextAudio.volume = 0;
    playAudio(nextAudio);
    fadeAudio(nextAudio, 0, 0.25, fadeDuration);

    nextAudio.addEventListener('timeupdate', () => {
        if (nextAudio.currentTime >= nextAudio.duration - (crossfadeDuration / 1000)) {
            currentAudio = nextAudio;
            nextAudio = new Audio(selectRandomAudioFile());
            nextAudio.volume = 0;
            playAudio(nextAudio);
            fadeAudio(nextAudio, 0, 0.25, fadeDuration);
            fadeAudio(currentAudio, 0.25, 0, fadeDuration, () => {
                currentAudio.pause();
            });
        }

        const shiftTimeRemaining = getShiftTimeRemaining();
        if (shiftTimeRemaining <= 5 && nextAudio.volume > 0) {
            fadeAudio(nextAudio, nextAudio.volume, 0, fadeDuration, () => {
                if (shiftTimeRemaining <= 1) {
                    nextAudio.pause();
                }
            });
        }
    });
}

export function playFryingSoundLoop() {
    if (isFrying) return;

    isFrying = true;
    fryingAudio = new Audio(audioFiles[6]);
    fryingAudio.loop = true;
    fryingAudio.volume = 0.2;

    function checkFryingStatus() {
        const areChipsFrying = getAreChipsFrying();
        const shiftInProgress = getShiftInProgress();

        if (areChipsFrying && shiftInProgress) {
            if (fryingAudio.paused) {
                fryingAudio.play().catch(error => console.error('Error playing frying audio:', error));
            }
        } else {
            stopFryingSound();
        }
    }

    checkFryingStatus();

    const checkInterval = setInterval(checkFryingStatus, 200);

    function stopFryingSound() {
        isFrying = false;
        clearInterval(checkInterval);
        fryingAudio.pause();
    }

    if (!getAreChipsFrying() || !getShiftInProgress()) {
        stopFryingSound();
    }
}
