import React, { Suspense, lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { FallbackUI } from "../common/ErrorBoundary";

import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import AdminNavbar from "../Admin/Navbar";
import AdminHome from "../../pages/Admin/Home";
import SideDrawer from "../common/SideDrawer";
import AdminSidebar from "../Admin/Sidebar";
import { fn, pickupDataFromResponse } from "../../helpers/utils";
import AdminComplaints from "../../pages/Admin/Complaints";
import { GET_ALL_SERVICES } from "../../graphql/queries/service";
import { useQuery } from "@apollo/client";

import { storeAllClients, storeAllServices } from "../../slice/authSlice";
import {
  GET_SOCIETIES,
  getSocietyMemberSubquery,
} from "../../graphql/queries/getSocieties";
import { ROLES } from "../../constants";
// import AdminComplpeaints from "../../pages/Admin/Complaints";

const Home = lazy(() => import("../../pages/Home"));
const Login = lazy(() => import("../../pages/Login"));
const RegisterSociety = lazy(() => import("../../pages/RegisterSociety"));
const Reports = lazy(() => import("../../pages/Reports"));
const Services = lazy(() => import("../../pages/Services"));
const AdminServiceRequests = lazy(() =>
  import("../../pages/Admin/ServiceRequests")
);
const AdminServices = lazy(() => import("../../pages/Admin/Services"));
const AccessManagement = lazy(() =>
  import("../../pages/Admin/AccessManagement")
);
const AdminPartners = lazy(() => import("../../pages/Admin/Partners"));
const AdminClients = lazy(() => import("../../pages/Admin/Clients"));
const Complaints = lazy(() => import("../../pages/Complaints"));
const ServiceRequests = lazy(() => import("../../pages/ServiceRequests"));
const Tasks = lazy(() => import("../../pages/Tasks"));
const Attendance = lazy(() => import("../../pages/Attendance"));
const Vendors = lazy(() => import("../../pages/Vendors"));
const RightSideDrawer = lazy(() => import("../common/RightSideDrawer"));
const Catalog = lazy(() => import("../../pages/Catalog"));
const Employees = lazy(() => import("../../pages/Employees"));
const Dashboard = lazy(() => import("../../pages/Dashboard"));

const commonRoutes = [
  {
    path: "/login",
    name: "Login",
    element: <Login />,
  },
  {
    path: "/register",
    name: "Register",
    element: <Login />,
  },
  {
    path: "/register-society",
    name: "Register Society",
    element: <RegisterSociety />,
  },
  {
    path: "*",
    name: "Not Found",
    element: <FallbackUI />,
  },
];

const routes = [
  {
    path: "/",
    name: "Dashboard",
    element: <Dashboard />,
    isPrivate: true,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    element: <Dashboard />,
    isPrivate: true,
  },
  {
    path: "/reports",
    name: "Reports",
    element: <Reports />,
    isPrivate: true,
  },
  {
    path: "/service-requests",
    name: "Service Requests",
    element: <AdminServiceRequests />,
    isPrivate: true,
  },
  {
    path: "/tasks",
    name: "Tasks",
    element: <Tasks />,
    isPrivate: true,
  },
  {
    path: "/attendance",
    name: "Attendance",
    element: <Attendance />,
    isPrivate: true,
  },
  {
    path: "/complaints",
    name: "Complaints",
    element: <Complaints />,
    isPrivate: true,
  },
  {
    path: "/services",
    name: "Services",
    element: <Services />,
    isPrivate: true,
  },
  {
    path: "/vendors",
    name: "Vendors",
    element: <Vendors />,
    isPrivate: true,
  },
  {
    path: "/catalog",
    name: "Catalog",
    element: <Catalog />,
    isPrivate: true,
  },
  {
    path: "/employee-management",
    name: "Employee Management",
    element: <Employees />,
    isPrivate: true,
  },
  ...commonRoutes,
];

const adminRoutes = [
  {
    path: "/",
    name: "Admin Portal Home",
    element: <Dashboard />,
    isPrivate: true,
  },
  {
    path: "/admin/reports",
    name: "Reports",
    element: <Reports />,
    isPrivate: true,
  },
  {
    path: "/admin/services",
    name: "Services",
    element: <AdminServices />,
    isPrivate: true,
  },
  {
    label: "Clients",
    path: "/admin/clients",
    isPrivate: true,
    element: <AdminClients />,
  },
  {
    label: "Partners",
    path: "/admin/partners",
    isPrivate: true,
    element: <AdminPartners />,
  },
  {
    label: "Complaints",
    path: "/admin/complaints",
    isPrivate: true,
    element: <AdminComplaints />,
  },
  {
    label: "Service Requests",
    path: "/admin/service-requests",
    isPrivate: true,
    element: <AdminServiceRequests />,
  },
  {
    label: "Access Management",
    path: "/admin/access-management",
    isPrivate: true,
    element: <AccessManagement />,
  },
  {
    label: "Redeem Requests",
    path: "/admin/redeem-requests",
    isPrivate: true,
    element: <>Redeem Requests</>,
  },
  {
    label: "Notifications",
    path: "/admin/notifications",
    isPrivate: true,
    element: <>Notifications</>,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    isPrivate: true,
    element: <>Orders</>,
  },
  ...commonRoutes,
];

function UserRouteHOC({ element, path, index }) {
  return (
    <>
      <Navbar />
      <div className="flex transition-all duration-300">
        <Sidebar />
        <div className="w-full overflow-x-hidden overflow-y-scroll bg-base-200 h-content">
          {element}
        </div>
      </div>
      <RightSideDrawer />
    </>
  );
}

function AdminRouteHOC({ element, path, index }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [path]);

  return (
    <div>
      <AdminNavbar toggleDrawer={() => setIsOpen(!isOpen)} />
      <div className="flex transition-all duration-300">
        <div className="w-full pt-2 pb-2 pl-2 overflow-x-hidden overflow-y-scroll bg-base-200 h-content">
          {element}
        </div>
      </div>
      <SideDrawer
        isOpen={isOpen}
        setIsOpen={() => setIsOpen(!isOpen)}
        width="w-60"
        placement="left"
      >
        <AdminSidebar onChange={fn} />
      </SideDrawer>
    </div>
  );
}

function PrivateRoute({ children }) {
  const { isAuthenticated, roles } = useSelector((state) => state.authSlice);

  return isAuthenticated && roles.length ? (
    <>{children}</>
  ) : (
    <Navigate
      to={`${
        isAuthenticated && !roles.length ? "/register-society" : "/login"
      }`}
    />
  );
}

const Loading = () => {
  return (
    <div className="fixed h-full">
      <div className="flex items-center justify-center w-screen h-full opacity-70 bg-blur-md">
        Loading...
      </div>
    </div>
  );
};

// const Loading = () => {
//   return (
//     <div className="fixed h-full">
//       <div className="flex items-center justify-center w-screen h-full opacity-70 bg-blur-md">
//         Loading...
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
//           <rect fill="#FFFFFF" width="100%" height="100%" />
//           <radialGradient
//             id="a11"
//             cx=".66"
//             fx=".66"
//             cy=".3125"
//             fy=".3125"
//             gradientTransform="scale(1.5)"
//           >
//             <stop offset="0" stop-color="#7CA2BF"></stop>
//             <stop offset=".3" stop-color="#7CA2BF" stop-opacity=".9"></stop>
//             <stop offset=".6" stop-color="#7CA2BF" stop-opacity=".6"></stop>
//             <stop offset=".8" stop-color="#7CA2BF" stop-opacity=".3"></stop>
//             <stop offset="1" stop-color="#7CA2BF" stop-opacity="0"></stop>
//           </radialGradient>
//           <circle
//             transform-origin="center"
//             fill="none"
//             stroke="url(#a11)"
//             stroke-width="12"
//             stroke-linecap="round"
//             stroke-dasharray="200 1000"
//             stroke-dashoffset="0"
//             cx="100"
//             cy="100"
//             r="70"
//           >
//             <animateTransform
//               type="rotate"
//               attributeName="transform"
//               calcMode="spline"
//               dur="2"
//               values="360;0"
//               keyTimes="0;1"
//               keySplines="0 0 1 1"
//               repeatCount="indefinite"
//             ></animateTransform>
//           </circle>
//           <circle
//             transform-origin="center"
//             fill="none"
//             opacity=".2"
//             stroke="#7CA2BF"
//             stroke-width="12"
//             stroke-linecap="round"
//             cx="100"
//             cy="100"
//             r="70"
//           ></circle>
//         </svg>
//       </div>
//     </div>
//   );
// };

export default function Layout() {
  const { isAuthenticated, roles, activeRole, user } = useSelector(
    (state) => state.authSlice
  );

  const dispatch = useDispatch();

  const servicesResp = useQuery(GET_ALL_SERVICES, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    skip: !isAuthenticated,
    onCompleted: (data) => {
      const servicesData = pickupDataFromResponse({ data });
      dispatch(storeAllServices({ services: servicesData }));
    },
  });

  // const clientsResp = useQuery(GET_SOCIETIES, {
  //   notifyOnNetworkStatusChange: true,
  //   fetchPolicy: "network-only",
  //   skip: !isAuthenticated,
  //   onCompleted: (data) => {
  //     const clientsData = pickupDataFromResponse({ data });
  //     dispatch(storeAllClients({ clients: clientsData }));
  //   },
  // });
  const clientResp = useQuery(GET_SOCIETIES, {
    skip: !isAuthenticated,
    onCompleted: (data) => {
      // console.log('def societyRes',data)
      const clientsData = pickupDataFromResponse({ data });
      dispatch(storeAllClients({ clients: clientsData }));
    },
    variables: {
      memberSubquery:
        activeRole === ROLES.INSPACCO_KAM
          ? getSocietyMemberSubquery(user?.objectId, activeRole)
          : activeRole === ROLES.INSPACCO_CDA
          ? getSocietyMemberSubquery(user?.objectId, activeRole)
          : {},
    },
  });

  return (
    <div>
      <Suspense fallback={<Loading />}>
        {activeRole === "INSPACCO_ADMIN" || activeRole == "INSPACCO_KAM" ? (
          <Routes>
            {adminRoutes
              .filter((obj) => {
                if (activeRole === "INSPACCO_KAM") {
                  if (!["/", "/admin/service-requests"].includes(obj.path))
                    return false;
                }
                return true;
              })
              .map(({ path, element, isPrivate = false }, index) =>
                isPrivate ? (
                  <Route
                    key={index}
                    path={path}
                    element={
                      <PrivateRoute>
                        <AdminRouteHOC {...{ path, element, index }} />
                      </PrivateRoute>
                    }
                  />
                ) : (
                  <Route key={index} path={path} element={element} />
                )
              )}
          </Routes>
        ) : (
          <Routes>
            {routes.map(({ path, element, isPrivate = false }, index) =>
              isPrivate ? (
                <Route
                  key={index}
                  path={path}
                  element={
                    <PrivateRoute>
                      <UserRouteHOC {...{ path, element, index }} />
                    </PrivateRoute>
                  }
                />
              ) : (
                <Route key={index} path={path} element={element} />
              )
            )}
          </Routes>
        )}
      </Suspense>
    </div>
  );
}
