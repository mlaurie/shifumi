import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";

function Score() {
  const { id } = useParams();
  const [isVisible, setIsVisible] = useState(false);
  const [isDataLoading, setDataLoading] = useState(false);
  const [turns, setTurns] = useState();
  const [user1, setUser1] = useState();
  const [user2, setUser2] = useState();

  useEffect(() => {
    setDataLoading(true)
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
        setDataLoading(false)
      })
      .catch((error) => console.log(error))
    )
  }, [])

  return (
    <>
    <table className="m-auto border-2 border-slate-400">
      <thead>
          <tr>
            <th className="bg-gradient-to-tr text-white from-blue-600 to-indigo-600" colSpan="3">Score</th>
          </tr>
      </thead>
      <tbody>
        {turns?.map((turn, id) => (
          <tr key={id}>
            <td className="py-2 px-4 font-bold">Round {id} :</td>
            <td className="py-2 px-4">
              {turn.winner}
              {console.log({user1})}
              {console.log(user1)}
            </td>
          </tr> 
        ))}         
      </tbody>
    </table>
    </>
  );
  
}

export default Score;