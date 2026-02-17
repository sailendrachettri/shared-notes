import { useState, useEffect, useRef } from "react";
import "./App.css";
import Navbar from "./areas/public/common/nav-bar/Navbar";
import Home from "./areas/public/Home";
import { axiosInstance } from "./api/axios";
import { CHECK_SERVER_NETWORK } from "./api/api_routes";
import ServerNotFound from "./utils/info-screen/ServerNotFound";
import LoadingPage from "./utils/info-screen/LoadingPage";

function App() {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [serverStatus, setServerStatus] = useState(null); // null = loading, true = ok, false = error
  const intervalRef = useRef(null); // store interval ID
   const [autoFetchStatus, setAutoFetchStatus] = useState(false); 


  const handleServerNetworkCheck = async () => {
    try {
      const payload = { SearchText: "" };
      const res = await axiosInstance.post(CHECK_SERVER_NETWORK, payload);
      // console.log(res)

      if (res?.data?.success === true && res?.data?.status === "FETCHED") {
        setServerStatus(true);
        // Stop retrying once server is connected
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
    // Run immediately on mount
    handleServerNetworkCheck();

    // Then retry every 10 seconds
    intervalRef.current = setInterval(() => {
     
      handleServerNetworkCheck();
    }, 10000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(()=>{
    if(autoFetchStatus){
      setTimeout(() => {
        setAutoFetchStatus(false);
      }, 5000);
    }
  }, [autoFetchStatus]);




  if(serverStatus === null ) return  <LoadingPage />;
  if(serverStatus === false) return <ServerNotFound />;

  return (
    <>
      <Navbar
        setToggleSidebar={setToggleSidebar}
        toggleSidebar={toggleSidebar}
        autoFetchStatus={autoFetchStatus} 
      />
      <section>
        {serverStatus === true && <Home autoFetchStatus={autoFetchStatus} setAutoFetchStatus ={setAutoFetchStatus} toggleSidebar={toggleSidebar} />}
      
      </section>
    </>
  );
}

export default App;
