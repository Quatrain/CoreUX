import { AbstractVoiceAdapter } from './AbstractVoiceAdapter'

/**
 * Unified static registry to configure and trigger the active voice synthesis adapter.
 */
export class Voice {
   protected static _adapter: AbstractVoiceAdapter | null = null

   /**
    * Assign and initialize the active voice synthesis adapter.
    * 
    * @param adapter - An instance of AbstractVoiceAdapter.
    */
   public static setAdapter(adapter: AbstractVoiceAdapter): void {
      this._adapter = adapter
      this._adapter.init()
   }

   /**
    * Retrieve the currently active voice adapter.
    * 
    * @returns The active AbstractVoiceAdapter.
    * @throws {Error} If no adapter has been set.
    */
   public static getAdapter(): AbstractVoiceAdapter {
      if (!this._adapter) {
         throw new Error('Voice adapter has not been configured. Call Voice.setAdapter() first.')
      }
      return this._adapter
   }

   /**
    * Trigger voice synthesis on the active adapter.
    * 
    * @param text - Plain text to read.
    * @param options - Configuration options for synthesis.
    */
   public static speak(text: string, options?: any): Promise<void> {
      return this.getAdapter().speak(text, options)
   }
}
