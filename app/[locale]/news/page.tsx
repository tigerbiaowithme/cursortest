'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  publishedAt?: string;
  views: number;
}

export default function NewsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blogs?published=true')
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.blogs || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">Latest News</h1>
          
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : blogs.length === 0 ? (
            <div className="text-center text-gray-500">No news available yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link key={blog._id} href={`/news/${blog.slug}`}>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      {blog.featuredImage ? (
                        <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                      {blog.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                      )}
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{new Date(blog.publishedAt || '').toLocaleDateString()}</span>
                        <span>{blog.views} views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
