import { createSlice } from "@reduxjs/toolkit";
import _orderBy from "lodash/orderBy";
import {
  addToCart,
  captureOrder,
  checkout,
  createOrGetCart,
  emptyCart,
  fetchOrders,
  getOrder,
  getProductCategories,
  getProducts,
  updateCart,
} from "../thunk/catalogThunk";

export const catalogSlice = createSlice({
  name: "catalogSlice",
  initialState: {
    orders: {
      loading: false,
      data: {},
      layoutMode: 0,
    },
    cart: {
      checkoutLoading: false,
      updatingCart: false,
      loading: false,
      data: [],
    },
    productCategories: {
      loading: false,
      data: [],
      category_slug: "all",
    },
    products: {
      sortConfig: {},
      loading: false,
      layoutMode: 0,
      data: [],
      pagination: {
        page: 1,
        limit: 10,
      },
    },
    clientVendorMapping :{
      objectId:null,
      approvalRequired:false,
      partner:{}
    }
  },
  reducers: {
    setSelectedCategory: (state, { payload }) => {
      state.productCategories.category_slug = payload;
    },
    setProductCatalogLayout: (state, { payload }) => {
      state.products.layoutMode = payload;
    },
    setOrdersLayout: (state, { payload }) => {
      state.orders.layoutMode = payload;
    },
    setSortConfig: (state, { payload }) => {
      state.products.sortConfig = payload;
    },
    resetCart: (state) => {
      state.cart.line_items = [];
      state.cart.total_unique_items = 0;
    },
    setClientVendorMapping: (state, { payload }) => {
      state.clientVendorMapping = payload;
    },
  },
  extraReducers: {
    [createOrGetCart.pending]: () => {},
    [createOrGetCart.fulfilled]: (state, { payload }) => {
      const orderedCarts = _orderBy(
        payload.items,
        ["createTimestamp"],
        ["desc"]
      );
      state.cart.data = orderedCarts[0];
    },
    [createOrGetCart.rejected]: () => {},
    [addToCart.pending]: () => {},
    [addToCart.fulfilled]: (state, { payload }) => {
      const orderedCarts = _orderBy([payload], ["createTimestamp"], ["desc"]);
      state.cart.data = orderedCarts[0];
    },
    [addToCart.rejected]: () => {},
    [updateCart.pending]: (state) => {
      state.cart.updatingCart = true;
    },
    [updateCart.fulfilled]: (state, { payload }) => {
      const orderedCarts = _orderBy([payload], ["createTimestamp"], ["desc"]);
      state.cart.data = orderedCarts[0];
      state.cart.updatingCart = false;
    },
    [updateCart.rejected]: (state) => {
      state.cart.updatingCart = false;
    },
    [fetchOrders.pending]: (state) => {
      state.orders.loading = true;
    },
    [fetchOrders.fulfilled]: (state, { payload }) => {
      state.orders.data = payload;
      state.orders.loading = false;
    },
    [fetchOrders.rejected]: (state) => {
      state.orders.loading = false;
    },
    [getOrder.pending]: (state) => {
      state.orders.loading = true;
    },
    [getOrder.fulfilled]: (state, { payload }) => {
      state.orders.data = payload.error ? payload : [payload];
      state.orders.loading = false;
    },
    [getOrder.rejected]: (state) => {
      state.orders.loading = false;
    },
    [getProductCategories.pending]: (state) => {
      state.productCategories.loading = true;
    },
    [getProductCategories.fulfilled]: (state, { payload }) => {
      state.productCategories.data = payload?.data || [];
      state.productCategories.loading = false;
    },
    [getProductCategories.rejected]: (state) => {
      state.productCategories.loading = false;
    },
    [getProducts.pending]: (state) => {
      state.products.loading = true;
    },
    [getProducts.fulfilled]: (state, { payload }) => {
      state.products.data = payload.items || [];
      state.products.loading = false;
      state.products.pagination = payload.meta.pagination;
    },
    [getProducts.rejected]: (state) => {
      state.products.loading = false;
    },
    [checkout.pending]: (state) => {
      state.cart.checkoutLoading = true;
    },
    [checkout.fulfilled]: (state, { payload }) => {
      state.cart.checkoutLoading = false;
    },
    [checkout.rejected]: (state) => {
      state.cart.checkoutLoading = false;
    },
    [captureOrder.pending]: (state) => {
      state.cart.checkoutLoading = true;
    },
    [captureOrder.fulfilled]: (state, { payload }) => {
      state.cart.checkoutLoading = false;
      state.cart.data = {};
    },
    [captureOrder.rejected]: (state) => {
      state.cart.checkoutLoading = false;
    },
    [emptyCart.pending]: (state) => {
      state.cart.clearingCart = true;
    },
    [emptyCart.fulfilled]: (state, { payload }) => {
      const orderedCarts = _orderBy([payload], ["createTimestamp"], ["desc"]);
      state.cart.data = orderedCarts[0];
      state.cart.clearingCart = false;
    },
    [emptyCart.rejected]: (state) => {
      state.cart.clearingCart = false;
    },
  },
});

export const {
  setProductCatalogLayout,
  setOrdersLayout,
  setSortConfig,
  setSelectedCategory,
  resetCart,
  setClientVendorMapping
} = catalogSlice.actions;

export default catalogSlice.reducer;
