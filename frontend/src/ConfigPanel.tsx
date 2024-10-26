import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Config {
  updateInterval: number;
}

interface ConfigPanelProps {
  config: Config;
  updateConfig: (newConfig: Partial<Config>) => void;
  temperatureUnit: string;
  onTemperatureUnitChange: (unit: string) => void;
}

const ConfigPanel = ({ config, updateConfig, temperatureUnit, onTemperatureUnitChange }: ConfigPanelProps) => {
  const [updateInterval, setUpdateInterval] = useState(config.updateInterval);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateConfig({ updateInterval: Number(updateInterval) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="updateInterval">Update Interval (minutes)</Label>
            <Input
              id="updateInterval"
              type="number"
              value={updateInterval}
              onChange={(e) => setUpdateInterval(Number(e.target.value))}
              min={1}
            />
          </div>
          <div>
            <Label>Temperature Unit</Label>
            <RadioGroup value={temperatureUnit} onValueChange={onTemperatureUnitChange} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="celsius" id="celsius" />
                <Label htmlFor="celsius">Celsius</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fahrenheit" id="fahrenheit" />
                <Label htmlFor="fahrenheit">Fahrenheit</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit">Update Configuration</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ConfigPanel;