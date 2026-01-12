'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dynamic from 'next/dynamic';

const WorldMap = dynamic(
  () => import('react-simple-maps').then((mod) => mod.ComposableMap),
  { ssr: false }
);
const Geographies = dynamic(
  () => import('react-simple-maps').then((mod) => mod.Geographies),
  { ssr: false }
);
const Geography = dynamic(
  () => import('react-simple-maps').then((mod) => mod.Geography),
  { ssr: false }
);

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/analytics?period=month');
      if (!response.ok) {
        throw new Error('API 请求失败');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // 设置空数据，让页面可以显示
      setStats({
        inquiryCount: 0,
        monthlyVisits: 0,
        dailyVisits: 0,
        visitStats: [],
        topPages: [],
        countryStats: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  const visitData = stats?.visitStats?.map((item: any) => ({
    date: item._id,
    visits: item.count,
  })) || [];

  const topPagesData = stats?.topPages?.map((item: any) => ({
    page: item._id,
    visits: item.count,
  })) || [];

  const countryData = stats?.countryStats || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">数据统计</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">询盘数</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.inquiryCount || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">月访问量</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.monthlyVisits || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">日访问量</h3>
          <p className="text-3xl font-bold text-purple-600">{stats?.dailyVisits || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">热门页面数</h3>
          <p className="text-3xl font-bold text-orange-600">{topPagesData.length}</p>
        </div>
      </div>

      {/* 访问量趋势图 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">访问量趋势</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={visitData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="visits" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 热门页面 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">热门页面</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topPagesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="page" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visits" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 世界地图 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">访客来源地图</h2>
          <div className="h-96">
            {typeof window !== 'undefined' && (
              <WorldMap projectionConfig={{ scale: 150 }}>
                <Geographies geography={geoUrl}>
                  {({ geographies }: any) =>
                    geographies.map((geo: any) => {
                      const countryCode = geo.properties.ISO_A2;
                      const countryStat = countryData.find((c: any) => c._id === countryCode);
                      const fill = countryStat ? '#3b82f6' : '#e5e7eb';
                      
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fill}
                          stroke="#fff"
                          style={{
                            default: { outline: 'none' },
                            hover: { outline: 'none', fill: '#2563eb' },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </WorldMap>
            )}
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">国家统计</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {countryData.slice(0, 10).map((item: any) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item._id}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
