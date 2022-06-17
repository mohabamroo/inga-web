import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

export function NotFound() {
  return (
    <div>
      <h1>Not found page</h1>
      <button className="btn btn-primary">Go back to home</button>
      <Link to="/login">Login</Link>
    </div>
  );
}
