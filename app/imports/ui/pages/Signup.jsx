import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Container, Form, Grid, Header, Loader, Message, Segment } from 'semantic-ui-react';
import swal from 'sweetalert';
import { Accounts } from 'meteor/accounts-base';
import { withTracker } from 'meteor/react-meteor-data';
import { addRoleMethod, addSpecificInfoMethod, addLocationMethod, addSkillMethod }
  from '../../startup/both/Methods';
import { Profiles } from '../../api/profiles/Profiles';
import { Locations } from '../../api/locations/Locations';

/**
 * Signup component is similar to signin component, but we create a new user instead.
 */
class Signup extends React.Component {
  /** Initialize state fields. */
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', role: '', firstName: '', lastName: '', title: '',
      webpage: '', picture: '', bio: '', skills: '', locations: '', error: '', redirectToReferer: false };
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
    const { email, password, role, firstName, lastName, title, skills, locations, bio, webpage, picture } = this.state;
    console.log('skill?:', skills);
    console.log('locations?:', locations);
    if (role.trim() === '') {
      swal('Error', 'You must choose a role to sign up', 'error');
    } else {
      Accounts.createUser({ username: email, email, password }, (err) => {
        if (err) {
          this.setState({ error: err.reason });
        } else {
          Profiles.collection.insert({ email, role, firstName, lastName, title, bio, webpage, picture }, (err2) => {
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
              if (role === 'student') {
                Meteor.call(addSkillMethod, this.state, (error) => {
                  if (error) {
                    swal('Error', 'An error has occurred while trying to add the location you chose.'
                      + ' Please let the admin know by filing a report in the report a problem page.', 'error');
                  }
                });
              }
              if (role === 'company') {
                Meteor.call(addLocationMethod, this.state, (error) => {
                  if (error) {
                    swal('Error', 'An error has occurred while trying to add the location you chose.'
                      + ' Please let the admin know by filing a report in the report a problem page.', 'error');
                  }
                });
              }
              /** Calling the addSpecificInfoMethod to add user's skills to ProfilesSkills collection if they're a student
               * or add user's locations to ProfilesLocations collection if they're a student or company. */
              Meteor.call(addSpecificInfoMethod, this.state, (error) => {
                if (error) {
                  swal('Error', error.message, 'error');
                }
              });
              this.setState({ error: '', redirectToReferer: true });
            }
          });
        }
      });
    }
  }

  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Display the signup form. */
  renderPage() {
    const { from } = this.props.location.state || { from: { pathname: '/home' } };
    // if correct authentication, redirect to from: page instead of signup screen
    const locationChoices = [
      { text: 'US', key: 'US', value: 'US', id: 'US' },
      { text: 'Hawaii', key: 'Hawaii', value: 'Hawaii', id: 'Hawaii' },
      { text: 'Hawaii (The Big Island)', key: 'Hawaii (The Big Island)',
        value: 'Hawaii (The Big Island)', id: 'Hawaii (The Big Island)' },
      { text: 'Maui', key: 'Maui', value: 'Maui', id: 'Maui' },
      { text: 'Oahu', key: 'Oahu', value: 'Oahu', id: 'Oahu' },
      { text: 'Honolulu', key: 'Honolulu', value: 'Honolulu', id: 'Honolulu' },
      { text: 'Kauai', key: 'Kauai', value: 'Kauai', id: 'Kauai' },
      { text: 'Washington D.C', key: 'Washington D.C', value: 'Washington D.C', id: 'Washington D.C' },
      { text: 'California', key: 'California', value: 'California', id: 'California' },
      { text: 'Texas', key: 'Texas', value: 'Texas', id: 'Texas' },
      { text: 'Trondheim', key: 'Trondheim', value: 'Trondheim', id: 'Trondheim' },
      { text: 'France', key: 'France', value: 'France', id: 'France' },
      { text: 'South America', key: 'South America', value: 'South America', id: 'South America' },
      { text: 'Asia', key: 'Asia', value: 'Asia', id: 'Asia' },
      { text: 'China', key: 'China', value: 'China', id: 'China' },
      { text: 'India', key: 'India', value: 'India', id: 'India' },
      { text: 'Japan', key: 'Japan', value: 'Japan', id: 'Japan' },
      { text: 'South Korea', key: 'South Korea', value: 'South Korea', id: 'South Korea' },
      { text: 'Seoul', key: 'Seoul', value: 'Seoul', id: 'Seoul' },
      { text: 'New Zealand', key: 'New Zealand', value: 'New Zealand', id: 'New Zealand' },
    ];
    const skillChoices = [
      { text: 'Art', key: 'Art', value: 'Art', id: 'Art' },
      { text: 'Sports', key: 'Sports', value: 'Sports', id: 'Sports' },
      { text: 'Cooking', key: 'Cooking', value: 'Cooking', id: 'Cooking' },
      { text: 'Science', key: 'Science', value: 'Science', id: 'Science' },
      { text: 'Physics', key: 'Physics', value: 'Physics', id: 'Physics' },
      { text: 'Research', key: 'Research', value: 'Research', id: 'Research' },
      { text: 'Psychology', key: 'Psychology', value: 'Psychology', id: 'Psychology' },
      { text: 'Business', key: 'Business', value: 'Business', id: 'Business' },
      { text: 'Economics', key: 'Economics', value: 'Economics', id: 'Economics' },
      { text: 'English', key: 'English', value: 'English', id: 'English' },
      { text: 'History', key: 'History', value: 'History', id: 'History' },
      { text: 'Software Engineering', key: 'Software Engineering', value: 'Software Engineering', id: 'Software Engineering' },
      { text: 'Programming', key: 'Programming', value: 'Programming', id: 'Programming' },
      { text: 'Machine Learning', key: 'Machine Learning', value: 'Machine Learning', id: 'Machine Learning' },
      { text: 'Robotics', key: 'Robotics', value: 'Robotics', id: 'Robotics' },
      { text: 'Data Science', key: 'Data Science', value: 'Data Science', id: 'Data Science' },
      { text: 'Mathematics', key: 'Mathematics', value: 'Mathematics', id: 'Mathematics' },
    ];
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
                {this.state.role === 'company' ?
                  [
                    <Form.Input required
                      label="Company Name"
                      id="signup-form-companyName"
                      name="firstName"
                      type="firstName"
                      autoComplete="on"
                      placeholder="Company name"
                      key='input-company-name'
                      onChange={this.handleChange}
                    />,
                    <Form.Input required
                      label="Industry"
                      id="signup-form-industry-title"
                      name="title"
                      type="title"
                      autoComplete="on"
                      placeholder="Associated industry (ex. Manufacturing)"
                      key='signup-industry'
                      onChange={this.handleChange}
                    />,
                    <Form.Select required
                      label="Location"
                      id="input-company-locations"
                      name="locations"
                      type="locations"
                      autoComplete="on"
                      key='input-company-locations'
                      placeholder="Main company location (can add more upon registration)"
                      options={locationChoices}
                      onChange={this.handleChange}
                    />,
                  ] : ''
                }
                {this.state.role === 'student' ?
                  [<Form.Input required
                    label="First Name"
                    id="signup-form-firstname"
                    name="firstName"
                    type="firstName"
                    autoComplete="on"
                    placeholder="First name"
                    key='student-first-name'
                    onChange={this.handleChange}
                  />,
                  <Form.Input required
                    label="Last Name"
                    id="signup-form-lastname"
                    name="lastName"
                    type="lastName"
                    autoComplete="on"
                    placeholder="Last name"
                    key='student-last-name'
                    onChange={this.handleChange}
                  />,
                  <Form.Input required
                    label="Title"
                    id="signup-form-title"
                    name="title"
                    type="title"
                    autoComplete="on"
                    placeholder="Title that defines you (ex. Engineering Student)"
                    key='signup-title'
                    onChange={this.handleChange}
                  />,
                  <Form.Select required
                    label="Skill"
                    id="input-student-skills"
                    name="skills"
                    type="skills"
                    autoComplete="on"
                    placeholder="Your main skill (can add more upon registration)"
                    key='student-skills'
                    options={skillChoices}
                    onChange={this.handleChange}
                  />,
                  <Form.Select required
                    label="Location"
                    id="input-student-locations"
                    name="locations"
                    type="locations"
                    autoComplete="on"
                    key='input-student-locations'
                    placeholder="Preferred location (can add more upon registration)"
                    options={locationChoices}
                    onChange={this.handleChange}
                  />,
                  ]
                  : ''
                }
                {this.state.role !== '' ?
                  [
                    <Form.Input required
                      label="About"
                      id="signup-form-bio"
                      name="bio"
                      type="bio"
                      autoComplete="on"
                      placeholder="Description"
                      key='signup-desc'
                      onChange={this.handleChange}
                    />,
                    <Form.Input
                      label="Webpage"
                      id="signup-form-webpage"
                      name="webpage"
                      type="webpage"
                      autoComplete="on"
                      placeholder="Link to webpage"
                      key='signup-webpage'
                      onChange={this.handleChange}
                    />,
                    <Form.Input
                      label="Picture"
                      id="signup-form-picture"
                      name="picture"
                      type="picture"
                      autoComplete="on"
                      placeholder="Link to picture"
                      key='signup-pic'
                      onChange={this.handleChange}
                    />] : ''
                }
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
  locations: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Locations.userPublicationName);
  // Get the Locations documents
  const locations = Locations.collection.find({}).fetch();
  return {
    locations,
    ready: sub1.ready(),
  };
})(Signup);
