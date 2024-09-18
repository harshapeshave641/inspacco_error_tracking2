import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import TagIcon from "@heroicons/react/24/solid/TagIcon";
import ViewColumnsIcon from "@heroicons/react/24/outline/ViewColumnsIcon";
import XCirleIcon from "@heroicons/react/24/outline/XCircleIcon";

import Skeleton from "../../common/Skeleton";
import IconToggle from "../../common/Toggle/IconToggle";
import EmptyData from "../../common/EmptyData";
import SearchInput from "../../common/SearchInput";

import { INR_CURRENCY } from "../../../constants";
import { _getArr, _isEmpty } from "../../../helpers/utils";
import {
  fetchOrders,
  getOrder,
} from "../../../pages/Catalog/thunk/catalogThunk";
import { setOrdersLayout } from "../../../pages/Catalog/slice/catalogSlice";

const OrderComponent = ({ order, layoutMode }) => {
  const getStatusColor = (status) =>
    status !== "PAID" ? "text-green-600" : "text-red-600";

  const textClasses = layoutMode ? "text-xs" : "text-sm";

  return (
    <div
      className={`bg-base-100 p-6 shadow-lg transition-all duration-300 ${
        layoutMode ? "h-[500px] grid-rows-2" : "grid-cols-2"
      } rounded-md grid`}
    >
      {/* First Part */}
      <div className={`col-span-2 md:col-span-2 lg:col-span-1 ${textClasses}`}>
        <h3 className="text-xl font-semibold mb-2">
          Order #{order.orderNumber}
        </h3>
        <p className="mb-2">Date: {order.createDate}</p>
        <p>
          Order Status:{" "}
          <span className={`mb-2   ${getStatusColor(order.status)}`}>
            {order.status || "Placed"}
          </span>
        </p>
        <p>
          Payment Status:{" "}
          <span className={`mb-2  ${getStatusColor(order.paymentStatus)}`}>
            {order.paymentStatus}
          </span>
        </p>
        {/* <p className="mb-2">Payment Mode: {order.paymentMethod}</p> */}

        <h4 className="text-lg font-semibold mb-2">Items:</h4>
        <div
          className={`w-full transition-all duration-300 ${
            layoutMode
              ? "h-52 overflow-y-auto flex-col flex"
              : "grid grid-cols-4"
          }`}
        >
          {order?.items?.map((item) => (
            <div className="card card-compact w-full flex flex-row transition-all duration-300">
              <figure className="w-20 h-20 flex">
                {item.imageUrl ? (
                  <img
                    className="w-20 h-20 p-2 rounded-[14px]"
                    src={item.imageUrl}
                    alt="product-img"
                  />
                ) : (
                  <TagIcon className="w-12 h-12" />
                )}
              </figure>
              <div className="card-body">
                <h2 className="card-title text-sm">{item.name}</h2>
                <p className="text-md font-semibold">
                  {item.quantity} x {INR_CURRENCY} {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Second Part */}
      <div
        className={
          layoutMode
            ? "flex items-end justify-end"
            : `hidden md:block lg:col-span-1 column-reverse`
        }
      >
        <p>
          Total Order:{" "}
          <span className="text-lg font-semibold mb-2">
            {INR_CURRENCY}
            {order.total}
          </span>
        </p>
        {/* <p className="">
          Order Status:{" "}
          <span className="text-lg font-semibold mb-2">
            {order.fulfillmentStatus}
          </span>
        </p> */}
      </div>
    </div>
  );
};

const OrderHistory = () => {
  const { activeSociety } = useSelector((state) => state.authSlice);
  const { orders } = useSelector((state) => state.catalogSlice);

  const [searchStr, setSearchStr] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (!activeSociety) return;
    dispatch(fetchOrders(activeSociety.email));
  }, [activeSociety.email]);

  const handleChange = (orderNum) => {
    setSearchStr(orderNum);
    // if (!orderNum) dispatch(fetchOrders(activeSociety.email));
    // else dispatch(getOrder(orderNum));
  };

  if (orders.loading)
    return (
      <>
        <Skeleton width="w-70" height="h-10" className="mt-4" />
        {_getArr(5).map(() => (
          <Skeleton width="w-70" height="h-52" className="mt-2" />
        ))}
      </>
    );

  if (_isEmpty(orders.data)) {
    return (
      <div className="w-full card mt-4">
        <EmptyData
          icon={<XCirleIcon className="w-6 h-6" />}
          msg="No active orders!"
        />
      </div>
    );
  }

  return (
    <div className="mt-5">
      <div className="">
        <div className="flex gap-4 items-center">
          <SearchInput
            className="w-full"
            error={orders?.data?.error?.message}
            debounced
            value={searchStr}
            placeholder="Search with Order ID or Reference Number (without #)"
            debounceTimeInMs={800}
            onChange={handleChange}
            showSearchBtn
          />
          <IconToggle
            {...{
              value: orders.layoutMode,
              onChange: (mode) => dispatch(setOrdersLayout(mode)),
              Icon: <ViewColumnsIcon className="h-4 w-4" />,
            }}
          />
        </div>
        <div
          className={`mt-2 transition-all duration-300 gap-2 ${
            orders.data.error ? "!grid-cols-none" : ""
          } ${orders.layoutMode ? "grid grid-cols-3" : "grid grid-rows-auto"}`}
        >
          {orders.data.error ? (
            <EmptyData msg="No Orders Found!" />
          ) : (
            (searchStr
              ? orders.data.filter((order) =>
                  JSON.stringify(order)
                    .toLowerCase()
                    .includes(searchStr.toLowerCase())
                )
              : orders.data
            ).map((order) => (
              <OrderComponent
                {...{
                  order,
                  layoutMode: orders.layoutMode,
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
