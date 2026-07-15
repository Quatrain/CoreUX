/**
 * Abstract blueprint for voice synthesis adapters.
 */
export abstract class AbstractVoiceAdapter {
   /**
    * Adapter specific initialization
    */
   abstract init(): void

   /**
    * Synthesize text to speech
    * @param text - The plain text to read aloud
    * @param options - Configuration options such as voice ID, language, speed, etc.
    */
   abstract speak(text: string, options?: any): Promise<void>
}
