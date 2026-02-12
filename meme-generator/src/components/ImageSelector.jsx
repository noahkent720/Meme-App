import { useState, useEffect } from 'react'
import { memeTemplates } from '../assets/templates/placeholder'
import './ImageSelector.css'

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
    // template.url is now an imported module URL from Vite
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
    <div className="image-selector">
      <h2>Select Image</h2>
      
      <div className="upload-section">
        <label htmlFor="file-upload" className="upload-btn">
          Upload Custom Image
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        {uploadError && <p className="error-message">{uploadError}</p>}
      </div>

      <div className="divider">
        <span>OR</span>
      </div>

      <h3>Choose Template</h3>
      <div className="templates-grid">
        {memeTemplates.map((template) => (
          <button
            key={template.id}
            className={`template-btn ${selectedTemplateId === template.id ? 'selected' : ''}`}
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
              onError={(e) => {
                console.error('Image error for:', template.url, e)
              }}
              onLoad={() => {
                console.log('Image loaded:', template.url)
              }}
            />
            <span className="template-name">{template.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ImageSelector
