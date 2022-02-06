function MatchHistoryItem({ index, turnUser1, turnUser2 }) {

  return (
    <tr className="border-b text-left">
      <td className="pl-14 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Turn {index + 1}</td>
      <td className="text-sm text-gray-900 font-light pl-14 py-4 whitespace-nowrap">
        {turnUser1}
      </td>
      <td className="text-sm text-gray-900 font-light pl-14 py-4 whitespace-nowrap">
        {turnUser2}
      </td>
    </tr>
  );
}

export default MatchHistoryItem;