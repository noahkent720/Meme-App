import { useEffect, useRef, useState, forwardRef } from 'react'
import './MemeCanvas.css'

const MemeCanvas = forwardRef((props, ref) => {
  const {
    image,
    textBlocks,
    selectedTextId,
    onSelectText,
    onMoveText,
    onResizeText,
    onContentChange,
    onCanvasClick,
    fontFamily,
    textSize,
    textColor,
    borderColor
  } = props
  const overlayRef = useRef(null)
  const selectedBlockRef = useRef(null)
  const [draggingId, setDraggingId] = useState(null)
  const [resizingId, setResizingId] = useState(null)
  const dragStartRef = useRef({ x: 0, y: 0, blockX: 0, blockY: 0 })
  const resizeStartRef = useRef({ y: 0, fontSize: 0 })
  const DRAG_THRESHOLD = 5
  const RESIZE_SENSITIVITY = 0.8
  const MIN_FONT_SIZE = 12
  const MAX_FONT_SIZE = 120

  // Export canvas: draw image + all text at current positions
  useEffect(() => {
    if (!ref?.current || !image) return

    const canvas = ref.current
    const ctx = canvas.getContext('2d')

    canvas.width = image.width
    canvas.height = image.height
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    textBlocks.forEach((block) => {
      if (!block.content) return
      const size = block.fontSize ?? textSize
      const lineHeight = size * 1.2
      const strokeW = Math.ceil(size / 15)
      ctx.font = `bold ${size}px ${fontFamily}`
      ctx.fillStyle = textColor
      ctx.strokeStyle = borderColor
      ctx.lineWidth = strokeW
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const px = block.x * canvas.width
      const lines = block.content.toUpperCase().split('\n')
      const totalHeight = lines.length * lineHeight
      let y = block.y * canvas.height - totalHeight / 2 + lineHeight / 2
      lines.forEach((line) => {
        ctx.strokeText(line, px, y)
        ctx.fillText(line, px, y)
        y += lineHeight
      })
    })
  }, [image, textBlocks, textSize, textColor, borderColor, fontFamily, ref])

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
    const dist = Math.hypot(e.clientX - dragStartRef.current.x, e.clientY - dragStartRef.current.y)
    if (dist < DRAG_THRESHOLD) return
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

  const handleResizeStart = (e, block) => {
    e.preventDefault()
    e.stopPropagation()
    const blockFontSize = block.fontSize ?? textSize
    setResizingId(block.id)
    resizeStartRef.current = { y: e.clientY, fontSize: blockFontSize }
  }

  const handleResizeMove = (e) => {
    if (resizingId === null || !onResizeText) return
    const dy = e.clientY - resizeStartRef.current.y
    const delta = dy * RESIZE_SENSITIVITY
    const newSize = Math.round(
      Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, resizeStartRef.current.fontSize + delta))
    )
    onResizeText(resizingId, newSize)
  }

  const handleResizeEnd = () => {
    setResizingId(null)
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

  useEffect(() => {
    if (!resizingId) return
    window.addEventListener('mousemove', handleResizeMove)
    window.addEventListener('mouseup', handleResizeEnd)
    return () => {
      window.removeEventListener('mousemove', handleResizeMove)
      window.removeEventListener('mouseup', handleResizeEnd)
    }
  }, [resizingId])

  // Focus the textarea when a block is selected for immediate typing
  useEffect(() => {
    if (selectedTextId && selectedBlockRef.current) {
      selectedBlockRef.current.focus()
    }
  }, [selectedTextId])

  const handleOverlayClick = (e) => {
    if (e.target !== e.currentTarget || !onCanvasClick) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    onCanvasClick(x, y)
  }

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
        <div
          className="meme-overlay"
          onClick={handleOverlayClick}
          role="presentation"
        >
          {textBlocks.map((block) => {
            const blockFontSize = block.fontSize ?? textSize
            const isSelected = selectedTextId === block.id
            return (
              <div
                key={block.id}
                className={`meme-text-wrapper ${isSelected ? 'selected' : ''} ${draggingId === block.id ? 'dragging' : ''} ${resizingId === block.id ? 'resizing' : ''}`}
                style={{
                  left: `${block.x * 100}%`,
                  top: `${block.y * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {isSelected ? (
                  <textarea
                    ref={selectedBlockRef}
                    className="meme-text-block meme-text-edit"
                    dir="ltr"
                    value={block.content}
                    onChange={(e) => onContentChange?.(block.id, e.target.value)}
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      onSelectText(block.id)
                      handleDragStart(e, block)
                    }}
                    style={{
                      fontSize: `${blockFontSize}px`,
                      fontFamily: fontFamily,
                      color: textColor,
                      WebkitTextStroke: `${Math.ceil(blockFontSize / 15)}px ${borderColor}`,
                      paintOrder: 'stroke fill'
                    }}
                    rows={Math.max(2, (block.content.match(/\n/g) || []).length + 1)}
                    spellCheck={false}
                  />
                ) : (
                  <div
                    className="meme-text-block"
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      onSelectText(block.id)
                      e.currentTarget.focus()
                      handleDragStart(e, block)
                    }}
                    style={{
                      fontSize: `${blockFontSize}px`,
                      fontFamily: fontFamily,
                      color: textColor,
                      WebkitTextStroke: `${Math.ceil(blockFontSize / 15)}px ${borderColor}`,
                      paintOrder: 'stroke fill'
                    }}
                    tabIndex={0}
                  >
                    {block.content || ''}
                  </div>
                )}
                {isSelected && (
                  <span
                    className="resize-handle"
                    onMouseDown={(e) => handleResizeStart(e, block)}
                    title="Drag to resize"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
      <canvas ref={ref} className="export-canvas" aria-hidden="true" />
    </div>
  )
})

MemeCanvas.displayName = 'MemeCanvas'

export default MemeCanvas
