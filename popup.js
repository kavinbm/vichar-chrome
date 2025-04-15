
/**
 * PromptPal Popup Script
 */

document.addEventListener('DOMContentLoaded', init);

// Global state
let currentTab = 'prompts';
let allPrompts = [];
let editingPromptId = null;

/**
 * Initialize the popup
 */
async function init() {
  // Set up event listeners
  setupEventListeners();
  
  // Load prompts
  allPrompts = await getPrompts();
  renderPrompts(allPrompts);
  
  // Update storage info
  updateStorageInfo();
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Tab navigation
  document.getElementById('tab-prompts').addEventListener('click', () => switchTab('prompts'));
  document.getElementById('tab-create').addEventListener('click', () => switchTab('create'));
  document.getElementById('tab-settings').addEventListener('click', () => switchTab('settings'));
  document.getElementById('create-first-prompt').addEventListener('click', () => switchTab('create'));
  
  // Form events
  document.getElementById('prompt-form').addEventListener('submit', handleSavePrompt);
  document.getElementById('cancel-prompt').addEventListener('click', () => {
    editingPromptId = null;
    document.getElementById('prompt-form').reset();
    switchTab('prompts');
  });
  
  // Character counter for title
  const titleInput = document.getElementById('prompt-title');
  const titleCounter = document.getElementById('title-counter');
  titleInput.addEventListener('input', () => {
    titleCounter.textContent = titleInput.value.length;
  });
  
  // Search functionality
  document.getElementById('search-input').addEventListener('input', handleSearch);
  
  // Data import/export
  document.getElementById('export-data').addEventListener('click', handleExport);
  document.getElementById('import-data').addEventListener('click', handleImportClick);
  document.getElementById('import-file').addEventListener('change', handleImport);
}

/**
 * Switch between tabs
 * @param {string} tabName Tab to switch to
 */
function switchTab(tabName) {
  // Update active tab button
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.toggle('active', btn.id === `tab-${tabName}`);
  });
  
  // Show active tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(`${tabName}-container`).classList.add('active');
  
  currentTab = tabName;
}

/**
 * Render prompts list
 * @param {Array} prompts Prompts to render
 */
function renderPrompts(prompts) {
  const promptsList = document.getElementById('prompts-list');
  const promptCount = document.getElementById('prompt-count');
  
  // Update count
  promptCount.textContent = prompts.length;
  
  // Show empty state if no prompts
  if (prompts.length === 0) {
    promptsList.innerHTML = `
      <div class="empty-state">
        <p>No prompts found. Create your first prompt!</p>
        <button id="create-first-prompt" class="button primary">Create Prompt</button>
      </div>
    `;
    document.getElementById('create-first-prompt').addEventListener('click', () => switchTab('create'));
    return;
  }
  
  // Render prompt items
  promptsList.innerHTML = prompts.map(prompt => `
    <div class="prompt-item" data-id="${prompt.id}">
      <div class="prompt-header">
        <div class="prompt-title">${escapeHtml(prompt.title)}</div>
        <div class="prompt-actions">
          <button class="action-button copy" data-id="${prompt.id}">
            Copy
          </button>
          <button class="action-button edit" data-id="${prompt.id}">
            Edit
          </button>
          <button class="action-button delete" data-id="${prompt.id}">
            Delete
          </button>
        </div>
      </div>
      <div class="prompt-preview">${escapeHtml(truncateText(prompt.text, 100))}</div>
      <div class="prompt-meta">
        ${prompt.author ? `<div>By ${escapeHtml(prompt.author)}</div>` : ''}
        <div>${formatDate(prompt.createdAt)}</div>
      </div>
    </div>
  `).join('');
  
  // Add event listeners to prompt items
  document.querySelectorAll('.action-button.copy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleCopyPrompt(btn.dataset.id);
    });
  });
  
  document.querySelectorAll('.action-button.edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleEditPrompt(btn.dataset.id);
    });
  });
  
  document.querySelectorAll('.action-button.delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleDeletePrompt(btn.dataset.id);
    });
  });
  
  // Click on prompt item to copy
  document.querySelectorAll('.prompt-item').forEach(item => {
    item.addEventListener('click', () => {
      handleCopyPrompt(item.dataset.id);
    });
  });
}

/**
 * Handle form submission to save prompt
 * @param {Event} e Submit event
 */
async function handleSavePrompt(e) {
  e.preventDefault();
  
  const title = document.getElementById('prompt-title').value.trim();
  const text = document.getElementById('prompt-text').value.trim();
  const author = document.getElementById('prompt-author').value.trim();
  
  if (!title || !text) {
    showToast('Title and prompt text are required', 'error');
    return;
  }
  
  try {
    const promptData = { title, text, author };
    
    if (editingPromptId) {
      // Update existing prompt
      await updatePrompt(editingPromptId, promptData);
      showToast('Prompt updated successfully', 'success');
    } else {
      // Create new prompt
      await savePrompt(promptData);
      showToast('Prompt saved successfully', 'success');
    }
    
    // Reset form and go back to prompts
    document.getElementById('prompt-form').reset();
    document.getElementById('title-counter').textContent = '0';
    editingPromptId = null;
    
    // Refresh prompts
    allPrompts = await getPrompts();
    renderPrompts(allPrompts);
    updateStorageInfo();
    switchTab('prompts');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

/**
 * Handle prompt deletion
 * @param {string} id Prompt ID to delete
 */
async function handleDeletePrompt(id) {
  if (confirm('Are you sure you want to delete this prompt?')) {
    try {
      await deletePrompt(id);
      
      // Refresh prompts
      allPrompts = await getPrompts();
      renderPrompts(allPrompts);
      updateStorageInfo();
      
      showToast('Prompt deleted', 'success');
    } catch (error) {
      showToast('Failed to delete prompt', 'error');
    }
  }
}

/**
 * Handle editing a prompt
 * @param {string} id Prompt ID to edit
 */
async function handleEditPrompt(id) {
  const prompt = allPrompts.find(p => p.id === id);
  
  if (!prompt) {
    showToast('Prompt not found', 'error');
    return;
  }
  
  // Populate form
  document.getElementById('prompt-title').value = prompt.title;
  document.getElementById('prompt-text').value = prompt.text;
  document.getElementById('prompt-author').value = prompt.author || '';
  document.getElementById('title-counter').textContent = prompt.title.length;
  
  // Set editing state
  editingPromptId = id;
  
  // Switch to create tab
  switchTab('create');
}

/**
 * Handle copying prompt to clipboard
 * @param {string} id Prompt ID to copy
 */
async function handleCopyPrompt(id) {
  const prompt = allPrompts.find(p => p.id === id);
  
  if (!prompt) {
    showToast('Prompt not found', 'error');
    return;
  }
  
  try {
    await copyToClipboard(prompt.text);
    showToast('Copied to clipboard!', 'success');
    
    // Notify content script to check for input fields
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'promptCopied',
        text: prompt.text
      });
    });
  } catch (error) {
    showToast('Failed to copy to clipboard', 'error');
  }
}

/**
 * Handle search input
 * @param {Event} e Input event
 */
async function handleSearch(e) {
  const query = e.target.value.trim();
  
  try {
    const results = await searchPrompts(query);
    renderPrompts(results);
  } catch (error) {
    console.error('Search error:', error);
  }
}

/**
 * Handle export data
 */
async function handleExport() {
  try {
    const data = await exportPrompts();
    
    // Create download link
    const blob = new Blob([data], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptpal-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    
    showToast('Prompts exported successfully', 'success');
  } catch (error) {
    showToast('Failed to export prompts', 'error');
  }
}

/**
 * Handle import button click
 */
function handleImportClick() {
  document.getElementById('import-file').click();
}

/**
 * Handle importing data from file
 * @param {Event} e Change event
 */
async function handleImport(e) {
  const file = e.target.files[0];
  
  if (!file) {
    return;
  }
  
  // Check if it's a JSON file
  if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
    showToast('Please select a JSON file', 'error');
    return;
  }
  
  const reader = new FileReader();
  
  reader.onload = async (e) => {
    try {
      await importPrompts(e.target.result);
      
      // Refresh prompts
      allPrompts = await getPrompts();
      renderPrompts(allPrompts);
      updateStorageInfo();
      
      showToast('Prompts imported successfully', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };
  
  reader.onerror = () => {
    showToast('Failed to read file', 'error');
  };
  
  reader.readAsText(file);
  
  // Reset file input
  e.target.value = '';
}

/**
 * Update storage usage information
 */
function updateStorageInfo() {
  const usedCount = allPrompts.length;
  const percentage = (usedCount / MAX_PROMPTS) * 100;
  
  // Update UI
  document.getElementById('storage-used').textContent = usedCount;
  document.getElementById('storage-fill').style.width = `${percentage}%`;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
