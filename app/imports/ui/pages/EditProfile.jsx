import React from 'react';
import { Grid, Loader, Header, Segment, Form } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, SubmitField, TextField, LongTextField } from 'uniforms-semantic';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import MultiSelectField from '../forms/controllers/MultiSelectField';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesLocations } from '../../api/profiles/ProfilesLocations';
import { ProfilesSkills } from '../../api/profiles/ProfilesSkills';
import { updateProfileMethod } from '../../startup/both/Methods';
import { Skills } from '../../api/skills/Skills';
import { Locations } from '../../api/locations/Locations';

const makeSchema = (allLocations, allSkills) => new SimpleSchema({
  email: { type: String, label: 'Email', optional: true },
  firstName: { type: String, label: 'First', optional: true },
  lastName: { type: String, label: 'Last', optional: true },
  bio: { type: String, label: 'Biographical statement', optional: true },
  title: { type: String, label: 'Title', optional: true },
  picture: { type: String, label: 'Picture URL', optional: true },
  webpage: { type: String, label: 'Webpage URL', optional: true },
  locations: { type: Array, label: 'Locations', optional: true },
  'locations.$': { type: String, allowedValues: allLocations },
  skills: { type: Array, label: 'Skills', optional: true },
  'skills.$': { type: String, allowedValues: allSkills },
});

/** Renders the Home Page: what appears after the user logs in. */
class EditProfile extends React.Component {

  /** On submit, insert the data. */
  submit(data) {
    Meteor.call(updateProfileMethod, data, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Profile updated successfully', 'success');
      }
    });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    const email = Meteor.user().username;
    // Create the form schema for uniforms. Need to determine all interests and projects for muliselect list.
    const allSkills = _.pluck(Skills.collection.find().fetch(), 'name');
    const allLocations = _.pluck(Locations.collection.find().fetch(), 'name');
    const formSchema = makeSchema(allLocations, allSkills);
    const bridge = new SimpleSchema2Bridge(formSchema);
    // Now create the model with all the user information.
    const skills = _.pluck(ProfilesSkills.collection.find({ profile: email }).fetch(), 'skill');
    const locations = _.pluck(ProfilesLocations.collection.find({ profile: email }).fetch(), 'location');
    const profile = Profiles.collection.findOne({ email });
    const model = _.extend({}, profile, { skills, locations });
    return (
      <Grid id="edit-profile-page" container centered>
        <Grid.Column>
          <Header as="h2" textAlign="center">Edit Your Profile</Header>
          <AutoForm model={model} schema={bridge} onSubmit={data => this.submit(data)}>
            <Segment>
              <Form.Group widths={'equal'}>
                <TextField id='firstName' name='firstName' showInlineError={true} placeholder={'First Name'}/>
                <TextField id='lastName' name='lastName' showInlineError={true} placeholder={'Last Name'}/>
                <TextField name='email' showInlineError={true} placeholder={'email'} disabled/>
              </Form.Group>
              <LongTextField id='bio' name='bio' placeholder='Write a little bit about yourself.'/>
              <Form.Group widths={'equal'}>
                <TextField id='title' name='title' showInlineError={true} placeholder={'Title'}/>
                <TextField id='picture' name='picture' showInlineError={true} placeholder={'URL to picture'}/>
                <TextField id='webpage' name='webpage' showInlineError={true} placeholder={'URL to webpage'}/>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <MultiSelectField id='locations' name='locations' showInlineError={true} placeholder={'Locations'}/>
                <MultiSelectField id='skills' name='skills' showInlineError={true} placeholder={'Skills'}/>
              </Form.Group>
              <SubmitField id='edit-profile-page-submit' value='Update'/>
            </Segment>
          </AutoForm>
        </Grid.Column>
      </Grid>
    );
  }
}

EditProfile.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Skills.userPublicationName);
  const sub2 = Meteor.subscribe(Profiles.userPublicationName);
  const sub3 = Meteor.subscribe(ProfilesSkills.userPublicationName);
  const sub4 = Meteor.subscribe(ProfilesLocations.userPublicationName);
  const sub5 = Meteor.subscribe(Locations.userPublicationName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready(),
  };
})(EditProfile);
