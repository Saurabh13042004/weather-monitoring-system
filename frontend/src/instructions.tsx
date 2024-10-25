import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Instructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How to Use the Weather Monitoring System</CardTitle>
        <CardDescription>Follow these steps to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal list-inside space-y-2">
          <li>Select a city from the dropdown in the Settings tab to view its weather data.</li>
          <li>Choose between Celsius and Fahrenheit for temperature display.</li>
          <li>Set the update interval (in minutes) to control how often the data refreshes.</li>
          <li>Set an alert threshold temperature (in Celsius) to receive notifications when exceeded.</li>
          <li>Use the tabs to navigate between current weather, daily summaries, and alerts.</li>
          <li>The system will display real-time updates and generate alerts based on your settings.</li>
        </ol>
      </CardContent>
    </Card>
  )
}