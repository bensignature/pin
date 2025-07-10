# Installation and Testing Guide

## How to Install the Chrome Extension

### For Development/Testing:

1. **Download the Extension**
   - Copy the entire `/app/chrome-extension/` folder to your computer
   - Or download it as a ZIP file and extract it

2. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or go to Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner
   - This allows you to load unpacked extensions

4. **Load the Extension**
   - Click "Load unpacked" button
   - Select the folder containing the extension files (`chrome-extension` folder)
   - The extension should now appear in your extensions list

5. **Verify Installation**
   - You should see "Bulk Pinterest Pin Saver" in your extensions list
   - The Pinterest icon should appear in your browser toolbar
   - The extension should be enabled by default

## How to Test the Extension

### Prerequisites:
- Make sure you're logged into Pinterest in your browser
- Navigate to any website with images (e.g., unsplash.com, shopping sites, image galleries)

### Testing Steps:

1. **Open a Website with Images**
   - Go to a website like unsplash.com, pinterest.com, or any e-commerce site
   - Make sure the page has loaded completely

2. **Open the Extension**
   - Method 1: Click the red Pinterest button that appears in the top-right corner of the webpage
   - Method 2: Click the extension icon in your browser toolbar, then click "Open Sidebar"

3. **Test Image Selection**
   - The sidebar should slide in from the right
   - You should see the number of images found on the page
   - Click "Select All Images" to select all images
   - Images should be highlighted with a blue outline

4. **Test Bulk Save**
   - Add an optional description in the text area
   - Click "Save to Pinterest"
   - Multiple Pinterest tabs should open, each with a save dialog for an image
   - You should see a progress bar during the save process

5. **Test Individual Features**
   - Try hovering over images (they should highlight in red)
   - Try removing individual images from the selection
   - Test the "Clear Selection" button
   - Test closing and reopening the sidebar

### Expected Behavior:

- **Image Detection**: Extension should find all images larger than 100x100 pixels
- **Visual Feedback**: Images should highlight on hover and when selected
- **Bulk Save**: Should open Pinterest save dialogs for all selected images
- **Progress Tracking**: Should show progress during bulk save operation
- **Responsive Design**: Should work on different screen sizes

### Troubleshooting:

1. **Extension Not Appearing**
   - Check that Developer mode is enabled
   - Try reloading the extension in `chrome://extensions/`
   - Check the browser console for errors

2. **Images Not Detected**
   - Make sure the page has fully loaded
   - Check that images are larger than 100x100 pixels
   - Refresh the page and try again

3. **Pinterest Save Not Working**
   - Ensure you're logged into Pinterest
   - Check that popup blockers are disabled
   - Try testing on a different website

4. **Sidebar Not Opening**
   - Check browser console for JavaScript errors
   - Try refreshing the page
   - Ensure the extension has permission to run on the current site

### Test Websites:

Good websites to test the extension:
- unsplash.com (lots of high-quality images)
- pexels.com (photography site)
- amazon.com (product images)
- etsy.com (product images)
- Any Pinterest board (ironically!)

### Browser Compatibility:

- Chrome 88+
- Microsoft Edge 88+
- Other Chromium-based browsers

### Development Notes:

- The extension uses Chrome's Manifest V3
- Content scripts auto-inject on all web pages
- Uses Pinterest's official bookmarklet URL format
- No external servers or APIs required