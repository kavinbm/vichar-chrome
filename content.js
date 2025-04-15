/**
 * PromptPal Content Script
 * 
 * This script is injected into web pages to detect LLM input fields
 * and provide paste functionality for prompts.
 */

// Keep track of the current active input
let activeInput = null;

// List of supported LLM platforms and their input selectors
const SUPPORTED_PLATFORMS = [
  // ChatGPT
  {
    host: 'chat.openai.com',
    selectors: [
      'textarea[data-id="root"]',
      'div[contenteditable="true"]'
    ]
  },
  // Claude
  {
    host: 'claude.ai',
    selectors: [
      'div[contenteditable="true"]'
    ]
  },
  // Bard
  {
    host: 'bard.google.com',
    selectors: [
      'textarea[placeholder]'
    ]
  },
  // Anthropic
  {
    host: 'console.anthropic.com',
    selectors: [
      'div[contenteditable="true"]'
    ]
  },
  // Generics (common input types)
  {
    host: '*',
    selectors: [
      'textarea',
      'div[contenteditable="true"]',
      'input[type="text"]'
    ]
  }
];

/**
 * Initialize the content script
 */
function init() {
  // Set up listeners for messages from the popup
  chrome.runtime.onMessage.addListener(handleMessage);

  // Observe the DOM for added nodes to detect dynamically loaded inputs
  setupObserver();

  // Detect input fields on initial load
  detectInputFields();

  // Set up listener for user focus on input elements
  document.addEventListener('focusin', handleFocusIn);
}

/**
 * Handle messages from the popup or background script
 * @param {Object} message Message received
 * @param {Object} sender Sender information
 * @param {Function} sendResponse Response callback
 */
function handleMessage(message, sender, sendResponse) {
  if (message.action === 'promptCopied') {
    // Check if we have an active input field
    if (activeInput) {
      pasteToInput(activeInput, message.text);
      return true;
    }
  }
  return false;
}

/**
 * Set up mutation observer to watch for newly added input fields
 */
function setupObserver() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        detectInputFields();
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/**
 * Detect LLM input fields on the page
 */
function detectInputFields() {
  const currentHost = window.location.hostname;
  
  // Try all platform selectors, starting with platform-specific ones
  for (const platform of SUPPORTED_PLATFORMS) {
    if (platform.host === '*' || currentHost.includes(platform.host)) {
      for (const selector of platform.selectors) {
        const inputs = document.querySelectorAll(selector);
        
        for (const input of inputs) {
          // Skip inputs that are too small (likely not main input fields)
          const rect = input.getBoundingClientRect();
          if (rect.width < 200 || rect.height < 30) {
            continue;
          }
          
          // Add special class and data attribute to identified inputs
          input.classList.add('promptpal-detected-input');
          input.dataset.promptpalDetected = 'true';
        }
      }
    }
  }
}

/**
 * Handle when an input receives focus
 * @param {Event} e Focus event
 */
function handleFocusIn(e) {
  const input = e.target;
  
  // Check if this is a detected input
  if (input.classList.contains('promptpal-detected-input') || 
      input.dataset.promptpalDetected === 'true') {
    activeInput = input;
  }
}

/**
 * Paste text into an input field
 * @param {Element} input Input element
 * @param {string} text Text to paste
 */
function pasteToInput(input, text) {
  // Handle different types of inputs
  if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
    // Standard input/textarea
    const originalValue = input.value;
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;
    
    // Insert text at cursor position
    input.value = originalValue.substring(0, selectionStart) + 
                  text + 
                  originalValue.substring(selectionEnd);
    
    // Set cursor position after inserted text
    input.selectionStart = input.selectionEnd = selectionStart + text.length;
    
    // Trigger change event
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
  } else if (input.getAttribute('contenteditable') === 'true') {
    // Contenteditable div
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    // Create text node with the prompt
    const textNode = document.createTextNode(text);
    
    // Delete any selected text and insert new text
    range.deleteContents();
    range.insertNode(textNode);
    
    // Move cursor to end of inserted text
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Trigger input event
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
  }
  
  // Focus the input
  input.focus();
}

// Initialize the content script
init();
