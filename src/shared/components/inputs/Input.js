const Input = ({ name, type, title, value, onChange, errorMsg }) => (
  <div>
    <label htmlFor={name} className="block mb-1 text-xl text-gray-600 font-semibold">{title}</label>
    <input
      type={type}
      name={name}
      className="text-black bg-indigo-50 px-4 py-2 outline-none rounded-md w-full"
      value={value}
      onChange={onChange} />
    {errorMsg && (
      <div>{errorMsg}</div>
    )}
  </div>
)

export default Input
