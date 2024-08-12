import React, { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-router-dom";
import "../App.css";
import ReactCardFlip from "react-card-flip";

export default function Home() {
  const [showHome, setShowHome] = useState(false);
  const [cards, setCards] = useState([]);
  const [flippedIndex, setFlippedIndex] = useState(null);

  const getAllCards = async () => {
    try {
      const response = await fetch("http://localhost:5000/qns", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch card data: ${errorText}`);
      }

      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error("Error fetching card data:", error);
    }
  };

  const handleFlip = (index) => {
    setFlippedIndex(flippedIndex === index ? null : index);
  };

  useEffect(() => {
    getAllCards();
    const timer = setTimeout(() => {
      setShowHome(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="container">
        <div className={`video-container ${showHome ? "fade-out" : ""}`}>
          <video autoPlay muted>
            <source src="vid.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className={`home-content ${showHome ? "fade-in" : ""}`}>
          <div className="background">
            <nav>
              <div className="left">
                <img src="logo.png" alt="Logo" />
              </div>
            </nav>

            <main>
              <div className="type">
                <h1>
                  Learn
                  <Typewriter
                    words={[
                      " something new ",
                      " at your pace",
                      " smarter, not harder",
                    ]}
                    loop={false}
                    cursor
                    cursorStyle="_"
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={1000}
                  />
                </h1>
              </div>
              <div className="para">
                <p>
                  -FlashLearn allows students to flip cards to reveal the
                  meanings of words, offering an interactive and engaging
                  learning experience. Additionally, students can customize
                  their study sessions by selecting any number of words,
                  providing a flexible approach to mastering new vocabulary!!
                </p>
              </div>
              <h1 className="sign-head">Admin</h1>
              <div className="button">
                <Link to="/signup">
                  <button>SignUp</button>
                </Link>
                <Link to="/login">
                  <button>Login</button>
                </Link>
              </div>
            </main>

            <div className="cards">
              {cards.map((cardGroup, groupIndex) => (
                <div key={groupIndex} className="card-group">
                  {cardGroup.map((card, cardIndex) => (
                    <div
                      className="card" id="group-cards"
                      onClick={() => handleFlip(groupIndex * 100 + cardIndex)}
                    >
                      <ReactCardFlip
                        key={cardIndex}
                        flipDirection="horizontal"
                        isFlipped={
                          flippedIndex === groupIndex * 100 + cardIndex
                        }
                        className = "group-cards"
                      >
                        <div className="card-front">
                          <div className="ques">
                            Question {cardIndex + 1}: {card.QUES} ?
                          </div>
                          <div className="pub">Published By - {card.NAME}</div>
                        </div>
                        <div className="card-back">
                          <div className="ans">
                            Answer {cardIndex + 1}: {card.ANS}
                          </div>
                          <div className="pub">Published By - {card.NAME}</div>
                        </div>
                      </ReactCardFlip>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
