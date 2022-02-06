import { useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { login } from '../../shared/data/api'
import Input from "../../shared/components/inputs/Input";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const handleUsername = useCallback((event) => {
    setUsername(event.target.value);
  }, [])

  const handlePassword = useCallback((event) => {
    setPassword(event.target.value);
  }, [])

  const handleLogin = useCallback(async (event) => {
    event.preventDefault();
    setError(undefined)
    setIsLoading(true)

    try {
      await login(username, password)
      navigate('/matches');
    } catch (err) {
      setError(err)
      setIsLoading(false)
    }
  }, [navigate, username, password])

  return (
    <form onSubmit={handleLogin}>
      <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-md max-w-sm">
        <div className="space-y-6">
          <h1 className="text-center text-3xl font-semibold text-indigo-600 text-bold">Sign in</h1>
          <Input name={'username'} type={'text'} title={'Username'} value={username} onChange={handleUsername} errorMsg={error?.errors?.username?.message}  />
          <Input name={'password'} type={'password'} title={'Password'} value={password} onChange={handlePassword} errorMsg={error?.errors?.password?.message}  />
        </div>
        <input type="submit" className="hover:cursor-pointer hover:scale-110 hover:duration-150 mt-4 w-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-indigo-100 py-2 rounded-md text-lg tracking-wide" value="Login" />
      </div>
    </form>
  );
}

export default Login;
