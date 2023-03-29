import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>index</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          className="btn m-2"
          onClick={() => {
            navigate("/play");
          }}
        >
          Create New Lobby
        </button>
        <button className="btn m-2">Enter Session ID</button>
        <button className="btn m-2">Enter Invite Link</button>
      </div>
    </div>
  );
};

export default Index;
