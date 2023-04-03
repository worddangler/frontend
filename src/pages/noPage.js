import AnimatedTitle from "../components/animatedTitle";

const NoPage = () => {
  return (
    <div className="justify-center items-center flex flex-1 h-screen">
      <text className="text-3xl font-medium">
        <AnimatedTitle
          title="Error 404"
          className="text-2xl sm:text-4xl lg:text-6xl mt-10 text-red-500"
        />
        Page Not Found (Inavild Link)
      </text>
    </div>
  );
};

export default NoPage;
