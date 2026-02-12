import { useState, useRef } from 'react'
import ImageSelector from './components/ImageSelector'
import MemeCanvas from './components/MemeCanvas'
import BottomToolbar from './components/BottomToolbar'
import './App.css'

const DEFAULT_FONT = 'Impact, sans-serif'

function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [textBlocks, setTextBlocks] = useState([])
  const [selectedTextId, setSelectedTextId] = useState(null)
  const [fontFamily, setFontFamily] = useState(DEFAULT_FONT)
  const [textSize, setTextSize] = useState(50)
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [borderColor, setBorderColor] = useState('#000000')
  const canvasRef = useRef(null)

  const selectedBlock = textBlocks.find(b => b.id === selectedTextId)
  const updateBlock = (id, updates) => {
    setTextBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  const addTextBlock = (x, y) => {
    const id = crypto.randomUUID()
    setTextBlocks(prev => [...prev, { id, content: '', x, y, fontSize: textSize }])
    setSelectedTextId(id)
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

  return (
    <div className="app">
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

      <footer className="toolbar">
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
          hasImage={!!selectedImage}
        />
      </footer>
    </div>
  )
}

export default App
