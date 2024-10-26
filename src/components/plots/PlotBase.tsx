import { Coordinates, Mafs } from "mafs";
import { PlotEquation } from "../../types/nodes";
import FunctionEquation from "./FunctionEquation";

type props = {
  w: number;
  h: number;
  pan: boolean;
  equations: PlotEquation[];
};

const PlotBase = ({ w, h, pan, equations }: props) => {
  return (
    <div className="bg-sec w-full h-full">
      <Mafs viewBox={{ x: [-4, 4] }} width={w} height={h} pan={pan}>
        <Coordinates.Cartesian />
        {equations.map((eq, idx) => {
          switch (eq.type) {
            case "function":
              return <FunctionEquation key={idx} eq={eq} />;
          }
        })}
      </Mafs>
    </div>
  );
};

export default PlotBase;
