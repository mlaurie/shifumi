function MatchMovePlayed({ moveUsername1, moveUsername2 }) {

  return (
    <div className='flex gap-x-6 justify-center items-center'>
      <div className="w-20" >
        <img
          className="hover:cursor-pointer hover:origin-center hover:scale-110 hover:duration-150 hover:rotate-12"
          src={moveUsername1}
          />
        rock
      </div>
      <div className="font-bold text-xl">VS</div>
      <div className="w-20" >
        <img
          className="hover:cursor-pointer hover:origin-center hover:scale-110 hover:duration-150 hover:rotate-12"
          src={moveUsername2}
          />
        paper
      </div>
    </div>

  );
}

export default MatchMovePlayed;