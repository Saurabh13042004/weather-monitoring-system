import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AlertsLog({ alerts }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts Log</CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p>No alerts to display.</p>
        ) : (
          <ul className="space-y-2">
            {alerts.map((alert, index) => (
              <li key={index} className="bg-red-100 p-2 rounded">{alert}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}