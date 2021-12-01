function Card(props) {

    function handleVote(vote) {
        props.voteHandler(vote)
    }

    if (props.player) { 
        const careerStats = props.player.careerStats
        const stats = []

        if (props.player.position == "Pitcher") {
            stats.push(["G", careerStats['G']])
            stats.push(["W-L", careerStats['W'] + "-" + careerStats['L']])
            stats.push(["IP", careerStats['IP']])
            stats.push(["ERA", careerStats['earned_run_avg']])
            stats.push(["SO", careerStats['SO']])
            stats.push(["WHIP", careerStats['whip']])
        } else {
            stats.push(["AB", careerStats['AB']])
            stats.push(["H", careerStats['H']])
            stats.push(["R", careerStats['R']])
            stats.push(["HR", careerStats['HR']])
            stats.push(["RBI", careerStats['RBI']])
            stats.push(["BA", careerStats['batting_avg']])
            stats.push(["OBP", careerStats['onbase_perc']])
            stats.push(["OPS", careerStats['onbase_plus_slugging']])
            stats.push(["OPS+", careerStats['onbase_plus_slugging_plus']])
        } 

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

export default Card;