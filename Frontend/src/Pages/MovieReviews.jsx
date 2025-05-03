import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [user] = useState("currentUser"); // Placeholder for logged-in user (replace with actual auth)


    const user = JSON.parse(localStorage.getItem("users")).name;
    console.log(user)

    useEffect(() => {
        fetchMovie();
        fetchReviews();
    }, [id,loading]);

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:3000/api/v1/movie/get-reviews/${id}`, {
                headers: { Authorization: `Bearer ${token}` } // ✅ Pass token in headers
            });

            if (Array.isArray(res.data)) {  // ✅ Ensure it's an array
                setReviews(res.data);
            } else {
                setReviews([]);  // Set to empty array if not valid
            }
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setReviews([]); // ✅ Prevent crash by setting default empty array
        }
    };


    const fetchMovie = async () => {
        try {
            const res = await axios.get(`https://www.omdbapi.com/?apikey=183d627f&i=${id}`);
            if (res.data.Response === "True") {
                setMovie(res.data);
            } else {
                setError("Movie not found");
            }
        } catch (err) {
            setError(`Error fetching movie: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async () => {
        if (!newReview.trim()) return;

        try {
            const token = localStorage.getItem("token"); // Get token from localStorage
            const res = await axios.post("http://localhost:3000/api/v1/movie/add-review",
                {
                    movieId: id,
                    user,
                    text: newReview,
                },
                {
                    headers: { Authorization: `Bearer ${token}` } // ✅ Pass token in headers
                });

            if (res.data.review) {
                setReviews([...reviews, res.data.review]);
            }

            setNewReview("");
            fetchReviews();
            
        } catch (err) {
            console.error("Error submitting review:", err);
        }
    };


    const handleLike = async (reviewId) => {
        try {
            const token = localStorage.getItem("token"); // Get token
            const res = await axios.post(`http://localhost:3000/api/v1/movie/like-review/${id}/${reviewId}`,
                { user },
                { headers: { Authorization: `Bearer ${token}` } } // ✅ Secure request
            );

            setReviews(reviews.map((r) => (r._id === reviewId ? { ...r, likes: res.data.likes } : r)));
        } catch (err) {
            console.error("Error liking review:", err);
        }
    };
    


    if (loading) return <p>Loading movie details...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <Link to="/home" className="text-blue-500">← Back to Movies</Link>

            <div className="mt-4 bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row">
                    <img
                        src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300"}
                        alt={movie.Title}
                        className="w-full md:w-1/3 object-cover rounded-md"
                    />
                    <div className="md:ml-6 mt-4 md:mt-0 text-white">
                        <h2 className="text-3xl font-bold">{movie.Title}</h2>
                        <p className="text-gray-400 mt-2">{movie.Year} • {movie.Genre} • {movie.Runtime}</p>
                        <p className="mt-4">{movie.Plot}</p>
                        <p className="mt-2"><strong>Director:</strong> {movie.Director}</p>
                        <p><strong>Actors:</strong> {movie.Actors}</p>
                        <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-6 p-4 bg-gray-700 rounded-lg text-white">
                <h3 className="text-xl font-semibold">User Reviews</h3>

                {/* Review Input */}
                <div className="mt-4">
                    <textarea
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        placeholder="Write your review..."
                        className="w-full p-2 rounded bg-gray-600 text-white"
                    />
                    <button
                        onClick={handleReviewSubmit}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Submit Review
                    </button>
                </div>

                {/* Display Reviews */}
                {reviews.length === 0 ? (
                    <p className="text-gray-300 mt-2">No reviews yet. Be the first to review!</p>
                ) : (
                    <ul className="mt-4">
                        {
                        reviews.map((review) => (
                            <li key={review._id} className="p-3 bg-gray-800 my-2 rounded-md">
                                <p className="font-semibold">{review.user}</p>
                                <p className="text-gray-300">{review.text}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <button
                                        onClick={() => handleLike(review._id)}
                                        className="text-blue-400 flex items-center cursor-pointer"
                                    >
                                        👍 {review.likes.length}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MovieDetails;
