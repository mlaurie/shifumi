import { getConnectedUser } from "../../data/storage";

function MatchMoveItem({ move, img, matchId, turnId }){
  const connectedUser = getConnectedUser()

  function handleClick() {
    fetch(`http://fauques.freeboxos.fr:3000/matches/${matchId}/turns/${turnId}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${connectedUser?.token}`
      },
      body: JSON.stringify({move})
    }).then()
  }

  return (
    <button className="w-24" >
      <img
        data-move={move}
        onClick={(e) => handleClick(e)}
        className="hover:cursor-pointer hover:origin-center hover:scale-110 hover:duration-150 hover:rotate-12"
        src={img}
        alt={move}/>
      {move}
    </button>
  );

}

export default MatchMoveItem;
