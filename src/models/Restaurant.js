const mongoose = require('mongoose');

const restoSchema = new mongoose.Schema({
    restoPic: { type: String, required: true },
    restoName: { type: String, required: true },
    description: { type: String, required: true },
    main_rating: { type: Number, default: 0 },
    overall: { type: Number, default: 5 },
    outOF: { type: String, required: true },
    star_img: { type: String, required: true },
    noOfLike: { type: Number, default: 0 },
    noOfDislike: { type: Number, default: 0 }
});

const Resto = mongoose.model('restaurant', restoSchema);

module.exports = Resto;



