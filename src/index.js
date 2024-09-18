import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import './i18n.js'
import App from "./App";
import ErrorBoundary from "./components/common/ErrorBoundary";

import store from "./store";
import client from "./graphqlconfig";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";


// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById("app"));

root.render(
  <ErrorBoundary>
  <Provider store={store}>
    <ApolloProvider client={client}>
      <ToastContainer theme="colored" className={"!top-[65px]"} />
      <Router>
       
          <App />
        
      </Router>
    </ApolloProvider>
  </Provider>
  </ErrorBoundary>
);
