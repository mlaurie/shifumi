import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";

function Score() {
  const { id } = useParams();
  const [isVisible, setIsVisible] = useState(true);
  const [turns, setTurns] = useState();
  const [user1, setUser1] = useState();
  const [user2, setUser2] = useState();
  const [winner, setWinner] = useState();

  useEffect(() => {
    fetch(`http://fauques.freeboxos.fr:3000/matches/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
    })
      .then((response) => response.json()
      .then((match) => {
        setUser1(match.user1.username)
        setUser2(match.user2.username)
        setTurns(match.turns)
        match.turns.length === 0 && setIsVisible(false)
        match.winner && typeof match.winner !== "undefined" && setWinner(match.winner.username)
      })
      .catch((error) => console.log(error))
    )
  }, [])

  return (
    <>
    {isVisible === true &&
    <table className="m-auto border-2 border-slate-400">
      <thead>
          <tr>
            <th className="bg-gradient-to-tr text-white from-blue-600 to-indigo-600" colSpan="3">Score</th>
          </tr>
      </thead>
      <tbody>
        {turns?.map((turn, id) => (
          <tr key={id}>
            <td className="py-2 px-4 border-y-2 border-slate-400 font-bold">Round {id+1} :</td>
            <td className={turn.winner === "user1" ? "bg-green-300 py-2 px-4 border-y-2 border-slate-400" : "py-2 px-4 border-y-2 border-slate-400"}>{turn.user1 && user1}</td>
            <td className={turn.winner === "user2" ? "bg-green-300 py-2 px-4 border-y-2 border-slate-400" : "py-2 px-4 border-y-2 border-slate-400"}>{turn.user2 && user2}</td>
          </tr>  
        ))}
        {winner !== undefined && 
          <tr>
            <td className="py-2 px-4"colSpan="3">The Winner is <b>{winner}</b>.</td>
          </tr>}
      </tbody>
    </table>
    }
    </>
  );
  
}

export default Score;