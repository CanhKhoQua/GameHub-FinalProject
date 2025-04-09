export default function MemoryCard({handleClick})
{
    const emojiArr = ['🐶', '🐷', '🐙', '🐛', '🐵', '🐶', '🐷', '🐙', '🐛', '🐵'];
    const emojiEl = emojiArr.map((emoji, index)=>
            <li key={index} className="card-item">
            <button className="btn-emoji" onClick={handleClick}>
                {emoji}
            </button>
        </li>
    )

    return (
        <>
        <ul className="card-container">{emojiEl}</ul>
        </>
    )
}