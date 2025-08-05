'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Database, 
  Plus, 
  Trash2, 
  Settings, 
  Palette,
  Thermometer,
  Eye,
  EyeOff
} from 'lucide-react';
import { useDashboardStore } from '@/store/dashboard-store';
import { ColorRuleEditor } from './color-rule-editor';

export function DataSourceSidebar() {
  const {
    dataSources,
    colorRules,
    polygons,
    toggleDataSource,
    updateDataSourceColor,
    addColorRule,
    deleteColorRule,
    updateColorRule,
  } = useDashboardStore();

  const [showRuleEditor, setShowRuleEditor] = useState(false);
  const [selectedDataSourceId, setSelectedDataSourceId] = useState<string>('');

  const getActivePolygonCount = (dataSourceId: string) => {
    return polygons.filter(p => p.dataSource === dataSourceId).length;
  };

  const getDataSourceRules = (dataSourceId: string) => {
    return colorRules.filter(r => r.dataSourceId === dataSourceId);
  };

  const handleEditRules = (dataSourceId: string) => {
    setSelectedDataSourceId(dataSourceId);
    setShowRuleEditor(true);
  };

  return (
    <div className="w-80 h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Data Sources</h2>
            <p className="text-sm text-gray-600">Manage data and color rules</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Data Sources List */}
        <div className="space-y-4">
          {dataSources.map((dataSource) => {
            const activePolygons = getActivePolygonCount(dataSource.id);
            const rules = getDataSourceRules(dataSource.id);

            return (
              <Card key={dataSource.id} className="p-4 space-y-4">
                {/* Data Source Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: dataSource.color }}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{dataSource.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Thermometer className="w-3 h-3" />
                        <span>{dataSource.field}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {activePolygons} polygons
                    </Badge>
                    <Switch
                      checked={dataSource.enabled}
                      onCheckedChange={() => toggleDataSource(dataSource.id)}
                    />
                  </div>
                </div>

                {/* Color Rules Preview */}
                {rules.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Color Rules ({rules.length})</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRules(dataSource.id)}
                        className="h-7 px-2 text-xs"
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {rules.slice(0, 4).map((rule) => (
                        <div
                          key={rule.id}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: rule.color }}
                          />
                          <span className="text-gray-700">
                            {rule.operator} {rule.value}
                          </span>
                        </div>
                      ))}
                      {rules.length > 4 && (
                        <div className="flex items-center justify-center p-2 bg-gray-50 rounded text-xs text-gray-500">
                          +{rules.length - 4} more
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditRules(dataSource.id)}
                    className="flex-1 text-xs"
                  >
                    <Palette className="w-3 h-3 mr-1" />
                    Color Rules
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Legend */}
        {colorRules.length > 0 && (
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-gray-600" />
                <h3 className="font-medium text-gray-900">Legend</h3>
              </div>
              
              <div className="space-y-2">
                {colorRules.map((rule) => {
                  const dataSource = dataSources.find(ds => ds.id === rule.dataSourceId);
                  return (
                    <div key={rule.id} className="flex items-center gap-3 text-sm">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: rule.color }}
                      />
                      <span className="text-gray-700">
                        {rule.label || `${rule.operator} ${rule.value}`}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({dataSource?.name})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}

        {/* Statistics */}
        <Card className="p-4">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{polygons.length}</div>
                <div className="text-xs text-gray-600">Total Polygons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {polygons.filter(p => p.value !== undefined).length}
                </div>
                <div className="text-xs text-gray-600">With Data</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Color Rule Editor Modal */}
      {showRuleEditor && (
        <ColorRuleEditor
          dataSourceId={selectedDataSourceId}
          onClose={() => setShowRuleEditor(false)}
        />
      )}
    </div>
  );
}