const Player = require('./models/Player');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();

const url = "mongodb+srv://jaredm22:jjluke77@cluster0.txzog.mongodb.net/mlbplayers?retryWrites=true&w=majority";

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


mongoose.connect(url, { useNewUrlParser: true });
const db = mongoose.connection

db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Get all players
app.get("/players", async (req, res) => {
	const players = await Player.find();
    console.log("All players: ", players);
	res.send(players);
})

// Get all RPOD's
app.get("/rpods", async (req, res) => {
	const players = await Player.find({isRPOD: true});
    console.log("All RPOD's: ", players);
	res.send(players);
})

// Get all player's not yet voted on
app.get("/playersNotVotedOn", async (req, res) => {
	const players = await Player.find({votedOn: false});
    console.log("All players yet to be voted on: ", players);
	res.send(players);
})

app.post("/players", async (req, res) => {
    const careerStats = new Map(Object.entries(JSON.parse(req.body.careerStats)));
	const player = new Player({
        name: req.body.name,
        pageURL: req.body.pageURL,
        imgURL: req.body.imgURL,
        yearsPlayed: req.body.yearsPlayed,
        position: req.body.position,
        careerStats: careerStats,
        isRPOD: false, 
        votedOn: false
    })
	await player.save()
	res.send(player)
})

app.patch("/players", async (req, res) => {
	try {
		const player = await Player.findByIdAndUpdate(req.body.id, { isRPOD: req.body.isRPOD, votedOn: true})
		await player.save()
		res.send(player)
	} catch {
		res.status(404)
		res.send({ error: "player doesn't exist!" })
	}
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
})