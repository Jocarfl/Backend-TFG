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
        type: Number
    },
    weight: {
        type: Number
    },
    ideal_weight: {
        type: Number
    },
    weight_history: [
        {
            date: {
                type: Date
            },
            weight: {
                type: Number
            }
        }
    ]
}));
module.exports = UserInfo;