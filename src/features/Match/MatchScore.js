function MatchScore({ player1Score, player2Score, usernamePlayer1, usernamePlayer2 }) {

  return (
    <>
      <h2 className="text-center my-8 text-xl font-semibold text-gray-600">Score</h2>
      <table className="m-auto border-2 border-slate-400">
        <thead>
        <tr className="bg-gradient-to-tr from-blue-600 to-indigo-600">
          <th className="text-white w-1/2 px-8 border-2 border-slate-400">{usernamePlayer1}</th>
          <th className="text-white w-1/2 px-8 border-2 border-slate-400">{usernamePlayer2}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td className="py-2 px-4 w-1/2 border-2 border-slate-400">{player1Score}</td>
          <td className="py-2 px-4 w-1/2 border-2 border-slate-400">{player2Score}</td>
        </tr>
        </tbody>
      </table>
    </>
  );
}

export default MatchScore;
