'use client'

import React, { useState } from 'react'
import {
  Settings,
  Volume2,
  Sliders,
  Keyboard,
  Moon,
  Sun,
  Shield,
  Sparkles,
} from 'lucide-react'
import { OshoLogo } from '../../components/common/OshoLogo'

export default function SettingsPage() {
  const [audioQuality, setAudioQuality] = useState('high')
  const [autoplayNext, setAutoplayNext] = useState(true)
  const [normalizeVolume, setNormalizeVolume] = useState(true)

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause' },
    { key: 'J / Left Arrow', desc: 'Seek backward 5 seconds' },
    { key: 'L / Right Arrow', desc: 'Seek forward 5 seconds' },
    { key: 'N', desc: 'Next track' },
    { key: 'P', desc: 'Previous track' },
    { key: 'M', desc: 'Mute / Unmute audio' },
    { key: '/', desc: 'Focus search bar' },
    { key: 'Esc', desc: 'Close full-screen player or search' },
  ]

  return (
    <div className="max-w-4xl space-y-10 pb-20 select-none">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-[#FF4B4B] text-xs font-bold uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" />
          <span>Preferences</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Settings
        </h1>
      </div>

      {/* Playback Settings */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-[#FF4B4B]" />
          Audio & Playback
        </h2>

        <div className="bg-[#1B1B1B] rounded-2xl border border-white/5 divide-y divide-white/5 p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4">
            <div>
              <p className="font-semibold text-white text-sm">Streaming Audio Quality</p>
              <p className="text-xs text-neutral-400">
                Choose preferred audio streaming bitrate and fidelity
              </p>
            </div>
            <select
              value={audioQuality}
              onChange={(e) => setAudioQuality(e.target.value)}
              className="bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-[#FF4B4B]"
            >
              <option value="normal">Normal (128 kbps AAC)</option>
              <option value="high">High (256 kbps AAC - Recommended)</option>
              <option value="lossless">Extreme Lossless (FLAC 24-bit/96kHz)</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-4 pb-4">
            <div>
              <p className="font-semibold text-white text-sm">Autoplay Similar Music</p>
              <p className="text-xs text-neutral-400">
                Keep the music going by automatically adding similar tracks when queue finishes
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoplayNext}
              onChange={(e) => setAutoplayNext(e.target.checked)}
              className="w-5 h-5 accent-[#FF4B4B] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="font-semibold text-white text-sm">Volume Normalization</p>
              <p className="text-xs text-neutral-400">
                Balance loudness across different songs to eliminate abrupt jumps
              </p>
            </div>
            <input
              type="checkbox"
              checked={normalizeVolume}
              onChange={(e) => setNormalizeVolume(e.target.checked)}
              className="w-5 h-5 accent-[#FF4B4B] cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Keyboard Shortcuts Guide */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-[#FF4B4B]" />
          Keyboard Shortcuts
        </h2>

        <div className="bg-[#1B1B1B] rounded-2xl border border-white/5 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/60 border border-white/5 text-xs"
            >
              <span className="text-neutral-300">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-neutral-800 text-neutral-200 font-mono text-[11px] border border-white/10">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </section>

      {/* App Version & Credits */}
      <section className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <OshoLogo size={18} />
          <span>Oshovani • Discourses & Dhyan Edition</span>
        </div>
        <span>Version 1.0.0</span>
      </section>
    </div>
  )
}
