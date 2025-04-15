
/**
 * PromptPal Utility Functions
 */

// Maximum number of prompts that can be stored
const MAX_PROMPTS = 100;

// Local storage key
const STORAGE_KEY = 'promptpal_data';

/**
 * Get all stored prompts
 * @returns {Promise<Array>} Array of prompt objects
 */
function getPrompts() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const data = result[STORAGE_KEY] || { prompts: [] };
      resolve(data.prompts);
    });
  });
}

/**
 * Save a new prompt
 * @param {Object} prompt Prompt object to save
 * @returns {Promise<boolean>} Success state
 */
async function savePrompt(prompt) {
  const prompts = await getPrompts();
  
  // Check if we've reached the storage limit
  if (prompts.length >= MAX_PROMPTS) {
    return Promise.reject(new Error('Storage limit reached. Maximum 100 prompts.'));
  }
  
  // Add the new prompt with a unique ID and timestamp
  const newPrompt = {
    ...prompt,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  prompts.unshift(newPrompt);
  
  return new Promise((resolve) => {
    chrome.storage.local.set({ 
      [STORAGE_KEY]: { prompts } 
    }, () => {
      resolve(true);
    });
  });
}

/**
 * Update an existing prompt
 * @param {string} id Prompt ID to update
 * @param {Object} updatedData New prompt data
 * @returns {Promise<boolean>} Success state
 */
async function updatePrompt(id, updatedData) {
  const prompts = await getPrompts();
  const index = prompts.findIndex(p => p.id === id);
  
  if (index === -1) {
    return Promise.reject(new Error('Prompt not found'));
  }
  
  prompts[index] = {
    ...prompts[index],
    ...updatedData,
    updatedAt: new Date().toISOString()
  };
  
  return new Promise((resolve) => {
    chrome.storage.local.set({ 
      [STORAGE_KEY]: { prompts } 
    }, () => {
      resolve(true);
    });
  });
}

/**
 * Delete a prompt
 * @param {string} id Prompt ID to delete
 * @returns {Promise<boolean>} Success state
 */
async function deletePrompt(id) {
  const prompts = await getPrompts();
  const updatedPrompts = prompts.filter(p => p.id !== id);
  
  return new Promise((resolve) => {
    chrome.storage.local.set({ 
      [STORAGE_KEY]: { prompts: updatedPrompts } 
    }, () => {
      resolve(true);
    });
  });
}

/**
 * Search prompts by query
 * @param {string} query Search query
 * @returns {Promise<Array>} Filtered prompt array
 */
async function searchPrompts(query) {
  if (!query.trim()) {
    return getPrompts();
  }
  
  const prompts = await getPrompts();
  const searchTerm = query.toLowerCase();
  
  // Search in title and content, sort by relevance
  return prompts
    .map(prompt => {
      // Calculate relevance score
      const titleMatch = prompt.title.toLowerCase().includes(searchTerm);
      const contentMatch = prompt.text.toLowerCase().includes(searchTerm);
      
      let score = 0;
      if (titleMatch) score += 3; // Title matches are weighted more
      if (contentMatch) score += 1;
      
      return { ...prompt, score };
    })
    .filter(prompt => prompt.score > 0)
    .sort((a, b) => b.score - a.score); // Sort by relevance score
}

/**
 * Export prompts to JSON file
 * @returns {Promise<string>} JSON data
 */
async function exportPrompts() {
  const prompts = await getPrompts();
  return JSON.stringify({ prompts }, null, 2);
}

/**
 * Import prompts from JSON data
 * @param {string} jsonData JSON string to import
 * @returns {Promise<boolean>} Success state
 */
async function importPrompts(jsonData) {
  try {
    const data = JSON.parse(jsonData);
    
    if (!data.prompts || !Array.isArray(data.prompts)) {
      return Promise.reject(new Error('Invalid data format'));
    }
    
    // Get current prompts
    const currentPrompts = await getPrompts();
    
    // Check if we're exceeding the limit
    if (currentPrompts.length + data.prompts.length > MAX_PROMPTS) {
      return Promise.reject(new Error(`Cannot import ${data.prompts.length} prompts. You would exceed the 100 prompt limit.`));
    }
    
    // Add imported prompts with new IDs
    const newPrompts = data.prompts.map(prompt => ({
      ...prompt,
      id: generateId(),
      importedAt: new Date().toISOString()
    }));
    
    // Combine and save
    const combinedPrompts = [...newPrompts, ...currentPrompts];
    
    return new Promise((resolve) => {
      chrome.storage.local.set({ 
        [STORAGE_KEY]: { prompts: combinedPrompts } 
      }, () => {
        resolve(true);
      });
    });
  } catch (error) {
    return Promise.reject(new Error('Failed to parse import data'));
  }
}

/**
 * Copy text to clipboard
 * @param {string} text Text to copy
 * @returns {Promise<boolean>} Success state
 */
function copyToClipboard(text) {
  return new Promise((resolve) => {
    navigator.clipboard.writeText(text).then(() => {
      resolve(true);
    }).catch(() => {
      // Fallback method for clipboard
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      resolve(true);
    });
  });
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Format date for display
 * @param {string} dateString ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 30) {
    return date.toLocaleDateString();
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffMins > 0) {
    return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  } else {
    return 'Just now';
  }
}

/**
 * Truncate text to specified length
 * @param {string} text Text to truncate
 * @param {number} maxLength Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Show toast notification
 * @param {string} message Message to show
 * @param {string} type Toast type (success, error)
 */
function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  
  toast.className = 'toast';
  if (type) {
    toast.classList.add(type);
  }
  
  toastMessage.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
