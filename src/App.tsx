import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { AppContainer } from "./pages/AppContainer.page";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <ToastContainer />
      {AppContainer()}
    </>
  );
}

export default App;
