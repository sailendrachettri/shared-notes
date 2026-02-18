import { useState, useEffect, useRef } from "react";
import "./App.css";
import Navbar from "./areas/public/common/nav-bar/Navbar";
import Home from "./areas/public/Home";
import { axiosInstance } from "./api/axios";
import { CHECK_SERVER_NETWORK } from "./api/api_routes";
import ServerNotFound from "./utils/info-screen/ServerNotFound";
import LoadingPage from "./utils/info-screen/LoadingPage";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

function App() {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);
  const intervalRef = useRef(null);
  const [autoFetchStatus, setAutoFetchStatus] = useState(false);

  const currrentEnvironment = window.location.host;

  const handleServerNetworkCheck = async () => {
    try {
      const res = await axiosInstance.post(CHECK_SERVER_NETWORK, {
        SearchText: "",
      });

      if (res?.data?.success === true && res?.data?.status === "FETCHED") {
        setServerStatus(true);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        setServerStatus(false);
      }
    } catch (error) {
      console.error("Not able to connect to server", error);
      setServerStatus(false);
    }
  };

  useEffect(() => {
    handleServerNetworkCheck();
    
    intervalRef.current = setInterval(handleServerNetworkCheck, 10000);
    console.info("Connection to server again...");
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Control window size based on server status
  useEffect(() => {
    const resizeAndCenter = async () => {
      if (serverStatus === true) {
        await appWindow.setSize(new LogicalSize(1080, 650));
      } else {
        await appWindow.setSize(new LogicalSize(480, 360));
      }
    };

    resizeAndCenter();
  }, [serverStatus]);

  // Keyboard shortcut to refresh block
  useEffect(() => {
    if (currrentEnvironment?.includes("localhost")) {
      console.info("Allowing page reloading in development");
      return;
    }

    const handleKeyDown = (e) => {
      // F5
      if (e.key === "F5") {
        e.preventDefault();
      }

      // Ctrl + R (Windows/Linux)
      if (e.ctrlKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
      }

      // Cmd + R (Mac)
      if (e.metaKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (autoFetchStatus) {
      
      const t = setTimeout(() => setAutoFetchStatus(false), 5000);
      return () => clearTimeout(t);
    }
  }, [autoFetchStatus]);

  if (serverStatus === null) return <LoadingPage />;
  if (serverStatus === false) return <ServerNotFound />;

  return (
    <>
      <Navbar
        setToggleSidebar={setToggleSidebar}
        toggleSidebar={toggleSidebar}
        autoFetchStatus={autoFetchStatus}
      />
      <section>
        <Home
          autoFetchStatus={autoFetchStatus}
          setAutoFetchStatus={setAutoFetchStatus}
          toggleSidebar={toggleSidebar}
        />
      </section>
    </>
  );
}

export default App;
