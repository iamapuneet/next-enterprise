'use client'

import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Plus, X } from 'lucide-react'
import { musicService } from '../../services/musicService'
import { Playlist } from '../../types/music'

interface CreatePlaylistDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreated?: (playlist: Playlist) => void
}

export function CreatePlaylistDialog({ isOpen, onClose, onCreated }: CreatePlaylistDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      const playlist = await musicService.createPlaylist({
        title: title.trim(),
        description: description.trim(),
      })
      setTitle('')
      setDescription('')
      onCreated?.(playlist)
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs transition-opacity" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#1B1B1B] p-6 text-white shadow-2xl border border-white/10 outline-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <Dialog.Title className="text-lg font-bold">New Playlist</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your playlist a title"
                className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#FF4B4B] transition text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this playlist about?"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#FF4B4B] transition text-sm resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-sm font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || isSubmitting}
                className="px-5 py-2 rounded-full text-sm font-semibold bg-[#FF4B4B] hover:bg-[#E03E3E] text-white disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {isSubmitting ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
