import { Player } from "@lottiefiles/react-lottie-player";

const Loading = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Player
        autoplay
        loop
        src="/load.json"
        style={{ height: "250px", width: "250px" }}
      ></Player>
    </div>
  );
};

export default Loading;
