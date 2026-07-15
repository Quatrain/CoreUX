import { AbstractVoiceAdapter } from './AbstractVoiceAdapter'

/**
 * Voice synthesis adapter using ElevenLabs HTTP API.
 */
export class ElevenLabsVoiceAdapter extends AbstractVoiceAdapter {
   private _apiKey: string
   private _voiceId: string
   private _modelId: string

   constructor(config: { apiKey: string; voiceId?: string; modelId?: string }) {
      super()
      this._apiKey = config.apiKey
      this._voiceId = config.voiceId || 'bVsJfghVbJypxgwVISO3' // User's voice
      this._modelId = config.modelId || 'eleven_multilingual_v2'
   }

   init(): void {
      if (!this._apiKey) {
         throw new Error('ElevenLabsVoiceAdapter requires an apiKey.')
      }
   }

   /**
    * Synthesize text using ElevenLabs API and play the returned audio blob.
    * 
    * @param text - Plain text to synthesize.
    * @param options - Configuration options. Supports `voiceId` override.
    */
   async speak(text: string, options?: { voiceId?: string }): Promise<void> {
      const voiceId = options?.voiceId || this._voiceId
      const cleanText = text.replace(/[#*`[\]()]/g, '')

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'xi-api-key': this._apiKey,
         },
         body: JSON.stringify({
            text: cleanText,
            model_id: this._modelId,
            voice_settings: {
               stability: 0.5,
               similarity_boost: 0.75,
            },
         }),
      })

      if (!response.ok) {
         const errText = await response.text()
         throw new Error(`ElevenLabs TTS request failed: ${response.statusText} - ${errText}`)
      }

      const audioBlob = await response.blob()

      if (typeof window !== 'undefined') {
         const audioUrl = URL.createObjectURL(audioBlob)
         const audio = new Audio(audioUrl)
         await audio.play()
      }
   }
}
