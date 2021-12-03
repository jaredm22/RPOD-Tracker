function RBCard(props) {

    function handleVote(vote) {
        props.voteHandler(vote)
    }

    if (props.player) { 
        const careerStats = props.player.careerStats
        const stats = []

        stats.push(["G", careerStats['g']])
        stats.push(["GS", careerStats['gs']])
        stats.push(["Rush", careerStats['rush_att']])
        stats.push(["Yds", careerStats['rush_yds']])
        stats.push(["TD", careerStats['rush_td']])
        stats.push(["Y/A", careerStats['rush_yds_per_att']])
        stats.push(["Tgts", careerStats['targets']])
        stats.push(["Rec", careerStats['rec']])
        stats.push(["Yds", careerStats['rec_yds']])
        stats.push(["TD", careerStats['rec_td']])

        return (
            <div className="card">
                <img src={props.player.imgURL} height={200} width={150}/>
                <h4>{props.player.name + " (" + props.player.yearsPlayed[0] + " - " + props.player.yearsPlayed[1] + ")"}</h4>
                <h5>{props.player.position}</h5>
                <h5>Career Stats</h5>

                <table className="career-stats-table" key={props.player.name}>
                    <thead>
                        <tr>
                            {stats.map(e => 
                                <th>{e[0]}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {stats.map(e => 
                                <td>{e[1]}</td>
                            )}
                        </tr>
                    </tbody>
                </table>
                
                <button onClick={e => handleVote(true)}>RPOD</button>
                <button onClick={e => handleVote(false)}>Not a RPOD</button>
            </div>
        )
    } else {
        return(<div className="card"></div>)
    }
    
}

export default RBCard;