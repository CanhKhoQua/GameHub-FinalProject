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
        const allChampNames = Object.keys(data.data);
        
        //Checking
        console.log(allChampNames.length);

        //get champion names
        const champsName = getDataSlice(allChampNames);

        const champsShuffledArr = getChampsArr(champsName);
        return champsShuffledArr;

        }catch(e)
        {
            console.error(e);
        }
    }
    //retrieve champs name from certain index
    function getDataSlice(data)
    {
        const ranIndices = getRandomIndices(data);
        const dataSlice = ranIndices.map(index => data[index]);
        return dataSlice;
    }

    //get random index of champs
    function getRandomIndices(data)
    {
        let randomIndicesArr = [];
        for(let i=0; i<=9; i++)
        {
            let ranNum = Math.floor(Math.random() * data.length);
            if(!randomIndicesArr.includes(ranNum))
            {
                randomIndicesArr.push(ranNum);
            }else
            {
                i--;
            }
            console.log(ranNum);
        }
        return randomIndicesArr;
    }

    //duplicate and shuffle champs arr
    function getChampsArr(data)
    {
        let pairedChampsArr = [...data, ...data];
        return pairedChampsArr;
    }

    async function getChampsURL()
    {
        let imgURL = [];
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