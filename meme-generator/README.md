# 🎨 Meme Generator

A modern, easy-to-use meme generator built with React and Vite. Create custom memes with text overlays on images!

## ✨ Features

- **Image Selection**: Choose from predefined meme templates or upload your own images
- **Customizable Text**: Add top and bottom text with classic meme styling
- **Resizable Text**: Adjust text size from 20px to 80px using a slider
- **Color Customization**: Choose any color for the text and border using color pickers
- **Professional Styling**: Customizable text and border colors for maximum readability
- **Download Memes**: Export your creations as PNG files
- **Responsive Design**: Works great on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Navigate to the project directory:
```bash
cd meme-generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## 🎯 How to Use

1. **Select an Image**:
   - Click on a predefined template, OR
   - Click "Upload Custom Image" to use your own image

2. **Add Text**:
   - Enter text in the "Top Text" field
   - Enter text in the "Bottom Text" field
   - Use the slider to adjust text size
   - Click the text color picker to change the text color
   - Click the border color picker to change the border color

3. **Download Your Meme**:
   - Click the "Download Meme" button to save your creation

## 🛠️ Built With

- **React** - UI framework
- **Vite** - Build tool and dev server
- **HTML5 Canvas** - For image manipulation and text rendering
- **CSS3** - Modern styling with gradients and animations

## 📁 Project Structure

```
meme-generator/
├── src/
│   ├── components/
│   │   ├── ImageSelector.jsx    # Image selection UI
│   │   ├── ImageSelector.css
│   │   ├── MemeCanvas.jsx        # Canvas rendering
│   │   ├── MemeCanvas.css
│   │   ├── TextControls.jsx      # Text input controls
│   │   └── TextControls.css
│   ├── assets/
│   │   └── templates/
│   │       └── placeholder.js    # Predefined meme templates
│   ├── App.jsx                   # Main app component
│   ├── App.css                   # Main app styles
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Text Styling

The meme generator provides full control over text appearance:
- **Font**: Impact (sans-serif fallback)
- **Color**: Customizable via color picker (default: white)
- **Border**: Customizable via color picker (default: black)
- **Format**: Uppercase
- **Size**: Adjustable from 20px to 80px

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 📝 License

This project is open source and available for personal and educational use.

## 🤝 Contributing

Feel free to fork this project and add your own improvements!

## 💡 Tips

- Use high-contrast images for best text readability
- Keep text short and punchy for maximum impact
- The classic meme format uses ALL CAPS automatically
- Experiment with different text and border color combinations for unique styles
- High contrast between text and border colors works best
- Supported image formats: JPG, PNG, GIF

Enjoy creating memes!
