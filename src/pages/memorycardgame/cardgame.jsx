import { useEffect, useState } from "react"
import "./MemoryCardGame.css";
import { useUser } from "../../UserContext.jsx";

export default function Cardgame()
{
    const {name} = useUser();
    const [champsName, setChampsName] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [moves,setMoves] = useState(0);
    const [won,setWon] = useState(0);
    const [gameOn, setGameOn] = useState(false);
    const [difficulty, setDifficulty] = useState();
    const [champsAmount, setChampsAmount] = useState();
    console.log(selectedCards);

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

    //get random index of champs
    function getRandomIndices(data)
    {
        let randomIndicesArr = [];
        for(let i=1; i<=champsAmount; i++)
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

    function resetGame() {
        setChampsName([]);
        setSelectedCards([]);
        setMatchedCards([]);
        setMoves(0);
        setWon(0);
        fetchData();
    }

    function turnCard(name, index) {
        const selectedCardCheck = selectedCards.find(card => card.index === index);
        const matchedCardsCheck = matchedCards.find(card => card.index === index);
    
        if (matchedCardsCheck || selectedCardCheck) {
            return;
        }
    
        if (selectedCards.length === 1) {
            const firstCard = selectedCards[0];
            const secondCard = { name, index };
            setSelectedCards([firstCard, secondCard]);
    
            if (firstCard.name === secondCard.name) {
                setMatchedCards([...matchedCards, firstCard, secondCard]);
                setWon(won + 1);
            }
        }
        else
        {
            setSelectedCards([{ name, index }]);
            setMoves((moves)=>moves + 1);
        }
    }

    function handleDifficultyChange(level)
    {
        setDifficulty(level);
        setGameOn(false);
        if (level === "Easy") 
        {
            setChampsAmount(5);
        }
        else if (level === "Medium")
        {
            setChampsAmount(10);
        }
        else if (level === "Hard") 
        {   setChampsAmount(15);
        }
        setGameOn(true);
    };

    useEffect(() =>
    {
        resetGame();
    },[champsAmount])

    function GameMode()
    {
        return (
            <div>
                <h2>Select Difficulty</h2>
                <button onClick={() => handleDifficultyChange("Easy")}>Easy</button>
                <button onClick={() => handleDifficultyChange("Medium")}>Medium</button>
                <button onClick={() => handleDifficultyChange("Hard")}>Hard</button>
            </div>
        );
    }

    const champImages = champsName.map((name, index) => {
        const imageUrl = `https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/${name}.png`;
        const selectedCardCheck = selectedCards.find(card=>card.index === index);
        const matchedCardsCheck = matchedCards.find(card=>card.index=== index);

        const showImage = selectedCardCheck || matchedCardsCheck;

        const cardStyle = 
        matchedCardsCheck ? "card-item card-item--matched nohover" :
        selectedCardCheck ? "card-item card-item--selected" : "card-item";

        return (
            <li key={index} className={`${cardStyle}`} onClick={() => turnCard(name, index)}>
            {showImage 
                ? <img src={imageUrl} /> 
                : <img src="src/pages/memorycardgame/chest.png" />
            }</li>
        );
    });

    return (
        <>
            <h1>Memory Card Game</h1>
            {!gameOn ? <GameMode/> : <> 
            <p>Player: {name}</p>
            <p>Moves: {moves}</p>
            <p>Matches: {won}</p>
            <ul className="card-container">
                {champImages}
            </ul>
            <div>
                {won === champsName.length/2 ? (<p>{name} won the game</p>) : ([])}
                <button onClick={resetGame}>Reset Game</button>
                <button onClick={()=>setGameOn(false)}>Game Mode</button>
            </div></>
            }
        </>
    )
}