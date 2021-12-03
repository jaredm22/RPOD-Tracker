import { useState, useEffect } from "react"
import RBCard from "./components/RBCard"
import axios from 'axios'

export default function Home() {

    let base_url = 'http://localhost:4000/'
    let heroku_base_url = 'https://rpod-backend.herokuapp.com/'

    const [state, setState] = useState({
        RPODList: [],
        unvotedPlayerList: [], 
        currentPlayer: null
    })

    function getRPODs() {
        return fetch(heroku_base_url + 'nfl/rb/rpods', {method: "GET"})
          .then(data => data.json())
    }

    function getUnvoted() {
        return fetch(heroku_base_url + 'nfl/rb/unvoted', {method: "GET"})
            .then(data => data.json())
    }

    function voteRPOD(vote) {
        let updatedUnvotedList = [...state.unvotedPlayerList]
        updatedUnvotedList.shift()
        console.log(updatedUnvotedList)
        let updatedCurrentPlayer = state.unvotedPlayerList[1]
        let updatedRPODList = [...state.RPODList]
        if (vote) {
            updatedRPODList.push(state.currentPlayer)
        }
        axios.patch(heroku_base_url + "nfl/rb", {id: state.currentPlayer._id, isRPOD: vote})
            .then(_ => setState(prevState => 
                ({currentPlayer: updatedCurrentPlayer, RPODList: updatedRPODList, unvotedPlayerList: updatedUnvotedList})))
    }

    useEffect(() => {
        let mounted = true;
        getUnvoted()
            .then(items => {
                if(mounted) {
                    setState(prevState => ({...prevState, unvotedPlayerList: items, currentPlayer: items[0]}))
                }
        })
        return () => mounted = false;
    }, [])

    useEffect(() => {
        let mounted = true;
        getRPODs()
            .then(items => {
                if(mounted) {
                    setState(prevState => ({...prevState, RPODList: items}))
                }
        })
        return () => mounted = false;
    }, [])

    console.log(state)

    return (
        <div className="container">
            <h1>RPOD Tracker</h1>
            
            <div className="main-container">
                <RBCard player={state.currentPlayer} voteHandler={voteRPOD}/>


                <div className="list-container">
                    <div className="rpod-list-container">
                        <h4>Random Players of the Day</h4>
                        <div className="rpod-list">
                            {state.RPODList.map(p =>
                                <p>{p.name}</p>
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
