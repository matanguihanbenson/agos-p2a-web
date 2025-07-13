'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Bot, 
  Waves, 
  Leaf, 
  Users, 
  BarChart3, 
  Shield,
  ArrowRight,
  Play,
  Star,
  MapPin,
  Zap,
  Droplets,
  Menu,
  X,
  LogOut,
  User,
  Recycle,
  Activity,
  Globe,
  Download,
  Mail,
  Phone,
  Github,
  Eye,
  Navigation,
  FileText,
  AlertTriangle,
  Calendar
} from 'lucide-react';

export default function Home() {
  const { user, userData, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'impact', 'about', 'team', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getUserDisplayName = () => {
    if (userData) {
      return `${userData.firstname} ${userData.lastname}`;
    }
    return user?.email || 'User';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">AGOS</h1>
                <p className="text-xs text-gray-600">Autonomous River Cleaning</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`font-medium transition-colors ${activeSection === 'features' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>Features</a>
              <a href="#impact" className={`font-medium transition-colors ${activeSection === 'impact' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>Impact</a>
              <a href="#about" className={`font-medium transition-colors ${activeSection === 'about' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>About</a>
              <a href="#team" className={`font-medium transition-colors ${activeSection === 'team' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>Team</a>
              <a href="#contact" className={`font-medium transition-colors ${activeSection === 'contact' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>Contact</a>
            </nav>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      {getUserDisplayName()}
                    </span>
                  </div>
                  <Link
                    href="/admin/dashboard"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/admin/login"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Admin Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-blue-200/50">
              <div className="flex flex-col space-y-4">
                <a href="#features" className={`font-medium transition-colors ${activeSection === 'features' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>Features</a>
                <a href="#impact" className={`font-medium transition-colors ${activeSection === 'impact' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>Impact</a>
                <a href="#about" className={`font-medium transition-colors ${activeSection === 'about' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>About</a>
                <a href="#team" className={`font-medium transition-colors ${activeSection === 'team' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>Team</a>
                <a href="#contact" className={`font-medium transition-colors ${activeSection === 'contact' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>Contact</a>
                
                {user ? (
                  <div className="pt-4 border-t border-blue-200/50">
                    <div className="flex items-center space-x-2 mb-3">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        {getUserDisplayName()}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Link
                        href="/admin/dashboard"
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 text-center"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors text-center"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-blue-200/50">
                    <Link
                      href="/admin/login"
                      className="block px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 text-center"
                    >
                      Admin Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent block">
                Clean Rivers,
              </span>
              <span className="text-gray-800 block">Sustainable Future</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              AGOS uses cutting-edge autonomous technology to clean rivers and waterways, 
              protecting marine ecosystems while providing real-time environmental monitoring.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </button>
              <button className="inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200">
                Learn More
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { icon: <Bot className="h-8 w-8 text-blue-600" />, number: "12", label: "Active Bots" },
                { icon: <Users className="h-8 w-8 text-green-600" />, number: "25+", label: "Field Operators" },
                { icon: <Recycle className="h-8 w-8 text-purple-600" />, number: "1,234", label: "Trash Removed (kg)" },
                { icon: <Droplets className="h-8 w-8 text-cyan-600" />, number: "3", label: "Rivers Monitored" }
              ].map((stat, index) => (
                <div key={index} className="text-center bg-white/80 backdrop-blur rounded-lg p-4 shadow-sm">
                  <div className="flex justify-center mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features of AGOS That Make an Impact</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced technology meets environmental conservation through intelligent automation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Eye className="h-6 w-6" />,
                title: "Live Trash Detection & Mapping",
                description: "AGOS uses AI-powered object detection to identify and map floating trash in real time, giving users a clear view of pollution hotspots and types of waste present."
              },
              {
                icon: <Navigation className="h-6 w-6" />,
                title: "Autonomous Boat Control & Emergency Recall",
                description: "Users can monitor, deploy, and recall cleanup boats remotely, with built-in safety overrides and real-time status tracking for each boat."
              },
              {
                icon: <Droplets className="h-6 w-6" />,
                title: "Water Quality Monitoring",
                description: "The system continuously tracks key water quality indicators like pH and turbidity, making it easy to spot changes and address environmental concerns."
              },
              {
                icon: <Calendar className="h-6 w-6" />,
                title: "Automated Cleanup Scheduling",
                description: "Schedule and manage cleanup operations for individual boats or entire fleets, allowing efficient, regular maintenance without manual coordination."
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: "Data-Driven Insights & Reporting",
                description: "AGOS generates easy-to-understand reports and interactive dashboards showing collected waste statistics, water quality trends, and progress over time—ready for LGUs, NGOs, and stakeholders."
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Personalized Field Operator Tools",
                description: "Field operators can view assigned boat status, access their own cleanup stats, and receive real-time alerts for weather or emergency events—all designed for efficient on-the-ground operations."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 bg-blue-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Environmental Impact</h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Real-world impact in environmental conservation and river restoration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "1234", label: "Trash Collected", icon: <Recycle className="h-6 w-6" /> },
              { number: "3", label: "Rivers Monitored", icon: <Droplets className="h-6 w-6" /> },
              { number: "120", label: "Liters Water Analyzed", icon: <Activity className="h-6 w-6" /> },
              { number: "10+", label: "Field Operators", icon: <Users className="h-6 w-6" /> }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-white mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Our Mission */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                AGOS is dedicated to revolutionizing river cleanup and environmental monitoring through 
                innovative autonomous technology. We combine cutting-edge AI, robotics, and real-time 
                data analysis to provide sustainable solutions for water pollution challenges, empowering 
                communities and organizations to protect and restore our waterways for future generations.
              </p>
            </div>

            <div className="w-full">
              <div className="overflow-hidden">
                <Image 
                  src="/img/agos-bot-image.png" 
                  alt="AGOS Autonomous Cleaning Bot" 
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              A diverse group of passionate individuals working together to create 
              innovative solutions for environmental conservation and sustainable technology.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Mark Benson Matanguihan", role: "Full-Stack Developer & Mobile App Lead", team: "Software", color: "blue" },
              { name: "Jacqueline Reyes", role: "AI/ML Engineer & Technical Documentation", team: "Software", color: "blue" },
              { name: "Alexandra Andrea Fortu", role: "Data Scientist & Documentation Specialist", team: "Software", color: "blue" },
              { name: "Mk Cañanes", role: "Hardware Engineer & 3D Design", team: "Hardware", color: "green" },
              { name: "Maria Aceveda", role: "Robotics Engineer & System Architecture", team: "Hardware", color: "green" },
              { name: "Kimberly Mataba", role: "Business Analyst & Market Validation Lead", team: "Business", color: "purple" }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className={`w-16 h-16 bg-${member.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {member.team === "Software" && <Users className={`h-8 w-8 text-${member.color}-600`} />}
                  {member.team === "Hardware" && <Bot className={`h-8 w-8 text-${member.color}-600`} />}
                  {member.team === "Business" && <BarChart3 className={`h-8 w-8 text-${member.color}-600`} />}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                <span className={`inline-block px-3 py-1 bg-${member.color}-100 text-${member.color}-700 text-xs rounded-full font-medium`}>
                  {member.team} Team
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center-right bg-no-repeat"
          style={{ backgroundImage: 'url(/img/dowload.png)' }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">Download AGOS Mobile App</h2>
          <p className="text-lg text-white mb-12 max-w-2xl mx-auto">
            Get real-time access to river monitoring data, bot status updates, and environmental 
            reports directly on your mobile device.
          </p>
          
          <div className="flex justify-center space-x-4">
            <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-3">
              <Download className="h-5 w-5" />
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="font-semibold">App Store</div>
              </div>
            </button>
            <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-3">
              <Download className="h-5 w-5" />
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="font-semibold">Google Play</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Interested in learning more about AGOS or partnering with us? 
              We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <Mail className="h-6 w-6 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">contact@agos-systems.com</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <Phone className="h-6 w-6 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <Github className="h-6 w-6 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Open Source</h3>
              <p className="text-gray-600">github.com/agos-systems</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">AGOS</span>
              </div>
              <p className="text-gray-400 text-sm">
                Revolutionizing environmental conservation through autonomous technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#about" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 AGOS Systems. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

