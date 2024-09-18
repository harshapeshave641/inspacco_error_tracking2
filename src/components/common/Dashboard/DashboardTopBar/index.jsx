import Datepicker from "react-tailwindcss-datepicker";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";
import moment from "moment";

// const periodOptions = [
//   { name: "Today", value: "TODAY" },
//   { name: "Yesterday", value: "YESTERDAY" },
//   { name: "This Week", value: "THIS_WEEK" },
//   { name: "Last Week", value: "LAST_WEEK" },
//   { name: "This Month", value: "THIS_MONTH" },
//   { name: "Last Month", value: "LAST_MONTH" },
// ];

function DashboardTopBar({
  singleDatePicker = false,
  updateDashboardPeriod,
  dateRange,
  onRefreshDataClicked,
  actions,
  className = "",
}) {
  const handleDatePickerValueChange = (newValue) => {
    console.log("newValue", newValue);
    updateDashboardPeriod(newValue);
  };

  return (
    <div className={`flex items-center p-2 rounded-lg ${className}`}>
      <div className="">
        <Datepicker
          asSingle={singleDatePicker}
          value={dateRange}
          theme={"light"}
          startFrom={moment().subtract(1, "months").toDate()}
          maxDate={new Date()}
          inputClassName="text-base-content input input-bordered w-72"
          popoverDirection={"down"}
          toggleClassName="invisible"
          onChange={handleDatePickerValueChange}
          showShortcuts={false}
          primaryColor={"white"}
        />
      </div>
      <div className="pl-10 text-right">
        <div className="inline-flex gap-2 items-center">
          <button
            className="btn btn-primary btn-sm normal-case"
            onClick={onRefreshDataClicked}
          >
            <ArrowPathIcon className="w-4 mr-2" />
            Refresh Data
          </button>
          {actions}
        </div>
        {/* <button className="btn btn-ghost btn-sm normal-case  ml-2">
          <ShareIcon className="w-4 mr-2" />
          Share
        </button> */}
        {/* <div className="dropdown dropdown-bottom dropdown-end  ml-2">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-sm normal-case btn-square "
          >
            <EllipsisVerticalIcon className="w-5" />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu menu-compact p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a>
                <EnvelopeIcon className="w-4" />
                Email Digests
              </a>
            </li>
            <li>
              <a>
                <ArrowDownTrayIcon className="w-4" />
                Download
              </a>
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}

export default DashboardTopBar;
