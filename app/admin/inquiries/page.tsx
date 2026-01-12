'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  createdAt: string;
  country?: string;
  read: boolean;
  replied: boolean;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, [filter]);

  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const status = filter === 'all' ? '' : filter;
      const url = `/api/inquiries${status ? `?status=${status}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      setInquiries(data.inquiries || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (inquiry: Inquiry) => {
    const mailtoLink = `mailto:${inquiry.email}?subject=Re: ${inquiry.subject}&body=Dear ${inquiry.name},%0D%0A%0D%0A`;
    window.location.href = mailtoLink;
    
    // 标记为已回复
    markAsReplied(inquiry._id);
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ read: true }),
      });
      fetchInquiries();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAsReplied = async (id: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ replied: true, read: true }),
      });
      fetchInquiries();
    } catch (error) {
      console.error('Error marking as replied:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">询盘管理</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            全部
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg ${filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            未读
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg ${filter === 'read' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            已读
          </button>
          <button
            onClick={() => setFilter('replied')}
            className={`px-4 py-2 rounded-lg ${filter === 'replied' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            已回复
          </button>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          暂无询盘
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">姓名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">邮箱</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">主题</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">国家</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inquiries.map((inquiry) => (
                <tr
                  key={inquiry._id}
                  className={!inquiry.read ? 'bg-blue-50' : ''}
                  onClick={() => setSelectedInquiry(inquiry)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(inquiry.createdAt), 'yyyy-MM-dd HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {inquiry.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {inquiry.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {inquiry.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {inquiry.country || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      inquiry.replied ? 'bg-green-100 text-green-800' :
                      inquiry.read ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {inquiry.replied ? '已回复' : inquiry.read ? '已读' : '未读'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReply(inquiry);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      回复
                    </button>
                    {!inquiry.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(inquiry._id);
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        标记已读
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 详情模态框 */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">询盘详情</h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="font-semibold">时间:</label>
                <p>{format(new Date(selectedInquiry.createdAt), 'yyyy-MM-dd HH:mm:ss')}</p>
              </div>
              <div>
                <label className="font-semibold">姓名:</label>
                <p>{selectedInquiry.name}</p>
              </div>
              <div>
                <label className="font-semibold">邮箱:</label>
                <p>{selectedInquiry.email}</p>
              </div>
              {selectedInquiry.phone && (
                <div>
                  <label className="font-semibold">电话:</label>
                  <p>{selectedInquiry.phone}</p>
                </div>
              )}
              {selectedInquiry.company && (
                <div>
                  <label className="font-semibold">公司:</label>
                  <p>{selectedInquiry.company}</p>
                </div>
              )}
              <div>
                <label className="font-semibold">主题:</label>
                <p>{selectedInquiry.subject}</p>
              </div>
              <div>
                <label className="font-semibold">内容:</label>
                <p className="whitespace-pre-wrap bg-gray-50 p-4 rounded">{selectedInquiry.message}</p>
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => {
                    handleReply(selectedInquiry);
                    setSelectedInquiry(null);
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  回复邮件
                </button>
                {!selectedInquiry.read && (
                  <button
                    onClick={() => {
                      markAsRead(selectedInquiry._id);
                      setSelectedInquiry(null);
                    }}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                  >
                    标记已读
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
