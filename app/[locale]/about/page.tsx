'use client';

import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">About Us</h1>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-lg text-gray-700 mb-6">
              Welcome to Devos, your trusted business partner in international trade.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              We are committed to providing high-quality products and excellent service to our customers worldwide.
            </p>
            <p className="text-lg text-gray-700">
              With years of experience in the industry, we have built strong relationships with partners across the globe.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
