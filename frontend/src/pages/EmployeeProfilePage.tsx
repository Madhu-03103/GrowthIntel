import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getEmployeeOverview,
  getGrowthPrediction,
  simulateGrowth,
} from '../services/api';
import {
  TrendingUp,
  Award,
  AlertCircle,
  Target,
  Briefcase,
  Calendar,
  Mail,
  Badge,
} from 'lucide-react';
import clsx from 'clsx';

export default function EmployeeProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [overview, setOverview] = useState<any>(null);
  const [growthPred, setGrowthPred] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  // What-if simulation state
  const [simValues, setSimValues] = useState({
    performance_score: 0,
    skill_score: 0,
    learning_score: 0,
    leadership_score: 0,
  });

  useEffect(() => {
    if (id) {
      loadEmployeeData();
    }
  }, [id]);

  const loadEmployeeData = async () => {
    try {
      const [overviewData, growth] = await Promise.all([
        getEmployeeOverview(Number(id)),
        getGrowthPrediction(Number(id)).catch(() => null),
        
      ]);
      
      setOverview(overviewData);
      setGrowthPred(growth);

      
      // Initialize simulation values
      setSimValues({
        performance_score: overviewData.scores.performance,
        skill_score: overviewData.scores.skill,
        learning_score: overviewData.scores.learning,
        leadership_score: overviewData.scores.leadership,
      });
    } catch (error) {
      console.error('Failed to load employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async () => {
    if (!id) return;
    
    setSimulating(true);
    try {
      const result = await simulateGrowth(Number(id), simValues);
      setSimResult(result);
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading employee profile...</div>;
  }

  if (!overview) {
    return <div className="text-center py-12 text-gray-500">Employee not found</div>;
  }

  const getRiskColor = (level: string) => {
    const colors = {
      LOW: 'text-green-700 bg-green-50',
      MEDIUM: 'text-yellow-700 bg-yellow-50',
      HIGH: 'text-orange-700 bg-orange-50',
      CRITICAL: 'text-red-700 bg-red-50',
    };
    return colors[level as keyof typeof colors] || 'text-gray-700 bg-gray-50';
  };

  const getGrowthColor = (level: string) => {
    const colors = {
      HIGH_GROWTH: 'text-green-700 bg-green-50',
      STABLE_GROWTH: 'text-blue-700 bg-blue-50',
      SLOW_GROWTH: 'text-yellow-700 bg-yellow-50',
      DECLINING: 'text-red-700 bg-red-50',
    };
    return colors[level as keyof typeof colors] || 'text-gray-700 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-700">
                {overview.basic_info.full_name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {overview.basic_info.full_name}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Badge className="w-4 h-4" />
                  {overview.basic_info.employee_id}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {overview.basic_info.email}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {overview.basic_info.role || 'N/A'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {overview.basic_info.years_of_experience.toFixed(1)} years
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={clsx('px-3 py-1 rounded-full text-sm font-medium', getGrowthColor(overview.growth_intelligence.growth_level))}
            >
              {overview.growth_intelligence.growth_level.replace('_', ' ')}
            </span>
            <span
              className={clsx('px-3 py-1 rounded-full text-sm font-medium', getRiskColor(overview.growth_intelligence.risk_level))}
            >
              {overview.growth_intelligence.risk_level} Risk
            </span>
          </div>
        </div>
      </div>

      {/* Growth Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Growth Score</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{overview.scores.growth.toFixed(1)}</p>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${overview.scores.growth}%` }}
            />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Promotion Readiness</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {overview.growth_intelligence.promotion_readiness.toFixed(0)}%
          </p>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${overview.growth_intelligence.promotion_readiness}%` }}
            />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Performance</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{overview.scores.performance.toFixed(1)}</p>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${overview.scores.performance}%` }}
            />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Skill Score</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{overview.scores.skill.toFixed(1)}</p>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full"
              style={{ width: `${overview.scores.skill}%` }}
            />
          </div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Competency Breakdown</h2>
        <div className="space-y-4">
          {[
            { label: 'Performance', value: overview.scores.performance, color: 'bg-blue-500' },
            { label: 'Technical Skills', value: overview.scores.skill, color: 'bg-orange-500' },
            { label: 'Learning Activity', value: overview.scores.learning, color: 'bg-green-500' },
            { label: 'Leadership', value: overview.scores.leadership, color: 'bg-purple-500' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className="text-sm font-semibold text-gray-900">{item.value.toFixed(1)}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explainable AI */}
      {growthPred && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Growth Prediction Explanation</h2>
          <p className="text-gray-700 mb-4">{growthPred.explanation}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-green-700 mb-3">Positive Contributors</h3>
              <div className="space-y-2">
                {growthPred.positive_factors.map((factor: any, idx: number) => {
                  const [name, value] = Object.entries(factor)[0] as [string, number];
                  return (
                    <div key={idx} className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm text-gray-700">{name}</span>
                      <span className="text-sm font-semibold text-green-700">+{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {growthPred.negative_factors.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-red-700 mb-3">Areas for Improvement</h3>
                <div className="space-y-2">
                  {growthPred.negative_factors.map((factor: any, idx: number) => {
                    const [name, value] = Object.entries(factor)[0] as [string, number];
                    return (
                      <div key={idx} className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <span className="text-sm text-gray-700">{name}</span>
                        <span className="text-sm font-semibold text-red-700">{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* What-If Simulator */}
      <div className="card bg-gradient-to-br from-primary-50 to-purple-50 border-primary-200">
        <h2 className="text-xl font-semibold mb-4">What-If Career Simulator</h2>
        <p className="text-sm text-gray-600 mb-4">
          Adjust factors to see projected impact on growth and promotion readiness
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {Object.entries(simValues).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {key.replace('_', ' ').replace('score', '').trim()}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => setSimValues({ ...simValues, [key]: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>0</span>
                <span className="font-semibold">{value}</span>
                <span>100</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSimulate}
          disabled={simulating}
          className="btn-primary w-full md:w-auto"
        >
          {simulating ? 'Simulating...' : 'Run Simulation'}
        </button>

        {simResult && (
          <div className="mt-6 p-4 bg-white rounded-lg border border-primary-200">
            <h3 className="font-semibold mb-3">Simulation Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Current Growth Score</p>
                <p className="text-2xl font-bold text-gray-900">{simResult.current_growth_score}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Projected Growth Score</p>
                <p className="text-2xl font-bold text-green-600">{simResult.projected_growth_score}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Promotion Readiness</p>
                <p className="text-2xl font-bold text-gray-900">{simResult.current_promotion_readiness}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Projected Promotion Readiness</p>
                <p className="text-2xl font-bold text-purple-600">{simResult.projected_promotion_readiness}%</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-700 p-3 bg-blue-50 rounded">
              <strong>Impact:</strong> {simResult.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> AI-generated insights are decision-support recommendations and should 
          not be used as the sole basis for employment decisions.
        </p>
      </div>
    </div>
  );
}




