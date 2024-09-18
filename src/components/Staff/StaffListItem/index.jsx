import InvokePhone from "../../common/InvokePhone";
import UserProfileImage from "../../common/UserProfileImage";

export default function StaffListItem({
  image,
  firstName,
  lastName,
  desc,
  mobileNumber,
  onClick,
  className = "",
  disabled = false,
}) {
  console.log("fu=irstName", firstName, lastName, mobileNumber, image);

  return (
    <div
      onClick={onClick}
      className={`${className} ${
        disabled ? "pointer-events-none opacity-20" : ""
      } flex shadow text-highlight cursor-pointer bg-base-100 hover:bg-base-300 duration-300 transition-all justify-between items-center p-4 my-1 rounded-lg`}
    >
      <div className="inline-flex text-sm items-center">
        <div className="ml-2 mr-3">
          <UserProfileImage url={image} />
        </div>
        <div>
          <div className="font-medium">
            {firstName} {lastName}
          </div>
          <div className="text-xs text-highlight">{desc}</div>
        </div>
      </div>
      <div> <a className="text-blue-500" href={`tel:${mobileNumber}`}>{mobileNumber}</a></div>
      {/* <InvokePhone phone={mobileNumber} /> */}

    </div>
  );
}
