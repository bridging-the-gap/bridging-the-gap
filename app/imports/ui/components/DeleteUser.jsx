import React from 'react';
import { Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import { _ } from 'meteor/underscore';
import { Profiles } from '../../api/profiles/Profiles';
import { deleteProfileMethod } from '../../startup/both/Methods';

/** Renders a single row in the profile table in the admin page. See pages/Home.jsx. */
class DeleteUser extends React.Component {
  /** Initialize state fields. */
  constructor(props) {
    super(props);
    this.state = { email: '', role: '', error: '' };
  }

  /** Update the form controls each time the user interacts with them. */
  handleChange= (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  submit = () => {
    console.log('current email', this.state.email);
    console.log('roles from user', this.state.role);
    const isStudent = _.findWhere(this.props.profiles, { email: this.state.email, role: 'student' });
    console.log('isStudent', isStudent);
    const isCompany = _.findWhere(this.props.profiles, { email: this.state.email, role: 'company' });
    console.log('isCompany', isCompany);
    const match = ((isStudent !== undefined && this.state.role === isStudent.role) ||
      (isCompany !== undefined && this.state.role === isCompany.role));
    console.log('match', match);
    if (this.state.role === '' ||
      (this.props.profiles.find(({ email }) => email === this.state.email) === undefined || match === false)) {
      Swal.fire({
        title: 'Cannot delete user.',
        text: 'Your attempt to delete the user likely failed for one of the following reasons: ' +
          'you tried to delete a user that does not exist, you did not choose the role for the user,' +
          ' you put the wrong role for the user, or you entered an invalid email.',
        icon: 'error',
      });
    } else {
      Meteor.call(deleteProfileMethod, this.state, (error) => {
        if (error) {
          swal('Error', 'Your attempt to delete the user likely failed for one of the following reasons: ' +
          'you tried to delete a user that does not exist, you put the wrong role for the user, or you entered an invalid email.', 'error');
        } else {
          swal('User was deleted successfully.', 'This action cannot be undone.',
            'success').then(() => this.setState({ email: '', error: '' }, () => {
            console.log('current role should be empty:', this.state);
          }));
        }
      });
    }
  }

  render() {
    const mainRoles = [
      { text: 'student', value: 'student' },
      { text: 'company', value: 'company' },
    ];
    return (
      <Form id='deleteUserForm' onSubmit={this.submit}>
        <Form.Group>
          <Form.Input required placeholder='email of user to delete' id='email'
            name='email' type='email' onChange={this.handleChange}/>
          <Form.Dropdown placeholder='role of user to delete' id='role' name='role' selection options={mainRoles} onChange={this.handleChange}/>
          <Form.Button type='submit'>DELETE</Form.Button>
        </Form.Group>
      </Form>
    );
  }
}

// Require a document to be passed to this component.
DeleteUser.propTypes = {
  profiles: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Roles.subscription;
  const sub2 = Meteor.subscribe(Profiles.userPublicationName);
  // Get the Profiles documents
  const profiles = Profiles.collection.find({}).fetch();
  return {
    profiles,
    ready: sub1.ready() && sub2.ready(),
  };
})(DeleteUser);
