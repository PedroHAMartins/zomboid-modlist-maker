# Zomboid Modlist Helper

A Chrome extension that helps you create and manage modlists for Project Zomboid by adding mods directly from Steam Workshop pages. Easily create a txt file that helps you place ModID, WorkshopID and Maps strings into the .ini of your server or SP.

## Features

- 🎯 **One-click mod addition**: Add mods to your list directly from Steam Workshop pages
- 📋 **Modlist management**: View, organize, and manage your collected mods
- 📥 **Export functionality**: Export your modlist as a text file
- 🏷️ **Mod information**: Automatically extracts mod data.
- 💾 **Persistent storage**: Your modlist is saved locally and persists between sessions

## How it Works

1. **Install the extension** in your Chrome browser
2. **Navigate to Steam Workshop** pages for Project Zomboid mods
3. **Click "Add to Modlist"** buttons that appear on mod pages
4. **Manage your modlist** through the extension popup
5. **Export your list** when you're ready to use it

## Installation

### Development Installation

1. Clone this repository:

   ```bash
   git clone <your-repo-url>
   cd zomboid-modlist-maker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the extension:

   ```bash
   npm run build:extension
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` folder

### Production Installation

1. Build the extension:

   ```bash
   npm run build:extension
   ```

2. The built extension will be in the `dist` folder, ready for packaging or distribution.

## Usage

### Adding Mods

1. Visit Project Zomboid modlist on Steam Workshop
2. Look for the "Add to Modlist" button that appears below the mod
3. Click the button to add the mod to your list
4. The button will show a success message when the mod is added

### Managing Your Modlist

1. Click the extension icon in your Chrome toolbar
2. View all your collected mods in the popup
3. Remove individual mods using the ✕ button
4. Clear your entire list using the "Clear All" button
5. Export your modlist as a text file using the "Export List" button

### Supported Pages

The extension works on:

- Individual mod pages: `https://steamcommunity.com/sharedfiles/filedetails/?id=*`
- Workshop browse pages: `https://steamcommunity.com/workshop/browse/?appid=108600*`

## Development

### Project Structure

```
src/
├── App.tsx              # Main popup UI component
├── main.tsx             # React entry point
├── types/
│   └── chrome.d.ts      # Chrome extension API types
public/
├── manifest.json        # Extension manifest
├── content.js           # Content script for Steam pages
├── background.js        # Background service worker
└── 128x128.png         # Extension icon
scripts/
└── build-extension.js   # Build script for copying files
```

### Building

```bash
# Development build
npm run dev

# Production build
npm run build:extension

# Lint code
npm run lint
```

### Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Chrome Extension APIs** - Browser integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
