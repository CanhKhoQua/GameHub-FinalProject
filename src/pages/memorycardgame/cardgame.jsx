import { useState } from "react"
import MemoryCard from "../../components/memorycardgame/MemoryCard";
import Form from "../../components/memorycardgame/Form";

export default function Cardgame()
{
    const [isGameOn, setIsGameOn] = useState(false);

    async function startGame(e) {
        e.preventDefault();
        try {
            const res = await fetch(`https://emojihub.yurace.pro/api/all/category/animals-and-nature`);
            const data = await res.json();
            console.log(data)
            setIsGameOn(true)
        } catch (e) {
            console.error(e)
        }
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