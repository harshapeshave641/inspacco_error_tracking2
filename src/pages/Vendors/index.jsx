import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { useLazyQuery } from "@apollo/client";

import BlocksGrid from "../../components/common/BlocksGrid";
import { GET_SOCIETY_SERVICES } from "../../graphql/queries/getSocietyServices";
import VendorDetails from "../../components/Details/VendorDetails";

const Vendors = () => {
  const [selectedVendor, setSelectedVendor] = useState({});
  const [vendors, setVendors] = useState([]);
  const today = new Date().toISOString();

  let { activeAccountId } = useSelector((state) => state.authSlice);

  const [getActiveServiceServices, { loading: subServiceLoading }] =
    useLazyQuery(GET_SOCIETY_SERVICES, {
      onCompleted: (data) => setVendors(_getUniqVendors(data)),
      skip: !activeAccountId,
    });

  const _getUniqVendors = (data) => {
    const hashMap = [];
    return data.serviceSubscriptions.edges?.reduce((accumulator, { node }) => {
      if (!hashMap.includes(node?.partner?.objectId)) {
        accumulator.push(node);
        hashMap.push(node?.partner?.objectId);
      }
      return accumulator;
    }, []);
  };

  useEffect(() => {
    getActiveServiceServices({
      variables: {
        societyId: activeAccountId,
        endDate: today,
      },
    });
  }, [activeAccountId]);

  const handleVendorSelection = (node) => setSelectedVendor(node);

  return (
    <>
      <div className="container">
        <div className="flex lg:flex-row md:flex-row sm:flex-col">
          <div className="sm:w-full md:w-2/4 lg:w-6/12 bg-base-200 px-4 pt-4">
            <div className="rounded-xl-tl rounded-xl-bl">
              <BlocksGrid
                setSelectedBlock={(node) => handleVendorSelection(node)}
                header="Vendors"
                accessor={"partner"}
                selectedBlock={selectedVendor}
                data={vendors}
                loading={subServiceLoading}
              />
            </div>
          </div>
          <div className="sm:w-full md:w-2/4 lg:w-6/12">
            <div className="rounded-xl min-h-[84vh] overflow-hidden shadow-md ml-0 m-3 bg-base-100">
              {!isEmpty(selectedVendor) && (
                <VendorDetails
                  {...{
                    header: "Vendors",
                    partner: selectedVendor?.partner,
                    source: "vendors",
                    loading: false,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Vendors;
