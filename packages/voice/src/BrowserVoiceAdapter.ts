import { AbstractVoiceAdapter } from './AbstractVoiceAdapter'

/**
 * Voice synthesis adapter using the native Web Speech API (SpeechSynthesis) in the browser.
 */
export class BrowserVoiceAdapter extends AbstractVoiceAdapter {
   init(): void {
      // Browser SpeechSynthesis does not need explicit initialization keys
   }

   /**
    * Synthesize text using the browser's speechSynthesis engine.
    * 
    * @param text - Plain text to synthesize.
    * @param options - Configuration options. Supports `lang` (e.g. 'fr-FR', 'en-US').
    */
   async speak(text: string, options?: { lang?: string }): Promise<void> {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
         throw new Error('BrowserVoiceAdapter requires a browser environment with SpeechSynthesis support.')
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      // Strip markdown syntax for natural reading
      const cleanText = text.replace(/[#*`[\]()]/g, '')
      const utterance = new SpeechSynthesisUtterance(cleanText)

      if (options?.lang) {
         utterance.lang = options.lang
      }

      window.speechSynthesis.speak(utterance)
   }
}
