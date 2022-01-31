function MatchScore({ player1Score, player2Score }) {

  return (
    <table className="m-auto border-2 border-slate-400">
      <thead>
        <tr className="bg-gradient-to-tr from-blue-600 to-indigo-600">
          <th className="text-white px-8 border-2 border-slate-400">Player 1</th>
          <th className="text-white px-8 border-2 border-slate-400">Player 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-2 px-4 border-2 border-slate-400">{player1Score}</td>
          <td className="py-2 px-4 border-2 border-slate-400">{player2Score}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default MatchScore;