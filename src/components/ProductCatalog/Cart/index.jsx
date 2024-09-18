import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import XCirleIcon from "@heroicons/react/24/outline/XCircleIcon";
import ArrowLongRightIcon from "@heroicons/react/24/outline/ArrowLongRightIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";

import EmptyData from "../../common/EmptyData";
import Button from "../../common/neomorphic/Button";
import CartProduct from "../../ProductUnit/CartProduct";
import Skeleton from "../../common/Skeleton";

import {
  _getArr,
  _isEmpty,
  pickupDataFromResponse,
} from "../../../helpers/utils";
import {
  captureOrder,
  checkout,
  createOrGetCart,
  emptyCart,
} from "../../../pages/Catalog/thunk/catalogThunk";
import { resetCart } from "../../../pages/Catalog/slice/catalogSlice";
import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_REQUEST_WITH_FIRST_LEVEL_APPROVAL,
  FIRST_LEVEL_APPROVAL,
  GET_ORDER_REQUEST_BY_CART_ID,
} from "../../../graphql/orderrequest";
import { useMutation, useQuery } from "@apollo/client";

const Cart = ({ onCheckoutDone }) => {
  const { activeSociety, activeRole, user } = useSelector(
    (state) => state.authSlice
  );
  const { cart, clientVendorMapping } = useSelector(
    (state) => state.catalogSlice
  );
  const [creteOrderRequest] = useMutation(CREATE_ORDER_REQUEST);
  const [creteOrderRequestWithFirstLevelApproval] = useMutation(
    CREATE_ORDER_REQUEST_WITH_FIRST_LEVEL_APPROVAL
  );
  const [approveFirstLevel] = useMutation(FIRST_LEVEL_APPROVAL);

  const { data: orderRequestRes, loading, refetch } = useQuery(
    GET_ORDER_REQUEST_BY_CART_ID,
    {
      variables: {
        cartId: cart?.data?.id,
      },
      skip: !cart?.data?.id,
    }
  );
  const order_request = pickupDataFromResponse({ data: orderRequestRes });
  const dispatch = useDispatch();

  async function handleCheckout() {
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
    ).then(() => {
      localStorage.removeItem(`${activeSociety.email}:cart_id`);
      toast.update(toastId, {
        render: `Order Created Successfully`,
        isLoading: false,
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      onCheckoutDone();
    });
  }

  function handleClear() {
    // resetCart
    dispatch(createOrGetCart());
    // dispatch(resetCart());
    // dispatch(emptyCart(cart.data.id));
  }

  if (cart.loading) {
    return _getArr(3).map(() => (
      <Skeleton width={"w-700"} height="h-40" className="mt-2" />
    ));
  }
  async function handleOrderRequest() {
    //DEPARTMETN USER
    if (activeRole === "SOCIETY_STAFF") {
      await creteOrderRequest({
        variables: {
          cartId: cart.data.id,
          clientvendorcatalogMappingId: clientVendorMapping?.objectId,
        },
      });
      //SITE HEAD
    } else if (activeRole === "SOCIETY_ADMIN") {
      //thi
      if (order_request?.[0]?.objectId) {
        await approveFirstLevel({
          variables: {
            approver: user?.objectId,
            id: order_request?.[0]?.objectId,
          },
        });
      } else {
        await creteOrderRequestWithFirstLevelApproval({
          variables: {
            cartId: cart.data.id,
            clientvendorcatalogMappingId: clientVendorMapping?.objectId,
            approver: user?.objectId,
            comments: "FIRST LEVEL APPROVAL",
          },
        });
      }
    }

    toast.success("Submitted for Approval");
    dispatch(createOrGetCart());
    // dispatch(resetCart());
    // dispatch(emptyCart(cart.data.id));

    //  dispatch(resetCart());
    // dispatch(emptyCart(cart.data.id));
  }
  if (!cart?.data?.total_unique_items)
    return (
      <div className="w-full mt-4 card">
        <EmptyData
          icon={<XCirleIcon className="w-6 h-6" />}
          msg="Cart is Empty!"
        />
      </div>
    );

  return (
    <div className="p-4 mt-5 rounded-md shadow-lg bg-base-100">
      <div className="">
        <h3 className="mb-2 text-xl font-semibold">Cart Items</h3>
        <div className="flex flex-wrap gap-[13px]">
          {cart?.data?.line_items?.map((item) => (
            <CartProduct
              {...{
                product: item,
                disabled: cart.checkoutLoading,
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between my-4 font-semibold">
        <p>Number of Products: {cart?.data?.total_unique_items}</p>
        <p>Total Price: {cart?.data?.subtotal?.formatted} INR</p>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button
          onClick={handleClear}
          className={`gap-2 rounded-full ${
            cart.checkoutLoading || cart.clearingCart ? "loading" : ""
          }`}
        >
          <TrashIcon className="w-5 h-5" />
          Clear Cart
        </Button>
        {activeRole !== "SOCIETY_MANAGER" && clientVendorMapping?.approvalRequired ? (
          <Button  onClick={handleOrderRequest} className={`gap-2 rounded-full`}>
            Submit for Approval
            <ArrowLongRightIcon className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            onClick={handleCheckout}
            className={`gap-2 rounded-full ${
              cart.checkoutLoading || cart.clearingCart ? "loading" : ""
            }`}
          >
            Checkout
            <ArrowLongRightIcon className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Cart;
