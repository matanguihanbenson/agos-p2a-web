import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Bot, 
  Download, 
  Mail, 
  Phone, 
  Github,
  Shield,
  Activity,
  Droplets,
  Recycle,
  Users,
  Globe,
  Play,
  Star,
  CheckCircle
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-7 w-7 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AGOS</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">Features</a>
              <a href="#impact" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">Impact</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">About</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">Contact</a>
              <Link 
                href="/admin/login" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-8 pb-8 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
  <div className="max-w-6xl mx-auto w-full">
    <div className="grid lg:grid-cols-2 gap-12 items-center relative">
      {/* Content */}
      <div className="space-y-6 z-10">
        <div className="space-y-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            Autonomous
            <span className="text-blue-600 block">River Cleanup</span>
            <span className="text-gray-700">Revolution</span>
          </h1>
          <p className="text-base text-gray-600 leading-relaxed max-w-lg">
            AGOS (Autonomous Garbage-cleaning Operation System) is revolutionizing 
            environmental protection through advanced robotic technology that 
            autonomously collects trash and monitors water quality in rivers.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium">
            <Download className="h-4 w-4" />
            <span>Download App</span>
          </button>
          <button className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 font-medium">
            <Play className="h-4 w-4" />
            <span>Watch Demo</span>
          </button>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-8 pt-6">
          <div className="text-left">
            <div className="text-2xl font-bold text-blue-600">150K+</div>
            <div className="text-sm text-gray-500">Trash Removed</div>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-blue-600">25+</div>
            <div className="text-sm text-gray-500">Inland Waters Cleaned</div>
          </div>
        </div>
      </div>
      {/* Overlapping Image */}
      <div className="relative flex justify-center lg:justify-end">
        <div className="relative w-[600px] h-[600px] lg:-ml-32 lg:-mr-8 z-0">
          <Image
            src="/img/agos-bot-image.png"
            alt="AGOS Autonomous River Cleaning Bot"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced technology meets environmental conservation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Bot className="h-6 w-6" />,
                title: "Autonomous Navigation",
                description: "AI-powered navigation system for intelligent river mapping and cleaning."
              },
              {
                icon: <Droplets className="h-6 w-6" />,
                title: "Water Quality Monitoring",
                description: "Real-time sensors providing comprehensive environmental data analysis."
              },
              {
                icon: <Recycle className="h-6 w-6" />,
                title: "Smart Trash Collection",
                description: "99.8% accuracy in identifying and collecting waste materials."
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Robust Design",
                description: "Weather-resistant construction for continuous operation."
              },
              {
                icon: <Activity className="h-6 w-6" />,
                title: "Real-time Monitoring",
                description: "Live tracking with instant alerts and comprehensive reporting."
              },
              {
                icon: <Globe className="h-6 w-6" />,
                title: "Remote Management",
                description: "Cloud-based control system for remote operation and management."
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

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                AGOS was developed by a passionate team of engineers, environmental scientists, 
                and technology innovators committed to creating sustainable solutions for our planet's 
                most pressing environmental challenges.
              </p>
              
              <div className="space-y-4">
                {[
                  { name: "Project Director", role: "AI Engineering & Strategy" },
                  { name: "Environmental Scientist", role: "Water Quality Analysis" },
                  { name: "Robotics Engineer", role: "Hardware & Navigation" },
                  { name: "Software Developer", role: "Mobile & Web Platform" }
                ].map((member, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-600">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Vision</h3>
                <p className="text-gray-600">
                  A world where advanced robotics and AI work harmoniously with nature 
                  to restore and maintain clean, healthy waterways for future generations.
                </p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Impact</h3>
                <p className="text-gray-600">
                  Revolutionizing environmental conservation through autonomous technology, 
                  making river cleanup efficient, sustainable, and scalable worldwide.
                </p>
              </div>
            </div>
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
              We'd love to hear from you.
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
