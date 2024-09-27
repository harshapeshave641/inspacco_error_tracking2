import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import TableCellsIcon from "@heroicons/react/24/outline/TableCellsIcon";
import ListBulletIcon from "@heroicons/react/24/outline/ListBulletIcon";
import Drilldown from "../../../components/Admin/Drilldown";
import FiltersBar from "../../../components/common/FilterBar";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  GET_PARTNERS,
  GET_PARTNER_BY_ID_QUERY,
  GET_TOTAL_PARTNER_COUNT,
} from "../../../graphql/queries/partners";
import { useEffect, useState } from "react";
import {
  LANGAGUE_OPTIONS,
  PAGE_LIMIT,
  PARTNER_STATUS_OPTIONS,
  getValueFromSelectValue,
} from "../../../constants";
import IconToggle from "../../../components/common/Toggle/IconToggle";
import DataGrid from "../../../components/common/DataTable/DataGrid";
import { getPincodeInfo, pickupDataFromResponse } from "../../../helpers/utils";
import Pagination from "../../../components/common/Pagination";
import { GET_SERVICES } from "../../../graphql/queries/getPopularServices";
import VendorDetails from "../../../components/Details/VendorDetails";
import Button from "../../../components/common/neomorphic/Button";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import { useTranslation } from "react-i18next";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import Modal from "../../../components/common/Modal";
import CommonForm from "../../../components/common/CommonForm";
import {
  CREATE_PARTNER,
  UPDATE_PARTNER,
} from "../../../graphql/mutations/partner";
import { toast } from "react-toastify";
import { GET_SOCIETIES } from "../../../graphql/queries/society";
import { GET_ALL_SERVICE_SUBSCRIPTIONS_BY_QUERY } from "../../../graphql/queries/getActiveServiceSubscriptionsBySociety";
import FileUpload from "../../../components/common/FileUpload";
import { useSelector } from "react-redux";

const filters = [
  {
    name: "name",
    label: "Name",
    value: "",
  },
  {
    name: "city",
    label: "City",
    value: "",
  },
  {
    name: "pincode",
    label: "Pincode",
    value: "",
  },
  {
    name: "serviceNames",
    label: "Service",
    value: "",
    menuPortalTarget: ".w-screen",
    native: false,
    type: "SELECT",
    options: [],
  },
  {
    name: "status",
    label: "Status",
    value: "",
    type: "SELECT",
    options: PARTNER_STATUS_OPTIONS,
  },
  {
    label: "Client",
    name: "client",
    type: "SELECT",
    menuPortalTarget: ".w-screen",
    native: false,
    value: "",
  },
  // {
  //   name: "preferedLanguage",
  //   label: "Language",
  //   value: "",
  //   type: "SELECT",
  //   options: LANGAGUE_OPTIONS,
  // },
  {
    name: "rating",
    label: "Rating",
    value: "",
    type: "SELECT",
    options: Array.from({ length: 5 }, (_, index) => {
      return {
        label: index + " & up",
        value: index,
      };
    }),
  },
];
const partnerColumnDefs = [
  {
    headerName: "Name",
    pinned: "left",
    field: "name",
    cellRenderer: "hyperlinkCellRenderer",
  },
  { headerName: "Services", field: "serviceNames" },
  { headerName: "Address", field: "fullAddress" },
  { headerName: "STATUS", field: "status" },
  { headerName: "Language", field: "preferedLanguage" },
  {
    headerName: "Website",
    field: "website",
    cellRenderer: "hyperlinkCellRenderer",
  },
  {
    headerName: "Experience  (Years)",
    field: "experience",
    type: "number",
  },
  {
    headerName: "Rating",
    field: "rating",
    type: "number",
  },
];
export default function AdminPartners() {
  const [layoutMode, setLayoutMode] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [filterObj, setFilterObj] = useState({});
  const [isVendorDetailsModalOpen, setVendorDetailModalOPen] = useState(false);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [partnerFormData, setPartnerFormData] = useState({});
  const { allClients = [] } = useSelector((state) => state.authSlice);
  const [getPartner, { data: partnerRes, loading: partnerLoading }] =
    useLazyQuery(GET_PARTNER_BY_ID_QUERY, {
      fetchPolicy: "network-only",
      variables: {
        id: selectedPartner?.objectId,
      },
      skip: selectedPartner === null,
    });
  const [t] = useTranslation();
  const [getPartners, { data: partnersData, loading = partnerLoading }] =
    useLazyQuery(GET_PARTNERS);
  const [getPartnersCount, { data: partnersCountData }] = useLazyQuery(
    GET_TOTAL_PARTNER_COUNT
  );
  // const [getActiveServiceSubs, { data: subscripitonsData }] = useLazyQuery(
  //   GET_ALL_SERVICE_SUBSCRIPTIONS_BY_QUERY
  // );
  const { data: servicesRes } = useQuery(GET_SERVICES, {
    variables: {
      first: 999,
    },
  });
  // const { data: clientsRes } = useQuery(GET_SOCIETIES);
  useEffect(() => {
    getPartners({
      variables: {
        subQuery: {
          fullAddress: { exists: true },
        },
        limit: 10,
        skip: 0,
      },
    });
  }, []);
  const [createPartner] = useMutation(CREATE_PARTNER);
  const [updatePartner] = useMutation(UPDATE_PARTNER);
  function handleUpdateAttachment() {}

  // console.log("FilterObj", filterObj);
  function handleSearch(pageNo) {
    console.log("HandleSearch", filterObj);
    const subQuery = {};
    //  console.log('subscripitonsData',subscripitonsData)
    let skip = (pageNo - 1) * PAGE_LIMIT;
    Object.keys(filterObj)
      .filter((key) => filterObj[key])
      .forEach((key) => {
        let value = getValueFromSelectValue(filterObj[key]);
        // console.log("value==", value);
        if (key == "name" || key == "status" || key == "serviceNames") {
          subQuery[key] = { matchesRegex: value, options: "i" };
        } else if (
          key == "verified" ||
          key == "preferedLanguage" ||
          key == "rating"
        ) {
          if (key == "rating") {
            if (value != "0") {
              subQuery[key] = { greaterThanOrEqualTo: parseInt(value) };
            }
          } else {
            subQuery[key] = { equalTo: value };
          }
        } else if (key == "client" && value) {
          subQuery["clients"] = { have: { objectId: { equalTo: value } } };
        } else {
          subQuery["OR"] = subQuery["OR"] || [];
          subQuery["OR"].push({
            fullAddress: { matchesRegex: value, options: "i" },
          });
        }
      });
    console.log("SubQuery", subQuery);
    getPartnersCount({
      variables: { subQuery },
    });
    getPartners({
      variables: {
        subQuery,
        limit: PAGE_LIMIT,
        skip,
      },
    });
  }
  function handleClear() {
    setFilterObj({});
    getPartners({
      subQuery: {},
    });
    setCurrentPage(1);
  }
  useEffect(() => {
    handleSearch(currentPage);
  }, [currentPage]);
  useEffect(() => {
    if (partnerRes) {
      setSelectedPartner(pickupDataFromResponse({ data: partnerRes }));
    }
  }, [partnerRes]);
  async function handleSubmit() {
    console.log("partnerformdata", partnerFormData);
    // return;
    const fields = {
      status: partnerFormData?.status || "Active",
      verified: true,
      preferedLanguage: partnerFormData?.preferedLanguage || "en",
      name: partnerFormData.name,
      mobileNumber: partnerFormData.mobileNumber,
      email: partnerFormData.email,
      ratingParameters: partnerFormData.ratingParameters,
      address: {
        city: partnerFormData.city,
        pincode: partnerFormData.pincode,
        addressLine1: partnerFormData?.addressLine1,
        addressLine2: partnerFormData?.addressLine2,
        area: partnerFormData?.area,
        city: partnerFormData?.city,
        state: partnerFormData?.state,
      },
      website: partnerFormData.website,
      experience: partnerFormData.experience,
      services: partnerFormData.myservices?.map((a) => {
        return {
          __type: "Pointer",
          className: "Service",
          objectId: typeof a === "object" ? a.value : a,
        };
      }),
    };
    if (partnerFormData?.objectId) {
      await updatePartner({
        variables: {
          id: partnerFormData?.objectId,
          fields,
        },
      });
      toast.success("Partner updated successfully");
      getPartner({
        variables: {
          id: partnerFormData?.objectId,
        },
      });
    } else {
      try {
        await createPartner({
          variables: {
            fields,
          },
        });
        toast.success("Partner Created successfully");
        setFormModalOpen(false);
      } catch (e) {
        toast.error(e.message);
      }
    }
  }
  function TestError1() {
    const a=2;
    a.nono();
  }
  console.log("ParrnterFormData", partnerFormData);
  // function getServiceSubscriptionBySociety(value) {
  //   getActiveServiceSubs({
  //     variables: {
  //       subQuery: {
  //         society: {
  //           have: {
  //             objectId: {
  //               equalTo: getValueFromSelectValue(value),
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  // }
  // useEffect(() => {
  //   getServiceSubscriptionBySociety(filterObj?.client);
  // }, [filterObj?.client]);
  useEffect(() => {
    // console.log('pincode',partnerFormData?)
    if (partnerFormData?.pincode?.trim()?.length == 6) {
      getPincodeInfo(partnerFormData?.pincode).then((pincodeRes) => {
        // pincodeInfo = { city: pincodeRes?.['Region'], state: pincodeRes?.['State'], area: pincodeRes?.['Name'] };
        setPartnerFormData({
          ...partnerFormData,
          city: pincodeRes?.["Region"],
          state: pincodeRes?.["State"],
          area: pincodeRes?.["Name"],
        });
      });
    }
  }, [partnerFormData?.pincode]);
  // console.log('partnerFormData',partnerFormData)

  return (
    <div>
      {/* <div>
        <Breadcrumb path={[{ route: "/", name: "Home" }]} />
      </div> */}
      <TestError1/>
      <div className="px-4 py-2 mb-1 rounded-lg">
        <div className="pb-2 pl-3 bg-base-100">
          <FiltersBar
            loading={partnerLoading}
            filters={filters.map((filter) => {
              if (filter.name === "serviceNames") {
                let options =
                  pickupDataFromResponse({
                    data: servicesRes,
                  })?.map((a) => {
                    return {
                      label: a.name,
                      value: a.name,
                    };
                  }) || [];
                filter.options = [
                  { label: "--  Select  -- ", value: "" },
                  ...options,
                ];
              }
              if (filter.name == "client") {
                let options = allClients?.map((client) => {
                  return {
                    label: client.name,
                    value: client.objectId,
                  };
                });
                filter.options = [
                  { label: "--  Select  -- ", value: "" },
                  ...options,
                ];
              }
              return {
                ...filter,
                value: filterObj[filter.name] || "",
                setData: (obj) => {
                  console.log("obj", obj);
                  setFilterObj({
                    ...filterObj,
                    ...obj,
                  });
                },
              };
            })}
            onSubmit={() => handleSearch(1)}
            onClear={handleClear}
          />
        </div>
        <div className="flex justify-between pt-2">
          <div className="pl-3">
            <IconToggle
              toggleIcon1={<TableCellsIcon className="w-4 h-4" />}
              toggleIcon2={<ListBulletIcon className="w-4 h-4" />}
              {...{
                value: layoutMode,
                onChange: (mode) => setLayoutMode(mode),
                //   Icon: <View className="w-4 h-4" />,
              }}
            />
          </div>
          <Pagination
            compact
            gotoPage={setCurrentPage}
            className="float-right shadow-lg"
            config={{
              current_page: currentPage,
              total_pages: Math.ceil(
                (partnersCountData?.totalPartners?.count || PAGE_LIMIT) /
                  PAGE_LIMIT
              ),
            }}
          />
          <div className="pt-2 text-secondary">
            <span>
              Found {partnersCountData?.totalPartners?.count || 0} Vendors
            </span>
          </div>
          <div>
            <>
              <Button
                disabled={!selectedPartner?.id}
                className="btn-warning btn-sm"
                onClick={() => {
                  // console.log('selected partner',selectedPartner)
                  setPartnerFormData({
                    ...selectedPartner,
                    addressLine1: selectedPartner?.address?.addressLine1,
                    addressLine2: selectedPartner?.address?.addressLine2,
                    city: selectedPartner?.address?.city,
                    area: selectedPartner?.address?.area,
                    state: selectedPartner?.address?.state,
                  });
                  setFormModalOpen(true);
                  console.log("selectedPartner", selectedPartner);
                  // populateFormDataForEdit();
                  // setShowCreateForm(true);
                }}
              >
                <PencilIcon className="w-3 h-3" /> &nbsp;
                {t("general.edit")}{" "}
              </Button>
              <Button
                paddingClass="ml-2"
                onClick={(e) => {
                  setPartnerFormData({});
                  setFormModalOpen(true);
                }}
                className="gap-2 capitalize tracking-[0.30px] font-medium btn-sm text-sm"
              >
                <PlusCircleIcon className="w-4 h-4" />
                Create Partner
              </Button>
              <FileUpload />
            </>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4">
          {layoutMode ? (
            <Drilldown
              {...{
                source: "partners",
                itemIcon: <EyeIcon />,
                leftSideLoading: loading,
                rightSideLoading: false,
                listData: partnersData?.partners?.edges,
                details_content: (
                  <VendorDetails
                    partner={selectedPartner}
                    loading={partnerLoading}
                    onChangeData={async (data) => {
                      setPartnerFormData({ ...selectedPartner, ...data });
                      await updatePartner({
                        variables: {
                          id: selectedPartner?.objectId,
                          fields: {
                            ratingParameters: data?.ratingParameters,
                          },
                        },
                      });
                      setSelectedPartner({
                        ...selectedPartner,
                        ratingParameters: data?.ratingParameters,
                      });
                      toast.success("Partner Rating Updated");
                    }}
                  />
                ),
                onItemSelect: async (data) => {
                  getPartner({
                    variables: {
                      id: data?.objectId,
                    },
                  });
                },
                pagination: true,
                paginationConfig: {
                  current_page: currentPage,
                  total_pages: Math.ceil(
                    (partnersCountData?.totalPartners?.count || PAGE_LIMIT) /
                      PAGE_LIMIT
                  ),
                },
                onPageChange: setCurrentPage,
              }}
            />
          ) : (
            <>
              <DataGrid
                download={false}
                downloadFileName={`Partners`}
                name={"Partners"}
                data={pickupDataFromResponse({ data: partnersData })}
                loading={loading}
                columnDefs={partnerColumnDefs?.map((colDef) => {
                  if (colDef.field === "name") {
                    return {
                      ...colDef,
                      cellRendererParams: {
                        onClick: (props) => {
                          setSelectedPartner(props.data);
                          setVendorDetailModalOPen(true);
                        },
                      },
                    };
                  }
                  return colDef;
                })}
                style={{ height: `${window.innerHeight - 260}px` }}
              />
              <Pagination
                compact
                gotoPage={setCurrentPage}
                className="float-right shadow-lg"
                config={{
                  current_page: currentPage,
                  total_pages: Math.ceil(
                    (partnersCountData?.totalPartners?.count || PAGE_LIMIT) /
                      PAGE_LIMIT
                  ),
                }}
              />
            </>
          )}
        </div>
      </div>
      <Modal
        fullscreen={true}
        showBtns={false}
        title="Vendor Details"
        closeModal={() => setVendorDetailModalOPen(false)}
        showModal={isVendorDetailsModalOpen}
      >
        {selectedPartner?.objectId ? (
          <VendorDetails partner={selectedPartner} loading={partnerLoading} />
        ) : null}
      </Modal>
      {isFormModalOpen ? (
        <Modal
          fullscreen={true}
          title={
            partnerFormData?.objectId
              ? `Edit ${partnerFormData.name}`
              : "Add Partner"
          }
          showBtns={false}
          closeModal={() => setFormModalOpen(false)}
          showModal={isFormModalOpen}
        >
          <div className="flex justify-center">
            <CommonForm
              editMode={true}
              //  className={'w-full'}
              cols={2}
              onSubmit={handleSubmit}
              formData={[
                {
                  label: "Name",
                  name: "name",
                  type: "text",
                  value: partnerFormData?.name || "",
                  required: true,
                },
                {
                  label: "Whatsapp Number",
                  name: "mobileNumber",
                  type: "NUMBER",
                  required: true,
                  value: partnerFormData?.mobileNumber || "",
                },
                {
                  label: "Website",
                  name: "website",
                  // type: "number",
                  value: partnerFormData?.website || "",
                },
                {
                  label: "GST Number",
                  name: "gstNumber",
                  type: "text",
                  value: partnerFormData?.gstNumber || "",
                },
                {
                  label: "PAN Number",
                  name: "pan",
                  type: "text",
                  value: partnerFormData?.pan || "",
                },
                {
                  label: "Estd Year",
                  name: "estd",
                  type: "number",
                  value: partnerFormData?.estd || "",
                },
                {
                  label: "Email",
                  name: "email",
                  value: partnerFormData?.email || "",
                },
                {
                  label: "Address Line 1",
                  name: "addressLine1",
                  value: partnerFormData?.address?.addressLine1 || "",
                },
                {
                  label: "Address Line 2",
                  name: "addressLine2",
                  value: partnerFormData?.address?.addressLine2 || "",
                },
                {
                  label: "Pincode",
                  name: "pincode",
                  required: true,
                  type: "NUMBER",
                  value: partnerFormData?.address?.pincode || "",
                },
                {
                  label: "City",
                  name: "city",
                  value: partnerFormData?.address?.city || "",
                },
                {
                  label: "State",
                  name: "state",
                  value: partnerFormData?.address?.state || "",
                },

                {
                  label: "Description",
                  name: "description",
                  type: "TEXTAREA",
                  value: partnerFormData?.description || "",
                },
                {
                  name: "status",
                  label: "Status",
                  value: partnerFormData?.status || "",
                  type: "SELECT",
                  options: PARTNER_STATUS_OPTIONS,
                },
                {
                  name: "preferedLanguage",
                  label: "Language",
                  value: partnerFormData?.preferedLanguage || "",
                  type: "SELECT",
                  options: LANGAGUE_OPTIONS,
                },

                {
                  label: "Service",
                  name: "myservices",
                  type: "SELECT",
                  multiple: true,
                  native: false,
                  required: true,
                  value:
                    partnerFormData?.services?.map((a) => {
                      return {
                        label: a?.name,
                        value: a?.objectId,
                      };
                    }) || "",
                  options: [],
                },
              ].map((field) => {
                if (field.name === "myservices") {
                  const serviceOptions =
                    pickupDataFromResponse({
                      data: servicesRes,
                    })?.map((a) => {
                      return {
                        label: a.name,
                        value: a.objectId,
                      };
                    }) || [];
                  field["options"] = serviceOptions;
                }
                return {
                  ...field,
                  value: partnerFormData[field.name] || field?.value,
                  setData: (obj) => {
                    // console.log("obj", obj);
                    setPartnerFormData({ ...partnerFormData, ...obj });
                  },
                };
              })}
            />
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
