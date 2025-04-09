import { useState } from "react"
import MemoryCard from "../../components/memorycardgame/MemoryCard";
import Form from "../../components/memorycardgame/Form";

export default function Cardgame()
{
    const [isGameOn, setIsGameOn] = useState(false);
    const [emojiData, setEmojiData] = useState([]);
    console.log(emojiData);

    async function startGame(e) {
        e.preventDefault();
        try {
            const res = await fetch(`https://emojihub.yurace.pro/api/all/category/animals-and-nature`);
            if (!res.ok)
            {
                throw new Error ("Failed to fetch data from API")
            }
            const data = await res.json();
            
            const dataSample = data.slice(0,4)
            setEmojiData(dataSample);

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