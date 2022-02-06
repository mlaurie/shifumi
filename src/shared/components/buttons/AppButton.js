const AppButton = ({ onClick, title, ...rest }) => (
  <div
    {...rest}
    onClick={onClick}
    className="hover:cursor-pointer hover:scale-110 hover:duration-150	mt-4 w-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-indigo-100 py-2 rounded-md text-lg tracking-wide">
    {title}
  </div>
)

export default AppButton
