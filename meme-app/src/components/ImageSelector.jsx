'use client'

import { useState, useEffect } from 'react'
import { memeTemplates } from '../data/templates'
import styles from './ImageSelector.module.css'

function ImageSelector({ onImageSelect, selectedImage }) {
  const [uploadError, setUploadError] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)

  // Sync selectedTemplateId with selectedImage when it's cleared externally
  useEffect(() => {
    if (!selectedImage) {
      setSelectedTemplateId(null)
    }
  }, [selectedImage])

  const handleTemplateSelect = (template) => {
    setUploadError('')
    const img = new Image()
    img.src = template.url
    img.onload = () => {
      setSelectedTemplateId(template.id)
      onImageSelect(img)
      setUploadError('')
    }
    img.onerror = () => {
      console.error('Failed to load image:', template.url)
      setUploadError(`Failed to load template: ${template.name}`)
      setSelectedTemplateId(null)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid image file (JPG, PNG, or GIF)')
      return
    }

    setUploadError('')
    setSelectedTemplateId(null)

    // Read file and create image
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        onImageSelect(img)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className={styles.imageSelector}>
      <h2>Select Image</h2>
      
      <div className={styles.uploadSection}>
        <label htmlFor="file-upload" className={styles.uploadBtn}>
          Upload Custom Image
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        {uploadError && <p className={styles.errorMessage}>{uploadError}</p>}
      </div>

      <div className={styles.divider}>
        <span>OR</span>
      </div>

      <h3>Choose Template</h3>
      <div className={styles.templatesGrid}>
        {memeTemplates.map((template) => (
          <button
            key={template.id}
            className={`${styles.templateBtn} ${selectedTemplateId === template.id ? styles.selected : ''}`}
            onClick={() => handleTemplateSelect(template)}
          >
            <img 
              src={template.url} 
              alt={template.name}
              loading="lazy"
              style={{ 
                display: 'block', 
                width: '100%', 
                height: '110px', 
                objectFit: 'cover',
                backgroundColor: '#1a1a1a'
              }}
            />
            <span className={styles.templateName}>{template.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ImageSelector
