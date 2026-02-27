import { useEffect } from "react";
import WorkSpaceBoardView from "./WorkSpaceBoardView";
import { axiosInstance } from "../../../api/axios";
import { GET_ALL_USERS_URL } from "../../../api/api_routes";
import { useState } from "react";

const WorkSpaceMain = ({
  selectedWorkspaceId,
  selectedWorkspaceName,
  selectedWorkspaceMode,
  setRefresh,
}) => {
  // // console.log({ selectedWorkspaceId });
  const [allUsers, setAllUsers] = useState([]);

  const handleGetAllUsers = async () => {
    try {
      const res = await axiosInstance.get(GET_ALL_USERS_URL);
      setAllUsers(res?.data);
    } catch (error) {
      console.error("Not able to get users list", error);
    }
  };

  useEffect(() => {
    handleGetAllUsers();
  }, []);

  return (
    <>
      <section className="notion-editor-wrapper">
        {selectedWorkspaceId && (
          <WorkSpaceBoardView
            selectedWorkspaceId={selectedWorkspaceId}
            selectedWorkspaceName={selectedWorkspaceName}
            selectedWorkspaceMode={selectedWorkspaceMode}
            setRefresh={setRefresh}
            allUsers={allUsers}
          />
        )}
      </section>
    </>
  );
};

export default WorkSpaceMain;
