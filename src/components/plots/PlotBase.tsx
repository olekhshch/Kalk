import { Coordinates, Mafs } from "mafs";
import { PlotEquation } from "../../types/nodes";
import FunctionEquation from "./FunctionEquation";
import VectorEquation from "./VectorEquation";

type props = {
  w: number;
  h: number;
  pan: boolean;
  equations: PlotEquation[];
  viewBox: { x?: [number, number] };
};

const PlotBase = ({ w, h, pan, equations, viewBox }: props) => {
  return (
    <div className="bg-sec w-full h-full">
      <Mafs viewBox={viewBox} width={w} height={h} pan={pan}>
        <Coordinates.Cartesian />
        {equations.map((eq, idx) => {
          switch (eq.type) {
            case "function":
              return <FunctionEquation key={idx} eq={eq} />;
            case "vec":
              return <VectorEquation key={idx} vec={eq} />;
          }
        })}
      </Mafs>
    </div>
  );
};

export default PlotBase;
