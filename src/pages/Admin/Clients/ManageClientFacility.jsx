import React from "react";
import { Tabs } from "react-daisyui";
import BulkClientFacility from "./BulkUploadClientFacilty";
import DataGrid from "../../../components/common/DataTable/DataGrid";
import moment from "moment";
import { useQuery } from "@apollo/client";
import { GET_ALL_CLIENT_FACILITIES } from "../../../graphql/queries/clientfacility";
import { pickupDataFromResponse } from "../../../helpers/utils";
import { ClientFacilityFieldMapping } from "../../../constants";
const fieldMappingColDefs = Object.entries(ClientFacilityFieldMapping).map(
  ([key, value]) => {
    return {
      field: value,
      headerName: key,
      width: 150,
      pinned: value == "uniqueCode" ? "left" : "",
    };
  }
);
function ViewClientFacilities({
  activeSociety,
  clientFacilities = [],
  loading = false,
}) {
  //  useQuery(GET_ALL_CLIENT_FACILITIES)

  return (
    <div className="mt-5">
      <DataGrid
        downloadFileName={`Clinet_Facilities__${
          activeSociety?.name
        }_${moment().format("YYYY-MM-DD")}`}
        name={"Client Facilities"}
        data={clientFacilities}
        loading={loading}
        columnDefs={fieldMappingColDefs}
      />
    </div>
  );
}
export default function ManageClientFacility({ activeSociety = {} }) {
  const [selectedTab, setSelectedTab] = React.useState("view");
  const { loading, error, data, refetch } = useQuery(
    GET_ALL_CLIENT_FACILITIES,
    {
      variables: { clientId: activeSociety.objectId },
    }
  );
  console.log("data==", data);
  const clientFacilities = pickupDataFromResponse({ data }) || [];
  function handleTabChange(v) {
    setSelectedTab(v);
    console.log(v); // log tab clicked
  }
  return (
    <div>
      <Tabs variant="boxed">
        <Tabs.Tab
          onClick={() => handleTabChange("view")}
          active={selectedTab == "view"}
        >
          View Client Facilities
        </Tabs.Tab>
        <Tabs.Tab
          onClick={() => handleTabChange("bulkupload")}
          active={selectedTab == "bulkupload"}
        >
          Bulk Client Facility
        </Tabs.Tab>
      </Tabs>
      {selectedTab === "bulkupload" && (
        <BulkClientFacility
          activeSociety={activeSociety}
          clientFacilities={clientFacilities}
          onDone={refetch}
        />
      )}
      {selectedTab === "view" && (
        <ViewClientFacilities
          activeSociety={activeSociety}
          clientFacilities={clientFacilities}
          loading={loading}
        />
      )}
    </div>
  );
}
