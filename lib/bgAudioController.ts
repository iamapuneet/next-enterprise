class BgAudioController {
  private static instance: BgAudioController | null = null
  private audio: HTMLAudioElement | null = null
  private enabled: boolean = true
  private volume: number = 0.18 // default low volume 18%

  private constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio('/bg_sound/interstellar.mp3')
      this.audio.loop = true
      this.audio.volume = this.volume
    }
  }

  public static getInstance(): BgAudioController {
    if (!BgAudioController.instance) {
      BgAudioController.instance = new BgAudioController()
    }
    return BgAudioController.instance
  }

  public play() {
    if (!this.audio || !this.enabled) return
    try {
      const promise = this.audio.play()
      if (promise !== undefined) {
        promise.catch((err) => {
          console.warn('Background sound play blocked or pending user interaction:', err)
        })
      }
    } catch (e) {
      console.warn('Background audio error:', e)
    }
  }

  public pause() {
    if (!this.audio) return
    this.audio.pause()
  }

  public setEnabled(enabled: boolean, shouldPlayNow: boolean = false) {
    this.enabled = enabled
    if (!enabled) {
      this.pause()
    } else if (shouldPlayNow) {
      this.play()
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol))
    if (this.audio) {
      this.audio.volume = this.volume
    }
  }

  public setMuted(muted: boolean) {
    if (this.audio) {
      this.audio.muted = muted
    }
  }

  public isPlaying(): boolean {
    return !this.audio?.paused
  }
}

export const bgAudioController = BgAudioController.getInstance()
