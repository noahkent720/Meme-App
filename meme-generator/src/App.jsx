import { useState, useRef } from 'react'
import ImageSelector from './components/ImageSelector'
import MemeCanvas from './components/MemeCanvas'
import TextControls from './components/TextControls'
import './App.css'

const defaultTextBlocks = [
  { id: 'top', content: '', x: 0.5, y: 0.08 },
  { id: 'bottom', content: '', x: 0.5, y: 0.92 }
]

function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [textBlocks, setTextBlocks] = useState(defaultTextBlocks)
  const [selectedTextId, setSelectedTextId] = useState('top')
  const [textSize, setTextSize] = useState(50)
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [borderColor, setBorderColor] = useState('#000000')
  const canvasRef = useRef(null)

  const selectedBlock = textBlocks.find(b => b.id === selectedTextId)
  const updateBlock = (id, updates) => {
    setTextBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
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

  return (
    <div className="app">
      <header className="app-header">
        <h1>Meme Generator</h1>
        <p>Create awesome memes with custom text</p>
      </header>

      <div className="app-body">
        <aside className="left-panel">
          <ImageSelector
            onImageSelect={setSelectedImage}
            selectedImage={selectedImage}
          />
        </aside>

        <main className="canvas-main">
          <div className="canvas-container">
            <MemeCanvas
              ref={canvasRef}
              image={selectedImage}
              textBlocks={textBlocks}
              selectedTextId={selectedTextId}
              onSelectText={setSelectedTextId}
              onMoveText={updateBlock}
              textSize={textSize}
              textColor={textColor}
              borderColor={borderColor}
            />
          </div>
        </main>
      </div>

      <footer className="toolbar">
        <TextControls
          textBlocks={textBlocks}
          selectedTextId={selectedTextId}
          selectedBlock={selectedBlock}
          onSelectText={setSelectedTextId}
          onContentChange={(content) => selectedBlock && updateBlock(selectedBlock.id, { content })}
          textSize={textSize}
          textColor={textColor}
          borderColor={borderColor}
          onTextSizeChange={setTextSize}
          onTextColorChange={setTextColor}
          onBorderColorChange={setBorderColor}
          onDownload={handleDownload}
          hasImage={!!selectedImage}
        />
      </footer>
    </div>
  )
}

export default App
