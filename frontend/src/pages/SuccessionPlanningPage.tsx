import { useState, useEffect } from 'react';
import { Users, AlertTriangle, Award, Target, CheckCircle } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import LoadingSpinner from '../components/LoadingSpinner';

interface SuccessorCandidate {
  id: number;
  name: string;
  current_role: string;
  target_role: string;
  readiness: number;
  readiness_timeline: string;
  strengths: string[];
  development_needs: string[];
  risk_level: string;
}

interface CriticalPosition {
  role: string;
  department: string;
  current_holder: string;
  successor_count: number;
  risk_status: string;
  avg_readiness: number;
}

export default function SuccessionPlanningPage() {
  const [loading, setLoading] = useState(true);
  const [successors, setSuccessors] = useState<SuccessorCandidate[]>([]);
  const [criticalPositions, setCriticalPositions] = useState<CriticalPosition[]>([]);
  const [selectedTimeline, setSelectedTimeline] = useState<string>('all');

  useEffect(() => {
    loadSuccessionData();
  }, []);

  const loadSuccessionData = async () => {
    setLoading(true);
    try {
      // Simulate data - in production, fetch from API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSuccessors([
        {
          id: 1,
          name: 'Sarah Williams',
          current_role: 'Senior Data Scientist',
          target_role: 'Data Science Manager',
          readiness: 92,
          readiness_timeline: 'Ready Now',
          strengths: ['Leadership', 'Technical Excellence', 'Mentoring'],
          development_needs: ['Budget Management'],
          risk_level: 'LOW'
        },
        {
          id: 2,
          name: 'Michael Chen',
          current_role: 'Senior Software Engineer',
          target_role: 'Engineering Manager',
          readiness: 88,
          readiness_timeline: 'Ready Now',
          strengths: ['Architecture', 'Team Collaboration', 'Problem Solving'],
          development_needs: ['People Management'],
          risk_level: 'LOW'
        },
        {
          id: 3,
          name: 'Emily Rodriguez',
          current_role: 'Product Manager',
          target_role: 'Senior Product Manager',
          readiness: 85,
          readiness_timeline: '3-6 Months',
          strengths: ['Strategy', 'Stakeholder Management'],
          development_needs: ['Cross-functional Leadership'],
          risk_level: 'MEDIUM'
        },
        {
          id: 4,
          name: 'David Thompson',
          current_role: 'Engineering Lead',
          target_role: 'VP of Engineering',
          readiness: 75,
          readiness_timeline: '6-12 Months',
          strengths: ['Technical Vision', 'Delivery'],
          development_needs: ['Strategic Planning', 'Executive Communication'],
          risk_level: 'MEDIUM'
        },
        {
          id: 5,
          name: 'Lisa Anderson',
          current_role: 'Senior Data Analyst',
          target_role: 'Analytics Manager',
          readiness: 82,
          readiness_timeline: '3-6 Months',
          strengths: ['Analytics', 'Communication'],
          development_needs: ['Team Leadership'],
          risk_level: 'LOW'
        }
      ]);

      setCriticalPositions([
        {
          role: 'VP of Engineering',
          department: 'Engineering',
          current_holder: 'John Smith',
          successor_count: 2,
          risk_status: 'COVERED',
          avg_readiness: 78
        },
        {
          role: 'Data Science Manager',
          department: 'Data Science',
          current_holder: 'Jane Doe',
          successor_count: 3,
          risk_status: 'STRONG',
          avg_readiness: 87
        },
        {
          role: 'Product Director',
          department: 'Product',
          current_holder: 'Robert Johnson',
          successor_count: 1,
          risk_status: 'AT_RISK',
          avg_readiness: 65
        },
        {
          role: 'Sales Director',
          department: 'Sales',
          current_holder: 'Amanda Lee',
          successor_count: 0,
          risk_status: 'CRITICAL',
          avg_readiness: 0
        }
      ]);
    } catch (error) {
      console.error('Failed to load succession data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReadinessColor = (readiness: number) => {
    if (readiness >= 85) return 'text-green-600 bg-green-100';
    if (readiness >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskBadgeColor = (risk: string) => {
    const colors = {
      CRITICAL: 'bg-red-100 text-red-800 border-red-200',
      AT_RISK: 'bg-orange-100 text-orange-800 border-orange-200',
      COVERED: 'bg-blue-100 text-blue-800 border-blue-200',
      STRONG: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[risk as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredSuccessors = selectedTimeline === 'all' 
    ? successors 
    : successors.filter(s => s.readiness_timeline === selectedTimeline);

  const metrics = {
    total_successors: successors.length,
    ready_now: successors.filter(s => s.readiness_timeline === 'Ready Now').length,
    critical_gaps: criticalPositions.filter(p => p.risk_status === 'CRITICAL').length,
    avg_readiness: Math.round(successors.reduce((acc, s) => acc + s.readiness, 0) / successors.length)
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Succession Planning</h1>
        <p className="text-gray-600 mt-2">Strategic talent pipeline and leadership readiness</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          label="Total Successors"
          value={metrics.total_successors}
          icon={Users}
          color="bg-blue-500"
        />
        <MetricCard
          label="Ready Now"
          value={metrics.ready_now}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <MetricCard
          label="Critical Gaps"
          value={metrics.critical_gaps}
          icon={AlertTriangle}
          color="bg-red-500"
        />
        <MetricCard
          label="Avg Readiness"
          value={`${metrics.avg_readiness}%`}
          icon={Award}
          color="bg-purple-500"
        />
      </div>

      {/* Critical Positions */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Critical Positions Coverage</h2>
            <p className="text-sm text-gray-600 mt-1">Key roles and succession readiness</p>
          </div>
        </div>

        <div className="space-y-4">
          {criticalPositions.map((position, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{position.role}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRiskBadgeColor(position.risk_status)}`}>
                      {position.risk_status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Department:</span>
                      <span className="ml-2 font-medium text-gray-900">{position.department}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Current:</span>
                      <span className="ml-2 font-medium text-gray-900">{position.current_holder}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Successors:</span>
                      <span className="ml-2 font-medium text-gray-900">{position.successor_count}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg Readiness:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {position.avg_readiness > 0 ? `${position.avg_readiness}%` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                {position.risk_status === 'CRITICAL' && (
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                )}
                {position.risk_status === 'STRONG' && (
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Successor Pipeline */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Successor Pipeline</h2>
            <p className="text-sm text-gray-600 mt-1">High-potential talent ready for advancement</p>
          </div>
          <div className="flex space-x-2">
            {['all', 'Ready Now', '3-6 Months', '6-12 Months'].map((timeline) => (
              <button
                key={timeline}
                onClick={() => setSelectedTimeline(timeline)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeline === timeline
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {timeline === 'all' ? 'All' : timeline}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {filteredSuccessors.map((successor) => (
            <div key={successor.id} className="border-2 border-gray-200 rounded-lg p-5 hover:border-primary-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{successor.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {successor.current_role} → {successor.target_role}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getReadinessColor(successor.readiness).split(' ')[0]}`}>
                      {successor.readiness}%
                    </div>
                    <div className="text-xs text-gray-600">Readiness</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getReadinessColor(successor.readiness)}`}>
                    {successor.readiness_timeline}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Strengths
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {successor.strengths.map((strength, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Target className="w-4 h-4 mr-2 text-blue-600" />
                    Development Needs
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {successor.development_needs.map((need, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                        {need}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
