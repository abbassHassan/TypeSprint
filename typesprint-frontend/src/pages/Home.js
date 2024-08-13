import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [textSample, setTextSample] = useState("");
  const [textSampleId, setTextSampleId] = useState(""); // Store the text sample ID
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [error, setError] = useState(null); // Handle errors
  const [result, setResult] = useState(null); // Store typing test result
  const [timeLeft, setTimeLeft] = useState(30); // Initial time of 30 seconds
  const navigate = useNavigate();

  const timerRef = useRef(null);

  // Fetch text sample on component mount
  useEffect(() => {
    const fetchTextSample = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/text-samples/random"
        );
        const data = await response.json();
        setTextSample(data.content);
        setTextSampleId(data._id); // Store the text sample ID
      } catch (err) {
        console.error("Error fetching text sample:", err);
        setError("Failed to fetch text sample. Please try again later.");
      }
    };

    fetchTextSample();
  }, []);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && startTime) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      handleSubmit(); // Submit results when time runs out
    }

    return () => clearInterval(timerRef.current);
  }, [timeLeft, startTime]);

  // Handle text input
  const handleChange = (e) => {
    if (!startTime) {
      setStartTime(new Date());
      setTimeLeft(30); // Reset timer to 30 seconds when the user starts typing
    }
    setTypedText(e.target.value);
  };

  // Submit typing test results
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token is missing. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/typing-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token, // Use actual JWT token from local storage
        },
        body: JSON.stringify({
          textSampleId, // Use the actual text sample ID
          startTime,
          typedContent: typedText,
        }),
      });

      if (response.status === 401) {
        setError("Token is not valid. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setResult(data); // Store the result
      console.log(data);
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to submit typing test. Please try again later.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Render text with color-coding based on correctness
  const renderTextWithColor = () => {
    return textSample.split("").map((char, index) => {
      let color;
      if (index < typedText.length) {
        color = typedText[index] === char ? "text-black" : "text-red-500";
      } else {
        color = "text-gray-500";
      }
      return (
        <span key={index} className={color}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="w-full bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">TypeSprint</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">
        <div className="relative bg-white shadow-md rounded-lg p-6 mt-8">
          <h2 className="text-3xl font-bold text-center mb-6">Typing Test</h2>
          {error && (
            <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
              {error}
            </div>
          )}
          {result ? (
            <div className="mb-4 p-4 bg-green-200 rounded-lg">
              <h3 className="text-2xl font-bold text-center mb-2">Results</h3>
              <p className="text-lg text-center">
                WPM: {result.wpm.toFixed(2)}
              </p>
              <p className="text-lg text-center">
                Accuracy: {result.accuracy.toFixed(2)}%
              </p>
            </div>
          ) : (
            <>
              <div className="relative mb-4 p-4 bg-gray-200 rounded-lg h-32">
                <div
                  className="absolute top-0 left-0 w-full h-full text-lg font-mono leading-relaxed pointer-events-none whitespace-pre-wrap"
                  style={{
                    fontFamily: "monospace",
                    fontSize: "16px",
                    lineHeight: "1.5",
                    letterSpacing: "normal", // Ensure spacing matches the textarea
                  }}
                >
                  {renderTextWithColor()}
                </div>
                <textarea
                  className="w-full h-full p-0 border-none outline-none bg-transparent text-transparent caret-black absolute top-0 left-0"
                  value={typedText}
                  onChange={handleChange}
                  disabled={timeLeft <= 0} // Disable textarea when time is up
                  spellCheck="false" // Disable spellcheck to avoid red underlines
                  style={{
                    fontFamily: "monospace",
                    fontSize: "16px",
                    lineHeight: "1.5",
                    letterSpacing: "normal", // Ensure spacing matches the rendered text
                    caretColor: "black", // Ensure caret is visible
                  }}
                ></textarea>
              </div>
              <div className="text-center mb-4">
                <span className="text-2xl font-bold">{timeLeft}</span> seconds
                remaining
              </div>
            </>
          )}
        </div>
      </main>
      <footer className="w-full bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto text-center">
          &copy; 2024 TypeSprint. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
