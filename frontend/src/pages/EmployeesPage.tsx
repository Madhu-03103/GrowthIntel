import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployees } from '../services/api';
import type { EmployeeSummary } from '../types';
import { Search, Filter, Plus, Download, Edit2, Trash2, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import EmployeeModal from '../components/EmployeeModal';
import { ToastContainer } from '../components/Toast';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [toasts, setToasts] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    departments: [] as string[],
    roles: [] as string[],
    growthLevels: [] as string[],
    riskLevels: [] as string[],
    promotionReadinessMin: 0,
    promotionReadinessMax: 100
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadEmployees();
    loadDepartments();
    loadRoles();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      // Build query params from filters
      const params: any = { limit: 100 };
      
      // Apply filters to API call
      if (filters.departments.length > 0) {
        params.department = filters.departments[0]; // API supports one department at a time
      }
      if (filters.roles.length > 0) {
        params.role = filters.roles[0]; // API supports one role at a time
      }
      if (filters.growthLevels.length > 0) {
        params.growth_level = filters.growthLevels[0]; // API supports one level at a time
      }
      if (filters.riskLevels.length > 0) {
        params.risk_level = filters.riskLevels[0]; // API supports one level at a time
      }
      
      const data = await getEmployees(params);
      setEmployees(data);
    } catch (error) {
      console.error('Failed to load employees:', error);
      showToast('Failed to load employees', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      // Mock departments for now - in real app, add departments endpoint
      setDepartments([
        { id: 1, name: 'Engineering' },
        { id: 2, name: 'HR' },
        { id: 3, name: 'Sales' },
        { id: 4, name: 'Marketing' },
        { id: 5, name: 'Product' }
      ]);
    } catch (error) {
      console.error('Failed to load departments:', error);
    }
  };

  const loadRoles = async () => {
    try {
      // Mock roles for now - in real app, add roles endpoint
      setRoles([
        { id: 1, title: 'Software Engineer' },
        { id: 2, title: 'Senior Software Engineer' },
        { id: 3, title: 'HR Specialist' },
        { id: 4, title: 'Sales Representative' },
        { id: 5, title: 'Marketing Manager' },
        { id: 6, title: 'Product Manager' }
      ]);
    } catch (error) {
      console.error('Failed to load roles:', error);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const handleEditEmployee = (e: React.MouseEvent, emp: EmployeeSummary) => {
    e.stopPropagation();
    setEditingEmployee(emp);
    setShowModal(true);
  };

  const handleSaveEmployee = async (data: any) => {
    try {
      const token = localStorage.getItem('access_token');
      const url = editingEmployee
        ? `/api/employees/${editingEmployee.id}`
        : '/api/employees/';
      
      const response = await fetch(url, {
        method: editingEmployee ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to save employee');
      }

      showToast(
        editingEmployee ? 'Employee updated successfully' : 'Employee created successfully',
        'success'
      );
      setShowModal(false);
      loadEmployees();
    } catch (error: any) {
      showToast(error.message || 'Failed to save employee', 'error');
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      showToast('Employee deleted successfully', 'success');
      setDeleteConfirm(null);
      loadEmployees();
    } catch (error) {
      showToast('Failed to delete employee', 'error');
    }
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/employees/export/csv', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast('Export completed successfully', 'success');
    } catch (error) {
      showToast('Failed to export employees', 'error');
    }
  };

  const handleApplyFilters = () => {
    // Count active filters
    let count = 0;
    if (filters.departments.length > 0) count++;
    if (filters.roles.length > 0) count++;
    if (filters.growthLevels.length > 0) count++;
    if (filters.riskLevels.length > 0) count++;
    if (filters.promotionReadinessMin > 0 || filters.promotionReadinessMax < 100) count++;
    
    setActiveFiltersCount(count);
    setShowFilters(false);
    loadEmployees();
  };

  const handleClearFilters = () => {
    setFilters({
      departments: [],
      roles: [],
      growthLevels: [],
      riskLevels: [],
      promotionReadinessMin: 0,
      promotionReadinessMax: 100
    });
    setActiveFiltersCount(0);
  };

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const current = prev[category] as string[];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.full_name.toLowerCase().includes(search.toLowerCase()) ||
    emp.employee_id.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase())
  );

  const getRiskBadge = (level: string) => {
    const styles = {
      LOW: 'badge-success',
      MEDIUM: 'badge-warning',
      HIGH: 'badge-danger',
      CRITICAL: 'badge-danger',
    };
    return styles[level as keyof typeof styles] || 'badge-info';
  };

  const getGrowthBadge = (level: string) => {
    const styles = {
      HIGH_GROWTH: 'badge-success',
      STABLE_GROWTH: 'badge-info',
      SLOW_GROWTH: 'badge-warning',
      DECLINING: 'badge-danger',
    };
    return styles[level as keyof typeof styles] || 'badge-info';
  };

  if (loading) {
    return <div className="text-center py-12">Loading employees...</div>;
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Directory</h1>
          <p className="text-gray-600 mt-1">{employees.length} total employees</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadEmployees}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handleAddEmployee}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button 
            onClick={() => setShowFilters(true)}
            className="btn-secondary flex items-center gap-2 relative"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Employee Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department / Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => navigate(`/employees/${emp.id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-gray-900">{emp.full_name}</p>
                      <p className="text-sm text-gray-500">{emp.employee_id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-900">{emp.department_name || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{emp.role_title || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {emp.years_of_experience.toFixed(1)} years
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 mr-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={clsx(
                              'h-full rounded-full',
                              emp.growth_score >= 75
                                ? 'bg-green-500'
                                : emp.growth_score >= 50
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            )}
                            style={{ width: `${emp.growth_score}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {emp.growth_score.toFixed(0)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className={clsx('badge', getGrowthBadge(emp.growth_level))}>
                        {emp.growth_level.replace('_', ' ')}
                      </span>
                      <span className={clsx('badge', getRiskBadge(emp.risk_level))}>
                        {emp.risk_level} Risk
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleEditEmployee(e, emp)}
                        className="text-primary-600 hover:text-primary-900"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(emp.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No employees found matching your search
        </div>
      )}

      {/* Employee Modal */}
      {showModal && (
        <EmployeeModal
          employee={editingEmployee}
          onClose={() => setShowModal(false)}
          onSave={handleSaveEmployee}
          departments={departments}
          roles={roles}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this employee? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEmployee(deleteConfirm)}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Filter Employees</h2>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                <Filter className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departments
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {departments.map(dept => (
                    <label key={dept.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={filters.departments.includes(dept.name)}
                        onChange={() => toggleFilter('departments', dept.name)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{dept.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roles
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map(role => (
                    <label key={role.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={filters.roles.includes(role.title)}
                        onChange={() => toggleFilter('roles', role.title)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{role.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Growth Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Growth Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['HIGH_GROWTH', 'STABLE_GROWTH', 'SLOW_GROWTH', 'DECLINING'].map(level => (
                    <label key={level} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={filters.growthLevels.includes(level)}
                        onChange={() => toggleFilter('growthLevels', level)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{level.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Risk Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(level => (
                    <label key={level} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={filters.riskLevels.includes(level)}
                        onChange={() => toggleFilter('riskLevels', level)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Promotion Readiness Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promotion Readiness: {filters.promotionReadinessMin}% - {filters.promotionReadinessMax}%
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.promotionReadinessMin}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        promotionReadinessMin: parseInt(e.target.value) 
                      }))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">Min: {filters.promotionReadinessMin}%</div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.promotionReadinessMax}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        promotionReadinessMax: parseInt(e.target.value) 
                      }))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">Max: {filters.promotionReadinessMax}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear All Filters
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
