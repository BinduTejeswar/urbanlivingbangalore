import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getYouTubeID(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

export type PropertyVideoEmbed = {
  platform: 'youtube' | 'instagram'
  src: string
}

export function getPropertyVideoEmbed(url: string): PropertyVideoEmbed | null {
  const youtubeId = getYouTubeID(url)

  if (youtubeId) {
    return {
      platform: 'youtube',
      src: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&playsinline=1&rel=0`,
    }
  }

  try {
    const parsedUrl = new URL(url)
    const isInstagram = parsedUrl.hostname === 'instagram.com' || parsedUrl.hostname.endsWith('.instagram.com')
    if (!isInstagram) return null

    const match = parsedUrl.pathname.match(/^\/(p|reel|tv)\/([^/?#]+)/)
    if (!match) return null

    return {
      platform: 'instagram',
      src: `https://www.instagram.com/${match[1]}/${match[2]}/embed`,
    }
  } catch {
    return null
  }
}
