import React from 'react';
import rollbar from '../rollbar';
import { connect } from 'react-redux';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log('Error caught by ErrorBoundary:', error);
    console.log('Error info:', info);

    const { user, activeRole } = this.props; 
    console.log(error)
    rollbar.error(error, { extra: info, user, activeRole });
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const mapStateToProps = (state) => {
  const { user, activeRole } = state.authSlice;
  return { user, activeRole };
};

export default connect(mapStateToProps)(ErrorBoundary);
