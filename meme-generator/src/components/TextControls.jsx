import './TextControls.css'

function TextControls({
  textBlocks,
  selectedTextId,
  selectedBlock,
  onSelectText,
  onContentChange,
  textSize,
  textColor,
  borderColor,
  onTextSizeChange,
  onTextColorChange,
  onBorderColorChange,
  onDownload,
  hasImage
}) {
  return (
    <div className="toolbar-inner">
      <div className="toolbar-group text-select-group">
        <span className="toolbar-label">Text</span>
        <div className="text-tabs">
          {textBlocks.map((block) => (
            <button
              key={block.id}
              type="button"
              className={`text-tab ${selectedTextId === block.id ? 'active' : ''}`}
              onClick={() => onSelectText(block.id)}
            >
              {block.id === 'top' ? 'Top' : 'Bottom'}
            </button>
          ))}
        </div>
        <input
          type="text"
          className="toolbar-text-input"
          value={selectedBlock?.content ?? ''}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder={selectedTextId === 'top' ? 'Top text...' : 'Bottom text...'}
          maxLength={100}
        />
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <label htmlFor="toolbar-size" className="toolbar-label">
          Size
        </label>
        <div className="toolbar-size-row">
          <input
            id="toolbar-size"
            type="range"
            min="20"
            max="80"
            value={textSize}
            onChange={(e) => onTextSizeChange(Number(e.target.value))}
          />
          <span className="toolbar-size-value">{textSize}px</span>
        </div>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group toolbar-colors">
        <div className="toolbar-color-field">
          <label htmlFor="toolbar-text-color" className="toolbar-label">Text</label>
          <div className="color-input-wrapper">
            <input
              id="toolbar-text-color"
              type="color"
              value={textColor}
              onChange={(e) => onTextColorChange(e.target.value)}
            />
            <span className="color-value">{textColor}</span>
          </div>
        </div>
        <div className="toolbar-color-field">
          <label htmlFor="toolbar-border-color" className="toolbar-label">Border</label>
          <div className="color-input-wrapper">
            <input
              id="toolbar-border-color"
              type="color"
              value={borderColor}
              onChange={(e) => onBorderColorChange(e.target.value)}
            />
            <span className="color-value">{borderColor}</span>
          </div>
        </div>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group toolbar-actions">
        <button
          type="button"
          className="download-btn"
          onClick={onDownload}
          disabled={!hasImage}
        >
          Download
        </button>
      </div>
    </div>
  )
}

export default TextControls
