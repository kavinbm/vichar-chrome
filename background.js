
/**
 * Vichar Background Script
 */

// Initial setup when extension is installed or updated
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // First time installation
    console.log('Vichar extension installed');
    
    // Initialize storage with empty prompts array
    chrome.storage.local.set({ 
      'vichar_data': { 
        prompts: [],
        settings: {
          autoDetectInputs: true
        }
      } 
    });
  }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle any background script messages here if needed
  return false;
});
