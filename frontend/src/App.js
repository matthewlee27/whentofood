import React, { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:5001";

function App() {
    const [foodName, setFoodName] = useState("");
    const [rating, setRating] = useState("");
    const [ratings, setRatings] = useState([]);

    //Set up timezone
    useEffect(() => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        fetch(`${API_URL}/set-time`, {
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify({ timezone })
        });
    }, [])

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
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const newRating = {
            food_name: foodName,
            rating: parseInt(rating),
            timezone: timezone
        }; // this is the format our flask wants
        

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

                const newRating = {
                    id: data.id,
                    food_name: data.food_name,
                    rating: data.rating,
                    time_submitted: data.time_submitted
                };

                setRatings([...ratings, newRating]);
                setFoodName("");
                setRating("");
            }
        })
        .catch(error => console.error("Error submitting rating:", error));
    };

    const handleDeletion = (id) => {
        const id_package = {id};
        
        fetch(`${API_URL}/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(id_package)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error){
                console.error("Error", data.error);
                alert(data.error);
            } else {
                console.log("Deleted", data);
                setRatings(prevRatings => prevRatings.filter(r => r.id !== id));
            }
        })
        .catch(error => console.error("Error deleting rating", error));
    };

    // Input/texts
    return (
        <div style = {{ paddingLeft: "20px" }}>
            
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
                            <button onClick={() => handleDeletion(r.id)}>Remove Rating</button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default App;