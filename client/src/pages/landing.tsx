import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Box, FolderSync, ChartLine, Target, Calculator, Scale } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function Landing() {
  // Dynamic statistics
  const [currentStats, setCurrentStats] = useState({
    activeTraders: 1, // Start with current actual count
    trackedVolume: 0, // Start with actual tracked volume
  });

  // Simulate real-time updates (could be replaced with actual API calls)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStats(prev => ({
        activeTraders: prev.activeTraders + Math.floor(Math.random() * 3), // Gradual increase
        trackedVolume: prev.trackedVolume + (Math.random() * 1000000), // Add trading volume
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(1)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(0)}K`;
    }
    return `$${num.toFixed(0)}`;
  };

  const formatTraderCount = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K+`;
    }
    return `${num}+`;
  };

  return (
    <div className="min-h-screen bg-dark-navy text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none"></div>
      <div className="floating-elements"></div>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slideUp">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="gradient-text">Trade Smarter</span><br />
                with AI-Powered<br />
                Journal Insights
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Transform your trading with our premium journal platform. Track, analyze, and optimize your performance with cutting-edge AI insights and 3D visualizations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button className="btn-primary animate-glow px-8 py-4 text-lg" data-testid="button-start-trial">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="btn-glass px-8 py-4 text-lg" data-testid="button-view-demo">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative animate-float">
              {/* Floating trade cards with background image */}
              <div 
                className="absolute -top-4 -right-4 glass-morphism p-4 rounded-xl animate-float"
                style={{ 
                  animationDelay: '0.5s',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundBlendMode: 'overlay'
                }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-semibold">+$1,247</span>
                </div>
                <p className="text-xs text-gray-400">TSLA Long</p>
              </div>
              
              <div 
                className="absolute -bottom-4 -left-4 glass-morphism p-4 rounded-xl animate-float"
                style={{ 
                  animationDelay: '1s',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundBlendMode: 'overlay'
                }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-electric-blue rounded-full"></div>
                  <span className="text-sm font-semibold">AI Insight</span>
                </div>
                <p className="text-xs text-gray-400">Pattern Detected</p>
              </div>
              
              <img 
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Futuristic trading dashboard with dark theme and neon accents" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold gradient-text mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-300">Everything you need to become a better trader</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-morphism border-gray-600 hover:border-electric-blue transition-all duration-300 trade-card">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-electric-blue to-cyber-purple rounded-lg flex items-center justify-center mb-6">
                  <Brain className="text-xl" />
                </div>
                <h3 className="text-2xl font-bold mb-4">AI-Powered Analysis</h3>
                <p className="text-gray-300">Advanced machine learning algorithms analyze your trading patterns and provide actionable insights to improve your performance.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-morphism border-gray-600 hover:border-electric-blue transition-all duration-300 trade-card">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-electric-blue to-cyber-purple rounded-lg flex items-center justify-center mb-6">
                  <Box className="text-xl" />
                </div>
                <h3 className="text-2xl font-bold mb-4">3D Visualizations</h3>
                <p className="text-gray-300">Immersive 3D charts and data visualizations that make complex trading data easy to understand and analyze.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-morphism border-gray-600 hover:border-electric-blue transition-all duration-300 trade-card">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-electric-blue to-cyber-purple rounded-lg flex items-center justify-center mb-6">
                  <FolderSync className="text-xl" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Real-time FolderSync</h3>
                <p className="text-gray-300">Seamlessly sync with your favorite brokers and platforms for automatic trade logging and real-time updates.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Card className="glass-morphism p-12 rounded-3xl border-gray-600">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-4xl font-bold gradient-text mb-2 transition-all duration-500">
                  {formatTraderCount(currentStats.activeTraders)}
                </h3>
                <p className="text-gray-300">Active Traders</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold gradient-text mb-2 transition-all duration-500">
                  {formatLargeNumber(currentStats.trackedVolume)}
                </h3>
                <p className="text-gray-300">Tracked Volume</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold gradient-text mb-2">94%</h3>
                <p className="text-gray-300">Success Rate</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold gradient-text mb-2">24/7</h3>
                <p className="text-gray-300">Support</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-electric-blue to-cyber-purple rounded-lg flex items-center justify-center">
                  <Brain className="text-sm text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">TradeZella Pro</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                The next-generation trading journal platform powered by AI and advanced analytics.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 glass-morphism rounded-lg flex items-center justify-center cursor-pointer hover:border-electric-blue transition-colors">
                  <span className="text-xs">𝕏</span>
                </div>
                <div className="w-8 h-8 glass-morphism rounded-lg flex items-center justify-center cursor-pointer hover:border-electric-blue transition-colors">
                  <span className="text-xs">📘</span>
                </div>
                <div className="w-8 h-8 glass-morphism rounded-lg flex items-center justify-center cursor-pointer hover:border-electric-blue transition-colors">
                  <span className="text-xs">💼</span>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-electric-blue transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-electric-blue transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-electric-blue transition-colors">API</a></li>
                <li><a href="#" className="hover:text-electric-blue transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-electric-blue transition-colors">Roadmap</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-electric-blue transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-electric-blue transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-electric-blue transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-electric-blue transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-electric-blue transition-colors">Support</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-electric-blue transition-colors">About</a></li>
                <li><a href="#" className="hover:text-electric-blue transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-electric-blue transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-electric-blue transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-electric-blue transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 TradeZella Pro. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-xs text-gray-500">Built with</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">AI Technology</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyber-purple rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span className="text-xs text-gray-400">Real-time Data</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
