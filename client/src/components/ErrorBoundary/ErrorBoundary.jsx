import React from "react";

import "./ErrorBoundary.scss";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorText: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorText: error.toString() };
  }

  render() {
    if (this.state.hasError) {
      return (
        <h1 className="errorboundary__title">
          Что-то пошло не так. {this.state.errorText}
        </h1>
      );
    }

    return this.props.children;
  }
}
