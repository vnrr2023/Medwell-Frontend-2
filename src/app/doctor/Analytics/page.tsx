"use client"
import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import DaddyAPI from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [viewMode, setViewMode] = useState<string>("desktop");

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

    // Set view mode based on screen width
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode("mobile");
      } else {
        setViewMode("desktop");
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    <div className="p-2 sm:p-4 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Doctor Analytics Dashboard</h1>
        <Tabs value={selectedTimeRange} onValueChange={setSelectedTimeRange} className="w-full sm:w-auto">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:flex">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* KPI cards - responsive grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4">
        <Card className="h-auto">
          <CardContent className="p-3 sm:p-4 flex flex-col justify-between">
            <h2 className="text-xs sm:text-sm font-medium text-gray-500">Total Revenue</h2>
            <div className="mt-2">
              <p className="text-lg sm:text-2xl font-bold text-green-600">${analytics.total_amount_generated}</p>
              <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="h-auto">
          <CardContent className="p-3 sm:p-4 flex flex-col justify-between">
            <h2 className="text-xs sm:text-sm font-medium text-gray-500">Total Appointments</h2>
            <div className="mt-2">
              <p className="text-lg sm:text-2xl font-bold text-blue-600">{totalAppointments}</p>
              <p className="text-xs text-gray-500 mt-1">+5% from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="h-auto">
          <CardContent className="p-3 sm:p-4 flex flex-col justify-between">
            <h2 className="text-xs sm:text-sm font-medium text-gray-500">Visit Rate</h2>
            <div className="mt-2">
              <p className="text-lg sm:text-2xl font-bold text-purple-600">{visitRate}%</p>
              <p className="text-xs text-gray-500 mt-1">{visitRate > 75 ? 'Good' : visitRate > 50 ? 'Average' : 'Needs improvement'}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="h-auto">
          <CardContent className="p-3 sm:p-4 flex flex-col justify-between">
            <h2 className="text-xs sm:text-sm font-medium text-gray-500">Cancellation Rate</h2>
            <div className="mt-2">
              <p className="text-lg sm:text-2xl font-bold text-red-500">{cancelRate}%</p>
              <p className="text-xs text-gray-500 mt-1">{cancelRate < 10 ? 'Good' : cancelRate < 25 ? 'Average' : 'High'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts - Responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card className="w-full">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-sm sm:text-base font-medium text-gray-500">Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-4">
            <div className="h-[200px] sm:h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: viewMode === "mobile" ? 10 : 12 }} />
                  <YAxis tick={{ fontSize: viewMode === "mobile" ? 10 : 12 }} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Area type="monotone" dataKey="value" stroke="#82ca9d" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-sm sm:text-base font-medium text-gray-500">Daily Appointment Status</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-4">
            <div className="h-[200px] sm:h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitStatusData.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: viewMode === "mobile" ? 10 : 12 }} />
                  <YAxis tick={{ fontSize: viewMode === "mobile" ? 10 : 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: viewMode === "mobile" ? 10 : 12 }} />
                  <Bar dataKey="visited" fill="#00C49F" name="Visited" />
                  <Bar dataKey="notVisited" fill="#FF8042" name="Not Visited" />
                  <Bar dataKey="booked" fill="#0088FE" name="Booked" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card className="w-full">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-sm sm:text-base font-medium text-gray-500">Revenue by Service</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-4">
            <div className="h-[250px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" tick={{ fontSize: viewMode === "mobile" ? 10 : 12 }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={viewMode === "mobile" ? 70 : 100} 
                    tick={{ fontSize: viewMode === "mobile" ? 10 : 12 }}
                  />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Bar dataKey="value" fill="#8884d8" name="Revenue" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-sm sm:text-base font-medium text-gray-500">Most Used Services</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-4">
            <div className="h-[250px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={servicesUsageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={viewMode === "mobile" ? 40 : 60}
                    outerRadius={viewMode === "mobile" ? 60 : 80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {servicesUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} appointments`, 'Count']} />
                  <Legend wrapperStyle={{ fontSize: viewMode === "mobile" ? 10 : 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location revenue - Full width on all screens */}
      <Card className="w-full mb-4">
        <CardHeader className="p-3 sm:p-4">
          <CardTitle className="text-sm sm:text-base font-medium text-gray-500">Revenue by Location</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-4">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={prepareChartData(
                  analytics.revenue_per_address.address_id.map(id => `Location ${id}`),
                  analytics.revenue_per_address.revenue
                )}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: viewMode === "mobile" ? 10 : 12 }} />
                <YAxis tick={{ fontSize: viewMode === "mobile" ? 10 : 12 }} />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="value" fill="#FFBB28" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Additional metrics - Responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="w-full">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-sm sm:text-base font-medium text-gray-500">Appointments Over Time</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-4">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={appointmentsMonthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: viewMode === "mobile" ? 10 : 12 }} />
                  <YAxis tick={{ fontSize: viewMode === "mobile" ? 10 : 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#0088FE" name="Appointments" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-sm sm:text-base font-medium text-gray-500">Cancellations Over Time</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-4">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={prepareChartData(
                    analytics.slots_cancelled_per_month.month.map(formatMonth),
                    analytics.slots_cancelled_per_month.cancelled_slots
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: viewMode === "mobile" ? 10 : 12 }} />
                  <YAxis tick={{ fontSize: viewMode === "mobile" ? 10 : 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#FF8042" name="Cancellations" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorAnalyticsPage;
