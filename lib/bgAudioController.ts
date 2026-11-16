class BgAudioController {
  private static instance: BgAudioController | null = null
  private audio: HTMLAudioElement | null = null
  private enabled: boolean = true
  private targetVolume: number = 0.18 // default low volume 18%
  private isFading: boolean = false
  private fadeAnimationId: number | null = null

  private constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio('/bg_sound/interstellar.mp3')
      this.audio.loop = true
      this.audio.volume = this.targetVolume
      this.audio.preload = 'auto'
    }
  }

  public static getInstance(): BgAudioController {
    if (!BgAudioController.instance) {
      BgAudioController.instance = new BgAudioController()
    }
    return BgAudioController.instance
  }

  private cancelOngoingFade() {
    if (this.fadeAnimationId !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(this.fadeAnimationId)
      this.fadeAnimationId = null
    }
    this.isFading = false
  }

  /**
   * Smoothly interpolate audio volume over a specified duration in ms
   */
  private fadeVolume(from: number, to: number, durationMs: number = 350, onComplete?: () => void) {
    if (!this.audio || typeof window === 'undefined') return
    this.cancelOngoingFade()
    this.isFading = true

    const startTime = performance.now()
    const diff = to - from

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(1, elapsed / durationMs)
      // Ease-out cubic for smooth natural volume curve
      const eased = 1 - Math.pow(1 - progress, 3)
      const newVol = Math.max(0, Math.min(1, from + diff * eased))

      if (this.audio) {
        this.audio.volume = newVol
      }

      if (progress < 1) {
        this.fadeAnimationId = window.requestAnimationFrame(step)
      } else {
        if (this.audio) this.audio.volume = to
        this.isFading = false
        this.fadeAnimationId = null
        if (onComplete) onComplete()
      }
    }

    this.fadeAnimationId = window.requestAnimationFrame(step)
  }

  public play() {
    if (!this.audio || !this.enabled) return
    try {
      if (this.audio.paused) {
        this.audio.volume = 0
        const promise = this.audio.play()
        if (promise !== undefined) {
          promise
            .then(() => {
              // Smoothly fade in to target volume over 450ms
              this.fadeVolume(0, this.targetVolume, 450)
            })
            .catch((err) => {
              console.warn('Background sound play blocked or pending user interaction:', err)
            })
        }
      } else if (!this.isFading && this.audio.volume < this.targetVolume) {
        this.fadeVolume(this.audio.volume, this.targetVolume, 300)
      }
    } catch (e) {
      console.warn('Background audio error:', e)
    }
  }

  public pause() {
    if (!this.audio || this.audio.paused) return
    const currentVol = this.audio.volume
    // Smoothly fade out before pausing
    this.fadeVolume(currentVol, 0, 300, () => {
      if (this.audio) {
        this.audio.pause()
        this.audio.volume = this.targetVolume
      }
    })
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
    const clamped = Math.max(0, Math.min(1, vol))
    this.targetVolume = clamped
    if (this.audio && !this.audio.paused) {
      // Smooth micro-fade to avoid audio crackle or stepping
      this.fadeVolume(this.audio.volume, clamped, 120)
    } else if (this.audio) {
      this.audio.volume = clamped
    }
  }

  public setMuted(muted: boolean) {
    if (!this.audio) return
    if (muted) {
      this.fadeVolume(this.audio.volume, 0, 200, () => {
        if (this.audio) this.audio.muted = true
      })
    } else {
      this.audio.muted = false
      this.fadeVolume(0, this.targetVolume, 300)
    }
  }

  public isPlaying(): boolean {
    return !this.audio?.paused
  }
}

export const bgAudioController = BgAudioController.getInstance()
