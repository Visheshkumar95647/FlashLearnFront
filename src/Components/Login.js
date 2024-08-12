import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert("Please Try Again");
                setUsername("");
                setPassword("");
                navigate("/login")
            }else{
                const { token } = data;
                localStorage.setItem('token', token); 
                navigate("/admin");
            }
        } catch (err) {
            alert("Please Try Again");
            setUsername("");
            setPassword("");
            navigate("/login")
        } 
    };

    return (
        <>
            <div className="background">
            <nav>
              <div className="left">
                <div><img src="logo.png" alt="Logo" /></div>
              </div>
            </nav>
            <br />
            <h1>Login</h1>
            <form onSubmit={handleLogin} className='input'>
                <div className="input">
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="Enter Your Username" 
                        required 
                    />
                </div>
                <div className="input">
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Enter Your Password" 
                        required 
                    />
                </div>
                <br />
                <div className="button">
                    <button>Login</button>
                </div>
            </form>
            </div>
        </>
    );
}
