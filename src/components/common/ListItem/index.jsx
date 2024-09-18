const ListItem = ({
  icon,
  title,
  description,
  className = "",
  isCard = true,
}) => {
  return (
    <div
      className={`${
        isCard ? "shadow hover:bg-base-300 bg-base-100" : "bg-transparent"
      } ${className} flex text-highlight cursor-pointer duration-300 transition-all justify-between items-center p-2 my-1 rounded-lg`}
    >
      <div className="inline-flex text-sm items-center">
        <div className="ml-2 mr-3">{icon}</div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-highlight">{description}</div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
