const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
const tripsList = async (req, res) => {
    try {
        const q = await Model.find({}).exec();

        if (!q || q.length === 0) {
            return res.status(404).json({ message: "No trips found" });
        } else {
            return res.status(200).json(q);
        }
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
};

// GET: /trips/:tripCode - find a specific trip by code
const tripsFindByCode = async (req, res) => {
    const { tripCode } = req.params;

    try {
        const trip = await Model.findOne({ code: tripCode }).exec();

        if (!trip) {
            return res.status(404).json({ message: `Trip with code ${tripCode} not found` });
        } else {
            return res.status(200).json(trip);
        }
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
};

module.exports = {
    tripsList,
    tripsFindByCode
};
