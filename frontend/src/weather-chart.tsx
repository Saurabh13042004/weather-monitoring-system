import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const kelvinToCelsius = (kelvin: number) => Math.round(kelvin - 273.15)
const celsiusToFahrenheit = (celsius: number) => Math.round((celsius * 9/5) + 32)

export default function WeatherChart({ data, city, unit }) {
  const chartData = data.map(entry => ({
    time: new Date(entry.dt * 1000).toLocaleTimeString(),
    temperature: unit === 'celsius' ? kelvinToCelsius(entry.temp) : celsiusToFahrenheit(kelvinToCelsius(entry.temp))
  }))

  const minTemp = Math.min(...chartData.map(t => t.temperature))
  const maxTemp = Math.max(...chartData.map(t => t.temperature))
  const avgTemp = Math.round(chartData.reduce((sum, t) => sum + t.temperature, 0) / chartData.length)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Weather Summary for {city}</CardTitle>
        <CardDescription>
          Min: {minTemp}°{unit === 'celsius' ? 'C' : 'F'}, 
          Max: {maxTemp}°{unit === 'celsius' ? 'C' : 'F'}, 
          Avg: {avgTemp}°{unit === 'celsius' ? 'C' : 'F'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            temperature: {
              label: "Temperature",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width={700} height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="temperature" name="Temperature" stroke="slateblue" activeDot={{ r: 8 }} />
                          </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}