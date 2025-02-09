import React, { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:5000";

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

    // Function to submit a new rating
    const handleSubmit = (e) => {
        e.preventDefault();
        const newRating = { food_name: foodName, rating: parseInt(rating) };

        fetch(`${API_URL}/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRating),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Success:", data);
            setRatings([...ratings, newRating]); // Update UI
            setFoodName("");
            setRating("");
        })
        .catch(error => console.error("Error submitting rating:", error));
    };

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
                {ratings.map((r, index) => (
                    <li key={index}>
                        {r.food_name}: {r.rating}/10
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;