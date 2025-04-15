
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, Database } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SettingsPanelProps {
  promptCount: number;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ promptCount }) => {
  // Maximum number of prompts allowed (simulated)
  const MAX_PROMPTS = 100;
  
  // Calculate percentage
  const storagePercentage = (promptCount / MAX_PROMPTS) * 100;
  
  return (
    <div className="p-4 animate-fade-in">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Database size={18} className="text-primary" />
            Data Management
          </CardTitle>
          <CardDescription>
            Import, export, and manage your prompt collection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Download size={14} />
              Export Prompts
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Upload size={14} />
              Import Prompts
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Storage usage</span>
              <span>{promptCount} of {MAX_PROMPTS} prompts</span>
            </div>
            <Progress value={storagePercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
