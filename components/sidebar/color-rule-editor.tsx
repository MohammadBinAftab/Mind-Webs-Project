'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Palette } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboard-store';
import { ColorRule } from '@/lib/types';

interface ColorRuleEditorProps {
  dataSourceId: string;
  onClose: () => void;
}

const PRESET_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange  
  '#F59E0B', // Amber
  '#EAB308', // Yellow
  '#84CC16', // Lime
  '#22C55E', // Green
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#A855F7', // Purple
];

const OPERATORS = [
  { value: '<', label: 'Less than (<)' },
  { value: '>', label: 'Greater than (>)' },
  { value: '<=', label: 'Less or equal (≤)' },
  { value: '>=', label: 'Greater or equal (≥)' },
  { value: '=', label: 'Equal to (=)' },
];

export function ColorRuleEditor({ dataSourceId, onClose }: ColorRuleEditorProps) {
  const {
    dataSources,
    colorRules,
    addColorRule,
    deleteColorRule,
    updateColorRule,
    updatePolygonColors,
  } = useDashboardStore();

  const dataSource = dataSources.find(ds => ds.id === dataSourceId);
  const rules = colorRules.filter(r => r.dataSourceId === dataSourceId);

  const [newRule, setNewRule] = useState<Partial<ColorRule>>({
    operator: '>=',
    value: 0,
    color: PRESET_COLORS[0],
    label: '',
  });

  const handleAddRule = () => {
    if (newRule.operator && newRule.value !== undefined && newRule.color) {
      addColorRule({
        dataSourceId,
        operator: newRule.operator as ColorRule['operator'],
        value: newRule.value,
        color: newRule.color,
        label: newRule.label || `${newRule.operator} ${newRule.value}`,
      });

      setNewRule({
        operator: '>=',
        value: 0,
        color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
        label: '',
      });

      // Update polygon colors after adding rule
      setTimeout(() => updatePolygonColors(), 100);
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    deleteColorRule(ruleId);
    setTimeout(() => updatePolygonColors(), 100);
  };

  const handleUpdateRule = (ruleId: string, updates: Partial<ColorRule>) => {
    updateColorRule(ruleId, updates);
    setTimeout(() => updatePolygonColors(), 100);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Color Rules - {dataSource?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Existing Rules */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Current Rules ({rules.length})</h3>
            
            {rules.length === 0 ? (
              <Card className="p-6 text-center text-gray-500">
                <Palette className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No color rules defined yet.</p>
                <p className="text-sm">Add rules below to colorize your polygons.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {rules
                  .sort((a, b) => a.value - b.value)
                  .map((rule) => (
                    <Card key={rule.id} className="p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-8 h-8 rounded-lg border-2 border-white shadow-sm cursor-pointer"
                          style={{ backgroundColor: rule.color }}
                          onClick={() => {
                            const newColor = prompt('Enter new color (hex):', rule.color);
                            if (newColor && /^#[0-9A-F]{6}$/i.test(newColor)) {
                              handleUpdateRule(rule.id, { color: newColor });
                            }
                          }}
                        />
                        
                        <div className="flex-1 grid grid-cols-3 gap-3">
                          <div>
                            <Label className="text-xs text-gray-600">Operator</Label>
                            <Select
                              value={rule.operator}
                              onValueChange={(value) => 
                                handleUpdateRule(rule.id, { operator: value as ColorRule['operator'] })
                              }
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {OPERATORS.map((op) => (
                                  <SelectItem key={op.value} value={op.value}>
                                    {op.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-xs text-gray-600">Value</Label>
                            <Input
                              type="number"
                              value={rule.value}
                              onChange={(e) => 
                                handleUpdateRule(rule.id, { value: parseFloat(e.target.value) })
                              }
                              className="h-8"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs text-gray-600">Label</Label>
                            <Input
                              value={rule.label || ''}
                              onChange={(e) => 
                                handleUpdateRule(rule.id, { label: e.target.value })
                              }
                              placeholder="Optional label"
                              className="h-8"
                            />
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRule(rule.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </div>

          {/* Add New Rule */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Add New Rule</h3>
            
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div>
                    <Label className="text-sm">Color</Label>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewRule({ ...newRule, color })}
                          className={`w-8 h-8 rounded-lg border-2 ${
                            newRule.color === color ? 'border-gray-900' : 'border-white'
                          } shadow-sm hover:scale-110 transition-transform`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-sm">Operator</Label>
                    <Select
                      value={newRule.operator}
                      onValueChange={(value) => 
                        setNewRule({ ...newRule, operator: value as ColorRule['operator'] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OPERATORS.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Value</Label>
                    <Input
                      type="number"
                      value={newRule.value || ''}
                      onChange={(e) => 
                        setNewRule({ ...newRule, value: parseFloat(e.target.value) })
                      }
                      placeholder="e.g., 25"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm">Label (Optional)</Label>
                    <Input
                      value={newRule.label || ''}
                      onChange={(e) => 
                        setNewRule({ ...newRule, label: e.target.value })
                      }
                      placeholder="e.g., Hot"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddRule}
                  disabled={!newRule.operator || newRule.value === undefined || !newRule.color}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Color Rule
                </Button>
              </div>
            </Card>
          </div>

          {/* Preview */}
          {rules.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Preview</h3>
              <Card className="p-4">
                <div className="space-y-2">
                  {rules
                    .sort((a, b) => a.value - b.value)
                    .map((rule) => (
                      <div key={rule.id} className="flex items-center gap-3 text-sm">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: rule.color }}
                        />
                        <span className="font-medium">
                          {rule.label || `${rule.operator} ${rule.value}`}
                        </span>
                        <span className="text-gray-500">
                          ({rule.operator} {rule.value}°C)
                        </span>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}