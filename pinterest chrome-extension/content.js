// Bulk Pinterest Pin Saver - Content Script
/* global chrome */

class BulkPinSaver {
  constructor() {
    this.images = [];
    this.sidebarOpen = false;
    this.selectedImages = new Set();
    this.init();
  }

  init() {
    this.createSidebar();
    this.setupEventListeners();
    this.scanForImages();
  }

  createSidebar() {
    // Create sidebar container
    this.sidebar = document.createElement('div');
    this.sidebar.id = 'bulk-pin-sidebar';
    this.sidebar.className = 'bulk-pin-sidebar';
    
    this.sidebar.innerHTML = `
      <div class="sidebar-header">
        <h3>Bulk Pin Saver</h3>
        <button id="close-sidebar" class="close-btn">&times;</button>
      </div>
      
      <div class="sidebar-content">
        <div class="stats-section">
          <p>Found <span id="total-images">0</span> images on this page</p>
        </div>
        
        <div class="actions-section">
          <button id="select-all-btn" class="action-btn primary">Select All Images</button>
          <button id="clear-selection-btn" class="action-btn secondary">Clear Selection</button>
        </div>
        
        <div class="selected-section">
          <h4>Selected Images: <span id="selected-count">0</span></h4>
          <div id="selected-images-list" class="selected-images-list"></div>
        </div>
        
        <div class="description-section">
          <label for="bulk-description">Description (optional):</label>
          <textarea id="bulk-description" placeholder="Add a description for all selected images..."></textarea>
        </div>
        
        <div class="save-section">
          <button id="bulk-save-btn" class="action-btn save-btn" disabled>Save to Pinterest</button>
          <div id="save-progress" class="save-progress hidden">
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <p class="progress-text">Saving images...</p>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.sidebar);
  }

  setupEventListeners() {
    // Toggle sidebar
    this.createToggleButton();
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'openSidebar') {
        this.toggleSidebar();
        sendResponse({success: true});
      }
    });
    
    // Sidebar controls
    document.getElementById('close-sidebar').addEventListener('click', () => {
      this.toggleSidebar();
    });
    
    document.getElementById('select-all-btn').addEventListener('click', () => {
      this.selectAllImages();
    });
    
    document.getElementById('clear-selection-btn').addEventListener('click', () => {
      this.clearSelection();
    });
    
    document.getElementById('bulk-save-btn').addEventListener('click', () => {
      this.bulkSaveToPinterest();
    });
    
    // Image hover effects
    document.addEventListener('mouseover', (e) => {
      if (e.target.tagName === 'IMG') {
        this.highlightImage(e.target);
      }
    });
    
    document.addEventListener('mouseout', (e) => {
      if (e.target.tagName === 'IMG') {
        this.removeHighlight(e.target);
      }
    });
  }

  createToggleButton() {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'bulk-pin-toggle';
    toggleBtn.className = 'bulk-pin-toggle';
    toggleBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
      </svg>
    `;
    toggleBtn.title = 'Bulk Pin Saver';
    toggleBtn.addEventListener('click', () => {
      this.toggleSidebar();
    });
    
    document.body.appendChild(toggleBtn);
  }

  scanForImages() {
    const allImages = document.querySelectorAll('img');
    this.images = Array.from(allImages).filter(img => {
      // Filter out small images (likely icons/thumbnails)
      return img.naturalWidth > 100 && img.naturalHeight > 100 && 
             img.src && !img.src.includes('data:image');
    });
    
    this.updateImageCount();
  }

  updateImageCount() {
    const totalElement = document.getElementById('total-images');
    if (totalElement) {
      totalElement.textContent = this.images.length;
    }
  }

  selectAllImages() {
    this.selectedImages.clear();
    this.images.forEach(img => {
      this.selectedImages.add(img);
      img.classList.add('bulk-pin-selected');
    });
    this.updateSelectedCount();
    this.updateSelectedImagesList();
  }

  clearSelection() {
    this.selectedImages.clear();
    this.images.forEach(img => {
      img.classList.remove('bulk-pin-selected');
    });
    this.updateSelectedCount();
    this.updateSelectedImagesList();
  }

  updateSelectedCount() {
    const countElement = document.getElementById('selected-count');
    const saveBtn = document.getElementById('bulk-save-btn');
    
    if (countElement) {
      countElement.textContent = this.selectedImages.size;
    }
    
    if (saveBtn) {
      saveBtn.disabled = this.selectedImages.size === 0;
    }
  }

  updateSelectedImagesList() {
    const listElement = document.getElementById('selected-images-list');
    if (!listElement) return;
    
    listElement.innerHTML = '';
    
    Array.from(this.selectedImages).slice(0, 5).forEach(img => {
      const imgPreview = document.createElement('div');
      imgPreview.className = 'selected-image-preview';
      imgPreview.innerHTML = `
        <img src="${img.src}" alt="Selected image">
        <button class="remove-btn" data-src="${img.src}">&times;</button>
      `;
      
      const removeBtn = imgPreview.querySelector('.remove-btn');
      removeBtn.addEventListener('click', () => {
        this.removeFromSelection(img);
      });
      
      listElement.appendChild(imgPreview);
    });
    
    if (this.selectedImages.size > 5) {
      const moreElement = document.createElement('div');
      moreElement.className = 'more-images';
      moreElement.textContent = `+${this.selectedImages.size - 5} more`;
      listElement.appendChild(moreElement);
    }
  }

  removeFromSelection(img) {
    this.selectedImages.delete(img);
    img.classList.remove('bulk-pin-selected');
    this.updateSelectedCount();
    this.updateSelectedImagesList();
  }

  highlightImage(img) {
    if (this.images.includes(img)) {
      img.classList.add('bulk-pin-hover');
    }
  }

  removeHighlight(img) {
    img.classList.remove('bulk-pin-hover');
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    this.sidebar.classList.toggle('open', this.sidebarOpen);
    
    if (this.sidebarOpen) {
      this.scanForImages(); // Refresh image list when opening
    }
  }

  async bulkSaveToPinterest() {
    if (this.selectedImages.size === 0) return;
    
    const description = document.getElementById('bulk-description').value || '';
    const currentUrl = window.location.href;
    
    // Show progress
    const progressSection = document.getElementById('save-progress');
    const progressFill = progressSection.querySelector('.progress-fill');
    const progressText = progressSection.querySelector('.progress-text');
    
    progressSection.classList.remove('hidden');
    
    const totalImages = this.selectedImages.size;
    let processedImages = 0;
    
    // Process images in batches to avoid overwhelming the browser
    const batchSize = 3;
    const imageBatches = this.chunkArray(Array.from(this.selectedImages), batchSize);
    
    for (const batch of imageBatches) {
      const batchPromises = batch.map(async (img) => {
        const pinterestUrl = `https://pinterest.com/pin/create/bookmarklet/?media=${encodeURIComponent(img.src)}&url=${encodeURIComponent(currentUrl)}&description=${encodeURIComponent(description)}`;
        
        // Open Pinterest save page in new tab
        window.open(pinterestUrl, '_blank');
        
        processedImages++;
        const progress = (processedImages / totalImages) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Saved ${processedImages}/${totalImages} images`;
        
        // Add delay between opens to prevent browser blocking
        await new Promise(resolve => setTimeout(resolve, 500));
      });
      
      await Promise.all(batchPromises);
      
      // Delay between batches
      if (imageBatches.indexOf(batch) < imageBatches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Hide progress and show success
    setTimeout(() => {
      progressSection.classList.add('hidden');
      progressText.textContent = 'All images saved successfully!';
      progressSection.classList.remove('hidden');
      
      setTimeout(() => {
        progressSection.classList.add('hidden');
      }, 3000);
    }, 1000);
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

// Initialize the extension when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new BulkPinSaver();
  });
} else {
  new BulkPinSaver();
}