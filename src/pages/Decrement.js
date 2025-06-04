import React, { useContext, useState } from "react";
import { SocketContext } from "../App";
function Decrement() {
  const { socket, counter } = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const handleClick = () => {
    socket.emit("decrement", (res) => {
      setMessage(res.success ? "Decremented!" : res.msg);
    });
  };
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Decrement Page</h1>
      <p>Counter: {counter}</p>
      <button onClick={handleClick} className="mt-2 px-4 py-2 bg-red-500 text-white rounded">
        Decrement
      </button>
      <p>{message}</p>
    </div>
  );
}
export default Decrement;
