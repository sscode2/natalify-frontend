import React from 'react';
import { 
  Shield, 
  Truck, 
  Star, 
  Users, 
  Award, 
  Heart, 
  Target, 
  Eye,
  CheckCircle,
  Globe,
  Smartphone,
  ShoppingBag
} from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { icon: Users, number: '50,000+', label: 'Happy Customers' },
    { icon: ShoppingBag, number: '100,000+', label: 'Orders Delivered' },
    { icon: Award, number: '1,000+', label: 'Quality Products' },
    { icon: Globe, number: '64', label: 'Districts Covered' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'We guarantee 100% authentic products sourced directly from verified suppliers and manufacturers.'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Our customers are at the heart of everything we do. We strive to exceed expectations with every interaction.'
    },
    {
      icon: Truck,
      title: 'Reliable Delivery',
      description: 'Fast, secure, and free delivery across Bangladesh with real-time tracking and careful handling.'
    },
    {
      icon: Star,
      title: 'Excellence',
      description: 'We continuously improve our services and maintain the highest standards in e-commerce.'
    }
  ];

  const features = [
    {
      icon: Smartphone,
      title: 'Mobile-First Experience',
      description: 'Optimized for mobile devices with a responsive design that works perfectly on any screen size.'
    },
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: 'Advanced security measures to protect your personal information and ensure safe transactions.'
    },
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'Enjoy free delivery across all 64 districts of Bangladesh with no minimum order requirements.'
    },
    {
      icon: CheckCircle,
      title: 'Easy Returns',
      description: '7-day hassle-free return policy with quick refunds and exchanges for your peace of mind.'
    }
  ];

  const team = [
    {
      name: 'Rifat Ahmed',
      role: 'Founder & CEO',
      description: 'Passionate about bringing quality products to Bangladesh through innovative e-commerce solutions.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'Fatima Khan',
      role: 'Head of Operations',
      description: 'Ensures smooth operations and timely delivery of products across Bangladesh.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b494?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'Arif Rahman',
      role: 'Technology Lead',
      description: 'Develops cutting-edge technology solutions to enhance the shopping experience.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-orange-300">BuyIn</span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Your trusted e-commerce partner in Bangladesh, bringing quality products 
              and exceptional service to your doorstep.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-xl mb-6">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To revolutionize e-commerce in Bangladesh by providing easy access to quality products, 
                exceptional customer service, and a seamless shopping experience that connects local 
                communities with the digital economy.
              </p>
            </div>
            
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-xl mb-6">
                <Eye className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To become Bangladesh's most trusted and innovative e-commerce platform, 
                empowering millions of customers with convenient access to authentic products 
                while supporting local businesses and economic growth.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600">Numbers that speak for themselves</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-xl shadow-sm mb-4">
                    <IconComponent className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These fundamental principles guide every decision we make and every interaction we have.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-xl mb-6 group-hover:bg-primary-600 transition-colors">
                    <IconComponent className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose BuyIn?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're committed to providing the best online shopping experience in Bangladesh.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <IconComponent className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2024, BuyIn began with a simple yet ambitious vision: to make quality 
                  products accessible to every corner of Bangladesh through innovative e-commerce solutions.
                </p>
                <p>
                  Starting as a small team of passionate entrepreneurs, we recognized the gap between 
                  traditional retail and the digital needs of modern Bangladeshi consumers. Our founders 
                  combined their expertise in technology, business, and customer service to create a 
                  platform that truly serves the local market.
                </p>
                <p>
                  Today, we're proud to serve customers across all 64 districts of Bangladesh, 
                  delivering not just products, but also trust, reliability, and exceptional service. 
                  Our commitment to authenticity, fast delivery, and customer satisfaction has made 
                  us a trusted name in Bangladeshi e-commerce.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-orange-100 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-6 h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-3xl">B</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">BuyIn</h3>
                    <p className="text-gray-600">Your Trusted E-commerce Partner</p>
                    <div className="mt-4 flex justify-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind BuyIn's success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="hero-gradient text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust BuyIn for their shopping needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Shopping
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;