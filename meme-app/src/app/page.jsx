'use client'

import db from '../lib/db'
import MemeCard from '../components/MemeCard'
import Link from 'next/link'
import styles from './page.module.css'

export default function FeedPage() {
  const { data, isLoading, error } = db.useQuery({
    memes: {
      $: {
        order: {
          serverCreatedAt: 'desc'
        }
      },
      author: {},
      image: {},
      votes: {},
      comments: {}
    }
  })

  if (isLoading) {
    return (
      <div className={styles.feedPage}>
        <div className={styles.header}>
          <h1>Meme Feed</h1>
          <Link href="/create" className={styles.createBtn}>
            Create Meme
          </Link>
        </div>
        <div className={styles.loading}>Loading memes...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.feedPage}>
        <div className={styles.header}>
          <h1>Meme Feed</h1>
          <Link href="/create" className={styles.createBtn}>
            Create Meme
          </Link>
        </div>
        <div className={styles.error}>Error loading memes: {error.message}</div>
      </div>
    )
  }

  const memes = data?.memes || []

  return (
    <div className={styles.feedPage}>
      <div className={styles.header}>
        <h1>Meme Feed</h1>
        <Link href="/create" className={styles.createBtn}>
          Create Meme
        </Link>
      </div>

      {memes.length === 0 ? (
        <div className={styles.empty}>
          <p>No memes yet. Be the first to create one!</p>
          <Link href="/create" className={styles.emptyBtn}>
            Create First Meme
          </Link>
        </div>
      ) : (
        <div className={styles.memesGrid}>
          {memes.map((meme) => (
            <MemeCard key={meme.id} meme={meme} />
          ))}
        </div>
      )}
    </div>
  )
}
