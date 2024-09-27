// const rollbarConfig = {
//     accessToken: '46873aa2a40041b19d201991d7496c21',
//     environment: 'testenv',
//     source_map_enabled: true,
//   }





  const rollbarConfig = {
    accessToken: "46873aa2a40041b19d201991d7496c21",
    captureUncaught: true,
    captureUnhandledRejections: true,
    
    payload: {
      environment: "testenv",
      client: {
        javascript: {
          source_map_enabled: true, // false by default
          
          // -- Add this into your configuration ---
          code_version: "3.2",
          // ---------------------------------------
          
          // Optionally have Rollbar guess which frames the error was 
          // thrown from when the browser does not provide line 
          // and column numbers.
          guess_uncaught_frames: true
        }
      }
    }
  }
  export default rollbarConfig

  