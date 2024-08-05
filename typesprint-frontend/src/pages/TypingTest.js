import React, { useState, useEffect } from "react";

const TypingTest = () => {
  const [textSample, setTextSample] = useState("");
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    const fetchTextSample = async () => {
      const response = await fetch(
        "http://localhost:5000/api/text-samples/random"
      );
      const data = await response.json();
      setTextSample(data.content);
    };

    fetchTextSample();
  }, []);

  const handleChange = (e) => {
    if (!startTime) {
      setStartTime(new Date());
    }
    setTypedText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEndTime(new Date());

    const response = await fetch("http://localhost:5000/api/typing-tests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": "your_jwt_token_here", // Replace with actual JWT token
      },
      body: JSON.stringify({
        textSampleId: "id_of_text_sample", // Replace with actual text sample ID
        startTime,
        endTime,
        typedContent: typedText,
      }),
    });

    const data = await response.json();
    console.log(data);
    // Handle the response, like showing results
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-center">Typing Test</h2>
      <div className="mt-4">
        <p className="text-lg">{textSample}</p>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-2 mt-2 border border-gray-300 rounded"
            rows="5"
            value={typedText}
            onChange={handleChange}
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 mt-4 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default TypingTest;
