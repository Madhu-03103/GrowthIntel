export interface Employee {
  id: number;
  employee_id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  department_id: number | null;
  role_id: number | null;
  joining_date: string;
  years_of_experience: number;
  performance_score: number;
  skill_score: number;
  learning_score: number;
  leadership_score: number;
  growth_score: number;
  promotion_readiness: number;
  growth_level: string;
  risk_level: string;
  user_role: string;
  department?: Department;
  role?: JobRole;
}

export interface EmployeeSummary {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  department_name: string | null;
  role_title: string | null;
  years_of_experience: number;
  performance_score: number;
  skill_score: number;
  growth_score: number;
  promotion_readiness: number;
  growth_level: string;
  risk_level: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
}

export interface JobRole {
  id: number;
  title: string;
  level: number;
  description?: string;
}

export interface GrowthPrediction {
  employee_id: number;
  growth_score: number;
  growth_category: string;
  confidence_score: number;
  positive_factors: Array<Record<string, number>>;
  negative_factors: Array<Record<string, number>>;
  explanation: string;
  prediction_date: string;
}

export interface PromotionPrediction {
  employee_id: number;
  promotion_probability: number;
  readiness_category: string;
  confidence_score: number;
  positive_factors: Array<Record<string, number>>;
  negative_factors: Array<Record<string, number>>;
  suggested_role: string | null;
  estimated_timeline_months: number | null;
  explanation: string;
  prediction_date: string;
}

export interface RiskAssessment {
  employee_id: number;
  risk_level: string;
  risk_score: number;
  risk_factors: Array<{
    factor: string;
    severity: string;
    description: string;
  }>;
  mitigation_actions: Array<{
    action: string;
    priority: string;
  }>;
  assessment_date: string;
}

export interface Recommendation {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  expected_impact: number | null;
  estimated_duration: string | null;
  status: string;
}

export interface DevelopmentPlan {
  id: number;
  employee_id: number;
  plan_name: string;
  duration_days: number;
  plan_data: {
    months?: Array<{
      month: number;
      focus_areas: string[];
      activities: string[];
    }>;
  };
  target_growth_score: number | null;
  target_skills: string[] | null;
  status: string;
  progress_percentage: number;
  start_date: string;
}

export interface AnalyticsOverview {
  summary: {
    total_employees: number;
    average_growth_score: number;
    promotion_ready_count: number;
    at_risk_count: number;
    high_potential_count: number;
    average_performance: number;
    average_skill_score: number;
  };
  growth_distribution: Record<string, number>;
  department_growth: Array<{
    department: string;
    average_growth: number;
    employee_count: number;
  }>;
  role_growth: Array<{
    role: string;
    average_growth: number;
    employee_count: number;
  }>;
  top_opportunities: Array<{
    employee_id: string;
    name: string;
    growth_score: number;
    promotion_readiness: number;
    gap: number;
  }>;
}

export interface WhatIfSimulation {
  modifications: Record<string, number>;
}

export interface WhatIfResult {
  current_growth_score: number;
  projected_growth_score: number;
  current_promotion_readiness: number;
  projected_promotion_readiness: number;
  improvement: number;
  factors_changed: string[];
  explanation: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  employee: {
    id: number;
    employee_id: string;
    email: string;
    full_name: string;
    role: string;
    department: string | null;
    job_role: string | null;
  };
}
