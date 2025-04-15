export default function MemoryCard({handleClick, data, moves, won})
{
    const imgList = data.map((img, index)=>
        <li key={index} className="card-item">
            <img src={`https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/${img}.png`} onClick={() => handleClick(img, index)} />
        </li>
    )

    return (
        <>
            <p>Moves: {moves}</p>
            <p>Matched: {won}</p>
            <ul className="card-container">
                {imgList}
            </ul>
        </>
    );
}