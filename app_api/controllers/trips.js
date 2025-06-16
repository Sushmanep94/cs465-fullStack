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

// POST: /trips - Adds a new Trip
const tripsAddtrip = async (req, res) => {
    try {
        const newTrip = new Trip({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });
        const q = await newTrip.save();
        return res.status(201).json(q);
    } catch (err) {
        return res.status(400).json({ message: "Error adding trip", error: err });
    }
};

// PUT: /trips/:tripCode - Updates an existing trip
const tripsUpdateTrip = async (req, res) => {
    try {
        const q = await Model.findOneAndUpdate(
            { code: req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
            { new: true, runValidators: true }
        ).exec();

        if (!q) {
            return res.status(404).json({ message: "Trip not found" });
        }

        return res.status(200).json(q);
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};


module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddtrip,
    tripsUpdateTrip
};
