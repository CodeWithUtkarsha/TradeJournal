import { useQuery } from "@tanstack/react-query";
import { authenticatedApiRequest } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Trade } from "@shared/schema";
import { BarChart3, TrendingUp, AlertTriangle, ThumbsUp, Lightbulb } from "lucide-react";

export default function Analytics() {
  // Get all trades
  const { data: trades = [], isLoading: tradesLoading } = useQuery<Trade[]>({
    queryKey: ["/api/trades"],
    queryFn: async () => {
      const response = await authenticatedApiRequest("GET", "/api/trades");
      return response.json();
    },
  });

  // Get user stats
  const { data: stats } = useQuery({
    queryKey: ["/api/user/stats"],
    queryFn: async () => {
      const response = await authenticatedApiRequest("GET", "/api/user/stats");
      return response.json();
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getMarketConditionPerformance = () => {
    // Mock market condition analysis
    return [
      { condition: "Low Volatility", pnl: 18.4, color: "status-positive" },
      { condition: "Medium Volatility", pnl: 8.2, color: "text-yellow-400" },
      { condition: "High Volatility", pnl: -5.1, color: "status-negative" },
    ];
  };

  const getAIInsights = () => {
    if (!stats || stats.totalTrades < 5) {
      return [
        {
          type: "info",
          icon: Lightbulb,
          title: "Getting Started",
          message: "Log more trades to receive AI-powered insights and pattern recognition.",
          color: "text-electric-blue",
        },
      ];
    }

    const insights = [];
    
    if (stats.winRate < 50) {
      insights.push({
        type: "warning",
        icon: AlertTriangle,
        title: "Win Rate Alert",
        message: "Your win rate is below 50%. Consider reviewing your entry strategy and risk management.",
        color: "text-yellow-500",
      });
    }

    if (stats.winRate > 70) {
      insights.push({
        type: "positive",
        icon: ThumbsUp,
        title: "Excellent Performance",
        message: `Your win rate of ${stats.winRate.toFixed(1)}% is exceptional. Consider increasing position sizes.`,
        color: "text-green-500",
      });
    }

    if (stats.avgWin && stats.avgLoss && stats.avgWin / stats.avgLoss < 1.5) {
      insights.push({
        type: "optimization",
        icon: Lightbulb,
        title: "Risk/Reward Optimization",
        message: "Your risk-to-reward ratio could be improved. Aim for 1:2 or better on new trades.",
        color: "text-electric-blue",
      });
    }

    return insights.length > 0 ? insights : [
      {
        type: "positive",
        icon: ThumbsUp,
        title: "Strong Performance",
        message: "Your trading metrics look healthy. Keep following your strategy consistently.",
        color: "text-green-500",
      },
    ];
  };

  return (
    <div className="min-h-screen bg-dark-navy text-white pt-20">
      <div className="floating-elements"></div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Analytics Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Analytics Hub</h1>
            <p className="text-gray-300">Deep dive into your trading performance</p>
          </div>
          
          {/* Analytics Filters */}
          <div className="flex flex-wrap gap-3">
            <Select defaultValue="all-time">
              <SelectTrigger className="bg-darker-surface border-gray-600 text-white" data-testid="select-timeframe">
                <SelectValue placeholder="All Timeframes" />
              </SelectTrigger>
              <SelectContent className="glass-morphism border-gray-600">
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="7-days">Last 7 days</SelectItem>
                <SelectItem value="30-days">Last 30 days</SelectItem>
                <SelectItem value="90-days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-instruments">
              <SelectTrigger className="bg-darker-surface border-gray-600 text-white" data-testid="select-instruments">
                <SelectValue placeholder="All Instruments" />
              </SelectTrigger>
              <SelectContent className="glass-morphism border-gray-600">
                <SelectItem value="all-instruments">All Instruments</SelectItem>
                <SelectItem value="stocks">Stocks</SelectItem>
                <SelectItem value="options">Options</SelectItem>
                <SelectItem value="crypto">Crypto</SelectItem>
              </SelectContent>
            </Select>
            <Button className="btn-primary" data-testid="button-apply-filters">Apply Filters</Button>
          </div>
        </div>

        {/* Advanced Analytics Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Strategy Correlation Matrix */}
          <Card className="glass-morphism border-gray-600">
            <CardHeader>
              <CardTitle className="text-xl">Strategy Performance Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-electric-blue mx-auto mb-4" />
                  <p className="text-gray-400">Strategy correlation analysis</p>
                  <p className="text-sm text-gray-500">3D correlation matrix with D3.js</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                Showing correlation between different trading strategies and market conditions
              </div>
            </CardContent>
          </Card>

          {/* Performance by Market Conditions */}
          <Card className="glass-morphism border-gray-600">
            <CardHeader>
              <CardTitle className="text-xl">Performance by Market Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg mb-4">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-electric-blue mx-auto mb-4" />
                  <p className="text-gray-400">Market volatility analysis</p>
                  <p className="text-sm text-gray-500">VIX correlation charts</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                {getMarketConditionPerformance().map((condition, index) => (
                  <div key={index}>
                    <div className={`text-2xl font-bold ${condition.color}`} data-testid={`text-market-${index}`}>
                      {condition.pnl > 0 ? '+' : ''}{condition.pnl}%
                    </div>
                    <div className="text-sm text-gray-400">{condition.condition}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trade Analysis Table */}
        <Card className="glass-morphism border-gray-600 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Detailed Trade Analysis</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-electric-blue bg-opacity-20 text-electric-blue border-electric-blue"
                  data-testid="button-winning-trades"
                >
                  Winning Trades
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-gray-400 border-gray-600 hover:bg-gray-700"
                  data-testid="button-losing-trades"
                >
                  Losing Trades
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-gray-400 border-gray-600 hover:bg-gray-700"
                  data-testid="button-all-trades"
                >
                  All Trades
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {tradesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : trades.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-600">
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Symbol</TableHead>
                      <TableHead className="text-gray-300">Type</TableHead>
                      <TableHead className="text-gray-300">Entry</TableHead>
                      <TableHead className="text-gray-300">Exit</TableHead>
                      <TableHead className="text-gray-300">P&L</TableHead>
                      <TableHead className="text-gray-300">Return %</TableHead>
                      <TableHead className="text-gray-300">Mood</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.slice(0, 10).map((trade) => (
                      <TableRow key={trade.id} className="border-gray-700 hover:bg-darker-surface" data-testid={`row-trade-${trade.id}`}>
                        <TableCell>{new Date(trade.entryTime).toLocaleDateString()}</TableCell>
                        <TableCell className="font-semibold">{trade.symbol}</TableCell>
                        <TableCell>
                          <Badge variant={trade.type === 'Long' ? 'default' : 'secondary'} className={trade.type === 'Long' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}>
                            {trade.type}
                          </Badge>
                        </TableCell>
                        <TableCell>${parseFloat(trade.entryPrice).toFixed(2)}</TableCell>
                        <TableCell>{trade.exitPrice ? `$${parseFloat(trade.exitPrice).toFixed(2)}` : '-'}</TableCell>
                        <TableCell className={trade.pnl ? (parseFloat(trade.pnl) >= 0 ? 'status-positive' : 'status-negative') : ''}>
                          {trade.pnl ? formatCurrency(parseFloat(trade.pnl)) : '-'}
                        </TableCell>
                        <TableCell className={trade.returnPercent ? (parseFloat(trade.returnPercent) >= 0 ? 'status-positive' : 'status-negative') : ''}>
                          {trade.returnPercent ? `${parseFloat(trade.returnPercent) >= 0 ? '+' : ''}${trade.returnPercent}%` : '-'}
                        </TableCell>
                        <TableCell>
                          {trade.mood ? ['😡', '😟', '😐', '😊', '😌'][trade.mood - 1] : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No trades to analyze yet</p>
                <p className="text-sm text-gray-500">Start logging trades to see detailed analytics</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Insights Panel */}
        <Card className="glass-morphism border-electric-blue">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <span className="gradient-text">AI-Powered Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getAIInsights().map((insight, index) => (
                <Card key={index} className="bg-darker-surface border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-8 h-8 ${insight.color === 'text-yellow-500' ? 'bg-yellow-500' : insight.color === 'text-green-500' ? 'bg-green-500' : 'bg-electric-blue'} rounded-lg flex items-center justify-center`}>
                        <insight.icon className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="font-semibold">{insight.title}</h4>
                    </div>
                    <p className="text-sm text-gray-300" data-testid={`text-insight-${index}`}>
                      {insight.message}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
