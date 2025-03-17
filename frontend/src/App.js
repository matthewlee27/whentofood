import React, { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:5001";

function App() {
    const [foodName, setFoodName] = useState("");
    const [rating, setRating] = useState("");
    const [ratings, setRatings] = useState([]);
    const [removeName, setRemoveName] = useState("");

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
        const newRating = { food_name: foodName, rating: parseInt(rating) };

        fetch(`${API_URL}/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRating),
        })
        .then(response => response.json())
        .then(data => {
        if (data.error) {
            console.error("Error:", data.error);
            alert(data.error);
        } else {
            console.log("Success:", data);
            setRatings([...ratings, newRating]);
            setFoodName("");
            setRating("");
        }
        })
        .catch(error => console.error("Error submitting rating:", error));
    };

    // Function to remove an existing rating
    const handleRemove = (r) => {
        r.preventDefault();
        removeName;
        
    }


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
                {ratings.map((r, index) => (
                    <li key={index}>
                        {r.food_name}: {r.rating}/10
                    </li>
                ))}
            </ul>
            
            <h2>Remove previous ratings</h2>
            <form onSubmit={handleRemove}>
                <input
                    type = "text"
                    placeholder = "remove this food"
                    value = {removeName}
                    onChange={(r) => setRemoveName(e.target.value)}
                />
                <button type="submit">Remove rating</button>
            </form>
        </div>
    );
}

export default App;