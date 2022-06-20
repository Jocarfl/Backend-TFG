const mongoose = require("mongoose");

const UserInfo = mongoose.model("UserInfo", new mongoose.Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    second_name: {
        type: String
    },
    born_date: {
        type: Date,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    ideal_weight: {
        type: Number
    },
    weight_history: [
        {
            date: {
                type: Date,
                required: true
            },
            weight: {
                type: Number,
                required: true
            }
        }
    ]
}));
module.exports = UserInfo;