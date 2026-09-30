import { useEffect, useState } from 'react';
import { getAnalyticsOverview } from '../services/api';
import type { AnalyticsOverview } from '../types';
import { Users, TrendingUp, Award, AlertTriangle, Target, BarChart2, RefreshCw, Activity } from 'lucide-react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  teal: '#14b8a6',
  indigo: '#6366f1'
};

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadData();
    loadActivity();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadData(true);
        loadActivity();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    
    try {
      const overview = await getAnalyticsOverview();
      setData(overview);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const loadActivity = async () => {
    try {
      const response = await fetch('/api/analytics/recent-activity?limit=10', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (response.ok) {
        const activities = await response.json();
        setRecentActivity(activities);
      }
    } catch (error) {
      console.error('Failed to load activity:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-12 text-gray-500">Failed to load data</div>;
  }

  const metrics = [
    {
      label: 'Total Employees',
      value: data.summary.total_employees,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up'
    },
    {
      label: 'Avg Growth Score',
      value: data.summary.average_growth_score.toFixed(1),
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+5.2%',
      trend: 'up'
    },
    {
      label: 'Promotion Ready',
      value: data.summary.promotion_ready_count,
      icon: Award,
      color: 'bg-purple-500',
      change: '+8',
      trend: 'up'
    },
    {
      label: 'At Risk',
      value: data.summary.at_risk_count,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: '-3',
      trend: 'down'
    },
    {
      label: 'High Potential',
      value: data.summary.high_potential_count,
      icon: Target,
      color: 'bg-indigo-500',
      change: '+15',
      trend: 'up'
    },
    {
      label: 'Avg Performance',
      value: data.summary.average_performance.toFixed(1),
      icon: BarChart2,
      color: 'bg-teal-500',
      change: '+3.1%',
      trend: 'up'
    },
  ];

  // Prepare chart data
  const growthDistributionData = Object.entries(data.growth_distribution).map(([name, value]) => ({
    name: name.replace('_', ' '),
    value: value as number,
    fill: name === 'HIGH_GROWTH' ? COLORS.success : 
          name === 'STABLE_GROWTH' ? COLORS.primary :
          name === 'SLOW_GROWTH' ? COLORS.warning : COLORS.danger
  }));

  const departmentData = data.department_growth.map(dept => ({
    name: dept.department,
    growth: dept.average_growth,
    employees: dept.employee_count
  }));

  const roleData = data.role_growth.map(role => ({
    name: role.role.length > 15 ? role.role.substring(0, 15) + '...' : role.role,
    growth: role.average_growth,
    count: role.employee_count
  }));

  // Risk distribution data
  const riskData = [
    { name: 'Low Risk', value: data.summary.total_employees - data.summary.at_risk_count, fill: COLORS.success },
    { name: 'At Risk', value: data.summary.at_risk_count, fill: COLORS.danger }
  ];

  // Performance metrics radar
  const radarData = [
    { metric: 'Growth', value: data.summary.average_growth_score },
    { metric: 'Performance', value: data.summary.average_performance },
    { metric: 'Skills', value: data.summary.average_skill_score },
    { metric: 'Readiness', value: (data.summary.promotion_ready_count / data.summary.total_employees) * 100 },
    { metric: 'Retention', value: ((data.summary.total_employees - data.summary.at_risk_count) / data.summary.total_employees) * 100 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time workforce intelligence and analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={() => loadData()}
            className="flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              autoRefresh
                ? 'text-green-600 bg-green-50 hover:bg-green-100'
                : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {autoRefresh ? '● ' : '○ '} Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  <p className={`text-sm mt-2 font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend === 'up' ? '↑' : '↓'} {metric.change} vs last month
                  </p>
                </div>
                <div className={`${metric.color} rounded-xl p-4 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Distribution Pie Chart */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <div className="w-1 h-6 bg-primary-600 rounded mr-3"></div>
            Growth Category Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={growthDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="value"
              >
                {growthDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {growthDistributionData.map((item) => (
              <div key={item.name} className="flex items-center text-sm">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.fill }}></div>
                <span className="text-gray-600">{item.name}: </span>
                <span className="font-semibold ml-1">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Assessment Donut */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <div className="w-1 h-6 bg-red-600 rounded mr-3"></div>
            Employee Risk Assessment
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-700">
                {((data.summary.total_employees - data.summary.at_risk_count) / data.summary.total_employees * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Low Risk</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-700">
                {(data.summary.at_risk_count / data.summary.total_employees * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">At Risk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance Bar Chart */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <div className="w-1 h-6 bg-purple-600 rounded mr-3"></div>
            Department Growth Scores
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="growth" fill={COLORS.primary} name="Avg Growth Score" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Radar Chart */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <div className="w-1 h-6 bg-teal-600 rounded mr-3"></div>
            Organization Performance Metrics
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar name="Score" dataKey="value" stroke={COLORS.teal} fill={COLORS.teal} fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role Distribution */}
        <div className="card lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <div className="w-1 h-6 bg-indigo-600 rounded mr-3"></div>
            Growth Score by Role
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roleData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip />
              <Bar dataKey="growth" fill={COLORS.indigo} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity Feed */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary-600" />
            Recent Activity
          </h2>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary-600 mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                    <p className="text-xs text-gray-500 truncate">{activity.employee_name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Growth Opportunities */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <div className="w-1 h-6 bg-orange-600 rounded mr-3"></div>
            Top Growth Opportunities
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            High-potential employees with development gaps
          </p>
          <div className="space-y-3">
            {data.top_opportunities.slice(0, 5).map((emp, index) => (
              <div
                key={emp.employee_id}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-transparent rounded-lg hover:from-orange-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{emp.name}</p>
                    <p className="text-sm text-gray-500">{emp.employee_id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <div>
                      <p className="text-xs text-gray-500">Growth</p>
                      <p className="text-sm font-semibold text-green-600">{emp.growth_score}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Readiness</p>
                      <p className="text-sm font-semibold text-blue-600">{emp.promotion_readiness}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Gap</p>
                      <p className="text-sm font-semibold text-orange-600">{emp.gap}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Statistics */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <div className="w-1 h-6 bg-green-600 rounded mr-3"></div>
            Department Statistics
          </h2>
          <div className="space-y-4">
            {data.department_growth.slice(0, 5).map((dept) => (
              <div key={dept.department} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{dept.department}</p>
                  <p className="text-sm text-gray-500">{dept.employee_count} employees</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{dept.average_growth}</p>
                  <p className="text-xs text-gray-500">Avg Growth Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
