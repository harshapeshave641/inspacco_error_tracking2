import React, { useCallback, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
// Import your GraphQL query
import _debounce from "lodash/debounce";
import { fn, pickupDataFromResponse } from "../../../helpers/utils";
import { SEARCH_USER_BY_MOBILENO_OR_NAME } from "../../../graphql/queries/user";
import Input from "../neomorphic/Input";
import FlatList from "../FlatList";
import ListItem from "../ListItem";
import Modal from "../Modal";
import Text from "../Typography/Text";
import Button from "../neomorphic/Button";
import UserForm from "./NewUserForm";
import { toast } from "react-toastify";

const UserSearchBar = ({ onSelect = fn, term = "", newUser = true }) => {
  const [isUserSearchModalOpen, setIsSearchIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(term);
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null);
  const [isUserFormOpen, setUserFormOpen] = useState(false);
  let onChangeDebounce = useCallback(
    _debounce((value) => {
      getSearchResults({ variables: { term: value } });
    }, 400),
    []
  );
  const [getSearchResults, { loading }] = useLazyQuery(
    SEARCH_USER_BY_MOBILENO_OR_NAME,
    {
      onCompleted: (data) => {
        const userdata = pickupDataFromResponse({ data });
        console.log(userdata);
        setSearchResults(userdata);
        //   setSearchResults(data.searchResults);
      },
    }
  );

  useEffect(() => {
    if (searchTerm) {
      onChangeDebounce(searchTerm);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);
  function handleNewUser(userData) {
    toast.success(`User ${userData.firstName} ${userData.lastName} added`);
    setUserFormOpen(false);
    setUser(userData);
    console.log("userDAta", userData);
    onSelect(userData);
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (isUserFormOpen) {
          setUserFormOpen();
        } else if (isUserSearchModalOpen) {
          setIsSearchIsModalOpen();
        }
      }
    };

    if (isUserFormOpen || isUserSearchModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUserFormOpen, isUserSearchModalOpen , setUserFormOpen, setIsSearchIsModalOpen ]);


  return (
    <>
      <div className="flex">
        <div
          onClick={() => {
            setIsSearchIsModalOpen(true);
            setSearchTerm("");
          }}
          className="w-full max-w-xs px-4 py-2 pt-3 rounded-lg shadow-md cursor-pointer input input-bordered focus:outline-none focus:ring focus:ring-blue-400"
        >
          <Text className="font-medium">
            {user
              ? `${user.firstName} ${user.lastName} (${user?.mobileNumber})`
              : "Select  User"}
          </Text>
        </div>
        {newUser ? (
          <>
            <div className="pt-3 pl-3">Or</div>
            <Button
              onClick={() => setUserFormOpen(true)}
              className="ml-3 btn-md btn-link"
              type="link"
            >
              New User
            </Button>
          </>
        ) : null}
      </div>
      <Modal
        title="Add User"
        fullscreen={false}
        closeModal={() => setUserFormOpen(false)}
        showModal={isUserFormOpen}
        showBtns={false}
      >
        <UserForm onDone={handleNewUser} />
      </Modal>
      <Modal
        title="Search User"
        fullscreen={false}
        closeModal={() => setIsSearchIsModalOpen(false)}
        showModal={isUserSearchModalOpen}
        showBtns={false}
      >
        <div className="relative w-full">
          <div className="flex ">
            <Input
              type="text"
              className="w-full px-4 py-2 mr-2 rounded-lg shadow-md focus:outline-none focus:ring focus:ring-blue-400"
              placeholder="Search by mobile number or name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
            {/* <Button  className="ml-3 btn-sm" type="ghost">New User</Button> */}
          </div>
          {loading && (
            <div className="absolute z-10 w-full bg-white shadow-md top-full">
              {/* Loading indicator */}
            </div>
          )}

          {searchResults.length > 0 && (
            <div
              style={{
                maxHeight: "600px",
                overflowY: "scroll",
                position: "fixed",
                width: "97%",
                zIndex: "1000",
                background: "white",
              }}
            >
              <FlatList
                data={searchResults}
                renderItem={({ item }) => (
                  <div
                    onClick={() => {
                      onSelect(item);
                      setUser(item);
                      setSearchResults([]);
                      setIsSearchIsModalOpen(false);
                      //   setSearchTerm(item?.firstName + " " + item.lastName);
                    }}
                  >
                    <ListItem
                      className=""
                      title={item?.firstName + " " + item.lastName}
                      description={item?.mobileNumber}
                    />
                  </div>
                )}
              />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default UserSearchBar;
