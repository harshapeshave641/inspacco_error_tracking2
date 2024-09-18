import _ from "lodash";
import moment from "moment";

// src/services/ecwidApi.js
function createQueryString(params) {
  return Object.keys(params)
    .filter((key) => params[key])
    .map(
      (key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
    )
    .join("&");
}

const getStatusInHumanReadable = (status = "") => {
  return _.startCase(_.toLower(status?.split("_").join(" ")));
};
function generateRandomTaxRate() {
  // Generate a random decimal number between 0 and 1
  const randomDecimal = Math.random();

  // Calculate the random tax rate within the range [8, 20]
  const randomTaxRate = 8 + randomDecimal * (20 - 8);

  // Round to two decimal places
  const roundedTaxRate = Math.round(randomTaxRate * 100) / 100;

  return Math.ceil(roundedTaxRate);
}
function generateRandomHSN() {
  // Generate a random six-digit number
  const randomHSN = Math.floor(100000 + Math.random() * 900000);

  return randomHSN.toString(); // Convert to string if needed
}
export default class CommerceApi {
  constructor() {
    // this.accessToken = "sk_546250b8c2b12f0600d5595d9153e221539795391e942";
    this.accessToken = window.sessionStorage.getItem('commercejs_access_key') || 'sk_test_5545633437331971519731318d81915042949bf48860f'
    this.baseURL = `https://api.chec.io/v1`;

    this.fetchConfig = {
      baseURL: this.baseURL,
      headers: {
        "X-Authorization": `${this.accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
  }

  fetchApi = {
    get: (url, headers) =>
      fetch(`${this.fetchConfig.baseURL}${url}`, {
        method: "GET",
        headers: {
          ...this.fetchConfig.headers,
          ...headers,
        },
      }).then((resp) => resp.json()),
    post: (url, body, headers) =>
      fetch(`${this.fetchConfig.baseURL}${url}`, {
        method: "POST",
        headers: {
          ...this.fetchConfig.headers,
          ...headers,
        },
        body: JSON.stringify(body),
      }).then((resp) => resp.json()),
    put: (url, body, headers) =>
      fetch(`${this.fetchConfig.baseURL}${url}`, {
        method: "PUT",
        headers: {
          ...this.fetchConfig.headers,
          ...headers,
        },
        body: JSON.stringify(body),
      }).then((resp) => resp.json()),
    delete: (url, body, headers) =>
      fetch(`${this.fetchConfig.baseURL}${url}`, {
        method: "DELETE",
        headers: {
          ...this.fetchConfig.headers,
          ...headers,
        },
        body: JSON.stringify(body),
      }).then((resp) => resp.json()),
  };
  updateAccessToken(accessToken) {
    this.accessToken = accessToken;
    this.fetchConfig = {
      baseURL: this.baseURL,
      headers: {
        "X-Authorization": `${this.accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
  }
  // Function to fetch product list
  async fetchProducts(filter) {
    let querystr = createQueryString(filter);
    const resp = await this.fetchApi.get(`/products?` + querystr);
    resp["items"] =
      resp.data?.map((product) => ({
        ...product,
        price: product.price.formatted,
        imageUrl: product?.image?.url,
        HSN: generateRandomHSN(),
        taxRate: generateRandomTaxRate()
      })) || [];
    return resp;
  }

  emptyCart(cart_id) {
    return this.fetchApi.delete(`/carts/${cart_id}/items`);
  }

  async fetchCategories() {
    if (sessionStorage.getItem(`categories_${this.accessToken}`)) {
      return new Promise((resolve) =>
        resolve(JSON.parse(sessionStorage.getItem(`categories_${this.accessToken}`)))
      );
    }
    const resp = await this.fetchApi.get("/categories");
    sessionStorage.setItem(`categories_${this.accessToken}`, JSON.stringify(resp));
    return resp;
  }

  // Function to add a product to the cart
  async addToCart({ cart_id, item }) {
    try {
      const resp = await this.fetchApi.post(`/carts/${cart_id}`, {
        id: item.productId,
      });
      return resp;
    } catch {
      return new Error("Adding failed!");
    }
  }

  // Function to update the cart
  updateCart({ cart_id, item }) {
    return this.fetchApi.put(`/carts/${cart_id}/items/${item.productId}`, {
      quantity: item.quantity,
    });
  }

  // Function to retrieve the cart
  async createOrGetCart(cartId) {
    // const userCartName = `${email}:cart_id`;
    // const sessionCartId = localStorage.getItem(userCartName);
    if (cartId) {
      try {
        const resp = await this.fetchApi.get(`/carts/${cartId}`);
        return { items: [resp] };
      } catch {
        // localStorage.removeItem(userCartName);
        return this.createOrGetCart();
      }
    } else {
      const newCartResp = await this.fetchApi.get(`/carts`);
      // localStorage.setItem(userCartName, newCartResp.id);
      return { items: [newCartResp] };
    }
  }

  captureOrder({ email, society }, data) {
    const line_items = {};
    const products = data?.line_items || [];

    const checkout_token = data.id;

    products.forEach((product) => {
      line_items[product.id] = {
        quantity: product.quantity,
      };
    });

    const captureObj = {
      line_items,
      customer: {
        firstname: society?.name,
        // lastname: "Doe",
        email: email,
      },
      shipping: {
        name: society?.name,
        street: `${society?.addressLine1},${society?.area}`,
        town_city: society?.city,
        county_state: "MH",
        postal_zip_code: society?.pincode + "",
        country: "IN",
      },
      fulfillment: {
        // The shipping method ID for "USPS Ground" (for example)
        // You can use commerce.checkout.getShippingOptions() to get a list
        // shipping_method: 'ship_1ypbroE658n4ea',
      },
      payment: {
        // Test Gateway is enabled by default, and is used when you submit orders with
        // your sandbox API key
        gateway: "test_gateway",
        card: {
          number: "4242 4242 4242 4242",
          expiry_month: "01",
          expiry_year: "2023",
          cvc: "123",
          postal_zip_code: "94103",
        },
      },
    };

    return this.fetchApi.post(`/checkouts/${checkout_token}`, captureObj);
  }

  async checkout({ cart_id, society }) {
    //generate token
    const resp = await this.fetchApi.get(`/checkouts/${cart_id}?type=cart`);
    return resp;
  }

  // Function to fetch order history
  async fetchOrders(email) {
    const resp = await this.fetchApi.get(
      `/orders?sortBy=created_at&sortDirection=desc&query=${email}&limit=1000`
    );
    return resp?.data?.map((obj) => this.populateOrderData(obj));
  }

  // get Order
  async getOrder(order_id) {
    const type = order_id.includes("ord_") ? "id" : "reference";
    const resp = await this.fetchApi.get(`/orders/${order_id}?type=${type}`);
    if (resp.error) return resp;
    return this.populateOrderData(resp);
  }

  populateOrderData(order) {
    const { order: orderobj } = order;
    return {
      // Basic information
      id: order.id,
      // "refundedAmount": 3.5,
      subtotal: orderobj?.subtotal?.raw,
      // "subtotalWithoutTax":1007,
      total: orderobj?.total_with_tax?.raw,
      totalWithoutTax: parseFloat(
        orderobj?.total?.raw - order?.tax?.amount?.raw
      ).toFixed(2),
      tax: order?.tax?.amount?.raw,
      // "usdTotal": 2014.97,
      // "giftCardRedemption": 2.23,
      // "totalBeforeGiftCardRedemption": 2.23,
      // "giftCardDoubleSpending": false,
      email: order?.customer?.email,
      customer: order.customer,
      currency: order.currency,
      // "paymentModule": "CUSTOM_PAYMENT_APP-mollie-pg",
      paymentMethod: "Credit or debit card (Mollie)",
      // "tax": 488.48,
      status: getStatusInHumanReadable(order?.meta?.status),
      paymentStatus: order?.status_payment,
      fulfillmentStatus: order?.status_fulfillment,
      orderNumber: order?.customer_reference, // deprecated. Use 'id' instead
      vendorOrderNumber: "XJ12H", // deprecated. Use 'id' instead
      refererUrl: "https://mdemo.ecwid.com/",
      orderComments: "Test order comments",

      customerId: order?.customer?.id,

      // createDate: moment(order?.created),
      createDate: moment(order?.created * 1000).format("DD/MM/YYYY h:mm A"),
      updateDate: "2018-05-31 15:09:35 +0000",
      createTimestamp: new Date(order.created * 1000),
      updateTimestamp: 1527779375,

      // Order items details
      items: orderobj?.line_items?.map((item) => {
        return {
          id: item.id,
          productId: item.product_id,
          name: item.product_name,
          quantity: item.quantity,
          price: item?.price?.raw,
          productPrice: item?.price?.raw - item?.tax?.raw,
          tax: item?.tax?.raw,
          imageUrl: item?.image?.url,
          // smallThumbnailUrl:
          //   'https://ecwid-images-ru.gcdn.co/images/5035009/650638292.jpg',
          taxes: item?.tax_lines,
        };
      }),
      pricesIncludeTax: false,
    };
  }

  getCustomerByEmail(email) {
    return this.fetchApi.get(`/customers?email=${email}&limit=1`);
  }

  // calculateOrderDetails(cart_id, item) {
  //   // return this.fetchApi.post("/order/calculate", {
  //   console.log("inside calculateOrderDetails");
  //   return this.fetchApi.post(`/carts/${cart_id}`, {
  //     id: item.productId,
  //   });
  // }

  convertCartToOrder(cartId) {
    return this.fetchApi.post(`/carts/${cartId}/place`);
  }
}
