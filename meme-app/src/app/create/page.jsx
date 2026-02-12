'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ImageSelector from '../../components/ImageSelector'
import MemeCanvas from '../../components/MemeCanvas'
import BottomToolbar from '../../components/BottomToolbar'
import db from '../../lib/db'
import { id } from '@instantdb/react'
import styles from './page.module.css'

const DEFAULT_FONT = 'Impact, sans-serif'

export default function CreatePage() {
  const router = useRouter()
  const { user } = db.useAuth()
  const [selectedImage, setSelectedImage] = useState(null)
  const [textBlocks, setTextBlocks] = useState([])
  const [selectedTextId, setSelectedTextId] = useState(null)
  const [fontFamily, setFontFamily] = useState(DEFAULT_FONT)
  const [textSize, setTextSize] = useState(50)
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [borderColor, setBorderColor] = useState('#000000')
  const [isPosting, setIsPosting] = useState(false)
  const canvasRef = useRef(null)

  const selectedBlock = textBlocks.find(b => b.id === selectedTextId)
  
  const updateBlock = (id, updates) => {
    setTextBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  const addTextBlock = (x, y) => {
    const newId = crypto.randomUUID()
    setTextBlocks(prev => [...prev, { id: newId, content: '', x, y, fontSize: textSize }])
    setSelectedTextId(newId)
  }

  const removeTextBlock = (id) => {
    setTextBlocks(prev => prev.filter(b => b.id !== id))
    setSelectedTextId(prev => (prev === id ? null : prev))
  }

  const handleDownload = () => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'meme.png'
      link.click()
      URL.revokeObjectURL(url)
    })
  }

  const handlePost = async () => {
    if (!canvasRef.current) return
    
    try {
      setIsPosting(true)
      
      // For development: allow anonymous posting
      let profileId
      
      if (user) {
        // Get or create profile for authenticated users
        try {
          const { data: profiles } = await db.queryOnce({
            profiles: {
              $: {
                where: {
                  'user.id': user.id
                }
              }
            }
          })
          
          if (profiles?.profiles?.length > 0) {
            profileId = profiles.profiles[0].id
          } else {
            // Create profile without linking (link might already exist)
            profileId = id()
            const nickname = user.email?.split('@')[0] || 'User'
            await db.transact([
              db.tx.profiles[profileId].update({
                nickname: nickname,
                createdAt: Date.now()
              }).link({ user: user.id })
            ])
          }
        } catch (profileError) {
          console.error('Profile error:', profileError)
          // Fallback: try to find existing profile by querying all profiles
          const { data: allProfiles } = await db.queryOnce({
            profiles: {}
          })
          const existingProfile = allProfiles?.profiles?.find(p => p.user?.id === user.id)
          if (existingProfile) {
            profileId = existingProfile.id
          } else {
            throw new Error('Could not create or find profile')
          }
        }
      } else {
        // Anonymous user - create temporary profile
        profileId = id()
        await db.transact([
          db.tx.profiles[profileId].update({
            nickname: 'Anonymous',
            createdAt: Date.now()
          })
        ])
      }
      
      // Convert canvas to data URL (simplified approach for demo)
      const canvas = canvasRef.current
      const dataUrl = canvas.toDataURL('image/png', 0.8) // 0.8 quality to reduce size
      
      // Create meme entity with data URL
      const memeId = id()
      console.log('Creating meme with:', { memeId, profileId })
      
      await db.transact([
        db.tx.memes[memeId].update({
          createdAt: Date.now(),
          imageUrl: dataUrl
        }).link({
          author: profileId
        })
      ])
      
      console.log('Meme created successfully:', memeId)
      
      // Navigate to feed
      router.push('/')
    } catch (err) {
      console.error('Failed to post meme:', err)
      alert('Failed to post meme: ' + err.message)
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className={styles.createPage}>
      <div className={styles.pageBody}>
        <aside className={styles.leftPanel}>
          <ImageSelector
            onImageSelect={setSelectedImage}
            selectedImage={selectedImage}
          />
        </aside>

        <main className={styles.canvasMain}>
          <div className={styles.canvasContainer}>
            <MemeCanvas
              ref={canvasRef}
              image={selectedImage}
              textBlocks={textBlocks}
              selectedTextId={selectedTextId}
              onSelectText={setSelectedTextId}
              onMoveText={updateBlock}
              onResizeText={(id, fontSize) => updateBlock(id, { fontSize })}
              onContentChange={(id, content) => updateBlock(id, { content })}
              onCanvasClick={addTextBlock}
              fontFamily={fontFamily}
              textSize={textSize}
              textColor={textColor}
              borderColor={borderColor}
            />
          </div>
        </main>
      </div>

      <footer className={styles.toolbar}>
        <BottomToolbar
          fontFamily={fontFamily}
          onFontChange={setFontFamily}
          selectedBlock={selectedBlock}
          onDeleteBlock={selectedBlock ? () => removeTextBlock(selectedBlock.id) : null}
          textSize={selectedBlock ? (selectedBlock.fontSize ?? textSize) : textSize}
          textColor={textColor}
          borderColor={borderColor}
          onTextSizeChange={(size) => {
            if (selectedBlock) {
              updateBlock(selectedBlock.id, { fontSize: size })
            } else {
              setTextSize(size)
            }
          }}
          onTextColorChange={setTextColor}
          onBorderColorChange={setBorderColor}
          onDownload={handleDownload}
          onPost={handlePost}
          hasImage={!!selectedImage}
          isPosting={isPosting}
        />
      </footer>
    </div>
  )
}
