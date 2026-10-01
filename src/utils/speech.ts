/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Speech API Thai Text-to-Speech (TTS) Engine
class SpeechController {
  public isEnabled: boolean = true;
  private thaiVoice: SpeechSynthesisVoice | null = null;
  private hasInitialized: boolean = false;

  constructor() {
    this.isEnabled = true;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('thai_pronoun_fish_voice');
        if (saved === 'false') {
          this.isEnabled = false;
        }
      } catch {
        // ignore
      }
      this.initVoices();
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Find Thai voice
      const th = voices.find((v) => v.lang.startsWith('th') || v.lang.includes('TH'));
      if (th) {
        this.thaiVoice = th;
      }
      this.hasInitialized = true;
    };

    pickVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = pickVoice;
    }
  }

  public toggleVoice(): boolean {
    this.isEnabled = !this.isEnabled;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('thai_pronoun_fish_voice', String(this.isEnabled));
      } catch {
        // ignore
      }
      if (!this.isEnabled && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
    return this.isEnabled;
  }

  // Speak Thai text with natural speech settings
  public speak(text: string, rate: number = 0.95, pitch: number = 1.05) {
    if (!this.isEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      // Cancel any ongoing utterance to avoid queuing lag
      window.speechSynthesis.cancel();

      if (!this.hasInitialized) {
        this.initVoices();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'th-TH';
      utterance.rate = rate;
      utterance.pitch = pitch;

      if (this.thaiVoice) {
        utterance.voice = this.thaiVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  // Read hooked pronoun word out loud
  public speakWord(word: string) {
    this.speak(word, 0.9, 1.0);
  }

  // Speak cheering phrase on correct answer
  public speakCorrect(personNumber?: number) {
    const praises = [
      'ถูกต้องค่ะ เก่งมาก!',
      'ยอดเยี่ยมมากค่ะ!',
      'ตอบถูกแล้วค่ะ!',
      'เก่งจริง ๆ เลยค่ะ!',
    ];
    let msg = praises[Math.floor(Math.random() * praises.length)];
    if (personNumber) {
      msg = `ถูกต้องค่ะ บุรุษที่ ${personNumber}`;
    }
    this.speak(msg, 1.0, 1.1);
  }

  // Speak feedback on wrong answer
  public speakWrong() {
    const wrongPhrases = [
      'ยังไม่ถูกต้องนะคะ ลองใหม่นะ',
      'ข้อนี้ยังไม่ใช่นะคะ ลองดูอีกครั้งค่ะ',
      'สู้ ๆ ค่ะ ลองคิดใหม่อีกทีนะ',
    ];
    const msg = wrongPhrases[Math.floor(Math.random() * wrongPhrases.length)];
    this.speak(msg, 0.95, 1.0);
  }

  // Speak when creature struggles and escapes after 3 seconds
  public speakEscape(creatureName: string = 'ปลา') {
    const escapePhrases = [
      `${creatureName}ดิ้นหลุดไปแล้วค่ะ! ต้องดึงเร็วกว่านี้นะคะ`,
      `หลุดเบ็ดไปแล้วค่ะ! ดิ้นแรงมาก`,
      `เกิน 3 วินาที ${creatureName}ดิ้นหนีไปแล้วค่ะ สู้ใหม่นะ`,
    ];
    const msg = escapePhrases[Math.floor(Math.random() * escapePhrases.length)];
    this.speak(msg, 1.0, 1.05);
  }

  // Speak game over announcement
  public speakGameOver(score: number, caught: number) {
    this.speak(`จบเกมแล้วค่ะ ตกปลาได้ ${caught} ตัว รวม ${score} คะแนน ยอดเยี่ยมมากเลยค่ะ`, 0.95, 1.05);
  }

  // Speak welcome greeting
  public speakWelcome() {
    this.speak('ยินดีต้อนรับสู่เกมตกปลาคำบุรุษสรรพนามค่ะ ขอให้สนุกกับการเรียนรู้นะคะ', 0.95, 1.05);
  }
}

export const speechManager = new SpeechController();
