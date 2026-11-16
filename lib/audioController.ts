import { Track } from '../types/music'

type AudioCallback = {
  onTimeUpdate: (currentTime: number) => void
  onDurationChange: (duration: number) => void
  onLoadingChange: (isLoading: boolean) => void
  onPlayingChange: (isPlaying: boolean) => void
  onEnded: () => void
  onError: (error: string) => void
}

class AudioController {
  private static instance: AudioController | null = null
  private audio: HTMLAudioElement | null = null
  private callbacks: AudioCallback | null = null

  private constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio()
      this.setupListeners()
    }
  }

  public static getInstance(): AudioController {
    if (!AudioController.instance) {
      AudioController.instance = new AudioController()
    }
    return AudioController.instance
  }

  public registerCallbacks(callbacks: AudioCallback) {
    this.callbacks = callbacks
  }

  private setupListeners() {
    if (!this.audio) return

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio && this.callbacks) {
        this.callbacks.onTimeUpdate(this.audio.currentTime)
      }
    })

    this.audio.addEventListener('loadedmetadata', () => {
      if (this.audio && this.callbacks) {
        this.callbacks.onDurationChange(this.audio.duration || 0)
        this.callbacks.onLoadingChange(false)
      }
    })

    this.audio.addEventListener('playing', () => {
      if (this.callbacks) {
        this.callbacks.onPlayingChange(true)
        this.callbacks.onLoadingChange(false)
      }
    })

    this.audio.addEventListener('pause', () => {
      if (this.callbacks) {
        this.callbacks.onPlayingChange(false)
      }
    })

    this.audio.addEventListener('waiting', () => {
      if (this.callbacks) {
        this.callbacks.onLoadingChange(true)
      }
    })

    this.audio.addEventListener('ended', () => {
      if (this.callbacks) {
        this.callbacks.onEnded()
      }
    })

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio playback error', e)
      if (this.callbacks) {
        this.callbacks.onLoadingChange(false)
        this.callbacks.onPlayingChange(false)
        this.callbacks.onError('Unable to play audio stream')
      }
    })
  }

  public loadAndPlay(track: Track) {
    if (!this.audio) return
    try {
      if (this.callbacks) this.callbacks.onLoadingChange(true)
      if (this.audio.src !== track.audioUrl) {
        this.audio.src = track.audioUrl
        this.audio.load()
      }
      const playPromise = this.audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Playback interrupted or autoplay blocked by browser:', err)
          if (this.callbacks) {
            this.callbacks.onPlayingChange(false)
            this.callbacks.onLoadingChange(false)
          }
        })
      }
    } catch (err) {
      console.error('Audio load error:', err)
    }
  }

  public play() {
    if (!this.audio) return
    const promise = this.audio.play()
    if (promise) {
      promise.catch((err) => {
        console.warn('Play error:', err)
        if (this.callbacks) this.callbacks.onPlayingChange(false)
      })
    }
  }

  public pause() {
    if (!this.audio) return
    this.audio.pause()
  }

  public seek(seconds: number) {
    if (!this.audio) return
    if (isFinite(seconds)) {
      this.audio.currentTime = seconds
    }
  }

  public setVolume(volume: number) {
    if (!this.audio) return
    this.audio.volume = Math.max(0, Math.min(1, volume))
  }

  public setMuted(muted: boolean) {
    if (!this.audio) return
    this.audio.muted = muted
  }

  public setPlaybackRate(rate: number) {
    if (!this.audio) return
    this.audio.playbackRate = rate
  }
}

export const audioController = AudioController.getInstance()
