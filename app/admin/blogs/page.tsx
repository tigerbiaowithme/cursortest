'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  views: number;
  publishedAt?: string;
}

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    published: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    metaTags: '',
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/blogs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: editingBlog ? formData.slug : generateSlug(title),
      seoTitle: formData.seoTitle || title,
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingBlog ? `/api/blogs/${editingBlog.slug}` : '/api/blogs';
      const method = editingBlog ? 'PUT' : 'POST';

      const keywords = formData.seoKeywords
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          seoKeywords: keywords,
        }),
      });

      if (response.ok) {
        setShowEditor(false);
        setEditingBlog(null);
        setFormData({
          title: '',
          slug: '',
          content: '',
          excerpt: '',
          published: false,
          seoTitle: '',
          seoDescription: '',
          seoKeywords: '',
          metaTags: '',
        });
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt || '',
      published: blog.published,
      seoTitle: blog.seoTitle || blog.title,
      seoDescription: blog.seoDescription || '',
      seoKeywords: blog.seoKeywords?.join(', ') || '',
      metaTags: '',
    });
    setShowEditor(true);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`/api/blogs/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`/api/blogs/${blog.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...blog,
          published: !blog.published,
        }),
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">博客管理</h1>
        <button
          onClick={() => {
            setEditingBlog(null);
            setFormData({
              title: '',
              slug: '',
              content: '',
              excerpt: '',
              published: false,
              seoTitle: '',
              seoDescription: '',
              seoKeywords: '',
              metaTags: '',
            });
            setShowEditor(true);
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          新建文章
        </button>
      </div>

      {showEditor ? (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block font-semibold mb-2">标题 *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="输入文章标题"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">URL (Slug) *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="url-friendly-slug"
            />
            <p className="text-sm text-gray-500 mt-1">
              完整URL: {typeof window !== 'undefined' && `${window.location.origin}/news/${formData.slug}`}
            </p>
          </div>

          <div>
            <label className="block font-semibold mb-2">摘要</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
              placeholder="文章摘要"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">内容 *</label>
            <ReactQuill
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              theme="snow"
              style={{ minHeight: '300px' }}
            />
          </div>

          {/* SEO 设置 */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">SEO 设置</h3>
            
            <div className="mb-4">
              <label className="block font-semibold mb-2">SEO 标题</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="搜索引擎优化标题"
              />
              <p className="text-sm text-gray-500 mt-1">
                长度: {formData.seoTitle.length} / 60 字符
              </p>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">SEO 描述</label>
              <textarea
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                placeholder="搜索引擎优化描述"
              />
              <p className="text-sm text-gray-500 mt-1">
                长度: {formData.seoDescription.length} / 160 字符
              </p>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">关键词 (用逗号分隔)</label>
              <input
                type="text"
                value={formData.seoKeywords}
                onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="关键词1, 关键词2, 关键词3"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">预览</h4>
              <div className="border rounded p-3">
                <div className="text-blue-600 text-sm mb-1">
                  {typeof window !== 'undefined' && `${window.location.hostname}/news/${formData.slug}`}
                </div>
                <div className="text-lg text-blue-600 mb-1">
                  {formData.seoTitle || formData.title || '标题'}
                </div>
                <div className="text-sm text-gray-600">
                  {formData.seoDescription || formData.excerpt || '描述'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="mr-2"
              />
              <span>立即发布</span>
            </label>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              保存
            </button>
            <button
              onClick={() => {
                setShowEditor(false);
                setEditingBlog(null);
              }}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">标题</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">浏览量</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {blog.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    /news/{blog.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      blog.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {blog.published ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {blog.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleTogglePublish(blog)}
                      className="text-green-600 hover:text-green-900"
                    >
                      {blog.published ? '取消发布' : '发布'}
                    </button>
                    <button
                      onClick={() => handleDelete(blog.slug)}
                      className="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
