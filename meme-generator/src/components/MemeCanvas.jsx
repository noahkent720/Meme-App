import { useEffect, useRef, useState, forwardRef } from 'react'
import './MemeCanvas.css'

const MemeCanvas = forwardRef((props, ref) => {
  const {
    image,
    textBlocks,
    selectedTextId,
    onSelectText,
    onMoveText,
    textSize,
    textColor,
    borderColor
  } = props
  const overlayRef = useRef(null)
  const [draggingId, setDraggingId] = useState(null)
  const dragStartRef = useRef({ x: 0, y: 0, blockX: 0, blockY: 0 })

  // Export canvas: draw image + all text at current positions
  useEffect(() => {
    if (!ref?.current || !image) return

    const canvas = ref.current
    const ctx = canvas.getContext('2d')

    canvas.width = image.width
    canvas.height = image.height
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    const strokeW = Math.ceil(textSize / 15)
    ctx.font = `bold ${textSize}px Impact, sans-serif`
    ctx.fillStyle = textColor
    ctx.strokeStyle = borderColor
    ctx.lineWidth = strokeW
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    textBlocks.forEach((block) => {
      if (!block.content) return
      const px = block.x * canvas.width
      const py = block.y * canvas.height
      const text = block.content.toUpperCase()
      ctx.strokeText(text, px, py)
      ctx.fillText(text, px, py)
    })
  }, [image, textBlocks, textSize, textColor, borderColor, ref])

  const handleDragStart = (e, block) => {
    e.preventDefault()
    if (!overlayRef.current) return
    const rect = overlayRef.current.getBoundingClientRect()
    setDraggingId(block.id)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      blockX: block.x,
      blockY: block.y
    }
  }

  const handleDragMove = (e) => {
    if (draggingId === null || !overlayRef.current) return
    const rect = overlayRef.current.getBoundingClientRect()
    const dx = (e.clientX - dragStartRef.current.x) / rect.width
    const dy = (e.clientY - dragStartRef.current.y) / rect.height
    const newX = Math.max(0, Math.min(1, dragStartRef.current.blockX + dx))
    const newY = Math.max(0, Math.min(1, dragStartRef.current.blockY + dy))
    onMoveText(draggingId, { x: newX, y: newY })
    dragStartRef.current = {
      ...dragStartRef.current,
      x: e.clientX,
      y: e.clientY,
      blockX: newX,
      blockY: newY
    }
  }

  const handleDragEnd = () => {
    setDraggingId(null)
  }

  useEffect(() => {
    if (!draggingId) return
    window.addEventListener('mousemove', handleDragMove)
    window.addEventListener('mouseup', handleDragEnd)
    return () => {
      window.removeEventListener('mousemove', handleDragMove)
      window.removeEventListener('mouseup', handleDragEnd)
    }
  }, [draggingId])

  if (!image) {
    return (
      <div className="meme-canvas">
        <div className="canvas-placeholder">
          <p>Select a template on the left to start</p>
        </div>
        <canvas ref={ref} style={{ display: 'none' }} />
      </div>
    )
  }

  return (
    <div className="meme-canvas">
      <div className="meme-display" ref={overlayRef}>
        <img
          src={image.src}
          alt="Meme"
          className="meme-image"
        />
        <div className="meme-overlay">
          {textBlocks.map((block) => (
            <div
              key={block.id}
              className={`meme-text-block ${selectedTextId === block.id ? 'selected' : ''} ${draggingId === block.id ? 'dragging' : ''}`}
              style={{
                left: `${block.x * 100}%`,
                top: `${block.y * 100}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: `${textSize}px`,
                color: textColor,
                WebkitTextStroke: `${Math.ceil(textSize / 15)}px ${borderColor}`,
                paintOrder: 'stroke fill'
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                onSelectText(block.id)
                handleDragStart(e, block)
              }}
            >
              {block.content ? block.content.toUpperCase() : (block.id === 'top' ? 'Top text' : 'Bottom text')}
            </div>
          ))}
        </div>
      </div>
      <canvas ref={ref} className="export-canvas" aria-hidden="true" />
    </div>
  )
})

MemeCanvas.displayName = 'MemeCanvas'

export default MemeCanvas
