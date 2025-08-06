import { useQuery } from "@tanstack/react-query";
import { auth, authenticatedApiRequest } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import TradeModal from "@/components/trade-modal";
import type { Trade, User } from "@shared/schema";
import { ChartLine, Target, Calculator, Scale, Brain, TrendingUp } from "lucide-react";

export default function Dashboard() {
  // Get current user
  const { data: currentUser } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const response = await authenticatedApiRequest("GET", "/api/auth/me");
      return response.json();
    },
  });

  // Get user stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/user/stats"],
    queryFn: async () => {
      const response = await authenticatedApiRequest("GET", "/api/user/stats");
      return response.json();
    },
  });

  // Get recent trades
  const { data: trades = [], isLoading: tradesLoading } = useQuery<Trade[]>({
    queryKey: ["/api/trades"],
    queryFn: async () => {
      const response = await authenticatedApiRequest("GET", "/api/trades");
      return response.json();
    },
  });

  const recentTrades = trades.slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-dark-navy text-white pt-20">
      <div className="floating-elements"></div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Trading Dashboard</h1>
            <p className="text-gray-300">
              Welcome back, {currentUser?.user?.firstName || "Trader"}
            </p>
          </div>
          
          <TradeModal />
        </div>

        {/* AI Summary Banner */}
        <Alert className="glass-morphism border-electric-blue bg-transparent mb-8">
          <Brain className="h-4 w-4" />
          <AlertDescription className="text-gray-300">
            <strong className="text-electric-blue">AI Insight:</strong> {' '}
            {stats?.totalTrades > 5 
              ? `Your win rate of ${formatPercentage(stats.winRate)} is ${stats.winRate > 60 ? 'above' : 'below'} the industry average. ${stats.winRate < 60 ? 'Consider reviewing your risk management strategy.' : 'Keep up the great work!'}`
              : "Start logging more trades to receive personalized AI insights and improve your trading performance."
            }
          </AlertDescription>
        </Alert>

        {/* Dashboard Widgets Grid */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          {/* Total P&L Widget */}
          <Card className="glass-morphism border-gray-600 hover:border-electric-blue transition-all duration-300 trade-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg text-gray-300">Total P&L</CardTitle>
                <ChartLine className="text-electric-blue" />
              </div>
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              ) : (
                <>
                  <div className={`text-3xl font-bold mb-2 ${stats?.totalPnL >= 0 ? 'status-positive' : 'status-negative'}`} data-testid="text-total-pnl">
                    {formatCurrency(stats?.totalPnL || 0)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {stats?.totalTrades || 0} total trades
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Win Rate Widget */}
          <Card className="glass-morphism border-gray-600 hover:border-electric-blue transition-all duration-300 trade-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg text-gray-300">Win Rate</CardTitle>
                <Target className="text-electric-blue" />
              </div>
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-electric-blue mb-2" data-testid="text-win-rate">
                    {formatPercentage(stats?.winRate || 0)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {stats?.winningTrades || 0} wins / {stats?.totalTrades || 0} trades
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Average Trade Widget */}
          <Card className="glass-morphism border-gray-600 hover:border-electric-blue transition-all duration-300 trade-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg text-gray-300">Avg Trade</CardTitle>
                <Calculator className="text-electric-blue" />
              </div>
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-white mb-2" data-testid="text-avg-trade">
                    {formatCurrency(stats?.avgTrade || 0)}
                  </div>
                  <div className="text-sm text-gray-400">Per trade</div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Win/Loss Ratio Widget */}
          <Card className="glass-morphism border-gray-600 hover:border-electric-blue transition-all duration-300 trade-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg text-gray-300">Avg Win/Loss</CardTitle>
                <Scale className="text-electric-blue" />
              </div>
              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-cyber-purple mb-2" data-testid="text-win-loss-ratio">
                    {stats?.avgWin && stats?.avgLoss 
                      ? `1:${(stats.avgWin / stats.avgLoss).toFixed(1)}`
                      : "N/A"
                    }
                  </div>
                  <div className="text-sm text-gray-400">Risk/Reward ratio</div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Performance Chart Placeholder */}
          <Card className="lg:col-span-2 glass-morphism border-gray-600">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Portfolio Performance</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="bg-electric-blue bg-opacity-20 text-electric-blue border-electric-blue">
                    1M
                  </Button>
                  <Button variant="outline" size="sm" className="text-gray-400 border-gray-600 hover:bg-gray-700">
                    3M
                  </Button>
                  <Button variant="outline" size="sm" className="text-gray-400 border-gray-600 hover:bg-gray-700">
                    1Y
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-electric-blue mx-auto mb-4" />
                  <p className="text-gray-400">Interactive chart coming soon</p>
                  <p className="text-sm text-gray-500">3D visualizations with Three.js</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Trades */}
          <Card className="glass-morphism border-gray-600">
            <CardHeader>
              <CardTitle className="text-xl">Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
              {tradesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-700 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : recentTrades.length > 0 ? (
                <div className="space-y-4">
                  {recentTrades.map((trade) => (
                    <Card key={trade.id} className="bg-darker-surface border-gray-700">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold" data-testid={`text-symbol-${trade.id}`}>
                              {trade.symbol}
                            </div>
                            <div className="text-sm text-gray-400">
                              {trade.type} • {new Date(trade.createdAt!).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            {trade.pnl && (
                              <>
                                <div className={`font-semibold ${parseFloat(trade.pnl) >= 0 ? 'status-positive' : 'status-negative'}`} data-testid={`text-pnl-${trade.id}`}>
                                  {parseFloat(trade.pnl) >= 0 ? '+' : ''}{formatCurrency(parseFloat(trade.pnl))}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {trade.returnPercent && `${parseFloat(trade.returnPercent) >= 0 ? '+' : ''}${trade.returnPercent}%`}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ChartLine className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No trades logged yet</p>
                  <TradeModal>
                    <Button className="btn-primary" data-testid="button-log-first-trade">
                      Log Your First Trade
                    </Button>
                  </TradeModal>
                </div>
              )}
              
              {recentTrades.length > 0 && (
                <Button variant="link" className="w-full mt-4 text-electric-blue hover:text-cyber-purple" data-testid="link-view-all-trades">
                  View All Trades
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Heatmap Placeholder */}
        <Card className="mt-6 glass-morphism border-gray-600">
          <CardHeader>
            <CardTitle className="text-xl">Trading Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="grid grid-cols-7 gap-1 max-w-xs mx-auto">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-sm ${
                        i % 5 === 0 ? 'bg-green-600' : 
                        i % 7 === 0 ? 'bg-red-600' : 
                        'bg-gray-700'
                      }`}
                    ></div>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-2">Daily performance heatmap</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
