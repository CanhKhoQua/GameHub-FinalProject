import { useState } from "react"
import MemoryCard from "../../components/memorycardgame/MemoryCard";
import Form from "../../components/memorycardgame/Form";

export default function Cardgame()
{
    const [isGameOn, setIsGameOn] = useState(false);
    const [champsURL, setChampsURL] = useState([]);

    async function getChampsName()
    {
        try {
        const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/12.6.1/data/en_US/champion.json`);
        if(!res.ok)
        {
            throw new Error ("Failed to fetch API");
        }
        const data = await res.json();
        const champNames = Object.keys(data.data);
        
        //get champion name
        const dataSample = champNames.slice(0,10);
        return dataSample;

        }catch(e)
        {
            console.error(e);
        }
    }

    async function getChampsURL()
    {
        var imgURL = [];
        const data = await getChampsName();

        //plug champs name to fetch champs img
        imgURL = data.map(name=>
            `https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/${name}.png`
        )
        setChampsURL(imgURL);
    }

    async function startGame(e) {
        e.preventDefault();
        getChampsURL();
        setIsGameOn(true);
    }
  
    function turnCard()
    {
        console.log("Memory card clicked")
    }

    return (
        <>
            <h1>Memory Card Game</h1>
            {!isGameOn ? <Form handleSubmit={startGame}/> : <MemoryCard handleClick={turnCard} data={champsURL}/> }
        </>
    )
}