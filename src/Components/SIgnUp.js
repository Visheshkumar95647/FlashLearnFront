import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpass, setConfirmpass] = useState("");
    const [number, setNumber] = useState("");
    const navigate = useNavigate();
    const checkPass = () => {
        if (password !== confirmpass) {
            alert("Passwords do not match");
            setPassword("");
            setConfirmpass("");
        }
    };

    const adduser = async (e) => {
        e.preventDefault();

        if (!name || !username || !password || !number) {
            alert("Please fill all credentials");
            return;
        }

        if (password !== confirmpass) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    username,
                    password,
                    phonenumber: number
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("User registered successfully");
                navigate('/login')
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to register user');
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
            <form onSubmit={adduser} className='input'>
            <ul><h1 className='sign-head'>Enter Details</h1></ul>
                <div className="name">
                    <input
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder='Enter Your Name' 
                    />
                </div>
                <div className="username">
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder='Enter Your Username' 
                    />
                </div>
                <div className="pass">
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder='Enter Your Password' 
                    />
                </div>
                <div className="confirmpass">
                    <input 
                        type="password" 
                        value={confirmpass} 
                        onChange={(e) => setConfirmpass(e.target.value)} 
                        onBlur={checkPass} 
                        placeholder='Confirm Your Password' 
                    />
                </div>
                <div className="phn">
                    <input 
                        type="text" 
                        value={number} 
                        onChange={(e) => setNumber(e.target.value)} 
                        placeholder='Enter Your Mobile Number' 
                    />
                </div>
                <div className="button">
                    <button>SignUp</button>
                </div>
            </form>
            </div>
            
        </>
    );
}
