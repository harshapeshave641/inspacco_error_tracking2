import { cartApiHelper } from "../../../helpers/cartAPI";
import { createAsyncThunk } from "@reduxjs/toolkit";

const cartApiInstance = cartApiHelper();

export const createOrGetCart = createAsyncThunk(
  "cartData/createOrGetCart",
  async (cartId, thunkAPI) => {
    const res = await cartApiInstance.createOrGetCart(cartId);
    // console.log('cart res', res)
    const { items = [] } = res;
    // console.log('statuscode ',items[0].status_code == 404)
    if(items?.length && items[0].status_code == 404){
      return await cartApiInstance.createOrGetCart();
    }
    return res;
  }
);

export const addToCart = createAsyncThunk(
  "cartData/addToCart",
  async (params, thunkAPI) => {
    try {
      const res = await cartApiInstance.addToCart(params);
      return res;
    } catch { }
  }
);

export const updateCart = createAsyncThunk(
  "cartData/updateCart",
  async (params, thunkAPI) => {
    const res = await cartApiInstance.updateCart(params);
    return res;
  }
);

export const emptyCart = createAsyncThunk(
  "cartData/emptyCart",
  async (cart_id, thunkAPI) => {
    const res = await cartApiInstance.emptyCart(cart_id);
    return res;
  }
);

export const checkout = createAsyncThunk(
  "cartData/checkout",
  async ({ cart_id, society }, thunkAPI) => {
    const resp = await cartApiInstance.checkout({ cart_id, society });
    return resp;
  }
);

export const captureOrder = createAsyncThunk(
  "cartData/captureOrder",
  async ({ param, resp }, thunkAPI) => {
    const res = await cartApiInstance.captureOrder(param, resp);
    return res;
  }
);

export const getOrder = createAsyncThunk(
  "cartData/getOrder",
  async (orderId, thunkAPI) => {
    const res = await cartApiInstance.getOrder(orderId);
    return res;
  }
);

export const fetchOrders = createAsyncThunk(
  "cartData/fetchOrders",
  async (email, thunkAPI) => {
    const res = await cartApiInstance.fetchOrders(email);
    return res;
  }
);

export const getProductCategories = createAsyncThunk(
  "cartData/getProductCategories",
  async () => {
    const res = await cartApiInstance.fetchCategories();
    return res;
  }
);

export const getProducts = createAsyncThunk(
  "cartData/getProducts",
  async (queryParams) => {
    const res = await cartApiInstance.fetchProducts(queryParams);
    return res;
  }
);
export const updateAccessToken = (token) => {
  cartApiInstance.updateAccessToken(token)
}