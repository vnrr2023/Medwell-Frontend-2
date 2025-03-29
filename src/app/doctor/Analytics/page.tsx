"use client"
import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import DaddyAPI from "@/services/api";

interface AnalyticsData {
  amount_per_service: {
    service_name: string[];
    amount_generated: number[];
  };
  total_amount_generated: number;
  amount_per_month: {
    month: string[];
    amount_generated: number[];
  };
  most_used_services: {
    service_name: string[];
    appointment_count: number[];
  };
  revenue_per_address: {
    address_id: number[];
    revenue: number[];
  };
  appointments_per_day: {
    date: string[];
    appointments_booked: number[];
  };
  appointments_per_month: {
    month: string[];
    appointments_booked: number[];
  };
  visited_per_day: {
    date: string[];
    visited_count: number[];
  };
  not_visited_per_day: {
    date: string[];
    not_visited_count: number[];
  };
  booked_per_day: {
    date: string[];
    booked_count: number[];
  };
  slots_cancelled_per_day: {
    date: string[];
    cancelled_slots: number[];
  };
  slots_cancelled_per_month: {
    month: string[];
    cancelled_slots: number[];
  };
}

const DoctorAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("month");

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await DaddyAPI.getAnalytics();
        setAnalytics(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to fetch analytics data. Please try again later.');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Transform data for charts
  const prepareChartData = (labels: string[] | number[], values: number[]) => {
    return labels.map((label, index) => ({
      name: label,
      value: values[index]
    }));
  };

  // Format month names for better display
  const formatMonth = (monthStr: string) => {
    const date = new Date(`${monthStr}-01`);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  };

  // Format dates for better display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading analytics data...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
  if (!analytics) return <div className="flex h-screen items-center justify-center">No analytics data available</div>;

  // Prepare data for charts
  const serviceData = prepareChartData(analytics.amount_per_service.service_name, analytics.amount_per_service.amount_generated);
  const monthlyRevenueData = prepareChartData(
    analytics.amount_per_month.month.map(formatMonth), 
    analytics.amount_per_month.amount_generated
  );
  const servicesUsageData = prepareChartData(analytics.most_used_services.service_name, analytics.most_used_services.appointment_count);
  const appointmentsMonthlyData = prepareChartData(
    analytics.appointments_per_month.month.map(formatMonth), 
    analytics.appointments_per_month.appointments_booked
  );
  const appointmentsDailyData = prepareChartData(
    analytics.appointments_per_day.date.map(formatDate), 
    analytics.appointments_per_day.appointments_booked
  );
  const visitStatusData = analytics.appointments_per_day.date.map((date, index) => ({
    date: formatDate(date),
    visited: analytics.visited_per_day.visited_count[index] || 0,
    notVisited: analytics.not_visited_per_day.not_visited_count[index] || 0,
    booked: analytics.booked_per_day.booked_count[index] || 0
  }));

  // Calculate KPIs
  const totalAppointments = analytics.appointments_per_month.appointments_booked.reduce((sum, val) => sum + val, 0);
  const totalVisited = analytics.visited_per_day.visited_count.reduce((sum, val) => sum + val, 0);
  const totalBooked = analytics.booked_per_day.booked_count.reduce((sum, val) => sum + val, 0);
  const visitRate = totalBooked > 0 ? Math.round((totalVisited / totalBooked) * 100) : 0;
  const totalCancelled = analytics.slots_cancelled_per_month.cancelled_slots.reduce((sum, val) => sum + val, 0);
  const cancelRate = totalAppointments > 0 ? Math.round((totalCancelled / (totalAppointments + totalCancelled)) * 100) : 0;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Doctor Analytics Dashboard</h1>
        
      </div>
      
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-4 gap-4 auto-rows-auto">
        {/* Row 1: KPI cards in smaller squares */}
        <div className="bg-white p-4 rounded-lg shadow col-span-1 h-40 flex flex-col justify-between">
          <h2 className="text-sm font-medium text-gray-500">Total Revenue</h2>
          <div className="mt-2">
            <p className="text-2xl font-bold text-green-600">${analytics.total_amount_generated}</p>
            <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow col-span-1 h-40 flex flex-col justify-between">
          <h2 className="text-sm font-medium text-gray-500">Total Appointments</h2>
          <div className="mt-2">
            <p className="text-2xl font-bold text-blue-600">{totalAppointments}</p>
            <p className="text-xs text-gray-500 mt-1">+5% from last month</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow col-span-1 h-40 flex flex-col justify-between">
          <h2 className="text-sm font-medium text-gray-500">Visit Rate</h2>
          <div className="mt-2">
            <p className="text-2xl font-bold text-purple-600">{visitRate}%</p>
            <p className="text-xs text-gray-500 mt-1">{visitRate > 75 ? 'Good' : visitRate > 50 ? 'Average' : 'Needs improvement'}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow col-span-1 h-40 flex flex-col justify-between">
          <h2 className="text-sm font-medium text-gray-500">Cancellation Rate</h2>
          <div className="mt-2">
            <p className="text-2xl font-bold text-red-500">{cancelRate}%</p>
            <p className="text-xs text-gray-500 mt-1">{cancelRate < 10 ? 'Good' : cancelRate < 25 ? 'Average' : 'High'}</p>
          </div>
        </div>

        {/* Row 2: Wider charts */}
        <div className="bg-white p-4 rounded-lg shadow col-span-2 row-span-2">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Monthly Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyRevenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Area type="monotone" dataKey="value" stroke="#82ca9d" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow col-span-2 row-span-2">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Daily Appointment Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={visitStatusData.slice(-7)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="visited" fill="#00C49F" name="Visited" />
              <Bar dataKey="notVisited" fill="#FF8042" name="Not Visited" />
              <Bar dataKey="booked" fill="#0088FE" name="Booked" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Row 3 & 4: Mixed sizes */}
        <div className="bg-white p-4 rounded-lg shadow col-span-2 row-span-2">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Revenue by Service</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={serviceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Bar dataKey="value" fill="#8884d8" name="Revenue" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow col-span-2 row-span-2">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Most Used Services</h2>
          <div className="flex items-center justify-center h-full">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={servicesUsageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {servicesUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} appointments`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 5: Location revenue */}
        <div className="bg-white p-4 rounded-lg shadow col-span-4">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Revenue by Location</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart 
              data={prepareChartData(
                analytics.revenue_per_address.address_id.map(id => `Location ${id}`),
                analytics.revenue_per_address.revenue
              )}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Bar dataKey="value" fill="#FFBB28" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Row 6: Additional metrics */}
        <div className="bg-white p-4 rounded-lg shadow col-span-2">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Appointments Over Time</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={appointmentsMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#0088FE" name="Appointments" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow col-span-2">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Cancellations Over Time</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart 
              data={prepareChartData(
                analytics.slots_cancelled_per_month.month.map(formatMonth),
                analytics.slots_cancelled_per_month.cancelled_slots
              )}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FF8042" name="Cancellations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DoctorAnalyticsPage;