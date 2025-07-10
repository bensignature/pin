# Bulk Pinterest Pin Saver - Chrome Extension

A Chrome extension that allows users to bulk save images from any webpage to Pinterest boards with ease.

## Features

- **Bulk Image Selection**: Select all images on a page with one click
- **Pinterest Integration**: Direct integration with Pinterest's save functionality
- **No API Required**: Works by using Pinterest's web interface - just login to Pinterest in your browser
- **Slide-in Sidebar**: Clean, intuitive sidebar interface
- **Optional Descriptions**: Add descriptions to all selected images
- **Progress Tracking**: Visual feedback during bulk save operations
- **Smart Image Filtering**: Automatically filters out small icons and thumbnails
- **Responsive Design**: Works on desktop and mobile layouts

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will now appear in your browser toolbar

## How to Use

1. **Login to Pinterest**: Make sure you're logged into Pinterest in your browser
2. **Navigate to any webpage** with images you want to save
3. **Click the red Pinterest button** in the top-right corner of the page
4. **Select images**: Click "Select All Images" to choose all images on the page
5. **Add description** (optional): Add a description that will be applied to all images
6. **Save to Pinterest**: Click "Save to Pinterest" to bulk save all selected images

## Technical Details

### Files Structure
- `manifest.json` - Extension configuration
- `content.js` - Main content script that runs on web pages
- `background.js` - Background service worker for extension logic
- `popup.html` & `popup.js` - Extension popup interface
- `styles.css` - Styling for the extension UI

### How It Works
1. The content script scans the page for images larger than 100x100 pixels
2. Creates a slide-in sidebar with bulk selection options
3. Uses Pinterest's bookmarklet URL format to save images
4. Opens Pinterest save pages in new tabs for each selected image
5. Includes batching and delays to prevent browser blocking

### Pinterest Save URL Format
```
https://pinterest.com/pin/create/bookmarklet/?media=[IMAGE_URL]&url=[PAGE_URL]&description=[DESCRIPTION]
```

## Permissions

The extension requires the following permissions:
- `activeTab` - Access to the current tab for image detection
- `storage` - Store user preferences and settings
- `scripting` - Inject content scripts
- `https://*/*` & `http://*/*` - Access to all websites for image detection

## Browser Compatibility

- Chrome 88+
- Edge 88+
- Other Chromium-based browsers

## Privacy

- No data is collected or stored outside your browser
- No external servers are used
- Only interacts with Pinterest's official save functionality
- All image processing happens locally

## Limitations

- Requires active Pinterest login in browser
- May not work on sites with strict Content Security Policy
- Cannot access images behind authentication walls
- Limited by Pinterest's rate limiting

## Development

To modify or extend the extension:

1. Make changes to the source files
2. Reload the extension in `chrome://extensions/`
3. Test on various websites

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.