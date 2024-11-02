import Gauge from 'react-gauge-component';

interface GaugeComponentProps {
    value: number;
  }


  const GaugeComponent: React.FC<GaugeComponentProps> = ({ value }) => {
  return (
      <Gauge
      type="semicircle"
      arc={{
        colorArray: ['#00FF15', '#FF2121'],
        padding: 0.02,
        subArcs: [
          { limit: 40 },
          { limit: 60 },
          { limit: 70 },
          {},
          {},
          {},
          {}
        ]
      }}
      pointer={{ type: "blob", animationDelay: 0 }}
      value={value}
    />
  );
};

export default GaugeComponent;