import { useState, useEffect } from "react"
import NFLCard from "./components/NFLCard"
import axios from 'axios'

export default function Home() {

    let testing = false

    let base_url = testing ? 'http://localhost:4000/' : 'https://rpod-backend.herokuapp.com/'

    const [state, setState] = useState({
        RPODList: [],
        unvotedPlayerList: [], 
        currentPlayer: null,
    })

    const [currentTab, setCurrentTab] = useState("qb")
    const [voter, setVoter] = useState("")


    function getRPODs(position) {
        return fetch(base_url + "nfl/rpods/" + position, {method: "GET"})
          .then(data => data.json())
    }

    function getUnvoted(position) {
        return fetch(base_url + 'nfl/unvoted/' +  position, {method: "GET"})
            .then(data => data.json())
    }

    function voteRPOD(vote) {
        let updatedUnvotedList = [...state.unvotedPlayerList]
        updatedUnvotedList.shift()
        let updatedCurrentPlayer = state.unvotedPlayerList[1]
        let updatedRPODList = [...state.RPODList]

        if (vote) {
            updatedRPODList.push(state.currentPlayer)
        }
        axios.patch(base_url + "nfl", {id: state.currentPlayer._id, isRPOD: vote})
            .then(_ => setState(prevState => 
                ({currentPlayer: updatedCurrentPlayer, RPODList: updatedRPODList, unvotedPlayerList: updatedUnvotedList})))
    }

    function switchTab(e) {
        let position = e.target.innerText
        setCurrentTab(position)
    }

    useEffect(() => {
        let mounted = true;
        getUnvoted(currentTab)
            .then(items => {
                if(mounted) {
                    setState(prevState => ({...prevState, unvotedPlayerList: items, currentPlayer: items[0]}))
                }
        })
        return () => mounted = false;
    }, [currentTab])

    useEffect(() => {
        let mounted = true;
        getRPODs(currentTab)
            .then(items => {
                if(mounted) {
                    setState(prevState => ({...prevState, RPODList: items}))
                }
        })
        return () => mounted = false;
    }, [currentTab])

    console.log(state)
    console.log(currentTab)

    return (
        <div className="container">
            <h1>RPOD Tracker</h1>
            <div className="tabs-container">
                <button onClick={switchTab}>qb</button>
                <button onClick={switchTab}>rb</button>
                <button onClick={switchTab}>wr</button>
                <button onClick={switchTab}>te</button>
            </div>

            <input className="voter-name" value={voter} onChange={e => setVoter(e.target.value)} placeholder="Voter Name"></input>
            
            <div className="main-container">
                <NFLCard player={state.currentPlayer} voteHandler={voteRPOD}/>

                <div className="list-container">
                    <div className="rpod-list-container">
                        <h4>Random Players of the Day</h4>
                        <div className="rpod-list">
                            {state.RPODList.map((p) =>
                                <div key={p._id} onClick={setState}>{p.name}</div>
                            )}
                        </div>
                    </div>

                    <div className="unvoted-list-container">
                        <h4>Unvoted Players</h4>
                        <div className="unvoted-list">
                            {state.unvotedPlayerList.map(p =>
                                <p>{p.name}</p>
                            )}
                        </div>
                    </div>  
                </div>          
            </div>
        </div>
    )
}
