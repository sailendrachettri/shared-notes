import WorkSpaceBoardView from "./WorkSpaceBoardView";

const WorkSpaceMain = ({
  selectedWorkspaceId,
  selectedWorkspaceName,
  selectedWorkspaceMode,
  setRefresh,
}) => {
  // // console.log({ selectedWorkspaceId });

  return (
    <>
      <section className="notion-editor-wrapper">
        {selectedWorkspaceId && (
          <WorkSpaceBoardView
            selectedWorkspaceId={selectedWorkspaceId}
            selectedWorkspaceName={selectedWorkspaceName}
            selectedWorkspaceMode={selectedWorkspaceMode}
            setRefresh={setRefresh}
          />
        )}
      </section>
    </>
  );
};

export default WorkSpaceMain;
