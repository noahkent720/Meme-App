'use client'

import Link from 'next/link'
import styles from './MemeCard.module.css'

function MemeCard({ meme }) {
  const score = meme.votes?.reduce((sum, vote) => sum + vote.value, 0) || 0
  const commentCount = meme.comments?.length || 0
  
  // Use imageUrl if available, otherwise try image.url, otherwise use placeholder
  const imageUrl = meme.imageUrl || meme.image?.url || '/templates/template1.png'

  return (
    <Link href={`/meme/${meme.id}`} className={styles.memeCard}>
      <div className={styles.imageContainer}>
        <img 
          src={imageUrl} 
          alt="Meme" 
          className={styles.memeImage}
        />
      </div>
      <div className={styles.memeInfo}>
        <div className={styles.author}>
          by {meme.author?.nickname || 'Anonymous'}
        </div>
        <div className={styles.stats}>
          <span className={styles.score} title="Score">
            {score > 0 ? '+' : ''}{score}
          </span>
          <span className={styles.comments} title="Comments">
            💬 {commentCount}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default MemeCard
