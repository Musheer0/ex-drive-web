import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ex drive',
    short_name: 'ex drive',
    description: 'mini mini google drive clone',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
 icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}