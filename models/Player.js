const mongoose = require("mongoose")

const player = mongoose.Schema({
	name: String,
    pageURL: String,
    imgURL: String,
    yearsPlayed: [Number],
    position: String, 
    careerStats: {
        type: Map,
        of: String
    }, 
    isRPOD: Boolean, 
    votedOn: Boolean
})

module.exports = mongoose.model("Player", player)