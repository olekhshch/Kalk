import "./index.css";
import BottomPanel from "./layout/BottomPanel";
import Canvas from "./layout/Canvas";
import TopPanel from "./layout/Top panel/TopPanel";

const App = () => {
  return (
    <>
      <div id="layout">
        <TopPanel />
        <Canvas />
        <BottomPanel />
      </div>
    </>
  );
};

export default App;
