import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import moment from "moment";

import Input from "./../neomorphic/Input";
import {
  pickupDataFromResponse,
  populateRoleResponse,
} from "./../../../helpers/utils";

import { changeSociety, setActiveServices } from "./../../../slice/authSlice";
import { GET_SOCIETIES_BY_SOCIETY_IDS } from "./../../../graphql/queries/society";
import { GET_ACTIVE_SERVICE_SUBSCRIPTIONS_BY_SOCIETY } from "./../../../graphql/queries/getActiveServiceSubscriptionsBySociety";

import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import _ from "lodash";

const VenueSelect = ({ onSelectionDone }) => {
  const { activeSociety, activeAccountId, user, roles } = useSelector(
    (state) => state.authSlice
  );

  const [selectedLocation, setSelectedLocation] = useState(activeSociety);
  const [venueFilter, setVenueFilter] = useState("");
  const [locationList, setLocationList] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  const [getSocitiesIds] = useLazyQuery(GET_SOCIETIES_BY_SOCIETY_IDS);
  const [getActiveServiceSubs] = useLazyQuery(
    GET_ACTIVE_SERVICE_SUBSCRIPTIONS_BY_SOCIETY,
    {
      onCompleted: (data) => {
        const activeServices = pickupDataFromResponse({ data });
        console.log("active subs", activeServices);
        dispatch(setActiveServices({ activeServices }));
      },
      skip: !activeAccountId,
    }
  );

  const fetchSocities = async () => {
    if (!roles.length) {
      return;
    }
    const socitiesResponse = await getSocitiesIds({
      variables: {
        societyIds: [...roles?.filter(a=>a?.activeRole?.startsWith('SOCIETY'))?.map((role) => role.activeAccountId)],
      },
    });
    const socs = pickupDataFromResponse(socitiesResponse) || [];
    const allSocities = socs.map((soc) => soc);

    setLocationList(allSocities);
  };

  useEffect(() => {
    if (locationList.length) {
      if (selectedLocation && selectedLocation.objectId) {
        // handleSelectedSociety(sel)
      } else {
        handleSelectedSociety(locationList[0]);
      }
    }
  }, [locationList]);

  useEffect(() => {
    fetchSocities();
  }, [roles]);
  const getActiveSociety = (location) =>
    roles.find((r) => r.activeAccountId === location.objectId);

  useEffect(() => {
    console.log("activeAccountId", activeAccountId);
    getActiveServiceSubs({
      variables: {
        societyId: activeAccountId,
        today: moment().toDate(),
      },
    });
  }, [activeAccountId]);

  const handleSelectedSociety = (location) => {
    setIsOpen(false);

    setSelectedLocation(location);
    console.log("========= location =======", location);
    const activeSociety = getActiveSociety(location);
    dispatch(changeSociety({ activeSociety: location, ...activeSociety }));

    onSelectionDone();
  };

  const _handleFilterChange = ({ target: { value } }) => {
    if (!value.trim()) setFilteredVenues([]);
    setVenueFilter(value);
    setFilteredVenues(
      locationList.filter(
        ({ name }) => name.toLowerCase().indexOf(value.toLowerCase()) > -1
      )
    );
  };

  let venues = venueFilter ? filteredVenues : locationList;
  console.log("venues", venues);
  return (
    <div>
      <Input
        prefixIcon={<MagnifyingGlassIcon className="w-4 h-4 text-accent" />}
        className={"input-sm"}
        placeholder="Search Client"
        onChange={_handleFilterChange}
        value={venueFilter}
      />

      <ul
        className={`max-h-[50vh] overflow-x-hidden overflow-y-scroll   p-2 bg-base-100   gap-1`}
      >
        {_.sortBy(venues, ["name"]).map((location, index) => (
          <li
            onClick={() => {
              handleSelectedSociety(location);
              setVenueFilter("");
            }}
            className={`text-accent p-2 mb-1 hover:bg-base-200 rounded-md cursor-pointer ${
              location.objectId === selectedLocation.objectId
                ? "bg-base-300 transition-all rounded-md"
                : ""
            }`}
            key={index}
          >
            <a>{location.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VenueSelect;
