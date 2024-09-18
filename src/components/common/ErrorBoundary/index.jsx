import { Component } from "react";
import NavigateBack from "../NavigateBack";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@heroicons/react/24/outline/PowerIcon";

import { logout } from "../../../slice/authSlice";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError)
      return <FallbackUI setErrorState={this.setState} />;
    return this.props.children;
  }
}

export default ErrorBoundary;

export const FallbackUI = ({ setErrorState }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    setErrorState({ hasError: false, error: null, errorInfo: null });
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <div className="text-accent text-5xl font-bold pb-4">
          Technical Error!
        </div>
        <NavigateBack to="/" />
        {process.env.NODE_ENV !== "production" && (
          <button
            onClick={logoutHandler}
            className="mt-4 btn btn-sm btn-ghost gap-2"
          >
            <LogoutIcon className="w-5 h-5" />
            Logout
          </button>
        )}
      </div>
    </div>
  );
};
