// Popup script for Bulk Pinterest Pin Saver
/* global chrome */

document.addEventListener('DOMContentLoaded', function() {
  const openSidebarBtn = document.getElementById('openSidebar');
  
  openSidebarBtn.addEventListener('click', function() {
    // Send message to content script to open sidebar
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'openSidebar'}, function(response) {
        if (chrome.runtime.lastError) {
          console.log('Error sending message:', chrome.runtime.lastError);
        } else {
          // Close popup after opening sidebar
          window.close();
        }
      });
    });
  });
  
  // Update UI based on current tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    const url = currentTab.url;
    
    // Check if we can run on this page
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('edge://')) {
      const status = document.querySelector('.status');
      status.innerHTML = `
        <div style="color: #dc3545;">
          Cannot run on this page
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 10px;">
          This extension cannot run on browser internal pages. 
          Please navigate to a regular website.
        </p>
      `;
      openSidebarBtn.disabled = true;
      openSidebarBtn.style.opacity = '0.5';
    }
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'updatePopup') {
    // Update popup with information from content script
    const statusDiv = document.querySelector('.status');
    if (request.imageCount !== undefined) {
      statusDiv.innerHTML = `
        <div class="status-active">
          Found ${request.imageCount} images on this page
        </div>
        <button class="toggle-btn" id="openSidebar">Open Sidebar</button>
      `;
    }
  }
});