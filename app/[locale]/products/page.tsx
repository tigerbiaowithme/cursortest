'use client';

import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';

export default function ProductsPage() {
  const products = [
    { id: 1, name: 'Product 1', description: 'High quality product', image: '/images/product1.jpg' },
    { id: 2, name: 'Product 2', description: 'Premium quality product', image: '/images/product2.jpg' },
    { id: 3, name: 'Product 3', description: 'Best quality product', image: '/images/product3.jpg' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">Our Products</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Product Image</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
