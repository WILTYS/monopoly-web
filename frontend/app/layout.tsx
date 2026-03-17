import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Monopoly Web — Jeu Multijoueur',
  description: 'Jouez au Monopoly en ligne avec vos amis en temps réel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
