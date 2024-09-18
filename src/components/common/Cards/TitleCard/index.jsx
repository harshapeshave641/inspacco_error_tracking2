import Subtitle from "../../Typography/Subtitle";
import InboxStackIcon from "@heroicons/react/24/outline/InboxStackIcon";

const EmptyComponent = () => (
  <div className="flex justify-center items-center">
    <InboxStackIcon />
    <span className="font-bold">No Data!</span>
  </div>
);

function TitleCard({
  title,
  children,
  topMargin,
  TopSideButtons,
  className = "",
  bodyClass = "",
}) {
  return (
    <div
      className={`card !static w-full p-6 bg-base-100 shadow-xl ${
        topMargin || "mt-6"
      } ${className}`}
    >
      {/* Title for Card */}
      <Subtitle styleClass={TopSideButtons ? "inline-block" : ""}>
        {title}

        {/* Top side button, show only if present */}
        {TopSideButtons && (
          <div className="inline-block float-right">{TopSideButtons}</div>
        )}
      </Subtitle>

      <div className="divider mt-2"></div>

      {/** Card Body */}
      <div className={`pb-6 bg-base-100 ${bodyClass}`}>
        {children || <EmptyComponent />}
      </div>
    </div>
  );
}

export default TitleCard;
