'use client'

import styles from './BottomToolbar.module.css'

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
  onPost,
  hasImage,
  isPosting,
}) {
  return (
    <div className={styles.bottomToolbar}>
      <div className={styles.toolbarGroup}>
        <label className={styles.toolbarLabel}>Font</label>
        <select
          className={styles.toolbarFontSelect}
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
          <div className={styles.toolbarDivider} />
          <button
            type="button"
            className={styles.toolbarDelete}
            onClick={onDeleteBlock}
            title="Remove caption"
          >
            Delete
          </button>
        </>
      )}
      <div className={styles.toolbarDivider} />
      <div className={styles.toolbarGroup}>
        <label htmlFor="toolbar-size" className={styles.toolbarLabel}>Size</label>
        <div className={styles.toolbarSizeRow}>
          <input
            id="toolbar-size"
            type="range"
            min="20"
            max="80"
            value={textSize}
            onChange={(e) => onTextSizeChange(Number(e.target.value))}
          />
          <span className={styles.toolbarSizeValue}>{textSize}px</span>
        </div>
      </div>
      <div className={styles.toolbarDivider} />
      <div className={`${styles.toolbarGroup} ${styles.toolbarGroupColor}`}>
        <label className={styles.toolbarLabel}>Text color</label>
        <input
          type="color"
          value={textColor}
          onChange={(e) => onTextColorChange(e.target.value)}
          className={styles.toolbarColor}
          title="Text color"
        />
      </div>
      <div className={`${styles.toolbarGroup} ${styles.toolbarGroupColor}`}>
        <label className={styles.toolbarLabel}>Border color</label>
        <input
          type="color"
          value={borderColor}
          onChange={(e) => onBorderColorChange(e.target.value)}
          className={styles.toolbarColor}
          title="Border color"
        />
      </div>
      <div className={styles.toolbarDivider} />
      <button
        type="button"
        className={styles.toolbarDownload}
        onClick={onDownload}
        disabled={!hasImage}
        title="Download meme"
      >
        Download
      </button>
      {onPost && (
        <button
          type="button"
          className={styles.toolbarPost}
          onClick={onPost}
          disabled={!hasImage || isPosting}
          title="Post meme to feed"
        >
          {isPosting ? 'Posting...' : 'Post'}
        </button>
      )}
    </div>
  )
}

export default BottomToolbar
