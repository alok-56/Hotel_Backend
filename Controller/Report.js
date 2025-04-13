const Bookingmodal = require("../Model/Booking");
const Expensemodel = require("../Model/Expense");
const Roommodal = require("../Model/Rooms");

// Dashboard Count

const DashboardCount = async (req, res, next) => {
    try {
        const { branchIds } = req.query;

        let matchBranch = {};
        if (branchIds) {
            const branchIdArray = branchIds.split(",");
            matchBranch.BranchId = { $in: branchIdArray };
        }

        // Total Rooms & Bookings
        const totalRooms = await Roommodal.countDocuments(matchBranch);
        const totalBookings = await Bookingmodal.countDocuments(matchBranch);

        // Total Earnings
        const bookingsForEarnings = await Bookingmodal.find({
            ...matchBranch,
            Status: "Booked",
        }).select("TotalAmount");

        const totalEarnings = bookingsForEarnings.reduce(
            (acc, curr) => acc + (curr.TotalAmount || 0),
            0
        );

        // Today's Bookings & Earnings
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const todayBookings = await Bookingmodal.find({
            ...matchBranch,
            createdAt: { $gte: todayStart, $lte: todayEnd },
        });

        const todayBookingCount = todayBookings.length;
        const todayEarnings = todayBookings.reduce(
            (acc, curr) =>
                curr.Status === "Booked" ? acc + (curr.TotalAmount || 0) : acc,
            0
        );

        // 🔹 Total Expense
        const expenses = await Expensemodel.find(matchBranch).select("Amount");
        const totalExpense = expenses.reduce((acc, curr) => acc + (curr.Amount || 0), 0);

        return res.status(200).json({
            status: true,
            code: 200,
            data: {
                totalRooms,
                totalBookings,
                totalEarnings,
                todayBookingCount,
                todayEarnings,
                totalExpense, // 👈 included here
            }
        });
    } catch (error) {
        console.error("DashboardCount Error:", error);
        return res.status(500).json({
            status: false,
            code: 500,
            message: error.message || "Internal Server Error"
        });
    }
};


// Weekly Sales count
const SalesDashboard = async (req, res, next) => {
    try {
        const { branchIds } = req.query;

        let matchBranch = {};
        if (branchIds) {
            const branchArray = branchIds.split(",");
            matchBranch.BranchId = { $in: branchArray };
        }

        const result = [];

        const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const day = new Date();
            day.setDate(today.getDate() - i);
            day.setHours(0, 0, 0, 0);
            const start = new Date(day);
            const end = new Date(day);
            end.setHours(23, 59, 59, 999);

            const count = await Bookingmodal.countDocuments({
                ...matchBranch,
                createdAt: { $gte: start, $lte: end },
            });

            result.push({
                day: dayLabels[day.getDay()],
                value: count,
            });
        }

        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        });

    } catch (error) {
        return error.message
    }
}

// Weekly Payment count
const PaymentDashboard = async (req, res, next) => {
    try {
        const { branchIds } = req.query;

        let matchBranch = {};
        if (branchIds) {
            const branchArray = branchIds.split(",");
            matchBranch.BranchId = { $in: branchArray };
        }

        const result = [];
        const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const day = new Date();
            day.setDate(today.getDate() - i);
            day.setHours(0, 0, 0, 0);
            const start = new Date(day);
            const end = new Date(day);
            end.setHours(23, 59, 59, 999);

            const payments = await Bookingmodal.find({
                ...matchBranch,
                createdAt: { $gte: start, $lte: end },
                Status: "Booked",
            }).select("TotalAmount");

            const totalForDay = payments.reduce(
                (acc, curr) => acc + (curr.TotalAmount || 0),
                0
            );

            result.push({
                day: dayLabels[day.getDay()],
                value: totalForDay,
            });
        }

        return res.status(200).json({
            status: true,
            code: 200,
            data: result
        });

    } catch (error) {
        return error.message
    }
}

module.exports = {
    DashboardCount,
    SalesDashboard,
    PaymentDashboard
}