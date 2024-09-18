import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";
import { RetryLink } from "@apollo/client/link/retry";
import errorHandlingLink from './errorHandlingLink';

import enviornment from "./env";
import store from "./store";

const uploadLink = createUploadLink({
  uri: enviornment.graphqlURL,
  // credentials: "include" // set this to 'include' to include cookies in the request
});

const authLink = setContext((_, { headers }) => {
  let { sessionToken } = store.getState().authSlice;
  console.log("store.getState()", store.getState().authSlice);
  if (!sessionToken) sessionToken = "";
  const authHeaders = { "X-Parse-Application-Id": "inspacco-parse-server"}
  if(sessionToken){
    authHeaders['X-Parse-Session-Token'] = sessionToken;
  }

  // add authorization headers here if needed
  return {
    headers: {
      ...headers,
      ...authHeaders
    },
  };
});

const retryLink = new RetryLink({
  attempts: {
    max: 5,
    retryIf: (error, _operation) => {
      // retry if the server returns a 5xx error
      return !!error && error.status >= 500 && error.status < 600;
    },
  },
});

const client = new ApolloClient({
    link: errorHandlingLink.concat(retryLink.concat(authLink.concat(uploadLink))),
  cache: new InMemoryCache(),
});

export default client;
