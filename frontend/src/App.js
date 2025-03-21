import React, { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:5001";

function App() {
    const [foodName, setFoodName] = useState("");
    const [rating, setRating] = useState("");
    const [ratings, setRatings] = useState([]);

    // Fetch existing ratings when the page loads
    useEffect(() => {
        fetch(`${API_URL}/get-ratings`)
            .then(response => response.json())
            .then(data => setRatings(data.ratings))
            .catch(error => console.error("Error fetching ratings:", error));
    }, []);

    // Hitting the submit button
    const handleSubmit = (e) => {
        e.preventDefault();
        const newRating = { food_name: foodName, rating: parseInt(rating)}; // this is the format our flask wants

        fetch(`${API_URL}/submit`, { //we define the API url above
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRating),
        })
        .then(response => response.json()) // waits for a response and parses it into JSON
        .then(data => { // checks if we get a data error
        if (data.error) {
            console.error("Error:", data.error);
            alert(data.error);
        } else {
            console.log("Success:", data);
            setRatings([...ratings, data]);
            setFoodName("");
            setRating("");
        }
        })
        .catch(error => console.error("Error submitting rating:", error));
    };


    // Input/texts
    return (
        <div>
            <h1>Personal Food Data Tracker</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter food name"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Rating (1-10)"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    required
                />
                <button type="submit">Submit Rating</button>
            </form>

            <h2>Previous Ratings:</h2>
            <ul>
                {ratings.map((r) => {
                    const submittedDate = new Date(r.time_submitted);
                    const formattedTime = submittedDate.toLocaleString();

                    return(
                        <li key={r.id}>
                        {r.food_name}: {r.rating}/10 - Submitted on {formattedTime}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default App;