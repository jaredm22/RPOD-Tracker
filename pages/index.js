import { useState, useEffect } from "react"
import Card from "./components/Card"
import axios from 'axios'

export default function Home() {
    const [unvotedPlayerList, setUnvoted] = useState([])
    const [RPODList, setRPODList] = useState([])
    const [currentPlayer, setCurrentPlayer] = useState(null)

    const [state, setState] = useState({
        RPODList: [],
        unvotedPlayerList: [], 
        currentPlayer: null
    })

    function getRPODs() {
        return fetch('http://localhost:3001/rpods', {method: "GET", mode: "cors", headers: {'Content-Type':  'application/json'}})
          .then(data => data.json())
    }

    function getUnvoted() {
        return fetch('http://localhost:3001/playersNotVotedOn', {method: "GET", mode: "cors", headers: {'Content-Type':  'application/json'}})
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
        axios.patch("http://localhost:3001/players", {id: state.currentPlayer._id, isRPOD: vote })
            .then(_ => setState(prevState => 
                ({currentPlayer: updatedCurrentPlayer, RPODList: updatedRPODList, unvotedPlayerList: updatedUnvotedList})))
    }

    // useEffect(() => {
    //     let mounted = true;
    //     getUnvoted()
    //         .then(items => {
    //             if(mounted) {
    //                 setUnvoted(items)
    //                 setCurrentPlayer(items[0])
    //             }
    //     })
    //     return () => mounted = false;
    // }, [])

    // useEffect(() => {
    //     let mounted = true;
    //     getRPODs()
    //         .then(items => {
    //             if(mounted) {
    //                 setRPODList(items)
    //             }
    //     })
    //     return () => mounted = false;
    // }, [])


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
                <div className="unvoted-list">
                    <h4>Unvoted Players</h4>
                    {state.unvotedPlayerList.map(p =>
                        <p>{p.name}</p>
                    )}
                </div>

                <Card player={state.currentPlayer} voteHandler={voteRPOD}/>

                <div className="rpod-list-container">
                    <h4>Random Players of the Day</h4>
                    <div className="rpod-list">
                        {state.RPODList.map(p =>
                            <p>{p.name}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
