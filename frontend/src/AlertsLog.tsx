import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Alert {
  city: string;
  message: string;
  temperature: number;
  threshold: number;
  timestamp: string;
}

interface AlertsLogProps {
  alerts: Alert[];
}

const AlertsLog = ({ alerts }: AlertsLogProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p>No alerts at this time.</p>
        ) : (
          <ul className="space-y-2">
            {alerts.map((alert, index) => (
              <li key={index} className="bg-red-100 p-2 rounded">
                <p><strong>{alert.city}</strong>: {alert.message}</p>
                <p>Temperature: {alert.temperature}°C</p>
                <p>Threshold: {alert.threshold}°C</p>
                <p>Time: {new Date(alert.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsLog;