const SurpriseInstance = require('../models/SurpriseInstance');
const OnDemandLead = require('../models/OnDemandLead');
const SurpriseCategory = require('../models/SurpriseCategory');

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Total revenue
    const allInstances = await SurpriseInstance.find();
    const totalRevenue = allInstances.reduce((sum, inst) => sum + (inst.pricePaid || 0), 0);

    // 2. Bookings this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const bookingsThisMonth = await SurpriseInstance.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // 3. Count categories popularity
    const categoryCounts = {};
    for (const inst of allInstances) {
      if (inst.category) {
        const categoryId = inst.category.toString();
        categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
      }
    }

    let mostBookedCategoryId = null;
    let mostBookedCount = 0;
    for (const [id, count] of Object.entries(categoryCounts)) {
      if (count > mostBookedCount) {
        mostBookedCount = count;
        mostBookedCategoryId = id;
      }
    }

    let mostBookedCategoryName = 'None';
    if (mostBookedCategoryId) {
      const popularCategory = await SurpriseCategory.findById(mostBookedCategoryId);
      if (popularCategory) {
        mostBookedCategoryName = popularCategory.name;
      }
    }

    // 4. Counts by status
    const paidCount = await SurpriseInstance.countDocuments({ status: 'Paid' });
    const contentAddedCount = await SurpriseInstance.countDocuments({ status: 'Content Added' });
    const liveCount = await SurpriseInstance.countDocuments({ status: 'Live' });

    // 5. Total On-Demand ideas (Leads)
    const totalLeads = await OnDemandLead.countDocuments();
    const newLeads = await OnDemandLead.countDocuments({ status: 'New' });

    res.json({
      success: true,
      stats: {
        totalRevenue,
        bookingsThisMonth,
        mostBookedCategory: mostBookedCategoryName,
        totalBookings: allInstances.length,
        statusCounts: {
          Paid: paidCount,
          ContentAdded: contentAddedCount,
          Live: liveCount
        },
        leads: {
          total: totalLeads,
          new: newLeads
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error generating dashboard analytics.' });
  }
};
