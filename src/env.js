const PROD = "https://api.inspacco.com";
const STAGE = "https://api-stage.inspacco.com";
const DEV = "http://api-dev.inspacco.com";
// const LOCAL_HOST = 'http://localhost:1337';
// For expo mobile replace localhost to your ip address.
const LOCAL_HOST = "http://192.168.1.7:1337";
const appId = "inspacco-parse-server";
const cartApiInstance = "ecw";
const environments = {
  dev: {
    host: DEV,
    serverURL: `${DEV}/parse`,
    graphqlURL: `${DEV}/graphql`,
    appId,
    cartApiInstance,
  },
  staging: {
    host: STAGE,
    serverURL: `${STAGE}/parse`,
    graphqlURL: `${STAGE}/graphql`,
    appId,
    cartApiInstance,
  },
  prod: {
    host: PROD,
    serverURL: `${PROD}/parse`,
    graphqlURL: `${PROD}/graphql`,
    appId,
    cartApiInstance,
  },
  local: {
    host: LOCAL_HOST,
    serverURL: `${LOCAL_HOST}/parse`,
    graphqlURL: `${LOCAL_HOST}/graphql`,
    appId,
    cartApiInstance,
  },
};
const apiEnv =
  window.location.hostname === "portal.inspacco.com"
    ? environments.prod
    : environments.staging;
export default apiEnv;
