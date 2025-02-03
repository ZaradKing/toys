const mongoose = require('mongoose');

const toySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Toy name is required'],
        trim: true,
        minlength: [2, 'Toy name must be at least 2 characters long']
    },
    info: {
        type: String,
        required: [true, 'Toy description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        lowercase: true,
        enum: ['action figures', 'educational', 'board games', 'vehicles', 'puzzles', 'dolls', 'electronic', 'outdoor', 'building blocks', 'arts and crafts']
    },
    img_url: {
        type: String,
        required: [true, 'Image URL is required'],
        trim: true,
        validate: {
            validator: function(v) {
                // Basic URL validation
                return /^(http|https):\/\/[^ "]+$/.test(v);
            },
            message: 'Please enter a valid image URL'
        }
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
        validate: {
            validator: function(v) {
                // Allow up to 2 decimal places
                return /^\d+(\.\d{1,2})?$/.test(v.toString());
            },
            message: 'Price can only have up to 2 decimal places'
        }
    },
    available_quantity: {
        type: Number,
        required: [true, 'Available quantity is required'],
        min: [0, 'Quantity cannot be negative'],
        default: 1
    },
    age_range: {
        min: {
            type: Number,
            required: [true, 'Minimum age is required'],
            min: [0, 'Age cannot be negative']
        },
        max: {
            type: Number,
            required: false
        }
    },
    brand: {
        type: String,
        required: [true, 'Brand name is required'],
        trim: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Text search index
toySchema.index({ name: 'text', info: 'text', brand: 'text' });

// Price index for range queries
toySchema.index({ price: 1 });

// Category index for filtering
toySchema.index({ category: 1 });

const Toy = mongoose.model('Toy', toySchema);

module.exports = Toy;