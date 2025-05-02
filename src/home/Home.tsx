import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft,
  ArrowRight,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { features, benefits, stats, testimonials, faqs, partners } from './data';

function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  const itemWidth = isMobile ? window.innerWidth - 32 : 400;
  const visibleItems = isMobile ? 1 : 3;
  const totalTestimonials = testimonials.length;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollTestimonials = useCallback((direction: 'prev' | 'next') => {
    setAutoScroll(false);
    setCurrentTestimonial(prev => {
      if (direction === 'prev') {
        return prev === 0 ? totalTestimonials - 1 : prev - 1;
      }
      return prev === totalTestimonials - 1 ? 0 : prev + 1;
    });
  }, [totalTestimonials]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoScroll) {
      interval = setInterval(() => {
        setCurrentTestimonial(prev => (prev === totalTestimonials - 1 ? 0 : prev + 1));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoScroll, totalTestimonials]);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">CRB Check</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#benefits" className="text-gray-600 hover:text-blue-600 transition-colors">Benefits</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Reviews</a>
              <Link to="/signin" className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors">Sign In</Link>
              <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </Link>
            </div>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
                <a href="#benefits" className="text-gray-600 hover:text-blue-600">Benefits</a>
                <a href="#testimonials" className="text-gray-600 hover:text-blue-600">Reviews</a>
                <Link to="/signin" className="text-blue-600 hover:text-blue-700">Sign In</Link>
                <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700">
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Credit Report, Simplified
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get instant access to your credit score and comprehensive report. Make informed financial decisions with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Check Your Score
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a 
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                Learn More
                <ChevronRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CRB Check?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get comprehensive credit insights with our powerful features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Benefits You'll Love
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover how our service can help you achieve your financial goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-start p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust CRB Check
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(-${currentTestimonial * itemWidth}px)`,
                  width: `${testimonials.length * itemWidth}px`
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={index}
                    style={{ width: itemWidth }}
                    className="px-4"
                  >
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <div className="flex items-center mb-4">
                        <img 
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <p className="text-gray-600 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="text-gray-600">{testimonial.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => scrollTestimonials('prev')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => scrollTestimonials('next')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Leading Banks
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We work with Kenya's top financial institutions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {partners.map((partner, index) => (
              <div 
                key={index}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl"
              >
                <partner.icon className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-600">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our service
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-left">{faq.question}</span>
                  <ChevronRight 
                    className={`w-5 h-5 transform transition-transform ${
                      activeFaq === index ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {activeFaq === index && (
                  <div className="p-4 bg-gray-50 rounded-b-lg">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Check Your Credit Score?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Kenyans who trust CRB Check for their credit reports
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-8 h-8" />
                <span className="text-2xl font-bold">CRB Check</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner in credit reporting and monitoring
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#benefits" className="text-gray-400 hover:text-white">Benefits</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white">Reviews</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@crbcheck.co.ke</li>
                <li>+254 (20) 123-4567</li>
                <li>Westlands Business Park<br />Nairobi, Kenya</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} CRB Check. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;