import React, { useContext } from "react";
import { SocketContext } from "../App";
function Home() {
  const { users, counter } = useContext(SocketContext);
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Home Page</h1>
      <p className="mb-2">Counter: {counter}</p>
      <h2>Connected Users:</h2>
      <ul className="list-disc ml-4">
        {users.map((id) => <li key={id}>{id}</li>)}
      </ul>
    </div>
  );
}
export default Home;
