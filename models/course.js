const mongoose = require('mongoose');

// SETUP SCHEMA
const courseSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }    
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

// Compile Schema into a model
module.exports = mongoose.model("Course", courseSchema);