const API_BASE_URL = 'https://render-backend-tradejournal.onrender.com/api';

class StatsService {
  async getPlatformStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/platform`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to fetch platform stats:', error);
      // Return fallback data if API fails
      return {
        totalUsers: 1,
        activeTraders: 1,
        trackedVolume: 0,
        totalPnL: 0,
        totalTrades: 0,
        successRate: 0,
        recentTrades: 0,
        recentUsers: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }
}

export const statsService = new StatsService();
