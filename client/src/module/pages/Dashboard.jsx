import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalShows: 0,
    totalTickets: 0,
    totalTurnover: 0,
    confirmedTickets: 0,
    monthlyData: [],
    todayPayments: {},
    totalPayments: {},
    showWiseStats: [],
  });

  const [roleFilter, setRoleFilter] = useState("");

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/dashboard/dashboarddata?filter=month${roleFilter ? `&roleFilter=${roleFilter}` : ""}`,
        { withCredentials: true }
      );
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [roleFilter]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4 text-center text-white p-2 rounded-sm"
        style={{ backgroundColor: "#030049" }}>
        Dashboard
      </h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Tickets</CardTitle>
            <CardDescription>Current Month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalTickets}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Turnover</CardTitle>
            <CardDescription>Current Month (in ₹)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{stats.totalTurnover.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Registered Accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Shows</CardTitle>
            <CardDescription>Current Month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalShows}</p>
          </CardContent>
        </Card>
      </div>

      {/* Show-wise Ticket Sales Breakdown */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Show-wise Ticket Sales</CardTitle>
          <CardDescription>Overall and Today’s ticket count per show</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.showWiseStats.length === 0 ? (
            <p className="text-gray-500 text-sm">No data available.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead>Show Title</TableHead>
                    <TableHead>Total Tickets</TableHead>
                    <TableHead>Today’s Tickets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.showWiseStats.map((show, index) => (
                    <TableRow key={index}>
                      <TableCell>{show.showTitle}</TableCell>
                      <TableCell>{show.totalTickets}</TableCell>
                      <TableCell>{show.todayTickets}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today’s Payments Breakdown */}
      <h2 className="text-xl font-semibold mb-4 mt-6 text-center text-white p-2 rounded-sm"
        style={{ backgroundColor: "#030049" }}>
        Today’s Payment Breakdown
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {["GPay", "Cash", "Mess Bill"].map((method) => (
          <Card key={method}>
            <CardHeader>
              <CardTitle>{method}</CardTitle>
              <CardDescription>Today's Amount</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-green-700">
                ₹{stats.todayPayments?.[method] || 0}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Payments Breakdown */}
      <h2 className="text-xl font-semibold mt-4 mb-4 text-center text-white p-2 rounded-sm"
        style={{ backgroundColor: "#030049" }}>
        Total Payment Breakdown
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["GPay", "Cash", "Mess Bill"].map((method) => (
          <Card key={method}>
            <CardHeader>
              <CardTitle>{method}</CardTitle>
              <CardDescription>Total Amount</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-blue-700">
                ₹{stats.totalPayments?.[method] || 0}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Sales Chart */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Monthly Sales Overview</CardTitle>
          <CardDescription>Total Turnover per Month (in ₹)</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name="Total Turnover (₹)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
