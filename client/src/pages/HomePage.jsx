import { useEffect, useState } from "react";
import { Link } from "react-router";
import NavBar from "../components/NavBar";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // 👈 import AuthContext

const HomePage = () => {
  const [polls, setPolls] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return; 

    const fetchPolls = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/polls", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setPolls(data);
      } catch (err) {
        console.error("Failed to fetch polls:", err);
      }
    };

    fetchPolls();
  }, [user]);

  return (
    <div className="min-h-screen bg-blue-400 p-4">
      <NavBar />
      <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Active Polls
        </h2>
        <div>
          {polls.map((poll) => (
            <div key={poll.id} className="mb-10">
              <Link to={`/votecard/${poll.id}`} state={{ poll }}>
                <div className="bg-gray-50 p-4 rounded border hover:shadow-md transition">
                  <h3 className="text-lg font-semibold text-center text-gray-800 mb-3">
                    {poll.question}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {poll.Options?.map((opt) => (
                      <div
                        key={opt.id}
                        className="flex items-center justify-center p-2 bg-gray-200 rounded text-gray-700"
                      >
                        👍 {opt.text}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-center text-gray-500">
                    Created at: {new Date(poll.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
