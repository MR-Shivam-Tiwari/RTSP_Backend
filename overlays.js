const express = require('express');
const Overlay = require('./Models/Overlay');
const router = express.Router();

// Create a new overlay
router.post('/', async (req, res) => {
    console.log(req.body);  // Log the request body to see if imageBase64 is being sent
    try {
        const overlay = new Overlay(req.body);
        await overlay.save();
        res.status(201).json(overlay);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get overlays by video URL
router.get('/', async (req, res) => {
    const { videoUrl, page = 1, limit = 10 } = req.query; // Default page 1 and limit 10
    const start = Date.now();  // Start timer

    try {
        const overlays = await Overlay.find({ videoUrl: videoUrl })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        
        console.log('Fetched overlays in:', Date.now() - start, 'ms'); // Log time taken
        res.json(overlays);
    } catch (error) {
        console.error('Error fetching overlays:', error.message); // Log any errors
        res.status(500).json({ message: error.message });
    }
});


// Update an overlay
router.put('/:id', async (req, res) => {
    try {
        const overlay = await Overlay.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!overlay) {
            return res.status(404).json({ message: 'Overlay not found' });
        }
        res.json(overlay);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an overlay
router.delete('/:id', async (req, res) => {
    try {
        const overlay = await Overlay.findByIdAndDelete(req.params.id);
        if (!overlay) {
            return res.status(404).json({ message: 'Overlay not found' });
        }
        res.json({ message: 'Overlay deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
