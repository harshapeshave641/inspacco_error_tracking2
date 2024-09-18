// rollbar.js
import Rollbar from 'rollbar';
import rollbarConfig from './rollbarConfig';

console.log(rollbarConfig)
const rollbar = new Rollbar(rollbarConfig);

export default rollbar;
