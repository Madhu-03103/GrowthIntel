import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, TrendingUp, Users, AlertCircle, Award, Lightbulb, BarChart3 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuickAction {
  icon: any;
  label: string;
  prompt: string;
  color: string;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI HR Assistant. I can help you with employee analytics, growth predictions, talent insights, and recommendations. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions: QuickAction[] = [
    {
      icon: TrendingUp,
      label: 'Growth Trends',
      prompt: 'Show me the current growth trends across all departments',
      color: 'bg-green-500'
    },
    {
      icon: Users,
      label: 'High Performers',
      prompt: 'Who are the top 10 high-performing employees?',
      color: 'bg-blue-500'
    },
    {
      icon: AlertCircle,
      label: 'At-Risk Analysis',
      prompt: 'Which employees are at risk and why?',
      color: 'bg-red-500'
    },
    {
      icon: Award,
      label: 'Promotion Ready',
      prompt: 'Who is ready for promotion and what are their key strengths?',
      color: 'bg-purple-500'
    },
    {
      icon: Lightbulb,
      label: 'Recommendations',
      prompt: 'Give me actionable recommendations to improve workforce performance',
      color: 'bg-yellow-500'
    },
    {
      icon: BarChart3,
      label: 'Department Insights',
      prompt: 'Compare department performance and identify areas for improvement',
      color: 'bg-indigo-500'
    }
  ];

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing with intelligent responses
    await new Promise(resolve => setTimeout(resolve, 1500));

    const messageLower = userMessage.toLowerCase();

    // Growth trends
    if (messageLower.includes('growth trend') || messageLower.includes('growth across')) {
      return `Based on current data analysis:

📈 **Growth Trends Overview:**
• Engineering: Strong upward trend (avg 78.5 growth score)
• Data Science: Exceptional performance (avg 82.1 growth score)
• Sales: Moderate growth (avg 65.3 growth score)
• Product: Steady improvement (avg 71.8 growth score)

**Key Insights:**
✅ 68% of employees show positive growth trajectory
✅ High Growth category increased by 12% this quarter
⚠️ Sales department needs targeted development programs

**Recommendation:** Focus on cross-functional training between Data Science and Sales teams to transfer best practices.`;
    }

    // High performers
    if (messageLower.includes('high perform') || messageLower.includes('top 10') || messageLower.includes('top performer')) {
      return `🏆 **Top 10 High-Performing Employees:**

1. **Sarah Williams** (Data Scientist)
   Growth Score: 94.2 | Promotion Ready: 92%

2. **Michael Chen** (Senior Engineer)
   Growth Score: 91.8 | Promotion Ready: 89%

3. **Emily Rodriguez** (Product Manager)
   Growth Score: 89.5 | Promotion Ready: 88%

4. **David Thompson** (Engineering Lead)
   Growth Score: 88.9 | Promotion Ready: 90%

5. **Lisa Anderson** (Senior Data Analyst)
   Growth Score: 87.6 | Promotion Ready: 85%

**Common Traits:**
• Consistently high performance scores (>85)
• Strong leadership potential
• Active in mentoring junior employees
• Cross-functional collaboration

**Action Items:**
✓ Consider for promotion pipeline
✓ Assign challenging projects
✓ Increase retention focus`;
    }

    // At-risk employees
    if (messageLower.includes('at risk') || messageLower.includes('at-risk')) {
      return `⚠️ **At-Risk Employee Analysis:**

**Critical (3 employees):**
• Performance decline >20% in last quarter
• Low engagement scores
• Skill gaps in core competencies

**High Risk (12 employees):**
• Stagnant growth for 6+ months
• Below-average performance scores
• Limited training participation

**Primary Risk Factors:**
1. Lack of development opportunities (45%)
2. Skill misalignment (30%)
3. Low manager engagement (15%)
4. Personal factors (10%)

**Immediate Actions:**
🎯 Schedule 1-on-1 check-ins
📚 Create personalized development plans
👥 Assign mentorship support
💡 Review role fit and potential transfers`;
    }

    // Promotion ready
    if (messageLower.includes('promotion') || messageLower.includes('ready for promotion')) {
      return `🌟 **Promotion-Ready Talent Pipeline:**

**Immediately Ready (15 employees):**
• Promotion Readiness Score: >85%
• Consistently exceeding expectations
• Leadership skills demonstrated

**Top Candidates:**

1. **Jennifer Martinez** - Software Engineer → Senior Engineer
   Strengths: Technical excellence, mentoring, innovation
   
2. **Robert Johnson** - Product Manager → Senior PM
   Strengths: Strategic thinking, stakeholder management
   
3. **Amanda Lee** - Data Analyst → Senior Analyst
   Strengths: Advanced analytics, project leadership

**Near Ready (28 employees - 6-12 months):**
• Readiness Score: 70-84%
• Need specific skill development

**Development Focus Areas:**
• Leadership & people management: 45%
• Strategic thinking: 30%
• Technical depth: 25%

**ROI Impact:**
Promoting from within saves avg $15K per hire and improves retention by 20%.`;
    }

    // Recommendations
    if (messageLower.includes('recommend') || messageLower.includes('improve')) {
      return `💡 **Strategic Recommendations:**

**1. Talent Development (Priority: HIGH)**
   • Launch mentorship program pairing high performers with developing talent
   • ROI: 15-20% improvement in growth scores
   • Timeline: 3 months to implement

**2. Performance Management**
   • Implement quarterly check-ins for at-risk employees
   • Early intervention can reduce attrition by 35%
   • Cost: Minimal, high impact

**3. Cross-Department Collaboration**
   • Create rotation programs between high and low performing departments
   • Knowledge transfer accelerates team growth
   • Expected lift: 10-15% in lagging departments

**4. Data-Driven Succession Planning**
   • Build promotion pipeline with current readiness data
   • Reduces external hiring needs by 25%
   • Improves internal mobility

**5. Skill Gap Closure**
   • Targeted training in identified weak areas
   • Focus on leadership, technical, and communication skills
   • Budget: $500-1000 per employee

**Expected Outcomes:**
📈 10-15% improvement in average growth scores
👥 20% reduction in attrition
💰 $200K+ savings in recruitment costs`;
    }

    // Department comparison
    if (messageLower.includes('department') || messageLower.includes('compare department')) {
      return `📊 **Department Performance Comparison:**

**🥇 Top Performer: Data Science**
• Avg Growth: 82.1 | Avg Performance: 84.5
• Strengths: Innovation, technical skills, collaboration
• Size: 45 employees
• Promotion Ready: 35%

**🥈 Second: Engineering**
• Avg Growth: 78.5 | Avg Performance: 79.2  
• Strengths: Delivery, problem-solving
• Size: 120 employees
• Promotion Ready: 28%

**🥉 Third: Product**
• Avg Growth: 71.8 | Avg Performance: 74.3
• Strengths: Strategy, communication
• Size: 35 employees
• Promotion Ready: 25%

**⚠️ Needs Attention: Sales**
• Avg Growth: 65.3 | Avg Performance: 68.1
• Challenges: Skill gaps, high attrition
• Size: 55 employees
• Promotion Ready: 18%

**Improvement Strategy for Sales:**
1. Hire senior talent for leadership
2. Implement structured training program
3. Cross-train with high-performing departments
4. Review compensation and incentives`;
    }

    // Default intelligent response
    return `I understand you're asking about "${userMessage}". 

I can provide insights on:
• 📊 Employee analytics and metrics
• 🎯 Growth predictions and trends  
• 👥 Talent identification and development
• ⚠️ Risk assessment and retention
• 🏆 Performance optimization
• 💡 Strategic HR recommendations

Could you please clarify what specific information you'd like? For example:
- "Show me top performers in Engineering"
- "What are the key retention risks?"
- "Recommend training priorities for Q4"
- "Compare growth across departments"`;
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await generateResponse(messageText);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI HR Assistant</h1>
            <p className="text-gray-600">Intelligent insights and recommendations powered by AI</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="flex flex-col items-center p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-md transition-all group"
                >
                  <div className={`${action.color} p-3 rounded-lg mb-2 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-primary-500'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-6 h-6 text-white" />
                ) : (
                  <Bot className="w-6 h-6 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={`flex-1 max-w-3xl ${
                  message.role === 'user' ? 'flex justify-end' : ''
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-primary-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t-2 border-gray-200 p-4 bg-gray-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about employee analytics, predictions, recommendations..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2 shadow-lg"
            >
              <Send className="w-5 h-5" />
              <span className="font-medium">Send</span>
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            AI responses are generated based on your employee data and analytics
          </p>
        </div>
      </div>
    </div>
  );
}
