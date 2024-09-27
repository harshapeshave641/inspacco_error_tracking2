import React, { useEffect, useRef, useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import _ from "lodash";
import ServicesIcon from "@heroicons/react/24/solid/WrenchScrewdriverIcon";

import Accordion from "../common/Accordion";
import EmptyData from "../common/EmptyData";
import FlatList from "../common/FlatList";

import {
  _getStatusType,
  fn,
  getFileUrl,
  isDateExpired,
  pickupDataFromResponse,
} from "../../helpers/utils";
import PaperClipIcon from "@heroicons/react/24/outline/PaperClipIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import DocumentManager from "../common/DocumentManager";
import HomeModernIcon from "@heroicons/react/24/solid/HomeModernIcon";
import Badge from "../common/Badge";
import PhotoIcon from "@heroicons/react/24/solid/PhotoIcon";
import { useSelector } from "react-redux";
import ListItem from "../common/ListItem";
import { GET_SERVICE_SUBSCRIPTIONS_BY_PARTNER } from "../../graphql/queries/getServiceSubscriptions";
import moment from "moment";
import ManagePartnerStaff from "../Partner/ManagePartnerStaff";
import ManageMember from "../Partner/ManageMember";
import { useTranslation } from "react-i18next";
import env from "../../env";
import RatingComp from "../common/Rating";
import LabelValue from "../common/LabelValue";
import { PARTNER_RATING_PARAMS } from "../../constants";
function TestError1() {
  const a=2;
  a.nono();
}
const Skeleton = () => {
  return (
    
    <div role="status" class="animate-pulse">
      {/* <TestError1/> */}
      <div class="h-4 bg-base-300 rounded-full mb-4"></div>
      <div className="animate-pulse">
        <div>
          <div class="h-2 bg-base-300 rounded-full mb-2.5"></div>
          <div class="h-2 bg-base-300 rounded-full mb-2.5"></div>
          <div class="h-2 bg-base-300 rounded-full mb-2.5"></div>
        </div>
        <div>
          <div class="h-52 mt-8 bg-base-300 rounded mb-2.5"></div>
        </div>
      </div>
    </div>
  );
};

export default function VendorDetails({ partner, loading, onChangeData = fn }) {
  console.log("partner", partner);
  const { activeRole } = useSelector((state) => state.authSlice);
  const [attachmentCount, setAttachmentCount] = useState(0);
  const [photoGallaryCount, setPhotoGallaryCount] = useState(0);
  const [companyLogoCount, setCompanyLogoCount] = useState(0);
  const [partnerMemberCount, setPartnerMemberCount] = useState(0);
  const [partnerStaffCount, setPartnerStaffCount] = useState(0);
  const [vendorLogo, setVendorLogo] = useState(null);
  const [t] = useTranslation();

  // const partnerClientSubscriptionsData = pickupDataFromResponse({
  //   data: partnerClientsdata,
  // });
  // const subscriptionDatagroupBySociety = _.groupBy(
  //   partnerClientSubscriptionsData,
  //   "society.objectId"
  // );
  // const partnerClients = Object.values(subscriptionDatagroupBySociety)?.map(
  //   (subscriptions = []) => {
  //     return {
  //       ...subscriptions[0],
  //       services: subscriptions?.map((a) => a?.service?.name),
  //     };
  //   }
  // );
  // console.l
  const partnerClients = partner?.clients?.edges?.map(({node})=>node)
  const partnerRating = PARTNER_RATING_PARAMS.map((ratingParams) => {
    return {
      parameterName: ratingParams,
      rating: partner?.ratingParameters?.[ratingParams] || 0,
    };
  });
  if (loading) {
    return <Skeleton />;
  }
  return (
    <div className="">
      <div className="">
        {/* <ServiceHeroImage serviceName={partner.service.name} /> */}
        {!partner ? (
          <EmptyData />
        ) : (
          <div className="w-[98%] p-4 pt-2 mx-auto">
            <div>
              {loading ? (
                <Skeleton />
              ) : (
                <div>
                  <div className="">
                    <div className="flex items-center justify-between mt-2">
                      <div className="">
                        <div className="text-xl font-large text-accent">
                          {partner?.name}
                        </div>
                      </div>
                      <div className="">
                        {vendorLogo ? (
                          <img
                            width={100}
                            src={`${env.serverURL}/files/${env.appId}/${vendorLogo}`}
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-5 w-[70%]">
                      <div className="">
                        <label className="">
                          <span className="label-text">PAN</span>
                        </label>
                        <div className="text-sm font-medium">
                          {partner?.pan || "N/A"}
                        </div>
                      </div>
                      <div className="">
                        <label className="">
                          <span className="label-text">Address</span>
                        </label>
                        <div className="text-sm font-medium">
                          {partner?.fullAddress || "N/A"}
                        </div>
                      </div>
                      <div className="">
                        <label className="">
                          <span className="label-text">Estd Year</span>
                        </label>
                        <div className="text-sm font-medium">
                          {partner?.estd || "N/A"}
                        </div>
                      </div>
                      <div className="">
                        <label className="">
                          <span className="label-text">Contact</span>
                        </label>
                        <div className="text-sm font-medium">
                          {partner?.mobileNumber || "N/A"}
                        </div>
                      </div>
                      {partner?.website ? (
                        <div className="">
                          <label className="">
                            <span className="label-text">Website</span>
                          </label>
                          <div className="text-sm font-medium">
                            <span style={{ color: "blue" }}>
                              <a
                                href={
                                  partner?.website?.startsWith("http")
                                    ? partner?.website
                                    : "https://" + partner?.website
                                }
                                target="_blank"
                              >
                                {partner?.website}
                              </a>
                            </span>
                          </div>
                        </div>
                      ) : null}
                      {activeRole === "INSPACCO_ADMIN" &&
                        partnerRating.map((param) => {
                          return (
                            <div key={param?.parameterName}>
                              <label>{param?.parameterName}</label>
                              <div>
                                <RatingComp
                                  value={param?.rating}
                                  onChange={(v) => {
                                    onChangeData({
                                      ratingParameters: {
                                        ...partner?.ratingParameters,
                                        [param?.parameterName]: v,
                                      },
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <div className="pt-6 rounded">
                    <Accordion
                      data={[
                        activeRole === "INSPACCO_ADMIN"
                          ? {
                              icon: <ServicesIcon className="w-4 h-4" />,
                              title: ` ${t("general.service")}s (${
                                partner?.serviceNames?.split(",")?.length || 0
                              })`,
                              content: (
                                <div>
                                  {partner?.serviceNames
                                    ?.split(",")
                                    ?.map((s) => (
                                      <Badge text={s} className={"mr-1"} />
                                    ))}{" "}
                                </div>
                              ),
                            }
                          : null,

                        activeRole === "INSPACCO_ADMIN"
                          ? {
                              icon: <UserGroupIcon className="w-4 h-4" />,
                              title: `Partner Members (${partnerMemberCount})`,
                              content: (
                                <>
                                  <ManageMember
                                    parentId={partner?.objectId}
                                    source="partner"
                                    onDataReceived={(data = []) =>
                                      setPartnerMemberCount(data.length)
                                    }
                                  />
                                </>
                              ),
                            }
                          : null,

                        {
                          icon: <UserGroupIcon className="w-4 h-4" />,
                          title: `${t(
                            "general.staff"
                          )}s (${partnerStaffCount})`,
                          content: (
                            <>
                              <ManagePartnerStaff
                                partnerId={partner?.objectId}
                                onDataReceived={(data = []) =>
                                  setPartnerStaffCount(data.length)
                                }
                              />
                            </>
                          ),
                        },
                        {
                          icon: <PaperClipIcon className="w-4 h-4" />,
                          title: `${t(
                            "general.documents"
                          )} (${attachmentCount})`,
                          content: (
                            <>
                              <DocumentManager
                                {...{
                                  module: "Partner",
                                  permissionGroupId: `PARTNER_${partner.objectId}`,
                                  parentId: partner.objectId,
                                  getAttachments: (attachments) =>
                                    setAttachmentCount(attachments?.length),
                                }}
                              />
                            </>
                          ),
                        },

                        activeRole === "INSPACCO_ADMIN"
                          ? {
                              icon: <PhotoIcon className="w-4 h-4" />,
                              title: `Photo Gallary (${photoGallaryCount})`,
                              content: (
                                <>
                                  <DocumentManager
                                    {...{
                                      module: "Photo_Gallery",
                                      permissionGroupId: `PARTNER_${partner.objectId}`,
                                      parentId: partner.objectId,
                                      getAttachments: (attachments) =>
                                        setPhotoGallaryCount(
                                          attachments?.length
                                        ),
                                    }}
                                  />
                                </>
                              ),
                            }
                          : null,
                        activeRole === "INSPACCO_ADMIN"
                          ? {
                              icon: <HomeModernIcon className="w-4 h-4" />,
                              title: `Company Logo (${companyLogoCount})`,
                              content: (
                                <>
                                  <DocumentManager
                                    {...{
                                      module: "Vendor_Logo",
                                      permissionGroupId: `PARTNER_${partner.objectId}`,
                                      parentId: partner.objectId,
                                      getAttachments: (attachments) => {
                                        console.log("logo", attachments);
                                        setVendorLogo(
                                          attachments?.length
                                            ? attachments[0]?.node?.url
                                            : null
                                        );
                                        setCompanyLogoCount(
                                          attachments?.length
                                        );
                                      },
                                    }}
                                  />
                                </>
                              ),
                            }
                          : null,
                        activeRole === "INSPACCO_ADMIN"
                          ? {
                              icon: <HomeModernIcon className="w-4 h-4" />,
                              title: `Clients (${partnerClients?.length})`,
                              content: (
                                <>
                                  <FlatList
                                    data={partnerClients}
                                    renderItem={({ item }) => (
                                      <ListItem
                                        icon={ item?.logo?<img  className="h-10" src={getFileUrl(item?.logo)}/>:null}
                                        title={item?.name}
                                        description={`${item?.area}, ${item?.city} ${item?.state}`}
                                      />
                                    )}
                                  />
                                </>
                              ),
                            }
                          : null,
                      ]}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
}
