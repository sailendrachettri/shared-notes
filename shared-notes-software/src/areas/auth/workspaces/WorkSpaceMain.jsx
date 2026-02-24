import WorkSpaceBoardView from "./WorkSpaceBoardView";

const WorkSpaceMain = ({ selectedWorkspaceId, selectedWorkspaceName }) => {
  console.log({ selectedWorkspaceId });
  return (
    <>
      <section className="notion-editor-wrapper">
        <WorkSpaceBoardView
          selectedWorkspaceId={selectedWorkspaceId}
          selectedWorkspaceName={selectedWorkspaceName}
        />
      </section>
    </>
  );
};

export default WorkSpaceMain;
