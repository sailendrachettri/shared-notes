import { useState } from "react";
import "./App.css";
import Navbar from "./areas/public/common/nav-bar/Navbar";
import Home from "./areas/public/Home";

function App() {
   const [toggleSidebar, setToggleSidebar] = useState(false);

  return (
    <>
      <Navbar setToggleSidebar={setToggleSidebar} toggleSidebar={toggleSidebar}/>

      <Home toggleSidebar={toggleSidebar}/>
    </>
  );
}

export default App;
