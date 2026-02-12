import './BottomToolbar.css'

const FONT_OPTIONS = [
  { id: 'impact', label: 'Impact', value: 'Impact, sans-serif' },
  { id: 'arial', label: 'Arial', value: 'Arial, sans-serif' },
  { id: 'comic', label: 'Comic Sans', value: '"Comic Sans MS", cursive' },
  { id: 'georgia', label: 'Georgia', value: 'Georgia, serif' },
  { id: 'verdana', label: 'Verdana', value: 'Verdana, sans-serif' },
]

function BottomToolbar({
  fontFamily,
  onFontChange,
  selectedBlock,
  onDeleteBlock,
  textSize,
  textColor,
  borderColor,
  onTextSizeChange,
  onTextColorChange,
  onBorderColorChange,
  onDownload,
  hasImage,
}) {
  return (
    <div className="bottom-toolbar">
      <div className="toolbar-group">
        <label className="toolbar-label">Font</label>
        <select
          className="toolbar-font-select"
          value={fontFamily}
          onChange={(e) => onFontChange(e.target.value)}
          title="Font family"
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font.id} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>
      {selectedBlock && onDeleteBlock && (
        <>
          <div className="toolbar-divider" />
          <button
            type="button"
            className="toolbar-delete"
            onClick={onDeleteBlock}
            title="Remove caption"
          >
            Delete
          </button>
        </>
      )}
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <label htmlFor="toolbar-size" className="toolbar-label">Size</label>
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
      <div className="toolbar-group toolbar-group-color">
        <label className="toolbar-label">Text color</label>
        <input
          type="color"
          value={textColor}
          onChange={(e) => onTextColorChange(e.target.value)}
          className="toolbar-color"
          title="Text color"
        />
      </div>
      <div className="toolbar-group toolbar-group-color">
        <label className="toolbar-label">Border color</label>
        <input
          type="color"
          value={borderColor}
          onChange={(e) => onBorderColorChange(e.target.value)}
          className="toolbar-color"
          title="Border color"
        />
      </div>
      <div className="toolbar-divider" />
      <button
        type="button"
        className="toolbar-download"
        onClick={onDownload}
        disabled={!hasImage}
        title="Download meme"
      >
        Download
      </button>
    </div>
  )
}

export default BottomToolbar
