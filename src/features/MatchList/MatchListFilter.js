const MatchListFilter = ({ onClick, title, selected }) => (
  <div
    onClick={onClick}
    className={`flex-1 hover:cursor-pointer px-2 py-2 rounded-2xl text-md ${selected ? 'bg-indigo-600 text-indigo-100' : ''}`}>
    {title}
  </div>
)

export default MatchListFilter
