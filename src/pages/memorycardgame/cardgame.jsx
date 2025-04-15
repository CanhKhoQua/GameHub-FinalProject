import { useEffect, useState } from "react"
import "../../components/memorycardgame/MemoryCardGame.css";
import { useUser } from "../../UserContext.jsx";

export default function Cardgame()
{
    const {name} = useUser();
    const [champsName, setChampsName] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [moves,setMoves] = useState(0);
    const [won,setWon] = useState(0);
    console.log(selectedCards);

    useEffect(()=>
    {
        const fetchData = async() => {
            try {
            const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/12.6.1/data/en_US/champion.json`);
            if(!res.ok)
            {
                throw new Error ("Failed to fetch API");
            }
            const data = await res.json();
            const allChampNames = Object.keys(data.data);
            
            //Checking
            //console.log(allChampNames.length);

            //get champion names
            const champsName = getDataSlice(allChampNames);
            const champsShuffledArr = getChampsArr(champsName);
            setChampsName(champsShuffledArr);
            }catch(e)
            {
                console.error(e);
            }
        };
        fetchData();
    },[])

    //get random index of champs
    function getRandomIndices(data)
    {
        let randomIndicesArr = [];
        for(let i=0; i<=4; i++)
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

    //retrieve champs name from certain index
    function getDataSlice(data)
    {
        const ranIndices = getRandomIndices(data);
        const dataSlice = ranIndices.map(index => data[index]);
        return dataSlice;
    }

    //duplicate and shuffle champs arr
    function getChampsArr(data)
    {
        let pairedChampsArr = [...data, ...data];
        console.log(`pairedChampsArr length is ${pairedChampsArr.length}`);
        let i=pairedChampsArr.length-1;

        while (i>0)
        {
            let a = Math.floor(Math.random() * i);
            const temp = pairedChampsArr[i];
            
            pairedChampsArr[i] = pairedChampsArr[a];
            pairedChampsArr[a] = temp;
            i--;    
        }
        return pairedChampsArr;
    }

    function resetGame()
    {

    }


    function turnCard(name, index)
    {
        const selectedCardCheck = selectedCards.find(card=> 
            card.index === index);
        const matchedCardsCheck = matchedCards.find(card =>
            card.name === name);
        
        if(matchedCardsCheck)
        {
            return;
        }
        if(!selectedCardCheck && selectedCards.length <2)
        {
            setSelectedCards(([...selectedCards,{name,index}]));
        }else if(selectedCards.length ==2)
        {
            setSelectedCards([{name, index}]);
        }
    }

    //match check
    useEffect(()=>
    {
        if(selectedCards.length ===2 && selectedCards[0].name === selectedCards[1].name)
        {
            console.log(`Matched`);
            setMatchedCards([...matchedCards, selectedCards[0], selectedCards[1]]);
            setWon((won)=>won+1);
            setMoves((moves) => moves+1);
        }
        else if(selectedCards.length ===2 && selectedCards[0].name != selectedCards[1].name)
        {
            console.log(`No match`);
            setMoves((moves) => moves+1)
        }
    }, [selectedCards])

    const champImages = champsName.map((img, index) => {
        const imageUrl = `https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/${img}.png`;
        return (
            <li key={index} className="card-item">
                <img src={imageUrl} onClick={() => turnCard(img, index)} />
            </li>
        );
    });

    return (
        <>
            <h1>Memory Card Game</h1>
            <p>Player: {name}</p>
            <p>Moves: {moves}</p>
            <p>Matched: {won}</p>
            <ul className="card-container">
                {champImages}
            </ul>
        </>
    )
}