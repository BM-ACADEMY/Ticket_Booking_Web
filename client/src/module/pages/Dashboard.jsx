import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"



// Mock tickets data
const tickets = [
  { id: 1, customer: "John Doe", event: "Concert", date: "2025-06-01", status: "Confirmed", price: 50 },
  { id: 2, customer: "Jane Smith", event: "Movie", date: "2025-06-02", status: "Pending", price: 30 },
  { id: 3, customer: "Alice Brown", event: "Theater", date: "2025-05-30", status: "Confirmed", price: 70 },
]

// Daily data from the provided code
export const dailyData = [
  { name: "06-01", bookings: 10, revenue: 500 },
  { name: "06-02", bookings: 15, revenue: 750 },
  { name: "06-03", bookings: 8, revenue: 400 },
  { name: "06-04", bookings: 20, revenue: 1000 },
  { name: "06-05", bookings: 12, revenue: 600 },
]

const Dashboard = () => (
  <div className=" p-6">
    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Tickets</CardTitle>
          <CardDescription>Current Month</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{tickets.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
          <CardDescription>Current Month</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${tickets.reduce((sum, t) => sum + t.price, 0)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pending Tickets</CardTitle>
          <CardDescription>Current Month</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{tickets.filter(t => t.status === "Pending").length}</p>
        </CardContent>
      </Card>
    </div>
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Daily Bookings</CardTitle>
        <CardDescription>Ticket bookings per day</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={dailyData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  </div>
)

export default Dashboard