import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactCardFlip from "react-card-flip";
export default function FlipLearn() {
  const [ques, setQues] = useState("");
  const [ans, setAns] = useState("");
  const [name, setName] = useState("");
  const [cards, setCards] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Want to Log Out?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  const allCards = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;  // Exit the function if no token is found
    }

    try {
      const response = await fetch('http://localhost:5000/qns', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get the error text for debugging
        throw new Error(`Failed to fetch card data: ${errorText}`);
      }

      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error("Error fetching card data:", error);
    }
  };

  useEffect(() => {
    allCards();
  }, []);

  const deletion = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/delete/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete card: ${errorText}`);
      }

      const data = await response.json();
      alert(data); // Show success message
      allCards(); // Refresh the card list
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const updation = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/update/${editingId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          ques,
          ans,
          name,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update card: ${errorText}`);
      }

      const data = await response.json();
      alert(data);
      setEditingId(null);
      setQues("");
      setAns("");
      setName("");
      allCards(); 
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const addQues = async (e) => {
    e.preventDefault();
    if (!ques) {
      alert("Add Question");
    } else if (!ans) {
      alert("Provide Ans Of Question");
    } else {
      try {
        const response = await fetch("http://localhost:5000/addques", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ques,
            ans,
            name,
          }),
        });

        if (response.ok) {
          alert("Question added successfully");
          setQues("");
          setAns("");
          setName("");
          allCards(); // Refresh the card list
        } else {
          alert("Failed to add question");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to add question");
      }
    }
  };


  const handleEditClick = (item) => {
    setEditingId(item.ID);
    setQues(item.QUES);
    setAns(item.ANS);
    setName(item.NAME);
  };

  return (
    <>
      <div className="background">
        <nav>
          <div className="left">
            <div>
              <img src="logo.png" alt="Logo" />
            </div>
          </div>
        </nav>

        <div className="qns">
          <div className="button"><button onClick={handleLogout}>Logout</button></div>
          <div className="questions">
            <textarea
              className="text"
              id="question"
              value={ques}
              onChange={(e) => setQues(e.target.value)}
              name="question"
              placeholder="Type your question here..."
              rows="4"
              cols="50"
            ></textarea>
          </div>
          <div className="answers">
            <textarea
              id="answer"
              value={ans}
              onChange={(e) => setAns(e.target.value)}
              className="text"
              name="answer"
              placeholder="Type your answer here..."
              rows="4"
              cols="50"
            ></textarea>
          </div>
          <form className="input">
            <input type="text" placeholder="Enter Publisher Name" value={name} onChange={(e) => setName(e.target.value)} />
          </form>
          <div className="button">
            <button onClick={editingId ? updation : addQues}>
              {editingId ? "Update Question" : "Add Question"}
            </button>
          </div>
        </div>

        <div className="cards">
          {cards.map((card, index) => {
            const elements = [];
            for (let i = 0; i < card.length; i++) {
              const item = card[i];
              elements.push(
                <div className="card" key={i}>
                  <div className="ques">Question {i+1} : {item.QUES} ?</div>
                  <div className="ans">Answer {i+1} : {item.ANS}</div>
                  <div className="pub">Published By - {item.NAME}</div>
                  <div className="btn">
                    <div className="button" onClick={() => handleEditClick(item)}><button>Update</button></div>
                    <div className="button" onClick={() => deletion(item.ID)}><button>Delete</button></div>
                  </div>
                </div>
              );
            }
            return <div key={index}>{elements}</div>;
          })}
        </div>

      </div>
    </>
  );
}
