import moment from "moment/moment";
import env from "../env";
import _ from "lodash";

import { UPLOAD_FILE_MUTATION_STRING } from "../graphql/mutations/attachment/uploadFile";
import { SERVICE_REQUEST_STATUS_OPTIONS, TaskStatus } from "../constants";
const _get = (obj, path, defaultValue = undefined) => {
  const travel = (regexp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj
      );
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};

const pickupDataFromResponse = (result) => {
  if (!result) return [];

  const data = result.data;
  if (data) {
    const key = Object.keys(data)[0];
    if (data[key].edges && Array.isArray(data[key].edges))
      return data[key].edges.map((obj) => obj.node);
    else return data[key];
  }
};
export const handleDownload = async (response, fileName) => {
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = fileName; // Default filename
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

const downloadFileFromUrl = (fileUrl, fileName) => {
  // const fileUrl = 'https://example.com/path/to/file.pdf';
  fetch(fileUrl)
    .then((response) => response.blob())
    .then((blob) => {
      // Create a temporary anchor element
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);

      // Simulate a click on the anchor element to start the download
      document.body.appendChild(link);
      link.click();

      // Clean up resources
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error downloading the file:", error);
    });
};

const applyPayloadOnState = (state, payload) => {
  Object.entries(payload).forEach(([key, val]) => {
    state[key] = val;
  });
};

const convertDate = (date) =>
  moment(date)
    .set({
      hour: 12,
      minute: 0,
      second: 0,
      millisecond: 0,
    })
    .toDate();

const COLORS = [
  "error",
  "info",
  "warning",
  "success",
  "yellow-500",
  "green-500",
  "red-500",
];
const PRIORITY_COLORS = ["success", "warning", "error", "accent"];
const StatusColorClassMap = {
  IN_PROGRESS: "yellow-500",
  OPEN: "red-400",
  RESOLVED: "green-500",
};
const _getStatusType = (status = "", isClass = false) => {
  status = status.toUpperCase();
  switch (status) {
    case "OPEN":
    case "CANCELLED":
    case "REJECTED":
      return isClass ? COLORS[6] : COLORS[0];
    case "IN_PROGRESS":
    case "IN PROGRESS":
      return isClass ? COLORS[4] : COLORS[2];
    case "RESOLVED":
    case "ACCEPTED":
    case "APPROVED":
    case "COMPLETED":
    case "CLOSED":
      return isClass ? COLORS[5] : COLORS[3];
    default:
      return (
        SERVICE_REQUEST_STATUS_OPTIONS?.find(
          (a) => a?.value?.toLowerCase() == status?.toLowerCase()
        )?.color || "primary"
      );
    //  return isClass ? "primary" : "primary";
  }
};

const _getPriorityType = (priority) => {
  switch (priority?.toLowerCase()) {
    case "low":
      return PRIORITY_COLORS[0];
    case "medium":
      return PRIORITY_COLORS[1];
    case "high":
      return PRIORITY_COLORS[2];
    case "critical":
      return PRIORITY_COLORS[3];
    default:
  }
};

const _openNewTab = async (url) => {
  let windowRef = await window.open();
  windowRef.location.href = `${env.serverURL}/files/${env.appId}/${url}`;
};

const _getServiceThumbnail = (serviceKey) => {
  return `${env.host}/public/images/services/${serviceKey}/thumbnail.jpg`;
};
const mapTaskToTaskIds = (data) => {
  if (!data) {
    return [];
  }
  const node = data?.serviceSubscriptions || data?.societies;
  const taskIds = node.edges?.reduce((acc, obj) => {
    const taskIds =
      obj?.node?.tasks?.edges?.map((obj) => obj?.node?.objectId) || [];
    // console.log('ta',taskIds);
    return [...acc, ...taskIds];
  }, []);
  // console.log('===taskIds',taskIds);
  return taskIds;
};
const gropupByServiceSubscription = (data) => {
  if (!data) {
    return [];
  }
  const obj = _.groupBy(
    data?.serviceSubscriptions?.edges,
    (obj) => obj?.node?.objectId
  );
  let result = Object.keys(obj).reduce((acc, key) => {
    const tasks = obj[key].map((ss) => {
      return ss?.node?.tasks?.edges?.map((a) => {
        return { ...a.node, serviceSubscription: obj[key][0]?.node };
      });
    });
    // console.log('tasks',tasks)
    return [...acc, ...tasks];
  }, []);
  result = result.reduce((acc, d) => {
    if (Array.isArray(d)) {
      return [...acc, ...d];
    }
    return [...acc, d];
  }, []);
  return result;
};
function formatFileSize(size) {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
}
function isImage(urlOrFile) {
  // Extract the file extension if it's a URL or get the extension from a file input
  let fileExtension;
  if (typeof urlOrFile === "string") {
    const urlParts = urlOrFile.split(".");
    fileExtension = urlParts[urlParts.length - 1].toLowerCase();
  } else if (urlOrFile instanceof File) {
    fileExtension = urlOrFile.name.split(".").pop().toLowerCase();
  } else {
    return false; // Neither a URL nor a File
  }

  // List of image file extensions
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];

  // Check if the file extension is in the list of image extensions
  return imageExtensions.includes(fileExtension);
}
async function executeGraphql(query, params) {
  const graphqlURL = env.graphqlURL;
  // const graphqlURL = `http://localhost:${SERVER_PORT || '1337'}/graphql`;
  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Parse-Application-Id": "inspacco-parse-server",
    };
    const sessionToken = window.localStorage.getItem("sessionToken");
    headers["X-Parse-Session-Token"] = sessionToken;

    const getResponse = await fetch(graphqlURL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        query: query,
        variables: params,
      }),
    });
    return await getResponse.json();
  } catch (error) {
    return Promise.reject(error);
  }
}
const blob2file = (blobData) => {
  const fd = new FormData();
  fd.set("image", blobData);
  return fd.get("image");
};
//Here file is input type file
const uploadFileToServer = async (uploadFile) => {
  const file = URL.createObjectURL(uploadFile);
  const res = await fetch(file);
  const blob = await res.blob();
  const blobFile = await blob2file(blob);
  // console.log("params", { file: blobFile });
  const graphqlRes = await executeGraphql(UPLOAD_FILE_MUTATION_STRING, {
    file: blobFile,
  });
  // console.log("graphqlRe", graphqlRes);
  return graphqlRes.data.createFile.fileInfo.name;
};
const getBlobResponseFromFile = async (file) => {
  const selectedFile = URL.createObjectURL(file);
  const res = await fetch(selectedFile);
  const blob = await res.blob();
  return blob;
};

const convertImgToDataURI = async (url) => {
  let blob = await fetch(url).then((r) => r.blob());
  let dataUrl = await new Promise((resolve) => {
    let reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
  return dataUrl;
};

const getFileUrl = (fileUrl) => {
  let { serverURL, appId } = env;
  return `${serverURL}/files/${appId}/${fileUrl}`;
};
function splitProperCase(input) {
  const match = input.match(/[a-z]+|[A-Z][a-z]*/g);
  if (match) return match;
  return [input]; // If no split is found, return the original word
}

const populateNestedRecords = (records = [], source) => {
  console.log("====> populateNestedRecords", records, source);
  if (source === "task") {
    // console.log()
    return (
      records
        ?.filter((obj) => !obj?.node?.task?.parentTask?.objectId)
        .map((obj) => {
          const taskId = obj?.node?.task?.objectId;
          return {
            node: {
              ...obj.node,
              subItems: records
                ?.filter((o) => o?.node?.task?.parentTask?.objectId === taskId)
                .map((a) => {
                  return {
                    node: {
                      ...a.node,
                      serviceSubscription: obj.node?.serviceSubscription,
                    },
                  };
                }),
            },
          };
        }) || []
    );
  }
  return records;
};
const _getCorePropsFromNode = (node, source) => {
  // if (isEmpty(activeCardDetails)) return {};
  switch (source) {
    case "task":
      let serviceName = node?.serviceSubscription?.service?.name || null;
      return {
        name: `${node?.task?.summary} ${serviceName ? `(${serviceName})` : ""}`,
        // date: new Date(node.taskDate).toLocaleDateString(),
        // location: node?.serviceSubscription?.society?.name,
        status: TaskStatus[node.taskStatus],
        requester: node?.createdBy,
        assignedTo: node?.task?.assignedTo,
        category: node?.task?.category,
        priority: node?.task?.parentTask?.objectId ? "SubTask" : "",
      };
    case "sr":
      const parsedRequirementObj =
        getRequirementDataAsPlainObject(node?.requirement) || {};
      return {
        name:
          `#${node?.displayId} - ` +
          node?.service?.name +
          (node?.subService ? ` - ${node?.subService}` : ""),
        date: moment(node.createdAt).format("DD MMM YYYY  h:mm A"),
        location: node?.society?.name,
        category: SERVICE_REQUEST_STATUS_OPTIONS?.find(
          (a) => a.value === node?.status
        )?.label,
        status: SERVICE_REQUEST_STATUS_OPTIONS?.find(
          (a) => a.value === node?.status
        )?.status,
        priority: node?.priority,
        helperSubText: parsedRequirementObj["Facility Name"],
        helperText: parsedRequirementObj["Reference Number(External)"],
      };
    case "attendance":
      return {
        name: node?.service?.name,
        status: node.status,
        serviceStaffs: node.serviceStaffsData,
        markedAttendance: node.markedAttendanceData,
      };
    case "complaints":
      return {
        name: `#${node.displayId} - ${node.summary}`,
        date: moment(node.createdAt).format("DD MMM YYYY"),
        status: node.status,
        priority: node.priority,
        requester: node.createdBy,
        // location: node.serviceSubscription?.society?.name,
        category: node.category,
        assignedTo: node?.assignee,
      };
    default:
      return {
        name: node.name,
        date: moment(node.createdAt).format("DD MMM YYYY"),
        status: node.status,
      };
  }
};
const getActiveServicesOptions = (activeServices) => {
  return activeServices?.map((serviceSubscription) => {
    return {
      label: serviceSubscription?.service?.name,
      value: serviceSubscription?.objectId,
      service: serviceSubscription?.service,
      society: serviceSubscription?.society,
      partner: serviceSubscription?.partner,
    };
  });
};

const _getArr = (len) => new Array(len).fill(null);

const _isEmpty = (obj) =>
  [Object, Array].includes((obj || {}).constructor) &&
  !Object.entries(obj || {}).length;

const getSocietyDetails = (roleName) => {
  const [activeRole, activeAccountId] = roleName.split("__");
  return { activeAccountId, activeRole };
};
const populateRoleResponse = function (rolesResponse) {
  const roles = pickupDataFromResponse(rolesResponse) || [];
  let rolesInfo = roles?.map((role) => getSocietyDetails(role.name));
  return rolesInfo.filter((obj) => obj.activeRole.startsWith("SOCIETY"));
};
const isDateExpired = (date) => {
  return moment(date).isBefore(new Date());
};
function splitArray(array, parts) {
  const result = [];
  const length = array.length;
  const chunkSize = Math.ceil(length / parts);

  for (let i = 0; i < length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }

  return result;
}

const _textSearch = ({ filterStr, data, filters = [] }) => {
  if (!filters.length) filters = Object.keys(data[0]);
  return data?.filter((node) =>
    filters
      .filter(
        (filterName) =>
          filterName !== "__typename" &&
          ["string", "number"].includes(typeof node[filterName])
      )
      .some((filterName) =>
        `${node[filterName]}`.toLowerCase().includes(filterStr.toLowerCase())
      )
  );
};

function _createServiceRequestSubqueryObj(formData) {
  let subQuery = {};

  Object.keys(formData).forEach((key) => {
    if (!formData[key]) return null;
    if (key === "dateRange") {
      subQuery["AND"] = [
        {
          createdAt: {
            greaterThanOrEqualTo: moment(formData?.dateRange.startDate).startOf(
              "day"
            ),
          },
        },
        {
          createdAt: {
            lessThanOrEqualTo: moment(formData?.dateRange.endDate).endOf("day"),
          },
        },
      ];
    } else if (["client", "service", "requester"].includes(key)) {
      if (key === "client" && formData[key]?.value) {
        subQuery = {
          ...subQuery,
          society: {
            have: {
              objectId: Array.isArray(formData[key].value)
                ? { in: formData[key].value }
                : { equalTo: formData[key].value },
            },
          },
        };
      } else if (key === "service" || key === "requester") {
        subQuery = {
          ...subQuery,
          [key]: { have: { objectId: { equalTo: formData[key]?.value } } },
        };
      }
    } else if (Array.isArray(formData[key])) {
      if (key == "parentStatus") {
        const valArr = formData[key].map(({ value }) => value);
        const childStatus = formData[key].length
          ? SERVICE_REQUEST_STATUS_OPTIONS?.filter(({ status }) =>
              valArr.includes(status)
            )
          : SERVICE_REQUEST_STATUS_OPTIONS;
        subQuery["status"] = { in: childStatus?.map(({ value }) => value) };
      } else {
        if (formData[key].length) {
          subQuery[key] = {
            in: formData[key].map((v) => v?.value || v),
          };
        }
      }
    } else if (key === "displayId") {
      subQuery[key] = { equalTo: parseInt(formData[key]) };
    } else {
      subQuery[key] = formData[key]?.value && { equalTo: formData[key]?.value };
    }
  });
  return subQuery;
}
function fetchBankDetails(ifscode, clientName) {
  if (
    clientName?.toLowerCase().includes("idfc") &&
    !ifscode?.startsWith("IDFB")
  ) {
    ifscode = `IDFB00${ifscode}`;
  }
  if (
    clientName?.toLowerCase().includes("dbs") &&
    !ifscode?.startsWith("DBS")
  ) {
    ifscode = `DBSS0IN${ifscode?.padStart(4, "0")}`;
  }

  return fetch(`https://ifsc.razorpay.com/${ifscode}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("json==", data);
      if (typeof data == "object") {
        return data;
      }
      throw new Error("Something Went Wrong");
    });
}
function findMatchingWords(str1, str2) {
  // Split the strings into arrays of words
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);

  // Initialize an empty array to store matching words
  const matchingWords = [];

  // Iterate through each word in words1
  for (let i = 0; i < words1.length; i++) {
    const word = words1[i];
    // Check if the word exists in words2 and is not already in matchingWords
    if (words2.includes(word) && !matchingWords.includes(word)) {
      matchingWords.push(word);
    }
  }

  // Return the array of matching words
  return matchingWords;
}
function extractPincode(address) {
  // Regular expression to match a 6-digit pincode surrounded by space or special characters
  var regex = /(?:^|\D)(\d{6})(?:\D|$)/;
  var match = address.match(regex);
  if (match && match[1]) {
    return match[1];
  } else {
    return ""; // If pincode is not found, return null
  }
}
function msToDays(ms) {
  return parseFloat((ms / 3600000 / 24).toFixed(1));
}
function msToHumanReadable(ms) {
  // Define time units in milliseconds
  const msPerSecond = 1000;
  const msPerMinute = msPerSecond * 60;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;

  // Calculate the time components
  const days = Math.floor(ms / msPerDay);
  const hours = Math.floor((ms % msPerDay) / msPerHour);
  const minutes = Math.floor((ms % msPerHour) / msPerMinute);
  const seconds = Math.floor((ms % msPerMinute) / msPerSecond);

  // Format the output
  const parts = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  // if (seconds > 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);

  return parts.length > 0 ? parts.join(", ") : "0 seconds";
}

// Example usage
const humanReadableTime = msToHumanReadable(987654321);
console.log(humanReadableTime);

function getHumanReadableDateTime(date) {
  if (!date) return "N/A";
  return moment(date).format("DD MMM YYYY hh:mm A");
}
function getHumanReadableDate(date) {
  if (!date) return "N/A";
  return moment(date).format("DD MMM YYYY");
}

const _calculatePercentage = (amt, percent) =>
  Number(amt) ? ((Number(amt) / 100) * Number(percent)).toFixed(2) : 0;

function getRequirementDataAsPlainObject(requirement = "") {
  try {
    let requirementData = JSON.parse(requirement)?.filter(
      (obj) => !_isEmpty(obj)
    );
    const plainOBj = {};
    requirementData?.forEach(({ fields = [] }) => {
      (fields || []).forEach(({ label, value }) => {
        plainOBj[label] = value;
      });
    });
    return plainOBj;
  } catch (e) {
    console.log("e", e);
    return {};
  }
}
function searchInObject(obj, searchTerm) {
  console.log("searchInObject", obj);
  if (!obj || !searchTerm) {
    return false;
  }
  const keys = Object.keys(obj);
  return keys.some((key) => {
    if (typeof obj[key] === "object") {
      return searchInObject(obj[key], searchTerm);
    }
    return obj[key]
      ?.toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });
}
function removeTimezoneOffsetFromDate(date) {
  // Get the current timezone offset in minutes
  const currentOffsetInMinutes = new Date().getTimezoneOffset();

  // Convert the current offset to milliseconds
  const currentOffsetInMilliseconds = currentOffsetInMinutes * 60 * 1000;

  // Convert the date to milliseconds
  const dateInMilliseconds = date.getTime();

  // Subtract the current offset from the date
  const dateWithoutOffsetInMilliseconds =
    dateInMilliseconds + currentOffsetInMilliseconds;

  // Create a new Date object with the adjusted time
  const dateWithoutOffset = new Date(dateWithoutOffsetInMilliseconds);

  return dateWithoutOffset;
}
async function getPincodeInfo(pincode) {
  try {
    console.log(`calling getPincodeInfo ${pincode}`);
    const pincodeRes = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    ).then((response) => response.json());
    // console.log(typeof pincodeRes);
    const { Status, PostOffice = [] } = pincodeRes?.[0] || {};
    if (Status === "Success") {
      if (PostOffice?.length) {
        return PostOffice[0];
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (e) {
    console.log("err", e);
  }
}

const downloadFileFromContent = (content, type = 'text/csv', filename) => {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function fn() { }
export {
  _get,
  _isEmpty,
  _getArr,
  _getServiceThumbnail,
  _getStatusType,
  _getPriorityType,
  _openNewTab,
  _getCorePropsFromNode,
  pickupDataFromResponse,
  applyPayloadOnState,
  downloadFileFromUrl,
  convertDate,
  mapTaskToTaskIds,
  gropupByServiceSubscription,
  isImage,
  formatFileSize,
  uploadFileToServer,
  executeGraphql,
  getBlobResponseFromFile,
  getFileUrl,
  convertImgToDataURI,
  splitProperCase,
  populateNestedRecords,
  getActiveServicesOptions,
  populateRoleResponse,
  isDateExpired,
  splitArray,
  fn,
  _textSearch,
  _createServiceRequestSubqueryObj,
  fetchBankDetails,
  findMatchingWords,
  extractPincode,
  getHumanReadableDateTime,
  getHumanReadableDate,
  getRequirementDataAsPlainObject,
  searchInObject,
  removeTimezoneOffsetFromDate,
  getPincodeInfo,
  msToHumanReadable,
  msToDays,
  _calculatePercentage,
  downloadFileFromContent,
};
