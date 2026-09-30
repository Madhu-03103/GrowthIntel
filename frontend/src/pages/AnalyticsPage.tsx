import { useEffect, useState } from 'react';
import { 
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { Filter, Download, Calendar, TrendingUp, X } from 'lucide-react';
import { getDepartmentAnalytics } from '../services/api';

const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  teal: '#14b8a6'
};

export default function AnalyticsPage() {
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('all');
  const [departments, setDepartments] = useState<string[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    frequency: 'weekly',
    email: '',
    department: 'all',
    timeRange: 'all'
  });

  useEffect(() => {
    loadAnalytics();
  }, [selectedDepartment]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await getDepartmentAnalytics();
      setDepartmentData(data);
      setDepartments(data.map((d: any) => d.department_name));
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Filter data by department
  const filteredData = selectedDepartment === 'all' 
    ? departmentData 
    : departmentData.filter(d => d.department_name === selectedDepartment);

  // Prepare comparison chart data
  const comparisonData = departmentData.map(dept => ({
    name: dept.department_name,
    growth: dept.average_growth_score,
    performance: dept.average_performance,
    employees: dept.total_employees,
    promotionReady: dept.promotion_ready,
    atRisk: dept.at_risk
  }));

  // Scatter plot data - Growth vs Performance
  const scatterData = departmentData.map(dept => ({
    x: dept.average_performance,
    y: dept.average_growth_score,
    z: dept.total_employees,
    name: dept.department_name
  }));

  // Growth distribution by department
  const growthDistData = departmentData.map(dept => ({
    name: dept.department_name,
    'High Growth': dept.growth_distribution?.HIGH_GROWTH || 0,
    'Stable': dept.growth_distribution?.STABLE_GROWTH || 0,
    'Slow': dept.growth_distribution?.SLOW_GROWTH || 0,
    'Declining': dept.growth_distribution?.DECLINING || 0
  }));

  // Calculate totals
  const totalEmployees = departmentData.reduce((sum, d) => sum + d.total_employees, 0);
  const avgGrowth = (departmentData.reduce((sum, d) => sum + d.average_growth_score, 0) / departmentData.length).toFixed(1);
  const totalPromotionReady = departmentData.reduce((sum, d) => sum + d.promotion_ready, 0);
  const totalAtRisk = departmentData.reduce((sum, d) => sum + d.at_risk, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">HR Analytics</h1>
        <p className="text-gray-600 mt-1">Comprehensive workforce analytics and insights</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <div>
            <label className="text-sm text-gray-600 mr-2">Department:</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 mr-2">Time Range:</label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
            >
              <option value="all">All Time</option>
              <option value="year">Last Year</option>
              <option value="quarter">Last Quarter</option>
              <option value="month">Last Month</option>
            </select>
          </div>

          <div className="ml-auto flex items-center space-x-2">
            <button className="btn-secondary flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button 
              onClick={() => setShowScheduleModal(true)}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Calendar className="w-4 h-4" />
              Schedule Report
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <p className="text-sm font-medium text-blue-700">Total Employees</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">{totalEmployees}</p>
          <p className="text-sm text-blue-600 mt-2">Across {departmentData.length} departments</p>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <p className="text-sm font-medium text-green-700">Avg Growth Score</p>
          <p className="text-3xl font-bold text-green-900 mt-2">{avgGrowth}</p>
          <p className="text-sm text-green-600 mt-2">↑ 5.2% from last month</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <p className="text-sm font-medium text-purple-700">Promotion Ready</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">{totalPromotionReady}</p>
          <p className="text-sm text-purple-600 mt-2">{((totalPromotionReady / totalEmployees) * 100).toFixed(1)}% of workforce</p>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <p className="text-sm font-medium text-red-700">At Risk Employees</p>
          <p className="text-3xl font-bold text-red-900 mt-2">{totalAtRisk}</p>
          <p className="text-sm text-red-600 mt-2">{((totalAtRisk / totalEmployees) * 100).toFixed(1)}% of workforce</p>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Comparison */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <div className="w-1 h-6 bg-primary-600 rounded mr-3"></div>
            Department Performance Comparison
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="growth" fill={COLORS.primary} name="Growth Score" radius={[8, 8, 0, 0]} />
              <Bar dataKey="performance" fill={COLORS.success} name="Performance Score" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Growth vs Performance Scatter */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <div className="w-1 h-6 bg-purple-600 rounded mr-3"></div>
            Growth vs Performance Analysis
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Performance" 
                domain={[0, 100]}
                label={{ value: 'Performance Score', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Growth" 
                domain={[0, 100]}
                label={{ value: 'Growth Score', angle: -90, position: 'insideLeft' }}
              />
              <ZAxis type="number" dataKey="z" range={[50, 400]} name="Employees" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Departments" data={scatterData} fill={COLORS.purple} />
            </ScatterChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Bubble size represents number of employees
          </p>
        </div>
      </div>

      {/* Stacked Area Chart */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <div className="w-1 h-6 bg-teal-600 rounded mr-3"></div>
          Growth Distribution by Department
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={growthDistData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="High Growth" stackId="a" fill={COLORS.success} />
            <Bar dataKey="Stable" stackId="a" fill={COLORS.primary} />
            <Bar dataKey="Slow" stackId="a" fill={COLORS.warning} />
            <Bar dataKey="Declining" stackId="a" fill={COLORS.danger} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Employee Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Promotion Readiness by Department */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <div className="w-1 h-6 bg-indigo-600 rounded mr-3"></div>
            Promotion Readiness Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="promotionReady" 
                stroke={COLORS.purple} 
                fill={COLORS.purple} 
                fillOpacity={0.6}
                name="Promotion Ready"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Analysis */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <div className="w-1 h-6 bg-red-600 rounded mr-3"></div>
            At-Risk Employee Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="atRisk" fill={COLORS.danger} radius={[8, 8, 0, 0]} name="At Risk" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Details Table */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
          Detailed Department Metrics
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Employees</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avg Growth</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avg Performance</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Promotion Ready</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">At Risk</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((dept) => (
                <tr key={dept.department_name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {dept.department_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                    {dept.total_employees}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                      dept.average_growth_score >= 75 ? 'bg-green-100 text-green-800' :
                      dept.average_growth_score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {dept.average_growth_score}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                      dept.average_performance >= 75 ? 'bg-green-100 text-green-800' :
                      dept.average_performance >= 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {dept.average_performance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                    {dept.promotion_ready} ({((dept.promotion_ready / dept.total_employees) * 100).toFixed(0)}%)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                    {dept.at_risk} ({((dept.at_risk / dept.total_employees) * 100).toFixed(0)}%)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {dept.average_growth_score >= 70 ? (
                      <span className="text-green-600 font-medium">Excellent</span>
                    ) : dept.average_growth_score >= 50 ? (
                      <span className="text-yellow-600 font-medium">Good</span>
                    ) : (
                      <span className="text-red-600 font-medium">Needs Attention</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Key Insights & Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-2">🎯 Top Performing Department</h3>
            <p className="text-sm text-gray-600">
              {comparisonData.sort((a, b) => b.growth - a.growth)[0]?.name} leads with {comparisonData.sort((a, b) => b.growth - a.growth)[0]?.growth} average growth score
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-yellow-100">
            <h3 className="font-semibold text-gray-900 mb-2">⚠️ Needs Attention</h3>
            <p className="text-sm text-gray-600">
              {comparisonData.sort((a, b) => a.growth - b.growth)[0]?.name} requires development focus with {comparisonData.sort((a, b) => b.atRisk - a.atRisk)[0]?.atRisk} at-risk employees
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-green-100">
            <h3 className="font-semibold text-gray-900 mb-2">📈 Promotion Pipeline</h3>
            <p className="text-sm text-gray-600">
              {totalPromotionReady} employees ready for promotion - {((totalPromotionReady / totalEmployees) * 100).toFixed(1)}% of total workforce
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-purple-100">
            <h3 className="font-semibold text-gray-900 mb-2">🚀 Growth Opportunity</h3>
            <p className="text-sm text-gray-600">
              Focus training on departments with high potential but lower performance scores
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Report Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Schedule Report</h2>
              <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              // In a real app, send scheduleForm to backend
              alert(`Report scheduled!\nFrequency: ${scheduleForm.frequency}\nEmail: ${scheduleForm.email}`);
              setShowScheduleModal(false);
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency *
                </label>
                <select
                  value={scheduleForm.frequency}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, frequency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={scheduleForm.email}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, email: e.target.value })}
                  placeholder="your.email@company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Filter
                </label>
                <select
                  value={scheduleForm.department}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Range
                </label>
                <select
                  value={scheduleForm.timeRange}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, timeRange: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Time</option>
                  <option value="year">Last Year</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="month">Last Month</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                >
                  Schedule Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
