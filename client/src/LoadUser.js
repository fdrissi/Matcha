import React from "react";

export class LoadUserComponent extends React.Component {
  componentDidMount() {
    this.props.loadUser(this.props.dispatch, this.props.socket);
  }
  render() {
    return <></>;
  }
}
