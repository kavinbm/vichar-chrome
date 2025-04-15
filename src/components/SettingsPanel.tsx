
import React from 'react';

interface SettingsPanelProps {
  promptCount: number;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ promptCount }) => {
  return (
    <div id="settings-container" className="tab-content active">
      <div className="settings-group">
        <h3>Data Management</h3>
        <div className="settings-actions">
          <button id="export-data" className="button secondary">Export Prompts</button>
          <button id="import-data" className="button secondary">Import Prompts</button>
        </div>
        <div className="storage-info">
          <div className="storage-bar">
            <div id="storage-fill" className="storage-fill" style={{ width: `${(promptCount / 100) * 100}%` }}></div>
          </div>
          <div className="storage-text">Using <span id="storage-used">{promptCount}</span> of 100 prompts</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
