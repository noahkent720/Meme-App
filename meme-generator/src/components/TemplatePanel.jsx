import { useState, useEffect } from 'react'
import { memeTemplates } from '../assets/templates/placeholder'
import './TemplatePanel.css'

function TemplatePanel({ onImageSelect, selectedImage }) {
  const [uploadError, setUploadError] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)

  useEffect(() => {
    if (!selectedImage) setSelectedTemplateId(null)
  }, [selectedImage])

  const handleTemplateSelect = (template) => {
    setUploadError('')
    const img = new Image()
    img.src = template.url
    img.onload = () => {
      setSelectedTemplateId(template.id)
      onImageSelect(img)
    }
    img.onerror = () => {
      setUploadError(`Failed to load: ${template.name}`)
      setSelectedTemplateId(null)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    if (!validTypes.includes(file.type)) {
      setUploadError('Use JPG, PNG, or GIF')
      return
    }
    setUploadError('')
    setSelectedTemplateId(null)
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => onImageSelect(img)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="template-panel">
      <div className="template-panel-header">Templates</div>
      <label className="upload-btn">
        Upload image
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </label>
      {uploadError && <p className="template-panel-error">{uploadError}</p>}
      <div className="templates-list">
        {memeTemplates.map((template) => (
          <button
            key={template.id}
            type="button"
            className={`template-thumb ${selectedTemplateId === template.id ? 'selected' : ''}`}
            onClick={() => handleTemplateSelect(template)}
          >
            <img src={template.url} alt={template.name} loading="lazy" />
            <span>{template.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TemplatePanel
