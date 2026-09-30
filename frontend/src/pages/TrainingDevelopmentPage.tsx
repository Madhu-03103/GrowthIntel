import { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Target, DollarSign, Award, Users, CheckCircle, Clock } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import LoadingSpinner from '../components/LoadingSpinner';

interface TrainingProgram {
  id: number;
  name: string;
  category: string;
  participants: number;
  completed: number;
  completion_rate: number;
  avg_rating: number;
  cost: number;
  skill_impact: string[];
}

interface SkillGap {
  skill: string;
  department: string;
  current_level: number;
  target_level: number;
  gap_percentage: number;
  affected_employees: number;
  priority: string;
}

export default function TrainingDevelopmentPage() {
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadTrainingData();
  }, []);

  const loadTrainingData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setPrograms([
        {
          id: 1,
          name: 'Leadership Essentials',
          category: 'Leadership',
          participants: 45,
          completed: 38,
          completion_rate: 84,
          avg_rating: 4.5,
          cost: 25000,
          skill_impact: ['People Management', 'Strategic Thinking', 'Communication']
        },
        {
          id: 2,
          name: 'Advanced Data Analytics',
          category: 'Technical',
          participants: 32,
          completed: 28,
          completion_rate: 88,
          avg_rating: 4.7,
          cost: 18000,
          skill_impact: ['Data Analysis', 'Python', 'Machine Learning']
        },
        {
          id: 3,
          name: 'Agile Project Management',
          category: 'Management',
          participants: 28,
          completed: 25,
          completion_rate: 89,
          avg_rating: 4.3,
          cost: 15000,
          skill_impact: ['Agile Methodology', 'Project Planning', 'Team Coordination']
        },
        {
          id: 4,
          name: 'Cloud Architecture Certification',
          category: 'Technical',
          participants: 22,
          completed: 15,
          completion_rate: 68,
          avg_rating: 4.6,
          cost: 30000,
          skill_impact: ['AWS', 'Cloud Infrastructure', 'DevOps']
        },
        {
          id: 5,
          name: 'Executive Communication',
          category: 'Soft Skills',
          participants: 18,
          completed: 17,
          completion_rate: 94,
          avg_rating: 4.8,
          cost: 12000,
          skill_impact: ['Public Speaking', 'Executive Presence', 'Storytelling']
        },
        {
          id: 6,
          name: 'Customer Success Mastery',
          category: 'Sales',
          participants: 35,
          completed: 30,
          completion_rate: 86,
          avg_rating: 4.4,
          cost: 20000,
          skill_impact: ['Customer Relations', 'Problem Solving', 'Product Knowledge']
        }
      ]);

      setSkillGaps([
        {
          skill: 'Machine Learning',
          department: 'Data Science',
          current_level: 65,
          target_level: 85,
          gap_percentage: 24,
          affected_employees: 12,
          priority: 'HIGH'
        },
        {
          skill: 'Leadership',
          department: 'Engineering',
          current_level: 58,
          target_level: 80,
          gap_percentage: 28,
          affected_employees: 18,
          priority: 'CRITICAL'
        },
        {
          skill: 'Cloud Architecture',
          department: 'Engineering',
          current_level: 62,
          target_level: 85,
          gap_percentage: 27,
          affected_employees: 15,
          priority: 'HIGH'
        },
        {
          skill: 'Strategic Planning',
          department: 'Product',
          current_level: 70,
          target_level: 85,
          gap_percentage: 18,
          affected_employees: 8,
          priority: 'MEDIUM'
        },
        {
          skill: 'Sales Techniques',
          department: 'Sales',
          current_level: 55,
          target_level: 80,
          gap_percentage: 31,
          affected_employees: 22,
          priority: 'CRITICAL'
        }
      ]);
    } catch (error) {
      console.error('Failed to load training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Leadership', 'Technical', 'Management', 'Soft Skills', 'Sales'];
  const filteredPrograms = selectedCategory === 'all' 
    ? programs 
    : programs.filter(p => p.category === selectedCategory);

  const totalParticipants = programs.reduce((acc, p) => acc + p.participants, 0);
  const totalCompleted = programs.reduce((acc, p) => acc + p.completed, 0);
  const avgCompletionRate = Math.round(programs.reduce((acc, p) => acc + p.completion_rate, 0) / programs.length);
  const totalInvestment = programs.reduce((acc, p) => acc + p.cost, 0);

  const getPriorityColor = (priority: string) => {
    const colors = {
      CRITICAL: 'bg-red-100 text-red-800 border-red-200',
      HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      LOW: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Training & Development</h1>
        <p className="text-gray-600 mt-2">Learning programs, skill development, and ROI tracking</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Participants"
          value={totalParticipants}
          icon={Users}
          trend={15}
          color="blue"
        />
        <MetricCard
          title="Completed"
          value={totalCompleted}
          icon={CheckCircle}
          trend={12}
          color="green"
        />
        <MetricCard
          title="Avg Completion"
          value={`${avgCompletionRate}%`}
          icon={Target}
          trend={8}
          color="purple"
        />
        <MetricCard
          title="Total Investment"
          value={`$${(totalInvestment / 1000).toFixed(0)}K`}
          icon={DollarSign}
          trend={-5}
          color="orange"
        />
      </div>

      {/* Skill Gaps */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Critical Skill Gaps</h2>
            <p className="text-sm text-gray-600 mt-1">Priority areas for development investment</p>
          </div>
        </div>

        <div className="space-y-4">
          {skillGaps.map((gap, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-gray-900">{gap.skill}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(gap.priority)}`}>
                      {gap.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{gap.department} • {gap.affected_employees} employees</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">{gap.gap_percentage}%</div>
                  <div className="text-xs text-gray-600">Gap</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Level</span>
                  <span className="font-medium">{gap.current_level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${gap.current_level}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Target Level</span>
                  <span className="font-medium text-green-600">{gap.target_level}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Training Programs */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Training Programs</h2>
            <p className="text-sm text-gray-600 mt-1">Active learning initiatives and completion status</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {filteredPrograms.map((program) => (
            <div key={program.id} className="border-2 border-gray-200 rounded-lg p-5 hover:border-primary-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{program.name}</h3>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium border border-primary-200">
                      {program.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {program.participants} participants
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                      {program.completed} completed
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-1 text-yellow-600" />
                      {program.avg_rating.toFixed(1)} rating
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-blue-600" />
                      ${(program.cost / 1000).toFixed(0)}K investment
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className={`text-2xl font-bold ${
                    program.completion_rate >= 85 ? 'text-green-600' :
                    program.completion_rate >= 70 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {program.completion_rate}%
                  </div>
                  <div className="text-xs text-gray-600">Completion</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      program.completion_rate >= 85 ? 'bg-green-500' :
                      program.completion_rate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${program.completion_rate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Skills Developed:</div>
                <div className="flex flex-wrap gap-2">
                  {program.skill_impact.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROI Summary */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Training ROI Analysis</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold">${(totalInvestment / 1000).toFixed(0)}K</div>
            <div className="text-purple-100">Total Investment</div>
          </div>
          <div>
            <div className="text-3xl font-bold">$320K</div>
            <div className="text-purple-100">Estimated Value Created</div>
          </div>
          <div>
            <div className="text-3xl font-bold">2.67x</div>
            <div className="text-purple-100">ROI Multiplier</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-purple-400">
          <p className="text-sm text-purple-100">
            Training programs have contributed to 18% improvement in performance scores and 25% reduction in skill-related bottlenecks.
          </p>
        </div>
      </div>
    </div>
  );
}
