/**
 * Voice Alerts Utility using Web Speech API (SpeechSynthesis)
 * Dynamically picks system voice matching the selected web language (Tamil / Hindi / English).
 */

export const speakWarning = (text, language = 'en') => {
  if (!('speechSynthesis' in window)) {
    console.warn("Speech Synthesis not supported in this browser.");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Normalize language code
  const targetLang = (language || 'en').toLowerCase();
  
  if (targetLang.startsWith('ta')) {
    utterance.lang = 'ta-IN';
  } else if (targetLang.startsWith('hi')) {
    utterance.lang = 'hi-IN';
  } else {
    utterance.lang = 'en-IN';
  }

  // Find exact voice matching language code in system synthesis voices
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => 
    v.lang.toLowerCase().includes(targetLang.startsWith('ta') ? 'ta' : targetLang.startsWith('hi') ? 'hi' : 'en')
  );

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.rate = 0.85; // Slower speed for elderly clarity
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
};

export const stopVoice = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
