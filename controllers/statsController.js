const User = require('../models/User');
const Trade = require('../models/Trade');

// @desc    Get real-time platform statistics
// @route   GET /api/stats/platform
// @access  Public
const getPlatformStats = async (req, res) => {
  try {
    console.log('📊 Getting platform statistics...');

    // Get total registered users
    const totalUsers = await User.countDocuments();
    console.log(`👥 Total users: ${totalUsers}`);

    // Get users who have at least one trade (active traders)
    const activeTraders = await User.countDocuments({
      '_id': {
        $in: await Trade.distinct('user')
      }
    });
    console.log(`🔥 Active traders: ${activeTraders}`);

    // Get total tracked volume (sum of all P&L)
    const volumeResult = await Trade.aggregate([
      {
        $match: {
          pnl: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          totalVolume: { $sum: { $abs: '$pnl' } },
          totalPnL: { $sum: '$pnl' },
          totalTrades: { $sum: 1 },
          winningTrades: {
            $sum: {
              $cond: [{ $gt: ['$pnl', 0] }, 1, 0]
            }
          }
        }
      }
    ]);

    const stats = volumeResult[0] || {
      totalVolume: 0,
      totalPnL: 0,
      totalTrades: 0,
      winningTrades: 0
    };

    // Calculate success rate
    const successRate = stats.totalTrades > 0 
      ? ((stats.winningTrades / stats.totalTrades) * 100).toFixed(1)
      : 0;

    // Get trades from last 24 hours for recent activity
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentTrades = await Trade.countDocuments({
      createdAt: { $gte: yesterday }
    });

    // Get recent users (last 7 days)
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: lastWeek }
    });

    const platformStats = {
      totalUsers,
      activeTraders,
      trackedVolume: Math.round(stats.totalVolume),
      totalPnL: Math.round(stats.totalPnL * 100) / 100,
      totalTrades: stats.totalTrades,
      successRate: parseFloat(successRate),
      recentTrades,
      recentUsers,
      lastUpdated: new Date().toISOString()
    };

    console.log('📈 Platform stats calculated:', platformStats);

    res.json({
      success: true,
      data: platformStats
    });

  } catch (error) {
    console.error('❌ Platform stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get platform statistics'
    });
  }
};

module.exports = {
  getPlatformStats
};
