import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function Login() {

    const[values, setValues] = useState({username:"", password:""})
    const navigate = useNavigate();

    function handleChange(e) {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
            e.preventDefault()
        fetch("http://fauques.freeboxos.fr:3000/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(values)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    localStorage.setItem("username", values.username);
                    localStorage.setItem("token", data.token);
                    navigate('/matches');
                }
            }) 
    }

    return (

        <form onSubmit={handleSubmit}>
            <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-md max-w-sm">
                <div className="space-y-6">
                    <h1 className="text-center text-3xl font-semibold text-indigo-600 text-bold">Sign in</h1>
                    <div>
                        <label htmlFor="username" className="block mb-1 text-xl text-gray-600 font-semibold">Username</label>
                        <input name="username" className="text-black bg-indigo-50 px-4 py-2 outline-none rounded-md w-full" value={values.username} onChange={handleChange}/>
                    </div>                   
                    <div>
                        <label htmlFor="password" className="block mb-1 text-xl text-gray-600 font-semibold">Password</label>
                        <input type="password" name="password" className="text-black bg-indigo-50 px-4 py-2 outline-none rounded-md w-full" value={values.password} onChange={handleChange}/>
                    </div>
                </div>
                <input type="submit" className="hover:cursor-pointer hover:scale-110 hover:duration-150 mt-4 w-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-indigo-100 py-2 rounded-md text-lg tracking-wide" value="Login" />
            </div>
        </form>
    );
}

export default Login;