'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import db from '../../../lib/db'
import { id } from '@instantdb/react'
import styles from './page.module.css'

export default function MemeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = db.useAuth()
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data, isLoading, error } = db.useQuery({
    memes: {
      $: {
        where: {
          id: params.id
        }
      },
      author: {},
      image: {},
      votes: {
        author: {
          user: {}
        }
      },
      comments: {
        $: {
          order: {
            serverCreatedAt: 'asc'
          }
        },
        author: {}
      }
    }
  })

  const handleVote = async (value) => {
    if (!user || !meme) return

    try {
      // Get or create profile
      const { data: profiles } = await db.queryOnce({
        profiles: {
          $: {
            where: {
              'user.id': user.id
            }
          }
        }
      })

      let profileId
      if (profiles?.profiles?.length > 0) {
        profileId = profiles.profiles[0].id
      } else {
        // Try to create profile
        profileId = id()
        try {
          await db.transact([
            db.tx.profiles[profileId].update({
              nickname: user.email?.split('@')[0] || 'User',
              createdAt: Date.now()
            }).link({ user: user.id })
          ])
        } catch (linkError) {
          // Profile might already exist, try to find it
          const { data: retry } = await db.queryOnce({ profiles: {} })
          const existing = retry?.profiles?.find(p => p.user?.id === user.id)
          if (existing) profileId = existing.id
          else throw new Error('Could not create or find profile')
        }
      }

      // Find existing vote by this user
      const existingVote = meme.votes?.find(v => v.author?.user?.id === user.id)

      const tx = []
      
      // If same vote value, remove the vote (toggle off)
      if (existingVote) {
        tx.push(db.tx.votes[existingVote.id].delete())
        
        // If different value, add new vote
        if (existingVote.value !== value) {
          const voteId = id()
          tx.push(
            db.tx.votes[voteId].update({ value }).link({
              meme: meme.id,
              author: profileId
            })
          )
        }
      } else {
        // No existing vote, create new one
        const voteId = id()
        tx.push(
          db.tx.votes[voteId].update({ value }).link({
            meme: meme.id,
            author: profileId
          })
        )
      }

      await db.transact(tx)
    } catch (err) {
      console.error('Failed to vote:', err)
      alert('Failed to vote: ' + err.message)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!user || !meme || !commentText.trim()) return

    try {
      setIsSubmitting(true)

      // Get or create profile
      const { data: profiles } = await db.queryOnce({
        profiles: {
          $: {
            where: {
              'user.id': user.id
            }
          }
        }
      })

      let profileId
      if (profiles?.profiles?.length > 0) {
        profileId = profiles.profiles[0].id
      } else {
        // Try to create profile
        profileId = id()
        try {
          await db.transact([
            db.tx.profiles[profileId].update({
              nickname: user.email?.split('@')[0] || 'User',
              createdAt: Date.now()
            }).link({ user: user.id })
          ])
        } catch (linkError) {
          // Profile might already exist, try to find it
          const { data: retry } = await db.queryOnce({ profiles: {} })
          const existing = retry?.profiles?.find(p => p.user?.id === user.id)
          if (existing) profileId = existing.id
          else throw new Error('Could not create or find profile')
        }
      }

      const commentId = id()
      await db.transact([
        db.tx.comments[commentId].update({
          body: commentText.trim(),
          createdAt: Date.now()
        }).link({
          meme: meme.id,
          author: profileId
        })
      ])

      setCommentText('')
    } catch (err) {
      console.error('Failed to comment:', err)
      alert('Failed to comment: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.loading}>Loading...</div>
      </div>
    )
  }

  if (error || !data?.memes?.[0]) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.error}>
          {error ? `Error: ${error.message}` : 'Meme not found'}
        </div>
        <Link href="/" className={styles.backBtn}>
          Back to Feed
        </Link>
      </div>
    )
  }

  const meme = data.memes[0]
  const score = meme.votes?.reduce((sum, vote) => sum + vote.value, 0) || 0
  const userVote = meme.votes?.find(v => v.author?.user?.id === user?.id)
  const imageUrl = meme.imageUrl || meme.image?.url || '/templates/template1.png'

  return (
    <div className={styles.detailPage}>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back to Feed
        </Link>
      </div>

      <div className={styles.content}>
        <div className={styles.memeSection}>
          <div className={styles.imageContainer}>
            <img
              src={imageUrl}
              alt="Meme"
              className={styles.memeImage}
            />
          </div>

          <div className={styles.voteSection}>
            <button
              className={`${styles.voteBtn} ${styles.upvote} ${userVote?.value === 1 ? styles.active : ''}`}
              onClick={() => handleVote(1)}
              disabled={!user}
              title={!user ? 'Sign in to vote' : 'Upvote'}
            >
              ▲
            </button>
            <div className={styles.voteScore}>{score}</div>
            <button
              className={`${styles.voteBtn} ${styles.downvote} ${userVote?.value === -1 ? styles.active : ''}`}
              onClick={() => handleVote(-1)}
              disabled={!user}
              title={!user ? 'Sign in to vote' : 'Downvote'}
            >
              ▼
            </button>
          </div>

          <div className={styles.memeInfo}>
            <div className={styles.author}>
              Posted by {meme.author?.nickname || 'Anonymous'}
            </div>
          </div>
        </div>

        <div className={styles.commentsSection}>
          <h2>Comments ({meme.comments?.length || 0})</h2>

          {user ? (
            <form onSubmit={handleComment} className={styles.commentForm}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className={styles.commentInput}
                rows={3}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting || !commentText.trim()}
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <div className={styles.signInPrompt}>
              Sign in to comment
            </div>
          )}

          <div className={styles.commentsList}>
            {meme.comments?.length === 0 ? (
              <div className={styles.noComments}>
                No comments yet. Be the first to comment!
              </div>
            ) : (
              meme.comments.map((comment) => (
                <div key={comment.id} className={styles.comment}>
                  <div className={styles.commentAuthor}>
                    {comment.author?.nickname || 'Anonymous'}
                  </div>
                  <div className={styles.commentBody}>{comment.body}</div>
                  <div className={styles.commentTime}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
