import WorkSpaceBoardView from "./WorkSpaceBoardView";

const WorkSpaceMain = ({ selectedWorkspaceId }) => {
  console.log({selectedWorkspaceId});
  return (
    <>
      <section className="notion-editor-wrapper">
        <WorkSpaceBoardView selectedWorkspaceId={selectedWorkspaceId}/>
      </section>
    </>
  );
};

export default WorkSpaceMain;
