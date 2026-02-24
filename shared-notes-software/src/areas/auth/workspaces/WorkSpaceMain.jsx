import WorkSpaceBoardView from "./WorkSpaceBoardView";

const WorkSpaceMain = ({ selectedWorkspaceId, selectedWorkspaceName, selectedWorkspaceMode }) => {
  console.log({ selectedWorkspaceId });
  return (
    <>
      <section className="notion-editor-wrapper">
        <WorkSpaceBoardView
          selectedWorkspaceId={selectedWorkspaceId}
          selectedWorkspaceName={selectedWorkspaceName}
          selectedWorkspaceMode={selectedWorkspaceMode}
        />
      </section>
    </>
  );
};

export default WorkSpaceMain;
