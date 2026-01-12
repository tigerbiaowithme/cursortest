'use client';

import { useEffect, useState } from 'react';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  lastRun?: string;
}

export default function AIMarketingPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    n8nWebhookUrl: '',
  });

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/ai-marketing/workflows', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setWorkflows(data.workflows || []);
      }
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/ai-marketing/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowCreate(false);
        setFormData({ name: '', description: '', n8nWebhookUrl: '' });
        fetchWorkflows();
      }
    } catch (error) {
      console.error('Error creating workflow:', error);
    }
  };

  const handleRun = async (workflowId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`/api/ai-marketing/workflows/${workflowId}/run`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchWorkflows();
    } catch (error) {
      console.error('Error running workflow:', error);
    }
  };

  const handleToggleStatus = async (workflowId: string, currentStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`/api/ai-marketing/workflows/${workflowId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: currentStatus === 'active' ? 'inactive' : 'active',
        }),
      });
      fetchWorkflows();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AI营销宝</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          创建工作流
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">创建新工作流</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">工作流名称</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">工作流连接地址</label>
              <input
                type="text"
                value={formData.n8nWebhookUrl}
                onChange={(e) => setFormData({ ...formData, n8nWebhookUrl: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="输入工作流连接地址"
              />
              <p className="text-sm text-gray-500 mt-1">
                此地址将用于连接自动化营销工作流
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                创建
              </button>
              <button
                onClick={() => {
                  setShowCreate(false);
                  setFormData({ name: '', description: '', n8nWebhookUrl: '' });
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {workflows.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            暂无工作流，点击"创建工作流"开始
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">描述</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">最后运行</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workflows.map((workflow) => (
                <tr key={workflow.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {workflow.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {workflow.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      workflow.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {workflow.status === 'active' ? '活跃' : '未激活'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workflow.lastRun || '从未运行'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleRun(workflow.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      运行
                    </button>
                    <button
                      onClick={() => handleToggleStatus(workflow.id, workflow.status)}
                      className="text-green-600 hover:text-green-900"
                    >
                      {workflow.status === 'active' ? '停用' : '激活'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
