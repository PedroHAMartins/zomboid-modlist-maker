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
├── App.tsx              # Main popup UI component (refactored to use components)
├── main.tsx             # React entry point
├── components/          # Reusable UI components
│   ├── index.ts         # Component exports
│   ├── Header.tsx       # Extension header with title and description
│   ├── SteamPageWarning.tsx  # Warning message for non-Steam pages
│   ├── ActionButtons.tsx     # Export and clear action buttons
│   ├── ModList.tsx      # Container for displaying mod collection
│   ├── ModItem.tsx      # Individual mod display component
│   └── EmptyState.tsx   # Empty state when no mods are present
├── hooks/               # Custom React hooks
│   ├── useChromeExtension.ts  # Chrome extension API integration
│   └── useModlistOperations.ts # Modlist management operations
├── types/               # TypeScript type definitions
│   ├── index.ts         # Shared types and interfaces
│   └── chrome.d.ts      # Chrome extension API types
├── App.css              # Main application styles
└── index.css            # Global styles
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

### Architecture

The project follows a componentized architecture with clear separation of concerns:

#### Components

- **Header**: Displays the extension title and description
- **SteamPageWarning**: Shows a warning when not on Steam Workshop pages
- **ActionButtons**: Handles export and clear operations
- **ModList**: Container component that manages the mod collection display
- **ModItem**: Individual mod display with mod IDs, map folders, and actions
- **EmptyState**: Displays when no mods are present

#### Custom Hooks

- **useChromeExtension**: Manages Chrome extension APIs, storage, and messaging
- **useModlistOperations**: Handles modlist operations like export, clear, and remove

#### Type Safety

- Shared TypeScript interfaces in `types/index.ts`
- Chrome extension API types in `types/chrome.d.ts`
- Proper typing throughout all components and hooks

### Technologies Used

- **React 19** - UI framework with hooks and functional components
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Vite** - Fast build tool and development server
- **Chrome Extension APIs** - Browser integration for storage and messaging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
