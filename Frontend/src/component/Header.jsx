import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


const Header = () => {
    const [user, setUser] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        // Fetch user details (replace with actual API or localStorage handling)
        const loggedInUser = JSON.stringify(localStorage.getItem("token"));
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("users"); // Clear user session
        setUser(null);
        navigate('/login')
        
    };

    return (
        <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
            <Link to="/" className="text-xl font-bold">Blog.in</Link>

            <div className="flex items-center space-x-4">
                {user ? (
                    <>
                        <img
                            src={user.avatar || "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?semt=ais_hybrid"}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full border-2 border-gray-400"
                        />
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Header;
