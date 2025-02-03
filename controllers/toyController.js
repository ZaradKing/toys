const Toy = require('../models/Toy');

class ToyController {
    // Create a new toy
    static async createToy(req, res) {
        try {
            const toy = new Toy({
                ...req.body,
                user_id: req.user._id // This will come from auth middleware
            });

            await toy.save();
            res.status(201).json({
                status: 'success',
                data: {
                    toy
                }
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Get all toys with pagination
    static async getAllToys(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const toys = await Toy.find()
                .populate('user_id', 'name email')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await Toy.countDocuments();

            res.json({
                status: 'success',
                data: {
                    toys,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalToys: total
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Get a single toy by ID
    static async getToyById(req, res) {
        try {
            const toy = await Toy.findById(req.params.id)
                .populate('user_id', 'name email');

            if (!toy) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Toy not found'
                });
            }

            res.json({
                status: 'success',
                data: {
                    toy
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Update a toy
    static async updateToy(req, res) {
        try {
            const updates = Object.keys(req.body);
            const allowedUpdates = ['name', 'info', 'category', 'img_url', 'price', 'available_quantity', 'age_range', 'brand'];
            const isValidOperation = updates.every(update => allowedUpdates.includes(update));

            if (!isValidOperation) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid updates'
                });
            }

            const toy = await Toy.findOne({ _id: req.params.id, user_id: req.user._id });

            if (!toy) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Toy not found or unauthorized'
                });
            }

            updates.forEach(update => toy[update] = req.body[update]);
            await toy.save();

            res.json({
                status: 'success',
                data: {
                    toy
                }
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Delete a toy
    static async deleteToy(req, res) {
        try {
            const toy = await Toy.findOneAndDelete({ 
                _id: req.params.id,
                user_id: req.user._id
            });

            if (!toy) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Toy not found or unauthorized'
                });
            }

            res.json({
                status: 'success',
                message: 'Toy deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Search toys
    static async searchToys(req, res) {
        try {
            const searchQuery = req.query.q;
            const toys = await Toy.find(
                { $text: { $search: searchQuery } },
                { score: { $meta: "textScore" } }
            )
            .sort({ score: { $meta: "textScore" } })
            .populate('user_id', 'name email');

            res.json({
                status: 'success',
                data: {
                    toys
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Get toys by category
    static async getToysByCategory(req, res) {
        try {
            const { category } = req.params;
            const toys = await Toy.find({ 
                category: category.toLowerCase() 
            })
            .populate('user_id', 'name email');

            res.json({
                status: 'success',
                data: {
                    toys
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Get toys by price range
    static async getToysByPriceRange(req, res) {
        try {
            const { min, max } = req.query;
            const toys = await Toy.find({
                price: {
                    $gte: parseFloat(min) || 0,
                    $lte: parseFloat(max) || Number.MAX_VALUE
                }
            })
            .populate('user_id', 'name email');

            res.json({
                status: 'success',
                data: {
                    toys
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = ToyController;