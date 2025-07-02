import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { Link, Navigate } from "react-router";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const [polls, setPolls] = useState([]);
  const { user } = useAuth();
  const access_token = localStorage.getItem("access_token");

  if (!access_token) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    if (!user) return;

    const fetchPolls = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/polls", {
          headers: {
            Authorization: `Bearer ${access_token}`,
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
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="overflow-hidden whitespace-nowrap mb-6">
        <h2 className="text-3xl font-bold text-gray-100 animate-marquee inline-block">
          🗳️ Available Polls — Cast your vote now !
        </h2>
      </div>

      <div>
        {polls.map((poll) => (
          <Link
            key={poll.id}
            to={`/votecard/${poll.id}`}
            state={{ poll }}
            className="block mb-6"
          >
            <div className="bg-white p-5 rounded-lg border-amber-400 border-4 border-double shadow hover:shadow-lg hover:border-blue-400 transition-all duration-200 cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-3">
                {poll.question}
              </h3>

              <div className="grid grid-cols-2 gap-2 mb-3">
                {poll.Options?.map((opt) => (
                  <div
                    key={opt.id}
                    className="flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-800 rounded px-2 py-1 text-sm transition"
                  >
                    👍 {opt.text}
                  </div>
                ))}
              </div>

              <p className="text-xs text-center text-gray-500">
                Created at: {new Date(poll.createdAt).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
