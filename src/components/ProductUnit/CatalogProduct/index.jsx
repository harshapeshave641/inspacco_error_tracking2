import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import TagIcon from "@heroicons/react/24/solid/TagIcon";

import { INR_CURRENCY } from "../../../constants";
import {
  addToCart,
  updateCart,
} from "../../../pages/Catalog/thunk/catalogThunk";

export default function CatalogProduct({ product }) {
  const dispatch = useDispatch();
  const {
    cart,
    products: { layoutMode },
  } = useSelector((state) => state.catalogSlice);

  const productAlreadyInCart = cart?.data?.line_items?.find(
    ({ product_id }) => product.id === product_id
  );

  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(productAlreadyInCart?.quantity || 0);
  const [isAddedToCart, setAddedToCart] = useState(
    Boolean(productAlreadyInCart)
  );

  const dispatchUpdateCart = ({ action }) =>
    dispatch(
      updateCart({
        cart_id: cart.data.id,
        item: {
          productId: productAlreadyInCart.id,
          price: product.price,
          quantity: action === "remove" ? quantity - 1 : quantity + 1,
          name: product.name,
        },
      })
    );

  const handleAddToCart = () => {
    setAddingToCart(true);
    dispatch(
      addToCart({
        cart_id: cart.data.id,
        item: {
          productId: product.id,
          price: product.price,
          quantity: 1,
          name: product.name,
        },
      })
    ).then((r) => {
      toast.success("Product added to cart!");
      setAddedToCart(true);
      setAddingToCart(false);
      setQuantity((prevQuantity) => prevQuantity + 1);
    });
  };

  const handleAddItem = () => {
    dispatchUpdateCart({ action: "add" }).then((r) => {
      toast.success("Product added!");
    });
    setQuantity(quantity + 1);
  };

  const handleRemoveItem = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
      dispatchUpdateCart({ action: "remove" }).then((r) => {
        toast.success("Product removed!");
      });
    } else {
      setQuantity(0);
      setAddedToCart(false);
    }
  };

  return (
    <div
      className={`card card-compact shadow-xl glass h-80 hover:-skew-y-1 transition-all duration-300 ${
        layoutMode ? "w-60" : "w-52"
      }`}
    >
      <figure className="w-full h-40 bg-white dark:bg-transparent dark:opacity-70 flex justify-center">
        {product.imageUrl ? (
          <img
            className="w-40 h-auto p-2 rounded-[14px]"
            src={product.imageUrl}
            alt="product-img"
          />
        ) : (
          <TagIcon className="w-12 h-12" />
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title text-sm min-h-[35px] items-start text-overflow truncate">
          {product.name}
        </h2>
        <p className="text-md font-semibold">HSN: {product.HSN}</p>
        <p className="text-md font-semibold">Tax Rate : {product.taxRate}</p>
        <p className="text-md font-semibold">SKU: {product.sku}</p>
        <p className="text-lg font-bold text-accent">
          {INR_CURRENCY} {product.price}
        </p>
        <div className="card-actions justify-end">
          {!isAddedToCart || !quantity ? (
            <button
              className={`${
                addingToCart ? "loading" : ""
              } btn btn-primary btn-sm text-sm font-weight-500`}
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
          ) : (
            <div className="btn-group">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleRemoveItem}
              >
                -
              </button>
              <button className={`btn btn-primary btn-sm {loading}`}>
                {quantity}
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAddItem}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
