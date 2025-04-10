export default function MemoryCard({handleClick, data})
{
    const imgList = data.map((img, index)=>
        <li key={index} className="card-item">
            <img src={img} onClick={handleClick} />
        </li>
    )

    return (
        <ul className="card-container">
            {imgList}
        </ul>
    );
}