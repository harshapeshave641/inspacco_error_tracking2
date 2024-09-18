const Skeleton = ({ className = "", height = "h-20", width = "w-20" }) => {
  return (
    <div
      className={`${width} ${height} ${className} animate-pulse bg-base-300 flex flex-col justify-center items-center rounded-lg`}
    />
  );
};

export default Skeleton;
