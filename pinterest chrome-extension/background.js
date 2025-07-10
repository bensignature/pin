// Background script for Bulk Pinterest Pin Saver
/* global chrome */

// Extension installation/update handling
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    console.log('Bulk Pinterest Pin Saver installed');
    
    // Open welcome page or instructions
    chrome.tabs.create({
      url: chrome.runtime.getURL('popup.html')
    });
  } else if (details.reason === 'update') {
    console.log('Bulk Pinterest Pin Saver updated');
  }
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'openPinterestSave') {
    // Open Pinterest save URL in new tab
    chrome.tabs.create({
      url: request.url,
      active: false
    });
    
    sendResponse({success: true});
  }
  
  if (request.action === 'bulkSave') {
    // Handle bulk save operation
    const { images, description, currentUrl } = request;
    
    // Process images with delay to prevent browser blocking
    images.forEach((imageUrl, index) => {
      setTimeout(() => {
        const pinterestUrl = `https://pinterest.com/pin/create/bookmarklet/?media=${encodeURIComponent(imageUrl)}&url=${encodeURIComponent(currentUrl)}&description=${encodeURIComponent(description)}`;
        
        chrome.tabs.create({
          url: pinterestUrl,
          active: false
        });
      }, index * 500); // 500ms delay between each tab
    });
    
    sendResponse({success: true, count: images.length});
  }
  
  return true; // Keep message channel open for async response
});

// Handle extension icon click
chrome.action.onClicked.addListener(function(tab) {
  // This will be handled by the popup, but we can add fallback logic here
  console.log('Extension icon clicked on tab:', tab.url);
});

// Monitor tab updates to refresh content script if needed
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if we need to reinject content script
    if (!tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
      // Content script should auto-inject via manifest, but we can add logic here if needed
      console.log('Page loaded:', tab.url);
    }
  }
});

// Handle context menu (optional feature)
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === 'bulk-pin-save') {
    // Send message to content script to open sidebar
    chrome.tabs.sendMessage(tab.id, {action: 'openSidebar'});
  }
});

// Create context menu
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: 'bulk-pin-save',
    title: 'Bulk Save Images to Pinterest',
    contexts: ['page']
  });
});