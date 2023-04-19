import "../App.css";

const AnimatedTitle = ({ title, className }) => {
  var letters = 0;
  let letterArray = [];
  for (const t of title) {
    letterArray.push(t);
  }
  return (
    <div className={"waviy " + className}>
      {letterArray.map((l) => {
        return (
          <span style={{ "--i": ++letters }} key={letters}>
            {l}
          </span>
        );
      })}
    </div>
  );
};

export default AnimatedTitle;
