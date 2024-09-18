import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLazyQuery, useQuery } from "@apollo/client";
import ServicesGrid from "../../components/common/ServicesGrid";
// import MoreServices from "../../components/common/MoreServices/MoreServices";

import ServiceDetails from "../../components/Details/ServiceDetails";
import { GET_SOCIETY_SERVICES } from "../../graphql/queries/getSocietyServices";
import { GET_POPULAR_SERVICES } from "../../graphql/queries/getPopularServices";
import PopularServiceDetail from "../../components/Services/PopularServiceDetails";
import { isEmpty } from "lodash";

const Services = () => {
  const [selectedService, setSelectedService] = useState({});
  const [selectedPopularService, setSelectedPopularService] = useState({});
  const [subscribedServices, setSubscribedServices] = useState([]);
  const today = new Date().toISOString();

  let { activeAccountId } = useSelector((state) => state.authSlice);

  const [getActiveServiceServices, { loading: subServiceLoading }] =
    useLazyQuery(GET_SOCIETY_SERVICES, {
      onCompleted: (data) =>
        setSubscribedServices(data.serviceSubscriptions.edges),
      skip: !activeAccountId,
    });

  const { data: moreServices, loading: moreServicesLoading } = useQuery(
    GET_POPULAR_SERVICES,
    {
      variables: {
        first: 999,
      },
    }
  );

  useEffect(() => {
    getActiveServiceServices({
      variables: {
        societyId: activeAccountId,
        endDate: today,
      },
    });
  }, [activeAccountId]);

  const handleServiceSelection = (node, source) => {
    console.log("node", node);
    if (source === "activeservices") {
      setSelectedService(node);
      setSelectedPopularService({});
    } else {
      setSelectedService({});
      setSelectedPopularService(node);
    }
  };

  return (
    <>
      <div className="container">
        <div className="flex lg:flex-row md:flex-row sm:flex-col">
          <div className="sm:w-full md:w-2/4 lg:w-6/12 bg-base-200 px-4 pt-4">
            <div className="rounded-xl-tl rounded-xl-bl">
              <ServicesGrid
                setSelectedService={(node) =>
                  handleServiceSelection(node, "activeservices")
                }
                selectedService={selectedService}
                data={subscribedServices}
                loading={subServiceLoading}
              />
              {/* <ServicesGrid
                header={"More Services"}
                selectedService={selectedPopularService}
                setSelectedService={handleServiceSelection}
                data={moreServices?.services?.edges}
                loading={moreServicesLoading}
              /> */}
            </div>
          </div>
          <div className="sm:w-full md:w-2/4 lg:w-6/12">
            <div className="rounded-xl min-h-[84vh] overflow-hidden shadow-md ml-0 m-3 bg-base-100">
              {!isEmpty(selectedService) && (
                <ServiceDetails
                  {...{
                    header: "Services Availed",
                    selectedRecord: selectedService,
                    source: "services",
                    loading: false,
                  }}
                />
              )}
              {!isEmpty(selectedPopularService) && (
                <PopularServiceDetail {...{ ...selectedPopularService }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
