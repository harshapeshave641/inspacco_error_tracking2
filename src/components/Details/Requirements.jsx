// import { isEmpty } from "lodash";
// import EmptyData from "../common/EmptyData";

// const Requirements = ({ data }) => {
//   if (!data) {
//     data = `[]`;
//   }
//   let parsedData = !isEmpty(data) ? JSON.parse(data) : [];
//   if (!data.length) return <EmptyData msg="There are no requirements." />;

//   return (
//     <div className="grid grid-cols-2 gap-6 w-[80%] mx-auto mt-4">
//       {parsedData.map(({ fields }) =>
//         fields?.filter(a=>a)?.map(({ label, value }) => (
//           <div>
//             <div className="text-sm font-semibold label-text">{label}</div>
//             <div className="text-sm label-text">{value || "-"}</div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default Requirements;


import { isEmpty } from "lodash";
import EmptyData from "../common/EmptyData";

const Requirements = ({ data }) => {
  if (!data) {
    data = `[]`;
  }

  let parsedData = !isEmpty(data) ? JSON.parse(data) : [];
  if (!parsedData.length) return <EmptyData msg="There are no requirements." />;

  return (
    <div className="grid grid-cols-2 gap-6 w-[80%] mx-auto mt-4">
      {parsedData.map((obj) =>
        obj?.fields?.filter(a=>a)?.map(({ label, value }) => (
          <div>
            <div className="text-sm font-semibold label-text">{label}</div>
            <div className="text-sm label-text">{value || "-"}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default Requirements;

