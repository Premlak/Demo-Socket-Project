import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const Home = React.lazy(() => import("./pages/Home"));
const Increment = React.lazy(() => import("./pages/Increment"));
const Decrement = React.lazy(() => import("./pages/Decrement"));

export const SocketContext = React.createContext();

function AppWrapper() {
  const [socket, setSocket] = useState(null);
  const [counter, setCounter] = useState(10);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const s = io();
    setSocket(s);
    s.on("connected", ({ counter, allUsers }) => {
      setCounter(counter);
      setUsers(allUsers);
    });
    s.on("updateCounter", setCounter);
    s.on("users", setUsers);
    return () => s.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, counter, setCounter, users }}>
      <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomeWithNavigation />} />
          <Route path="/increment" element={<IncrementWithNavigation />} />
          <Route path="/decrement" element={<DecrementWithNavigation />} />
        </Routes>
      </Suspense>
    </SocketContext.Provider>
  );
}

// 🔁 Add navigation buttons in each page
const withNavigation = (Component) => () => {
  const navigate = useNavigate();
  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <button onClick={() => navigate("/")} className="bg-blue-500 text-white px-4 py-2 rounded">Home</button>
        <button onClick={() => navigate("/increment")} className="bg-green-500 text-white px-4 py-2 rounded">Increment</button>
        <button onClick={() => navigate("/decrement")} className="bg-red-500 text-white px-4 py-2 rounded">Decrement</button>
      </div>
      <Component />
    </div>
  );
};

const HomeWithNavigation = withNavigation(Home);
const IncrementWithNavigation = withNavigation(Increment);
const DecrementWithNavigation = withNavigation(Decrement);

// 🌐 Wrap app with Router
function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
