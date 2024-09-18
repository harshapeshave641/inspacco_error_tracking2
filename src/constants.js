export const ROLES = {
  ROOT: "ROOT",
  INSPACCO_ADMIN: "INSPACCO_ADMIN",
  INSPACCO_CDA: "INSPACCO_CDA",
  INSPACCO_KAM: "INSPACCO_KAM",
  SOCIETY_ADMIN: "SOCIETY_ADMIN",
  SOCIETY_MANAGER: "SOCIETY_MANAGER",
  PARTNER_ADMIN: "PARTNER_ADMIN",
};

export const ROLES_PRIORITY = {
  ROOT: 1,
  INSPACCO_ADMIN: 2,
  INSPACCO_CDA: 3,
  INSPACCO_KAM: 4,
  SOCIETY_ADMIN: 5,
  SOCIETY_MANAGER: 6,
  PARTNER_ADMIN: 7,
};

export const IncidentCategory = {
  SERVICE_QUALITY: "Service Quality",
  ATTENDANCE: "Attendance",
  PAYMENT: "Payment",
  OTHER: "Other",
};

export const IncidentStatus = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
};

export const TaskStatus = {
  OPEN: "OPEN",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};
export const IncidentPiority = {
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
  CRITICAL: "CRITICAL",
};

export const IncidentAssignedGroup = {
  INSPACCO: "INSPACCO",
  PARTNER: "PARTNER",
  SOCIETY: "SOCIETY",
};

export const SERVICE_QUOTATION_STATUS = [
  { label: "Open", value: "OPEN" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Deleted", value: "DELETED" },
];

export const SERVICE_REQUEST_ATTACHMENT_TYPES = [
  { label: "Request Attachments", value: "SERVICE_REQUEST_CREATION_ATTACHMENT", permissionGroupIdPrefix: 'INSPACC_ADMIN_' },
  { label: "Quotation Attachments", value: "InspaccoAdmin", permissionGroupIdPrefix: 'INSPACC_ADMIN_' },
  { label: "Completion Attachments", value: "SERVICE_REQUEST_RESOLUTION_ATTACHMENT", permissionGroupIdPrefix: 'INSPACC_ADMIN_' },
  { label: "Client PO Attachments", value: "SERVICE_REQUEST_PO_ATTACHMENT", permissionGroupIdPrefix: 'INSPACC_ADMIN_' },
  { label: "Other Attachments", value: "SERVICE_REQUEST_OTHER_ATTACHMENT", permissionGroupIdPrefix: 'INSPACC_ADMIN_' },
]
export const SERVICE_REQUEST_STATUS_OPTIONS = [
  {
    label: "To Be Worked Upon",
    value: "TO_BE_WORKED_UPON",
    color: "red-500",
    status: "Open",
  },
  {
    label: "Site Address Not Available",
    value: "SITE_ADDRESS_NOT_AVAILABLE",
    color: "red-500",
    status: "Open",
  },
  {
    label: "Ordered Service Not In Scope",
    value: "ORDERED_SERVICE_NOT_IN_SCOPE",
    color: "blue-500",
    status: "Closed",
  },
  {
    label: "Repeated Order",
    value: "REPEATED_ORDER",
    color: "blue-500",
    status: "Closed",
  },
  {
    label: "Site POC Not Responding",
    value: "SITE_POC_NOT_RESPONDING",
    color: "red-500",
    status: "Open",
  },
  {
    label: "Work Already Closed",
    value: "WORK_ALREADY_CLOSED",
    color: "blue-500",
    status: "Closed",
  },
  {
    label: "Visit Scheduled",
    value: "VISIT_SCHEDULED",
    color: "red-500",
    status: "Open",
  },
  {
    label: "Visit Rescheduled",
    value: "VISIT_RESCHEDULED",
    color: "red-500",
    status: "Open",
  },
  {
    label: "Visit Done, Client Asked To Wait",
    value: "VISIT_DONE_CLIENT_ASKED_TO_WAIT",
    color: "yellow-500",
    status: "Open",
  },
  {
    label: "Visit Done, Quotation Pending",
    value: "VISIT_DONE_QUOTATION_PENDING",
    color: "green-500",
    status: "Open",
  },
  {
    label: "Quotation Approval Pending",
    value: "QUOTATION_APPROVAL_PENDING",
    color: "yellow-200",
    status: "In Progress",
  },
  {
    label: "Revised Quotation Pending",
    value: "REVISED_QUOTATION_PENDING",
    color: "yellow-200",
    status: "In Progress",
  },
  {
    label: "Quotation Approved",
    value: "QUOTATION_APPROVED",
    color: "yellow-500",
    status: "In Progress",
  },
  {
    label: "Order On Hold",
    value: "ORDER_ON_HOLD",
    color: "yellow-500",
    status: "In Progress",
  },
  {
    label: "Order Lost",
    value: "ORDER_LOST",
    color: "blue-200",
    status: "Closed",
  },
  {
    label: "Work Done, Invoice Pending",
    value: "WORK_DONE_INVOICE_PENDING",
    color: "green-500",
    status: "Completed",
  },
  {
    label: "Invoice Attached, Payment Pending",
    value: "INVOICE_ATTACHED_PAYMENT_PENDING",
    color: "green-500",
    status: "Completed",
  },
  {
    label: "Payment Received",
    value: "PAYMENT_RECEIVED",
    color: "green-500",
    status: "Completed",
  },
];
export const SERVICE_REQUEST_STATUS_OPTIONS_OLD = [
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Closed", value: "CLOSED" },
  { label: "Client Call Done", value: "CLIENT_CALL_DONE" },
  { label: "Call Not Recived", value: "CALL_NOT_RECIVED" },
  { label: "Meeting Done", value: "MEETING_DONE" },
  { label: "Quotation Sent", value: "QUOTATION_SENT" },
  { label: "Quotation Approved", value: "QUOTE_APPROVED" },
  { label: "Revised Quotation Pending", value: "REVISED_QUOTATION_PENDING" },
  { label: "On Hold", value: "ON_HOLD" },
  { label: "Lost", value: "LOST" },
];
export const SERVICE_REQUEST_PARENT_STATUS_COLORS = {
  Open: "#fbbf24",
  Completed: "#84cc16",
  "In Progress": "#2563eb",
};
// ["#84cc16", "#fbbf24", "#2563eb", "#ef4444"]
export const INCIDENT_STATUS_OPTIONS = [
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
];

export const taskStatusOptions = Object.keys(TaskStatus).map((key) => {
  return {
    label: TaskStatus[key],
    value: key,
  };
});
export const getStatusOptions = (itemType = "task", isAdmin = true) => {
  if (itemType === "task") {
    return taskStatusOptions;
  }
  if (itemType === "complaints") {
    return INCIDENT_STATUS_OPTIONS;
  }
  return isAdmin
    ? SERVICE_REQUEST_STATUS_OPTIONS
    : SERVICE_REQUEST_STATUS_OPTIONS?.filter((a) =>
      [
        "REVISED_QUOTATION_PENDING",
        "QUOTATION_APPROVED",
        "ORDER_ON_HOLD",
        "ORDER_LOST",
      ].includes(a?.value)
    );
};

export const INR_CURRENCY = "₹";
export const PAGE_LIMIT = 100;

export const LANGAGUE_OPTIONS = [
  { label: "-- Select --", value: "" },
  { label: "English", value: "en" }, // Hindi
  { label: "हिंदी", value: "hi" }, // Hindi
  { label: "বাংলা", value: "bn" }, // Bengali
  { label: "தமிழ்", value: "ta" }, // Tamil
  { label: "ગુજરાતી", value: "gu" }, // Gujarati
  { label: "ಕನ್ನಡ", value: "kn" }, // Kannada
  { label: "മലയാളം", value: "ml" }, // Malayalam
  { label: "ਪੰਜਾਬੀ", value: "pa" }, // Punjabi
  { label: "ଓଡ଼ିଆ", value: "or" }, // Odia
  { label: "اردو", value: "ur" }, // Urdu
];
export const PARTNER_STATUS_OPTIONS = [
  {
    label: "-- Select --",
    value: "",
  },
  {
    label: "Active",
    value: "Active",
  },
  {
    label: "Inactive",
    value: "Inactive",
  },
  {
    label: "Onboarded",
    value: "Onboarded",
  },
  {
    label: "Not onboarded",
    value: "Notonboarded",
  },
  {
    label: "Wrong Number",
    value: "Wrong Number",
  },
  {
    label: "DNP",
    value: "DNP",
  },
  {
    label: "Not Interested",
    value: "Not Interested",
  },
  {
    label: "Other",
    value: "Other",
  },
];

export const PARTNER_RATING_PARAMS = [
  "Service Rates",
  "Quality of Work",
  "Response Time",
  "Punctuality",
  "Honesty",
];
export const getValueFromSelectValue = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => {
      return typeof item == "object" ? item?.value : item;
    });
  } else if (typeof obj === "object") {
    return obj?.value;
  }
  return obj;
};
export const priorityOptions = [
  { label: "Low", value: IncidentPiority.LOW },
  { label: "Medium", value: IncidentPiority.MEDIUM },
  { label: "High", value: IncidentPiority.HIGH },
  { label: "Critical", value: IncidentPiority.CRITICAL },
];
export const serviceSubServices = [
  {
    name: "PLUMBING",
    subServices: [
      { name: "Tap", priority: "MEDIUM" },
      { name: "Health Faucet", priority: "HIGH" },
      { name: "Flush Tank", priority: "HIGH" },
      { name: "Drain blockage", priority: "CRITICAL" },
      { name: "Water Inlet blockage", priority: "CRITICAL" },
      { name: "Water Leakage", priority: "CRITICAL" },
      { name: "Others", priority: "LOW" },
    ],
  },
  {
    name: "CARPENTRY",
    subServices: [
      { name: "Drawers / Channels", priority: "HIGH" },
      { name: "Locks", priority: "HIGH" },
      { name: "Handles", priority: "MEDIUM" },
      { name: "Laminates", priority: "LOW" },
      { name: "Door Stoppers", priority: "LOW" },
      { name: "Partitions", priority: "LOW" },
      { name: "Glass", priority: "MEDIUM" },
      { name: "Doors", priority: "MEDIUM" },
      { name: "Main Door", priority: "HIGH" },
      { name: "Shutters", priority: "MEDIUM" },
      { name: "Others", priority: "LOW" },
    ],
  },
  {
    name: "CIVIL",
    subServices: [
      { name: "Painting", priority: "LOW" },
      { name: "Ramp works", priority: "LOW" },
      { name: "Wall Plastering", priority: "LOW" },
      { name: "Tiles", priority: "LOW" },
      { name: "Roofing / Shed", priority: "LOW" },
      { name: "Partitions (Brick)", priority: "LOW" },
      { name: "Others", priority: "LOW" },
    ],
  },
  {
    name: "ELECTRICAL",
    subServices: [
      { name: "Lights", priority: "MEDIUM" },
      { name: "Fans", priority: "MEDIUM" },
      { name: "Power Sockets", priority: "HIGH" },
      { name: "Main Incomer", priority: "CRITICAL" },
      { name: "Electrical Faults", priority: "CRITICAL" },
      { name: "Others", priority: "LOW" },
    ],
  },
  {
    name: "OTHER ASSETS",
    subServices: [
      { name: "AC", priority: "MEDIUM" },
      { name: "Water Dispenser", priority: "LOW" },
      { name: "Water Purifiers / RO", priority: "MEDIUM" },
      { name: "Other Banking Assets (UV Scanner)", priority: "LOW" },
      { name: "Inverters", priority: "HIGH" },
      { name: "UPS", priority: "CRITICAL" },
      { name: "DG", priority: "CRITICAL" },
    ],
  },
];

export const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
export const ClientFacilityFieldMapping = {
  "Name": 'name',
  "Unique Code": 'uniqueCode',
  "Address": "address",
  "Pincode": "pincode",
  "City": "city",
  "State": "state",
  "Region": "region",
  "POC Mobile Number": "POCMobileNumber",
  "POC Name": "POCName",
  "POC Email": "POCEmail"
}
export const CLIENT_SETTING_LIST = [{
  label: "Service Request",
  type: "SEPERATOR",
},{
  label:'Unique Source Data',
  name:'UNIQUE_SOURCE_DATA',
  section:'ServiceRequest',
  description:'Use Unique Code data from Client Facility data',
  type:'SELECT',
  native:true,
  options:['CLIENT_FACILITY','IFSC_API']
},
{
  label: "Quotation",
  type: "SEPERATOR",
},{
  label:'Show Management Fee and Discount in Quotation',
  name:'SHOW_MANAGEMENT_FEE_AND_DISCOUNT',
  section:'Quotation',
  description:'Show Management Fee and Discount in Quotation',
  type:'BOOLEAN'
},
{
  name:'SHOW_GRAND_TOTAL_INCLUDING_TAXES',
  label:'Show Grand Total (including TAXES)',
  section:'Quotation',
  description:'Show Grand Total (INCLUDING TAXES)',
  type:'BOOLEAN'
},{
  name:'IS_INSPACCO_QUOTATION_PROVIDER',
  label:'Inspacco Quotation Provider',
  section:'Quotation',
  description:'Quotation From Inspacco',
  type:'BOOLEAN'
},{
  name:'IS_CONTRACTUAL_VS_NON_CONTRACTUAL_RATE_OPTION',
  label:'Contractual Vs Non Contractual Column',
  section:'Quotation',
  description:'Quotation From Inspacco',
  type:'BOOLEAN'
}]