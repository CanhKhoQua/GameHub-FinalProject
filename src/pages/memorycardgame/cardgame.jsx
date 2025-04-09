import { useState } from "react"
import MemoryCard from "../../components/memorycardgame/MemoryCard";
import Form from "../../components/memorycardgame/Form";

export default function Cardgame()
{
    const [isGameOn, setIsGameOn] = useState(false);

    function startGame(e) {
        e.preventDefault();
        setIsGameOn(true)
    }

    function turnCard()
    {
        console.log("Memory card clicked")
    }

    return (
        <>
            <h1>Memory Card Game</h1>
            {!isGameOn ? <Form handleSubmit={startGame}/> : <MemoryCard handleClick={turnCard}/> }
        </>
    )
}