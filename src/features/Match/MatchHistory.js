import MatchHistoryItem from './MatchHistoryItem';

const MatchHistory = ({ turnsHistory, usernamePlayer1, usernamePlayer2 }) => (
  <>
    <h2 className="text-center my-6 text-xl font-semibold text-gray-600">History</h2>

    <div className='space-y-4'>
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
        {turnsHistory.map((turn, index) => (
          <MatchHistoryItem key={index} turnUser1={turn.user1} turnUser2={turn.user2} index={index}/>
        ))}
        </tbody>
      </table>
    </div>
  </>
);

export default MatchHistory;

