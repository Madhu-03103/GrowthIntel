import { useState, useEffect } from 'react';
import { TrendingDown, AlertTriangle, DollarSign, UserMinus, UserCheck } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import LoadingSpinner from '../components/LoadingSpinner';

interface AttritionTrend {
  month: string;
  voluntary: number;
  involuntary: number;
  total: number;
}

interface FlightRiskEmployee {
  id: number;
  name: string;
  role: string;
  department: string;
  tenure_months: number;
  risk_score: number;
  risk_level: string;
  risk_factors: string[];
  retention_actions: string[];
}

interface DepartmentAttrition {
  department: string;
  headcount: number;
  attrition_rate: number;
  voluntary_exits: number;
  avg_tenure: number;
  risk_status: string;
}

export default function RetentionAttritionPage() {
  const [loading, setLoading] = useState(true);
  const [flightRiskEmployees, setFlightRiskEmployees] = useState<FlightRiskEmployee[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentAttrition[]>([]);
  const [attritionTrends, setAttritionTrends] = useState<AttritionTrend[]>([]);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');

  useEffect(() => {
    loadRetentionData();
  }, []);

  const loadRetentionData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setFlightRiskEmployees([
        {
          id: 1,
          name: 'Alex Martinez',
          role: 'Software Engineer',
          department: 'Engineering',
          tenure_months: 18,
          risk_score: 85,
          risk_level: 'CRITICAL',
          risk_factors: ['Below market compensation', 'Limited growth opportunities', 'High workload'],
          retention_actions: ['Salary review', 'Career path discussion', 'Workload rebalancing']
        },
        {
          id: 2,
          name: 'Jessica Kim',
          role: 'Product Manager',
          department: 'Product',
          tenure_months: 24,
          risk_score: 78,
          risk_level: 'HIGH',
          risk_factors: ['Lack of promotion', 'Team conflicts', 'Project dissatisfaction'],
          retention_actions: ['Promotion consideration', 'Team mediation', 'Role adjustment']
        },
        {
          id: 3,
          name: 'Ryan Cooper',
          role: 'Data Analyst',
          department: 'Analytics',
          tenure_months: 12,
          risk_score: 72,
          risk_level: 'HIGH',
          risk_factors: ['Skill underutilization', 'Limited mentorship'],
          retention_actions: ['Challenging projects', 'Mentor assignment']
        },
        {
          id: 4,
          name: 'Maria Garcia',
          role: 'Sales Executive',
          department: 'Sales',
          tenure_months: 30,
          risk_score: 65,
          risk_level: 'MEDIUM',
          risk_factors: ['Market opportunities', 'Commission structure'],
          retention_actions: ['Compensation review', 'Territory expansion']
        },
        {
          id: 5,
          name: 'Tom Wilson',
          role: 'Designer',
          department: 'Design',
          tenure_months: 15,
          risk_score: 68,
          risk_level: 'MEDIUM',
          risk_factors: ['Creative constraints', 'Tool limitations'],
          retention_actions: ['Creative autonomy', 'Tool upgrades']
        }
      ]);

      setDepartmentData([
        {
          department: 'Sales',
          headcount: 55,
          attrition_rate: 18.2,
          voluntary_exits: 10,
          avg_tenure: 22,
          risk_status: 'HIGH'
        },
        {
          department: 'Engineering',
          headcount: 120,
          attrition_rate: 12.5,
          voluntary_exits: 15,
          avg_tenure: 28,
          risk_status: 'MEDIUM'
        },
        {
          department: 'Product',
          headcount: 35,
          attrition_rate: 8.6,
          voluntary_exits: 3,
          avg_tenure: 32,
          risk_status: 'LOW'
        },
        {
          department: 'Data Science',
          headcount: 45,
          attrition_rate: 6.7,
          voluntary_exits: 3,
          avg_tenure: 36,
          risk_status: 'LOW'
        },
        {
          department: 'Design',
          headcount: 25,
          attrition_rate: 16.0,
          voluntary_exits: 4,
          avg_tenure: 20,
          risk_status: 'HIGH'
        }
      ]);

      setAttritionTrends([
        { month: 'Jan', voluntary: 3, involuntary: 1, total: 4 },
        { month: 'Feb', voluntary: 2, involuntary: 0, total: 2 },
        { month: 'Mar', voluntary: 4, involuntary: 1, total: 5 },
        { month: 'Apr', voluntary: 3, involuntary: 2, total: 5 },
        { month: 'May', voluntary: 5, involuntary: 0, total: 5 },
        { month: 'Jun', voluntary: 4, involuntary: 1, total: 5 }
      ]);
    } catch (error) {
      console.error('Failed to load retention data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    const colors = {
      CRITICAL: 'bg-red-100 text-red-800 border-red-200',
      HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      LOW: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredEmployees = selectedRiskLevel === 'all'
    ? flightRiskEmployees
    : flightRiskEmployees.filter(e => e.risk_level === selectedRiskLevel);

  const totalAttrition = attritionTrends.reduce((acc, t) => acc + t.total, 0);
  const avgAttritionRate = 11.2;
  const estimatedCost = totalAttrition * 75000; // Average cost per departure

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Retention & Attrition</h1>
        <p className="text-gray-600 mt-2">Flight risk analysis and turnover insights</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          label="Avg Attrition Rate"
          value={`${avgAttritionRate}%`}
          icon={TrendingDown}
          color="bg-green-500"
        />
        <MetricCard
          label="Total Exits (6mo)"
          value={totalAttrition}
          icon={UserMinus}
          color="bg-blue-500"
        />
        <MetricCard
          label="High Flight Risk"
          value={flightRiskEmployees.filter(e => e.risk_level === 'HIGH' || e.risk_level === 'CRITICAL').length}
          icon={AlertTriangle}
          color="bg-red-500"
        />
        <MetricCard
          label="Attrition Cost"
          value={`$${(estimatedCost / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          color="bg-purple-500"
        />
      </div>

      {/* Attrition Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">6-Month Attrition Trend</h2>
          <p className="text-sm text-gray-600 mt-1">Voluntary vs involuntary departures</p>
        </div>
        
        <div className="space-y-4">
          {attritionTrends.map((trend, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-16 text-sm font-medium text-gray-700">{trend.month}</div>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-orange-500 flex items-center justify-end pr-2"
                    style={{ width: `${(trend.voluntary / 8) * 100}%` }}
                  >
                    {trend.voluntary > 0 && (
                      <span className="text-xs font-medium text-white">{trend.voluntary}</span>
                    )}
                  </div>
                  <div 
                    className="absolute left-0 top-0 h-full bg-red-500 flex items-center justify-end pr-2"
                    style={{ 
                      left: `${(trend.voluntary / 8) * 100}%`,
                      width: `${(trend.involuntary / 8) * 100}%` 
                    }}
                  >
                    {trend.involuntary > 0 && (
                      <span className="text-xs font-medium text-white">{trend.involuntary}</span>
                    )}
                  </div>
                </div>
                <div className="w-16 text-right text-sm font-bold text-gray-900">{trend.total}</div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center space-x-6 pt-4 border-t">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
              <span className="text-sm text-gray-700">Voluntary</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-sm text-gray-700">Involuntary</span>
            </div>
          </div>
        </div>
      </div>

      {/* Department Attrition */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Department Attrition Analysis</h2>
          <p className="text-sm text-gray-600 mt-1">Turnover rates and risk status by department</p>
        </div>

        <div className="space-y-4">
          {departmentData.map((dept, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-gray-900">{dept.department}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRiskColor(dept.risk_status)}`}>
                    {dept.risk_status} RISK
                  </span>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    dept.attrition_rate > 15 ? 'text-red-600' :
                    dept.attrition_rate > 10 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {dept.attrition_rate}%
                  </div>
                  <div className="text-xs text-gray-600">Attrition</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Headcount:</span>
                  <span className="ml-2 font-medium">{dept.headcount}</span>
                </div>
                <div>
                  <span className="text-gray-600">Exits:</span>
                  <span className="ml-2 font-medium">{dept.voluntary_exits}</span>
                </div>
                <div>
                  <span className="text-gray-600">Avg Tenure:</span>
                  <span className="ml-2 font-medium">{dept.avg_tenure}mo</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flight Risk Employees */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Flight Risk Employees</h2>
            <p className="text-sm text-gray-600 mt-1">Employees at risk of leaving and retention strategies</p>
          </div>
          <div className="flex space-x-2">
            {['all', 'CRITICAL', 'HIGH', 'MEDIUM'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedRiskLevel(level)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedRiskLevel === level
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level === 'all' ? 'All' : level}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="border-2 border-gray-200 rounded-lg p-5 hover:border-primary-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{employee.name}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRiskColor(employee.risk_level)}`}>
                      {employee.risk_level} RISK
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {employee.role} • {employee.department} • {employee.tenure_months} months tenure
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className={`text-2xl font-bold ${
                    employee.risk_score >= 80 ? 'text-red-600' :
                    employee.risk_score >= 70 ? 'text-orange-600' : 'text-yellow-600'
                  }`}>
                    {employee.risk_score}
                  </div>
                  <div className="text-xs text-gray-600">Risk Score</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                    Risk Factors
                  </div>
                  <div className="space-y-1">
                    {employee.risk_factors.map((factor, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        {factor}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <UserCheck className="w-4 h-4 mr-2 text-green-600" />
                    Retention Actions
                  </div>
                  <div className="space-y-1">
                    {employee.retention_actions.map((action, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Impact */}
      <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Attrition Cost Impact</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold">${(estimatedCost / 1000000).toFixed(1)}M</div>
            <div className="text-red-100">Total Cost (6 months)</div>
          </div>
          <div>
            <div className="text-3xl font-bold">$75K</div>
            <div className="text-red-100">Avg Cost per Exit</div>
          </div>
          <div>
            <div className="text-3xl font-bold">$450K</div>
            <div className="text-red-100">Potential Savings</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-red-400">
          <p className="text-sm text-red-100">
            Reducing attrition by 20% through targeted retention efforts could save approximately $450K annually in recruitment and training costs.
          </p>
        </div>
      </div>
    </div>
  );
}
