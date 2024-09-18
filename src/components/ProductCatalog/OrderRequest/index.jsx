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
import {
  _getArr,
  _isEmpty,
  pickupDataFromResponse,
} from "../../../helpers/utils";
import {
  captureOrder,
  checkout,
  createOrGetCart,
  fetchOrders,
  getOrder,
} from "../../../pages/Catalog/thunk/catalogThunk";
import { setOrdersLayout } from "../../../pages/Catalog/slice/catalogSlice";
import { useMutation, useQuery } from "@apollo/client";
import {
  FIRST_LEVEL_APPROVAL,
  GET_ORDER_REQUESTS,
  SECOND_LEVEL_APPROVAL,
} from "../../../graphql/orderrequest";
import Button from "../../common/neomorphic/Button";
import { toast } from "react-toastify";
import moment from "moment";
import Modal from "../../common/Modal";
import { cartApiHelper } from "../../../helpers/cartAPI";
import CartProduct from "../../ProductUnit/CartProduct";
const cartApiInstance = cartApiHelper();

const OrderRequest = ({ onCheckoutDone }) => {
  const { activeSociety, activeRole, user } = useSelector(
    (state) => state.authSlice
  );
  const { orders, clientVendorMapping, cart } = useSelector(
    (state) => state.catalogSlice
  );
  const [approveFirstLevel] = useMutation(FIRST_LEVEL_APPROVAL);
  const [approveSecondLevel] = useMutation(SECOND_LEVEL_APPROVAL);
  const [searchStr, setSearchStr] = useState("");
  const [selectedOrderRequest, setSelectedOrderRequest] = useState(null);
  const [showOrderRequestModal, setShowOrderRequestModal] = useState(false);
  // const [cart, setCart] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const dispatch = useDispatch();
  const { data: orderRequestRes, loading, refetch } = useQuery(
    GET_ORDER_REQUESTS,
    {
      variables: {
        mappingId: clientVendorMapping?.objectId,
        subQuery:
          activeRole == "SOCIETY_MANAGER"
            ? {
                firstLevelApproval: { exists: true },
              }
            : {},
      },
      skip: !clientVendorMapping?.objectId,
    }
  );

  const order_requests = pickupDataFromResponse({ data: orderRequestRes });
  console.log("order request", order_requests);

  const handleChange = (orderNum) => {
    setSearchStr(orderNum);
    // if (!orderNum) dispatch(fetchOrders(activeSociety.email));
    // else dispatch(getOrder(orderNum));
  };

  if (loading)
    return (
      <>
        <Skeleton width="w-70" height="h-10" className="mt-4" />
        {_getArr(5).map(() => (
          <Skeleton width="w-70" height="h-52" className="mt-2" />
        ))}
      </>
    );

  if (_isEmpty(order_requests)) {
    return (
      <div className="w-full card mt-4">
        <EmptyData
          icon={<XCirleIcon className="w-6 h-6" />}
          msg="No active orders!"
        />
      </div>
    );
  }
  const statusClass = {
    Approved: "success",
    Rejected: "error",
    "Pending Approval": "warning",
    "Approval Pending": "warning",
  };
  async function handleSetCart(cartId) {
    await dispatch(createOrGetCart(cartId));
    onCheckoutDone("Cart");
  }
  async function handleCheckout(order_request) {
    const toastId = toast.loading("Placing Order, Please wait...", {
      autoClose: false,
      type: toast.TYPE.INFO,
    });
    const resp = await dispatch(
      checkout({ cart_id: cart.data.id, society: activeSociety })
    );
    dispatch(
      captureOrder({
        param: { email: activeSociety.email, activeSociety },
        resp: resp.payload,
      })
    ).then(async (res) => {
      console.log("Order res", res);
      // localStorage.removeItem(`${activeSociety.email}:cart_id`);
      toast.update(toastId, {
        render: `Order Created Successfully`,
        isLoading: false,
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      await approveSecondLevel({
        variables: {
          approver: user?.objectId,
          id: order_request?.objectId,
          orderId: res?.payload?.customer_reference || res?.payload?.id,
        },
      });
      dispatch(createOrGetCart());
      onCheckoutDone();
    });
  }
  async function handleApprove(order_request) {
    if (!order_request?.firstLevelApproval && activeRole === "SOCIETY_ADMIN") {
      await approveFirstLevel({
        variables: {
          approver: user?.objectId,
          id: order_request?.objectId,
        },
      });
      toast.success("Order Request Approved");
      setShowOrderRequestModal(false);
    } else if (
      order_request?.firstLevelApproval &&
      !order_request?.secondLevelApproval &&
      activeRole == "SOCIETY_MANAGER"
    ) {
      handleCheckout(order_request);
      toast.success("Order Request Approved");
      setShowOrderRequestModal(false);
    } else {
      toast.error("Your are not Authorized");
    }
    refetch();
  }
  async function handleViewOrderRequest(order_request) {
    console.log("order_request", order_request);
    setShowOrderRequestModal(true);
    setSelectedOrderRequest(order_request);
    setModalLoading(true);
    // const cart = await cartApiInstance.createOrGetCart(order_request?.cartId);
    console.log("cart====", cart);
    // setCart({ data: cart?.items[0] });

    await dispatch(createOrGetCart(order_request?.cartId));
    setModalLoading(false);
  }
  return (
    <div className="mt-5">
      <div
        className={`mt-2 transition-all duration-300 gap-2 grid grid-rows-auto `}
      >
        {order_requests?.map((order_request) => (
          <div
            className={`bg-base-100 p-6 shadow-lg transition-all duration-300  grid-cols-2  rounded-md grid`}
          >
            <div>
              Cart Id :
              <b className="font-weight-400">{order_request?.cartId} </b>
            </div>
            <div>
              <span
                className={`float-right p-3 text-center flex-col-reverse badge badge-${
                  statusClass[order_request?.status]
                } text-white capitalize text-[15px] font-semibold rounded-full`}
              >
                {order_request?.status}{" "}
              </span>
            </div>
            <div>
              Created By:{" "}
              <b>
                {order_request?.createdBy?.firstName}{" "}
                {order_request?.createdBy?.lastName}
              </b>
            </div>
            <div>&nbsp;</div>
            <div>
              Date:{" "}
              <b>
                {moment(order_request?.createdAt).format("DD/MM/YYYY h:mm A")}
              </b>
            </div>
            <div>&nbsp;</div>
            <div>
              First Level Approval:
              <b className="bold">
                {order_request?.firstLevelApproval ? "Approved" : "Pending "}
              </b>
            </div>

            <div>
              {order_request?.firstLevelApproval ? (
                <span>
                  Approved By :{" "}
                  {order_request?.firstLevelApproval?.approver?.firstName}{" "}
                  {order_request?.firstLevelApproval?.approver?.lastName}({" "}
                  {moment(order_request?.firstLevelApproval?.createdAt).format(
                    "DD/MM/YYYY h:mm A"
                  )}{" "}
                  )
                </span>
              ) : (
                " "
              )}
            </div>

            <div>
              Second Level Approval:
              <b className="bold">
                {order_request?.secondLevelApproval ? "Approved" : "Pending "}
              </b>
            </div>
            <div>
              {order_request?.secondLevelApproval ? (
                <span>
                  Approved By :{" "}
                  {order_request?.secondLevelApproval?.approver?.firstName}{" "}
                  {order_request?.secondLevelApproval?.approver?.lastName} ({" "}
                  {moment(order_request?.secondLevelApproval?.createdAt).format(
                    "DD/MM/YYYY h:mm A"
                  )}{" "}
                  )
                </span>
              ) : (
                " "
              )}
            </div>

            {order_request?.status === "Approved"  ? (
             <> <div>
                Order Id : <b className="bold">{order_request.orderId || 'N/A'}</b>
              </div>
              <div>&nbsp;</div></>
            ) : null}

            <div>
              <Button
                disabled={order_request?.status === 'Approved'}
                onClick={() => handleViewOrderRequest(order_request)}
                type="secondary"
                paddingClass="px-2"
                loading={
                  selectedOrderRequest?.objectId === order_request?.objectId &&
                  modalLoading
                }
                className="p-2 float-right gap-2 rounded-full m-2 "
              >
                View
              </Button>
              {/* <Button
                onClick={() => handleSetCart(order_request?.cartId)}
                type="outline"
                paddingClass="px-2"
                disabled={order_request?.status == "Approved"}
                className="p-2 float-right gap-2 rounded-full m-2 "
              >
                Modify
              </Button> */}
            </div>
          </div>
        ))}
        {showOrderRequestModal && !modalLoading && (
          <Modal
            title="Order Request Details"
            closeModal={async () => {
              setShowOrderRequestModal((prevState) => !prevState);
              // await dispatch(createOrGetCart(sessioncart?.data?.id));
            }}
            fullscreen={true}
            showBtns={false}
            // submitBtnText={'Approve'}
            showModal={setShowOrderRequestModal}
            // onSubmit={}
          >
            <div className="bg-base-100 p-4 shadow-lg rounded-md mt-5 height-800">
              <div className="">
                <h3 className="text-xl font-semibold mb-2">Cart Items</h3>
                <div
                  className="flex flex-wrap gap-[13px] "
                  style={{ maxHeight: "420px", overflowY: "auto" }}
                >
                  {cart?.data?.line_items?.map((item) => (
                    <CartProduct
                      {...{
                        product: item,
                        disabled: selectedOrderRequest?.status === "Approved",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="my-4 flex justify-between font-semibold">
                <p>Number of Products: {cart?.data?.total_unique_items}</p>
                <p>Total Price: {cart?.data?.subtotal?.formatted} INR</p>
              </div>
            </div>
            <div className="mt-3">
              <Button
                onClick={() => handleApprove(selectedOrderRequest)}
                type="secondary"
                disabled={
                  activeRole === "SOCIETY_STAFF" ||
                  (selectedOrderRequest?.firstLevelApproval &&
                    selectedOrderRequest.secondLevelApproval)
                }
                paddingClass="px-2"
                className="p-2 float-right gap-2 rounded-full m-2 "
              >
                Approve
              </Button>
              {/* <Button
                onClick={() => handleApprove(selectedOrderRequest)}
                type=""
                disabled={
                  activeRole === "SOCIETY_STAFF" ||
                  selectedOrderRequest?.status === "Approved"
                }
                paddingClass="px-2"
                className="p-3 float-right gap-2 rounded-full m-2 "
              >
                Reject
              </Button> */}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default OrderRequest;
