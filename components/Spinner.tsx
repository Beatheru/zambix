import Image from "next/image";

const Spinner = ({ size }: { size: number }) => {
  return (
    <Image
      src="/icons/loading-circle.svg"
      alt="loading"
      width={size}
      height={size}
    />
  );
};

export default Spinner;
