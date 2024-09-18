import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _debounce from "lodash/debounce";

import ShoppingCartIcon from "@heroicons/react/24/solid/ShoppingCartIcon";
import TruckIcon from "@heroicons/react/24/outline/TruckIcon";
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import ViewColumnsIcon from "@heroicons/react/24/outline/ViewColumnsIcon";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";

import Dropdown from "./../../components/common/Dropdown";
import ProductList from "../../components/ProductCatalog/ProductList";
import OrdersTab from "../../components/ProductCatalog/Orders";
import CartTab from "../../components/ProductCatalog/Cart";
import TitleCard from "./../../components/common/Cards/TitleCard";
import IconToggle from "./../../components/common/Toggle/IconToggle";

import {
  setClientVendorMapping,
  setProductCatalogLayout,
  setSortConfig,
} from "./slice/catalogSlice";

import { _isEmpty, pickupDataFromResponse } from "./../../helpers/utils";
import {
  createOrGetCart,
  getProductCategories,
  getProducts,
  updateAccessToken,
} from "./thunk/catalogThunk";
import SearchInput from "../../components/common/SearchInput";
import {
  CREATE_USER_SETTINGS,
  GET_USER_SETTINGS,
  UPDATE_USER_SETTING,
} from "../../graphql/queries/usersetting";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CLIENT_VENDOR_CATALOG_MAPPINGS } from "../../graphql/clientVendorCatalogMapping";
import Select from "../../components/common/neomorphic/Select";
import OrderRequest from "../../components/ProductCatalog/OrderRequest";
import { setUserSetting } from "../../slice/authSlice";
import { useRef } from "react";
import Subtitle from "../../components/common/Typography/Subtitle";

function Catalog() {
  const [activeTab, setActiveTab] = useState("Catalog");
  const [userCart, setUserCart] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [vendors, setVendors] = useState([]);
  const { activeSociety, user, userSetting } = useSelector(
    (state) => state.authSlice
  );
  const { clientVendorMapping, cart } = useSelector(
    (state) => state.catalogSlice
  );
  const previousIdRef = useRef();
  const dispatch = useDispatch();
  const [createUserSetting] = useMutation(CREATE_USER_SETTINGS);
  const [updateUserSetting] = useMutation(UPDATE_USER_SETTING);
  const { client_vendor_catalog_res } = useQuery(
    GET_CLIENT_VENDOR_CATALOG_MAPPINGS,
    {
      variables: {
        societyId: activeSociety?.objectId,
      },
      skip: !activeSociety?.objectId,
      onCompleted: (data) => {
        const catalogvendormappings = pickupDataFromResponse({ data });
        console.log("catalogvendormappings", catalogvendormappings);
        if (catalogvendormappings?.length) {
          setVendors(catalogvendormappings);
          dispatch(setClientVendorMapping(catalogvendormappings[0]));
        }
      },
    }
  );

  const { data, loading, refetch } = useQuery(GET_USER_SETTINGS, {
    variables: {
      userId: user.objectId,
      settingType: "CATALOG",
      key: `CART_SOCIETY_${activeSociety.objectId}_PARTNER_${clientVendorMapping?.partner?.objectId}`,
    },
    skip: !(activeSociety && user && clientVendorMapping),
    onCompleted: async (data) => {
      console.log("===usersetting", data);
      if (data?.userSettings?.edges?.length) {
        let userSetting = data.userSettings.edges[0].node;
        dispatch(setUserSetting(userSetting));
        dispatch(createOrGetCart(userSetting?.value));
        setUserCart(userSetting?.value);
      } else {
        dispatch(createOrGetCart());
      }
    },
  });

  useEffect(() => {
    if (
      previousIdRef.current !== undefined &&
      previousIdRef.current !== cart?.data?.id &&
      clientVendorMapping
    ) {
      // Perform your operations here based on the change in id
      console.log("Cart ID changed! Perform operations...");
      storeCartInDb();
    }

    // Update the ref with the current id for the next comparison
    previousIdRef.current = cart?.data?.id;
  }, [cart?.data?.id]);

  async function storeCartInDb() {
    console.log("storeCartInDb", cart);
    console.log("clientVendorMapping=>", clientVendorMapping);
    // console.log('cart')
    if (userSetting?.objectId) {
      await updateUserSetting({
        variables: {
          id: userSetting?.objectId,
          value: cart?.data?.id,
        },
      });
    } else {
      await createUserSetting({
        variables: {
          userId: user.objectId,
          settingType: "CATALOG",
          key: `CART_SOCIETY_${activeSociety.objectId}_PARTNER_${clientVendorMapping?.partner?.objectId}`,
          value: cart?.data?.id,
        },
      });
    }
  }

  useEffect(() => {
    console.log("cart", cart?.data);
    console.log("userCart", userCart);
    if (cart?.data?.id && !userCart && clientVendorMapping) {
      storeCartInDb();
    }
  }, [cart, activeSociety, clientVendorMapping]);

  useEffect(() => {
    console.log("vendor", vendor);
    if (clientVendorMapping?.partner?.ecommerceSetting?.accesskey) {
      // window.sessionStorage.setItem(
      //   "commercejs_access_key",
      //   clientVendorMapping?.partner?.ecommerceSetting?.accesskey
      // );
      updateAccessToken(
        clientVendorMapping?.partner?.ecommerceSetting?.accesskey
      );
      setTimeout(() => {
        dispatch(getProductCategories());
        dispatch(
          getProducts({
            page: 1,
            // category_slug: category_slug === "all" ? "" : category_slug,
            // query: filterValue,
            // ...sortConfig,
          })
        );
        // dispatch(createOrGetCart());
      }, 100);
    }
  }, [clientVendorMapping]);

  const handleCheckoutDone = (tab) => setActiveTab(tab || "Orders");

  if (!clientVendorMapping) {
    return (
      <div className="text-center mt-4 flex justify-center">
        <Subtitle>Catalog Not Enabled!</Subtitle>
      </div>
    );
  }
  const tabsList = [
    {
      name: "Catalog",
      icon: <Squares2X2Icon className="w-4 h-4" />,
    },
    {
      name: "Cart",
      icon: <ShoppingCartIcon className="w-4 h-4" />,
      extra: (cart) =>
        cart?.data?.total_unique_items ? (
          <div className="badge badge-sm ml-1">
            {cart?.data?.total_unique_items}
          </div>
        ) : null,
    },
    {
      name: "Order Requests",
      icon: <TruckIcon className="w-4 h-4" />,
      disabled: !clientVendorMapping?.approvalRequired,
    },
    { name: "Orders", icon: <TruckIcon className="w-4 h-4" /> },
  ];
  return (
    <div className="m-3 flex flex-col justify-center">
      <div className="flex">
        <label className="text-center m-3 font-weight-300">Vendor</label>
        <Select
          placeholder={"Vendor"}
          className={"w-1/6 h-6"}
          native={true}
          onChange={(a) => {
            const obj = vendors?.find((v) => v?.partner?.objectId === a);
            console.log("a", a);
            dispatch(setClientVendorMapping(obj));
            // window.location.reload()
          }}
          options={vendors?.map((v) => {
            return {
              label: v?.partner?.name,
              value: v?.partner?.objectId,
              catalogVendorMapping: v,
            };
          })}
          value={clientVendorMapping?.partner?.objectId}
        />
      </div>
      <div className="tabs tabs-boxed bg-base-100 self-center transition-all duration-300">
        {tabsList
          ?.filter((a) => !a.disabled)
          .map((tab, index) => {
            return (
              <a
                key={index}
                className={
                  "tab " +
                  (activeTab === tab.name
                    ? "tab-active dark:!text-accent !text-white"
                    : "")
                }
                onClick={(e) => setActiveTab(tab.name)}
              >
                <div className="flex items-center justify-center gap-1">
                  {tab.icon}
                  {tab.name}
                  {tab.extra && tab.extra(cart)}
                </div>
              </a>
            );
          })}
      </div>
      <div className="pb-3">
        {activeTab == "Catalog" && <CatalogTab />}
        {activeTab == "Orders" && <OrdersTab />}
        {activeTab == "Order Requests" &&
          clientVendorMapping &&
          clientVendorMapping.approvalRequired && (
            <OrderRequest onCheckoutDone={handleCheckoutDone} />
          )}
        {activeTab == "Cart" && <CartTab onCheckoutDone={handleCheckoutDone} />}
      </div>
    </div>
  );
}

export default Catalog;

const options = [
  {
    label: "Newest",
    value: "sort_order:asc",
  },
  {
    label: "Price: Low to High",
    value: "price:asc",
  },
  {
    label: "Price: Higt to Low",
    value: "price:desc",
  },
];

const SortFilter = ({ onChange }) => {
  const [value, setValue] = useState("Select");

  function handleSelection({ label, value: v }) {
    setValue(v);
    if (typeof onChange === "function")
      onChange({
        sortBy: v?.split(":")?.[0] || "sort_order",
        sortDirection: v?.split(":")?.[1] || "asc",
      });
  }

  return (
    <Dropdown
      label="Sort"
      suffixIcon={<ChevronDownIcon className="w-4 h-4" />}
      value={value}
      className={"text-xs dropdown-left"}
      native={true}
      onChange={handleSelection}
      options={options}
    />
  );
};

const CatalogTab = () => {
  const [filterValue, setFilterValue] = useState("");
  const {
    productCategories: { category_slug },
    products: { layoutMode, sortConfig },
  } = useSelector((state) => state.catalogSlice);

  const dispatch = useDispatch();

  function handleSortChange(config) {
    dispatch(setSortConfig(config));
  }

  useEffect(() => {
    dispatch(
      getProducts({
        page: 1,
        category_slug: category_slug === "all" ? "" : category_slug,
        query: filterValue,
        ...sortConfig,
      })
    );
  }, [filterValue, category_slug]);

  return (
    <div className="-mt-14">
      <TitleCard
        title={
          <div className="float-left">
            <SearchInput
              className="!w-72"
              debounced
              onChange={setFilterValue}
            />
          </div>
        }
        className="!bg-transparent !p-0 !shadow-none"
        bodyClass="!bg-transparent"
        TopSideButtons={
          <div className="flex items-center gap-2">
            <SortFilter onChange={handleSortChange} />
            <IconToggle
              {...{
                value: layoutMode,
                onChange: (mode) => dispatch(setProductCatalogLayout(mode)),
                Icon: <ViewColumnsIcon className="h-4 w-4" />,
              }}
            />
          </div>
        }
      >
        <ProductList {...{ filterValue }} />
      </TitleCard>
    </div>
  );
};
