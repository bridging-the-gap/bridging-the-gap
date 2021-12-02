import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Container, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import swal from 'sweetalert';
import { Accounts } from 'meteor/accounts-base';
import { addRoleMethod } from '../../startup/both/Methods';
import { Profiles } from '../../api/profiles/Profiles';

/**
 * Signup component is similar to signin component, but we create a new user instead.
 */
class Signup extends React.Component {
  /** Initialize state fields. */
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', role: '', firstname: '', error: '', redirectToReferer: false };
  }

  /** Update the form controls each time the user interacts with them. */
  handleChange= (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  /** Update the form controls each time the user interacts with them.
   *   Used for the radio buttons. */
  handleChange2 = (e, { value }) => {
    this.setState({ value });
    this.setState({ role: value });
  }

  /** Handle Signup submission. Create user account and a profile entry, then redirect to the home page. */
  submit= () => {
    const { email, password, role, firstname } = this.state;
    if (role.trim() === '') {
      swal('Error', 'You must choose a role to sign up', 'error');
    } else {
      Accounts.createUser({ username: email, email, password }, (err) => {
        if (err) {
          this.setState({ error: err.reason });
        } else {
          Profiles.collection.insert({ email, role, firstname }, (err2) => {
            if (err2) {
              this.setState({ error: err2.reason });
            } else {
            /** Calling the addRoleMethod to give the new user their specified role if there are no errors with registration. */
              Meteor.call(addRoleMethod, this.state, (error) => {
                if (error) {
                  swal('Error', error.message, 'error');
                } else {
                  swal('You have registered successfully.', 'Welcome to Bridging the Gap!', 'success');
                }
              });
              this.setState({ error: '', redirectToReferer: true });
            }
          });
        }
      });
    }
  }

  /** Display the signup form. */
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/home' } };
    // if correct authentication, redirect to from: page instead of signup screen
    if (this.state.redirectToReferer) {
      return <Redirect to={from}/>;
    }
    return (
      <Container id="signup-page">
        <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
          <Grid.Column>
            <Header as="h2" textAlign="center">
                Sign up for a new account
            </Header>
            <Form onSubmit={this.submit}>
              <Segment stacked>
                <Form.Input
                  label="Email"
                  id="signup-form-email"
                  icon="user"
                  iconPosition="left"
                  name="email"
                  type="email"
                  autoComplete="on"
                  placeholder="E-mail address"
                  onChange={this.handleChange}
                />
                <Form.Input
                  label="Password"
                  id="signup-form-password"
                  icon="lock"
                  iconPosition="left"
                  name="password"
                  placeholder="Password"
                  type="password"
                  autoComplete="on"
                  onChange={this.handleChange}
                />
                <Form.Input
                    label="Email"
                    id="signup-form-email"
                    icon="user"
                    iconPosition="left"
                    name="email"
                    type="email"
                    autoComplete="on"
                    placeholder="E-mail address"
                    onChange={this.handleChange}
                />
                <Form.Group inline id="signup-form-roles">
                  <label>Role</label>
                  <Form.Radio
                    label="Student"
                    id='student-button'
                    name="role"
                    value="student"
                    autoComplete="on"
                    checked={this.state.value === 'student'}
                    onChange={this.handleChange2}
                  />
                  <Form.Radio
                    label="Company"
                    id='company-button'
                    name="role"
                    value="company"
                    checked={this.state.value === 'company'}
                    autoComplete="on"
                    onChange={this.handleChange2}
                  />
                </Form.Group>
                <Form.Button id="signup-form-submit" content="Submit"/>
              </Segment>
            </Form>
            <Message>
                Already have an account? Login <Link to="/signin">here</Link>
            </Message>
            {this.state.error === '' ? (
              ''
            ) : (
              <Message
                error
                header="Registration was not successful"
                content={this.state.error}
              />
            )}
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

/** Ensure that the React Router location object is available in case we need to redirect. */
Signup.propTypes = {
  location: PropTypes.object,
};

export default Signup;
