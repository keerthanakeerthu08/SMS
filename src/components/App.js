import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-toastify/dist/ReactToastify.css';

import Loading from 'components/common/loading';
import ForgotPassword from 'components/core/forgotForm';
import Login from 'components/core/loginForm';
import Home from 'components/home';
import Routes from 'components/Routes';
import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import auth from 'services/authService';

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {}
  }
  async componentDidMount() {
    await this.init()
  }
  init = async () => {
    const user = await auth.getCurrentUser();
    await this.setState({ session: user })
  }
  /**
    * @function isPageLoadingFalse  Loading Hide Function for all components
    */
  isPageLoadingFalse = async () => {
    await this.setState({ isPageLoading: false })
  }
  /**
   * @function isPageLoadingTrue  Loading Show Function for all components
   */
  isPageLoadingTrue = async () => {
    await this.setState({ isPageLoading: true })
  }
  render() {
    const { session, isPageLoading } = this.state;
    return (
      <Router basename="/">
        {(session && session !== null) ?
          <div>
            <ToastContainer />
            {isPageLoading &&
              <Loading ></Loading>}
            {/* All Routes  Come from Routes Js File*/}
            <Routes session={session} isPageLoadingFalse={this.isPageLoadingFalse} isPageLoadingTrue={this.isPageLoadingTrue} />
          </div> : <Switch>
            <Redirect from="/" to="/home" exact />
            <Route path="/home" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/forgotpassword" component={ForgotPassword} />
          </Switch>
        }
      </Router>
    );
  }
}

export default App;
