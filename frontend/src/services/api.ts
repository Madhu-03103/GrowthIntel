import axios from 'axios';
import type {
  Employee,
  EmployeeSummary,
  GrowthPrediction,
  PromotionPrediction,
  RiskAssessment,
  Recommendation,
  DevelopmentPlan,
  AnalyticsOverview,
  WhatIfResult,
  LoginCredentials,
  AuthResponse,
} from '../types';

// Use environment variable or fallback to relative URL
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Employees
export const getEmployees = async (params?: {
  skip?: number;
  limit?: number;
  department?: string;
  role?: string;
  growth_level?: string;
  risk_level?: string;
  search?: string;
}): Promise<EmployeeSummary[]> => {
  const response = await api.get<EmployeeSummary[]>('/employees/', { params });
  return response.data;
};

export const getEmployee = async (id: number): Promise<Employee> => {
  const response = await api.get<Employee>(`/employees/${id}`);
  return response.data;
};

export const getEmployeeOverview = async (id: number) => {
  const response = await api.get(`/employees/${id}/overview`);
  return response.data;
};

// Predictions
export const getGrowthPrediction = async (employeeId: number): Promise<GrowthPrediction> => {
  const response = await api.get<GrowthPrediction>(`/predictions/growth/${employeeId}`);
  return response.data;
};

export const getPromotionPrediction = async (employeeId: number): Promise<PromotionPrediction> => {
  const response = await api.get<PromotionPrediction>(`/predictions/promotion/${employeeId}`);
  return response.data;
};

export const getRiskAssessment = async (employeeId: number): Promise<RiskAssessment> => {
  const response = await api.get<RiskAssessment>(`/predictions/risks/${employeeId}`);
  return response.data;
};

export const getRecommendations = async (employeeId: number): Promise<Recommendation[]> => {
  const response = await api.get<Recommendation[]>(`/predictions/recommendations/${employeeId}`);
  return response.data;
};

export const getDevelopmentPlan = async (employeeId: number): Promise<DevelopmentPlan> => {
  const response = await api.get<DevelopmentPlan>(`/predictions/development-plan/${employeeId}`);
  return response.data;
};

export const simulateGrowth = async (
  employeeId: number,
  modifications: Record<string, number>
): Promise<WhatIfResult> => {
  const response = await api.post<WhatIfResult>('/predictions/simulate', {
    employee_id: employeeId,
    modifications,
  });
  return response.data;
};

// Analytics
export const getAnalyticsOverview = async (): Promise<AnalyticsOverview> => {
  const response = await api.get<AnalyticsOverview>('/analytics/overview');
  return response.data;
};

export const getDepartmentAnalytics = async () => {
  const response = await api.get('/analytics/departments');
  return response.data;
};

export const getGrowthTrends = async () => {
  const response = await api.get('/analytics/growth-trends');
  return response.data;
};

export default api;
