// import moment from "moment";

export function mobileValidator(mobileNumber) {
  const re = new RegExp(/^[0-9\b]+$/);
  if (!mobileNumber) return "Mobile Number can't be empty.";
  if (!re.test(mobileNumber)) return "Please enter valid mobile number";
  return "";
}
export const ACTIONS = {
  changeStatus: 'ChangeStatus',
  editComment : 'EditComment',
  editIncidentData : 'editIncidentData',
  editIncidentStatus : 'editIncidentStatus',
  editIncidentComment : 'editIncidentComment'
}
export function OtpValidator(otp) {
  const re = new RegExp(/^[0-9\b]+$/);
  if (!otp) return "OTP Number can't be empty.";
  if (otp.length !== 4) return "Enter valid number";
  if (!re.test(otp)) return "Please enter valid OTP";
  return "";
}
export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/;
  if (!email) return "Email can't be empty!";
  if (!re.test(email)) return "Please enter valid email";
  return "";
}

// export function dateValidator(date) {
//   return moment(date, "DD-MM-YYYY").isValid();
// }
