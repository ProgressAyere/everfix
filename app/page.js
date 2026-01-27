'use client';
import Link from 'next/link';
import { useState } from 'react';

const testimonials = [
  {
    text: "Amazing service! My phone was picked up, repaired, and returned within 24 hours. The engineer was professional and kept me updated throughout.",
    name: "Chioma A.",
    location: "Lagos"
  },
  {
    text: "I was worried about trusting someone with my phone, but the verification process gave me confidence. Highly recommend!",
    name: "Emeka O.",
    location: "Abuja"
  },
  {
    text: "No more stress of finding a repair shop. Everything was done from my home. The tracking feature is brilliant!",
    name: "Fatima M.",
    location: "Kano"
  }
];

export default function Home() {
  const [currentReview, setCurrentReview] = useState(0);

  const nextReview = () => setCurrentReview((prev) => (prev + 1) % testimonials.length);
  const prevReview = () => setCurrentReview((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center text-white py-20" style={{ backgroundImage: 'url(/background-image.png)' }}>
        <div className="absolute inset-0 bg-blue-900 bg-opacity-60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Fast, Safe Phone Repairs at Your Doorstep
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Verified engineers. Secure pickup. Real-time tracking. All across Nigeria.
          </p>
          <Link 
            href="/pickup" 
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Request a Pickup
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Request Pickup</h3>
              <p className="text-gray-600">Enter your location and phone issue. We'll match you with the nearest verified engineer.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">We Pick Up & Repair</h3>
              <p className="text-gray-600">Your phone is safely picked up, delivered to the engineer, and repaired with real-time updates.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Delivered Back to You</h3>
              <p className="text-gray-600">Once repaired, your phone is returned to your doorstep. Track everything from start to finish.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <p className="text-gray-600">Repairs Completed</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
              <p className="text-gray-600">Verified Engineers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">4.8★</div>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-gray-600">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Engineers */}
      <section id="engineers" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Verified Engineers You Can Trust</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Every engineer on our platform is thoroughly vetted, certified, and rated by customers like you.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-center mb-2">Certified Professionals</h3>
              <p className="text-gray-600 text-center text-sm">All engineers are verified with valid certifications and experience.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-center mb-2">Background Checked</h3>
              <p className="text-gray-600 text-center text-sm">Every engineer undergoes thorough background verification for your safety.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-center mb-2">Customer Rated</h3>
              <p className="text-gray-600 text-center text-sm">Real reviews from real customers help you choose the best engineer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Customers Say</h2>
          
          {/* Mobile Slider */}
          <div className="md:hidden relative">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">{testimonials[currentReview].text}</p>
              <p className="font-semibold">{testimonials[currentReview].name}</p>
              <p className="text-sm text-gray-500">{testimonials[currentReview].location}</p>
            </div>
            <button onClick={prevReview} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={nextReview} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.text}</p>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Fix Your Phone?</h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands of satisfied customers across Nigeria</p>
          <Link 
            href="/pickup" 
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Request a Pickup Now
          </Link>
        </div>
      </section>
    </div>
  );
}
