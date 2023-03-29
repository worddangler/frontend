import "../App.css";

const PlayButton = ({ title }) => {
  return (
    <div className="background-button">
      <button className="button">{title}</button>
    </div>
  );
};

export default PlayButton;
