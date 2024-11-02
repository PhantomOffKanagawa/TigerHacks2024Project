import Gauge from 'react-gauge-component';

interface GaugeComponentProps {
    value: number;
  }


  const GaugeComponent: React.FC<GaugeComponentProps> = ({ value }) => {
  return (
    <Gauge
      value={value}
      type="radial"
      minValue={0}
      maxValue={100}
    />
  );
};

export default GaugeComponent;