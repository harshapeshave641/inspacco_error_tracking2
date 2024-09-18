import React, { useState } from "react";
import TagIcon from "@heroicons/react/24/solid/TagIcon";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { INR_CURRENCY } from "../../../constants";
import { updateCart } from "../../../pages/Catalog/thunk/catalogThunk";

export default function CartProduct({ product, disabled }) {
  const { cart } = useSelector((state) => state.catalogSlice);
  const [quantity, setQuantity] = useState(product.quantity || 0);

  const dispatch = useDispatch();

  const dispatchUpdateCart = ({ action }) =>
    dispatch(
      updateCart({
        cart_id: cart.data.id,
        item: {
          productId: product.id,
          price: product.price,
          quantity: action === "remove" ? quantity - 1 : quantity + 1,
          name: product.name,
        },
      })
    );

  const handleAdd = () => {
    dispatchUpdateCart({ action: "add" }).then((r) => {
      toast.success("Product added!");
    });
    setQuantity(quantity + 1);
  };

  const handleRemove = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
      dispatchUpdateCart({ action: "remove" }).then((r) => {
        toast.success("Product removed!");
      });
    } else setQuantity(0);
  };

  return (
    <>
      {quantity ? (
        <div className="card card-compact w-full shadow-xl flex flex-row glass transition-all duration-300">
          <figure className="w-40 h-40 flex">
            {product?.image?.url ? (
              <img
                className="w-40 h-40 p-2 rounded-[14px]"
                src={product?.image?.url}
                alt="product-img"
              />
            ) : (
              <TagIcon className="w-12 h-12" />
            )}
          </figure>
          <div className="card-body">
            <h2 className="card-title text-sm">{product.name}</h2>
            <p className="text-md ">
              {product.quantity} x {product?.price?.formatted} ={" "}
              <span className="font-semibold">
                {INR_CURRENCY} {product.line_total.formatted}
              </span>
            </p>
            <div className={`card-actions justify-end`}>
              <div className="btn-group">
                <button
                  className={`btn btn-primary btn-sm ${
                    disabled ? "btn-disabled" : ""
                  }`}
                  onClick={handleRemove}
                >
                  -
                </button>
                <button className={`btn btn-primary btn-sm `}>
                  {quantity}
                </button>
                <button
                  className={`btn btn-primary btn-sm ${
                    disabled ? "btn-disabled" : ""
                  }`}
                  onClick={handleAdd}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
