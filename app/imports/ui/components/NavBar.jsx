import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Dropdown, Image } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
class NavBar extends React.Component {
  render() {
    const menuStyle = { marginBottom: '0px', backgroundColor: 'blue', color: 'white' };
    return (
      <Menu style={menuStyle} attached="top" borderless>
        <Menu.Item as={NavLink} activeClassName="" exact to="/">
          <Image size='small' src="/images/bridge-logo.png"/>
        </Menu.Item>
        {this.props.currentUser ? (
          <Menu.Item as={NavLink} id="homeMenuItem" activeClassName="green active" exact to="/home" key='home'
            style={{ color: 'white' }}>Home</Menu.Item>
        ) : ''}
        <Menu.Item as={NavLink} id="eventItem" activeClassName="green active" exact to="/events" key='events'
          style={{ color: 'white' }}>Events</Menu.Item>
        <Menu.Item as={NavLink} id="browseStudentsItem" activeClassName="green active" exact to="/browseStudents"
          key='browseStudents' style={{ color: 'white' }}>Browse Students</Menu.Item>
        <Menu.Item as={NavLink} id="browseCompaniesItem" activeClassName="green active" exact to="/browseCompanies"
          key='browseCompanies' style={{ color: 'white' }}>Browse Companies</Menu.Item>
        {this.props.currentUser && (Roles.userIsInRole(Meteor.userId(), 'company') === true) ? (
          // eslint-disable-next-line max-len
          <Menu.Item as={NavLink} id="addEventItem" activeClassName="green active" exact to="/addEvent" key='addEvent' style={{ color: 'white' }}>Add Event</Menu.Item>) : '' }
        {this.props.currentUser && (Roles.userIsInRole(Meteor.userId(), 'admin') === false) ? (
          <Menu.Item as={NavLink} id="profileMenuItem" activeClassName="green active" exact to="/profile" key='profile'
            style={{ color: 'white' }}>Profile</Menu.Item>) : '' }
        <Menu.Item position="right">
          {this.props.currentUser === '' ? (
            <Dropdown id="login-dropdown" text="Login" pointing="top right" icon={'user'} style={{ color: 'white' }}>
              <Dropdown.Menu>
                <Dropdown.Item id="login-dropdown-sign-in" icon="user" text="Sign In" as={NavLink} exact to="/signin"
                  style={{ color: 'white' }}/>
                <Dropdown.Item id="login-dropdown-sign-up" icon="add user" text="Sign Up" as={NavLink} exact to="/signup"
                  style={{ color: 'white' }}/>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Dropdown id="navbar-current-user" text={this.props.currentUser} pointing="top right" icon={'user'} style={{ color: 'white' }}>
              <Dropdown.Menu>
                <Dropdown.Item id="navbar-sign-out" icon="sign out" text="Sign Out" as={NavLink} exact to="/signout" style={{ color: 'white' }}/>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Menu.Item>
      </Menu>
    );
  }
}

/** Declare the types of all properties. */
NavBar.propTypes = {
  currentUser: PropTypes.string,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const NavBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(NavBar);

/** Enable ReactRouter so that links work. */
export default withRouter(NavBarContainer);
