import React, { useContext, useState } from "react";
import { SocketContext } from "../App";
function Increment() {
  const { socket, counter } = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const handleClick = () => {
    setMessage("Processing...");
    socket.emit("increment", (res) => {
      setMessage(res.success ? "Incremented!" : res.msg);
    });
  };
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Increment Page</h1>
      <p>Counter: {counter}</p>
      <button 
        onClick={handleClick} 
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
      >
        Increment
      </button>
      <p>{message}</p>
    </div>
  );
}
export default Increment;