import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Roles } from 'meteor/alanning:roles';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import AddEvent from '../pages/AddEvent';
import BrowseCompanies from '../pages/BrowseCompanies';
import BrowseStudents from '../pages/BrowseStudents';
import Events from '../pages/Events';
import AddReport from '../pages/AddReport';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Signout from '../pages/Signout';
import AddJob from '../pages/AddJob';
import EditCompany from '../pages/EditCompany';
import EditProfile from '../pages/EditProfile';
import EditEvent from '../pages/EditEvent';
import EditJob from '../pages/EditJob';
import JobListings from '../pages/JobListings';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <NavBar/>
          <div style={{ paddingTop: '20px', paddingBottom: '30px' }}>
            <Switch>
              <Route exact path="/" component={Landing}/>
              <ProtectedRoute path="/home" component={Home}/>
              <ProtectedRoute path="/profile" component={Profile}/>
              <ProtectedRoute path="/events" component={Events}/>
              <ProtectedRoute path="/jobs" component={JobListings}/>
              <ProtectedRoute path="/addReport" component={AddReport}/>
              <ProtectedRoute path="/addEvent" component={AddEvent}/>
              <ProtectedRoute path="/browseCompanies" component={BrowseCompanies}/>
              <ProtectedRoute path="/browseStudents" component={BrowseStudents}/>
              <ProtectedRoute path="/addJob" component={AddJob}/>
              <ProtectedRoute path="/editCompany/:_id" component={EditCompany}/>
              <ProtectedRoute path="/editProfile/:_id" component={EditProfile}/>
              <ProtectedRoute path="/editJob/:_id" component={EditJob}/>
              <ProtectedRoute path="/editEvent/:_id" component={EditEvent}/>
              <Route path="/signin" component={Signin}/>
              <Route path="/signup" component={Signup}/>
              <ProtectedRoute path="/signout" component={Signout}/>
              <Route component={NotFound}/>
            </Switch>
          </div>
          <Footer/>
        </div>
      </Router>
    );
  }
}

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      return isLogged ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
      return (isLogged && isAdmin) ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

/** Require a component and location to be passed to each ProtectedRoute. */
ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  location: PropTypes.object,
};

/** Require a component and location to be passed to each AdminProtectedRoute. */
AdminProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  location: PropTypes.object,
};

export default App;
