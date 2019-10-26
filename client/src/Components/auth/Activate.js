import React, { useState, useEffect, Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import { useUserStore } from "../../Context/appStore";
import { activation } from "../../actions/authAction";

// class Activate extends Component {
//   constructor(props) {
//     super(props);
//   }
//   componentDidMount() {
//     let params = queryString.parse(this.props.location.search);
//     console.log(params);
//     console.log(this.props.match.params.id);
//   }
//   render() {
//     return <h1>hello</h1>;
//   }
// }
const Activate = props => {
  const [state, dispatch] = useUserStore();
  let username = props.match.params.username;
  let token = props.match.params.token;
  useEffect(() => {
    activation(username, token, dispatch);
  }, []);
  return 0;
};
export default Activate;
