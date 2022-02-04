import MatchHistoryItem from './MatchHistoryItem';

function MatchHistory({ match, usernamePlayer1, usernamePlayer2 }) {

  return (

    <table className="min-w-full">
      <thead className="border-b">
        <tr>
          <th scope="col" className="text-sm font-medium text-gray-900 pl-14 py-4 text-left">
            #
          </th>
          <th scope="col" className="text-sm font-medium text-gray-900 pl-14 py-4 text-left">
          {usernamePlayer1}
          </th>
          <th scope="col" className="text-sm font-medium text-gray-900 pl-14 py-4 text-left">
          {usernamePlayer2}
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(match?.turns) && match.turns.map((turn, index) => (
          <MatchHistoryItem turnUser1={turn.user1} turnUser2={turn.user2} index={index}/>
        ))}
      </tbody>
    </table>

  );
}

export default MatchHistory;

