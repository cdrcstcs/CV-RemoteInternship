import CountUp from 'react-countup';

const AnimatedCounter = ({ amount }) => {
  return (
    <div className="w-full">
      <CountUp
        decimals={2}
        decimal=","
        prefix="$"
        end={amount}
        className="text-xl font-semibold text-gray-800"
      />
    </div>
  );
};

export default AnimatedCounter;
