import React from "react";
import Layout from "./components/Layout";
import ErrorBoundary from "./custom/ErrorBoundary";
import rollbarConfig from "./rollbarConfig";
import ErrorTrigger from "./graphqlErrorTrigger";
function TestError() {
  console.log(undefinedVar); 
  return null;
}

function TestError1() {
  const a=2;
  a.nono();
}



export default function App() {
  
  return (
    <ErrorBoundary>
    <div>
      <Layout />
      <ErrorTrigger/>
      {/* <TestError />
      <TestError1/> */}
    </div>
  </ErrorBoundary>
  );
}
