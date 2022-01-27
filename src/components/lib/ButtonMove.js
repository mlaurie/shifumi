function Button({ title, img }){
  
  return (
    <button className="w-24" >
      <img 
        className="hover:cursor-pointer hover:origin-center hover:scale-110 hover:duration-150 hover:rotate-12" 
        src={img} />
      {title}
    </button>
  );

}

export default Button;