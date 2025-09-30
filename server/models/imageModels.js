const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageCarouselSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit, iure.' },
    price: { type: String, required: true },
    formQuantity: { type: Number, required: true },
    category: { type: String, enum: ['photocard', 'banner'], default: 'photocard' },
}, { timestamps: true });

const ImageCarousel = mongoose.model('ImageCarousel', imageCarouselSchema);

module.exports = ImageCarousel;
