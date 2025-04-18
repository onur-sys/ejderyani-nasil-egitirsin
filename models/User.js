const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    rpmodel: { type: String, required: false },
    cash: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    rppuan: { type: Number, default: 0 },
    rplist: { type: Number, default: 0 },
    zenginlist: { type: Number, default: 0 },
    toprplist: { type: Number, default: 0 },
    toprppuan: { type: Number, default: 0 },
    ticketnumbers: { type: Number, default: 0 }
});

module.exports = mongoose.model("User", userSchema);
