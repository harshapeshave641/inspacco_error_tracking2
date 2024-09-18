import React, { useEffect, useState } from "react";
import UserSearchBar from "../../../components/common/User/UserSearchBar";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  GET_ROLES_BY_REGEX,
  GET_USER_ROLES,
} from "../../../graphql/queries/getuserRoles";
import FlatList from "../../../components/common/FlatList";
import ListItem from "../../../components/common/ListItem";
import { fn, pickupDataFromResponse } from "../../../helpers/utils";
import {
  GET_SOCIETIES,
  GET_SOCIETIES_BY_SOCIETY_IDS,
} from "../../../graphql/queries/society";
import ChevronRightIcon from "@heroicons/react/24/outline/ChevronDoubleRightIcon";
import EmptyData from "../../../components/common/EmptyData";
import {
  GET_ALL_PARTNERS,
  GET_PARTNERS,
} from "../../../graphql/queries/partners";
import Modal from "../../../components/common/Modal";
import DynamicField from "../../../components/common/DynamicField";
import Select from "../../../components/common/neomorphic/Select";
import Button from "../../../components/common/neomorphic/Button";
import {
  ASSIGN_ROLE_TO_USER,
  REMOVE_ROLE_FROM_USER,
} from "../../../graphql/mutations/role";
import { toast } from "react-toastify";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import ConfirmationWrapper from "../../../components/common/Dialog/ConfirmationWrapper";

function AssignRoleForm({ className, onSubmit = fn }) {
  const [roleType, setRoleType] = useState("");
  const [role, setRole] = useState(null);
  const [selectedSociety, setSelectedSociety] = useState();
  const [selectedPartner, setSelectedPartner] = useState();

  const [getClients, { data: clientsData }] = useLazyQuery(GET_SOCIETIES, {
    fetchPolicy: "cache-first",
  });
  const [getRoles, { data: rolesRes }] = useLazyQuery(GET_ROLES_BY_REGEX);
  const [renderRoles, setRenderRoles] = useState([]);
  const [getVendors, { data: vendorsData }] = useLazyQuery(GET_ALL_PARTNERS, {
    fetchPolicy: "cache-first",
  });

  useEffect(() => {
    getClients();
    getVendors();
  }, []);
  const societies = pickupDataFromResponse({ data: clientsData });
  const vendors = pickupDataFromResponse({ data: vendorsData });
  console.log("societies", societies);
  console.log("vendors", vendors);

  useEffect(() => {
    const roles = pickupDataFromResponse({ data: rolesRes });
    const customRoles = roles?.map((role) => {
      const [roleName] = role?.name?.split("__");
      return {
        label: roleName?.split("_")?.join(" "),
        value: role.objectId,
      };
    });
    setRenderRoles(customRoles);
  }, [rolesRes]);

  return (
    <div className={`flex flex-between ${className} `}>
      <div className="form-control ">
        <Select
          native={true}
          className={"ml-4 mb-4 w-full"}
          onChange={(v) => {
            setRole({});
            setRenderRoles([]);
            if (v === "ADMIN") {
              getRoles({
                variables: {
                  term: `INSPACCO_ADMIN`,
                },
              });
            }

            setRoleType(v);
          }}
          options={["--Select---", "ADMIN", "PARTNER", "SOCIETY"]}
          value={roleType}
        />
        {roleType === "PARTNER" && (
          <>
            <Select
              menuPortalTarget=".w-screen"
              native={false}
              className={"ml-4 mb-4 w-full"}
              onChange={(obj) => {
                getRoles({
                  variables: {
                    term: `${obj.value}$`,
                  },
                });
                setSelectedPartner(obj);
              }}
              options={vendors?.map((obj) => {
                return {
                  label: obj?.name,
                  value: obj?.objectId,
                };
              })}
              value={selectedPartner}
            />
          </>
        )}
        {roleType === "SOCIETY" && (
          <>
            <Select
              menuPortalTarget=".modal-content"
              native={false}
              //   menuPlacement=""
              className={"ml-4 mb-4 w-full"}
              onChange={(obj) => {
                getRoles({
                  variables: {
                    term: `${obj.value}$`,
                  },
                });
                setSelectedSociety(obj);
              }}
              options={societies?.map((obj) => {
                return {
                  label: obj?.name,
                  value: obj?.objectId,
                };
              })}
              value={selectedSociety}
            />
          </>
        )}

        <Select
          native={false}
          className={"ml-4 mb-4 w-full"}
          onChange={setRole}
          options={renderRoles}
          value={role}
        />
        <div className="pl-8">
          <Button
            //   type="accent"
            type="primary"
            className="btn-sm"
            onClick={() => onSubmit(role?.value)}
            disabled={!role}
          >
            Assign
          </Button>
        </div>
      </div>
    </div>
  );
}
export default function AccessManagement() {
  const [selectedUser, setSelecteduser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [getRoles] = useLazyQuery(GET_USER_ROLES, {
    fetchPolicy: "network-only",
  });

  const [getSocieties, { data: societyData }] = useLazyQuery(
    GET_SOCIETIES_BY_SOCIETY_IDS
  );
  const [getPartners, { data: partnersData, loading }] =
    useLazyQuery(GET_PARTNERS);
  const [assignRole] = useMutation(ASSIGN_ROLE_TO_USER);
  const [removeRoleFromUser] = useMutation(REMOVE_ROLE_FROM_USER);
  console.log("User Roles:", userRoles);
  function fetchsocieitiesAndPartners(roles = []) {
    console.log("fetchsocieitiesAndPartners");
    if (roles.length) {
      const partnerIds = [];
      const societyIds = [];
      roles.forEach((role) => {
        const [roleName, objectId] = role?.name?.split("__");
        if (roleName?.startsWith("PARTNER")) {
          partnerIds.push(objectId);
        }
        if (roleName?.startsWith("SOCIETY")) {
          societyIds.push(objectId);
        }
      });
      if (partnerIds?.length) {
        getPartners({
          variables: {
            partnerIds,
          },
        });
      }
      if (societyIds?.length) {
        getSocieties({
          variables: {
            societyIds,
          },
        });
      }
    }
  }

  const roleSocieties = pickupDataFromResponse({ data: societyData });
  const rolePartners = pickupDataFromResponse({ data: partnersData });
  const renderRoles = userRoles.map((role) => {
    const [roleName, objectId] = role?.name?.split("__");
    let companyName;
    if (roleName?.startsWith("SOCIETY")) {
      const company = roleSocieties?.find(
        (society) => society?.objectId == objectId
      );
      console.log("company", company);
      companyName = company?.name;
    }
    if (roleName?.startsWith("PARTNER")) {
      const company = rolePartners?.find(
        (society) => society?.objectId == objectId
      );
      console.log("company", company);
      companyName = company?.name;
    }
    return {
      roleName: roleName?.split("_")?.join(" "),
      companyName,
      roleId: role?.objectId,
    };
  });
  async function handleManageRole(roleId, action = "add") {
    if (action == "add") {
      const roleExist = userRoles.find((a) => a?.objectId === roleId);
      if (roleExist) {
        toast.error("Role already assigned to this user");
        return;
      }
    }

    const mutationData = {
      roleId,
      users: [selectedUser?.objectId],
    };
    if (action === "add") {
      await assignRole({
        variables: mutationData,
      });
    } else {
      await removeRoleFromUser({
        variables: mutationData,
      });
    }
    toast.success(action === "add" ? "Role assigned" : "Role Removed");
    fetchRoles(selectedUser);
  }
  async function fetchRoles(u) {
    const roleRes = await getRoles({
      variables: {
        user: u?.objectId,
      },
    });
    console.log("roleRes", roleRes);
    const roleList = pickupDataFromResponse(roleRes);
    setUserRoles(roleList);
    fetchsocieitiesAndPartners(roleList);
  }
  function handleRemoveRole() {}
  return (
    <div className="flex justify-between container access-management">
      <div className="w-5/12">
        <h3>Selected User</h3>
        <UserSearchBar
          //   newUser={false}
          onSelect={async (u) => {
            console.log("user", u);
            setSelecteduser(u);
            fetchRoles(u);
          }}
        />
        {selectedUser ? (
          <div className="mt-4">
            <h3>Assign Role</h3>
            <AssignRoleForm className="mt-4" onSubmit={handleManageRole} />
          </div>
        ) : null}
      </div>
      <div className="w-2/12 mt-10">
        <ChevronRightIcon className="w-5 h-5" />
      </div>
      <div className="w-5/12 bg-inherit " style={{maxHeight:'90vh',overflowY:'scroll'}}>
        {/* <RightIco */}
        <h3>Assigned Roles {renderRoles?.length}</h3>
        {renderRoles?.length ? (
          <FlatList
          showSearchBar={true}
           
            data={renderRoles}
            renderItem={({ item }) => (
              <div className="flex">
                <ListItem
                  className="w-10/12 h-10"
                  title={item?.roleName}
                  description={item?.companyName}
                  //   description={`${item?.services}`}
                />
                <div className="text-danger w-2/12 pl-2 pt-4 cursor-pointer">
                  <ConfirmationWrapper
                    onConfirm={() => {
                      handleManageRole(item?.roleId, "remove");
                    }}
                    confirmationMessage={`Are you Sure you want remove role ${item?.roleName} (${item?.companyName})`}
                  >
                    <TrashIcon className="ml-1 w-5 h-5 text-error " />
                  </ConfirmationWrapper>
                </div>
              </div>
            )}
          />
        ) : (
          <EmptyData msg="No Roles" />
        )}
      </div>

      {/* <Modal
        title="Assign Roles"
        fullscreen={false}
        closeModal={() => setIsRoleAssignModalOpen(false)}
        showModal={isRoleAssignModalOpen}
        showBtns={false}
      >
        <AssignRoleForm />
      </Modal> */}
    </div>
  );
}
