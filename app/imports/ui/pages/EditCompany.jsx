import React from 'react';
import { Grid, Loader, Header, Segment } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, SubmitField, TextField, LongTextField } from 'uniforms-semantic';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/underscore';
import MultiSelectField from '../forms/controllers/MultiSelectField';
import { Profiles } from '../../api/profiles/Profiles';
import { updateCompanyMethod } from '../../startup/both/Methods';
import { Locations } from '../../api/locations/Locations';
import { ProfilesLocations } from '../../api/profiles/ProfilesLocations';

const makeSchema = (allLocations) => new SimpleSchema({
  email: { type: String, label: 'Email', optional: true },
  firstName: { type: String, label: 'First', optional: true },
  lastName: { type: String, label: 'Last', optional: true },
  bio: { type: String, label: 'Biographical statement', optional: true },
  title: { type: String, label: 'Title', optional: true },
  picture: { type: String, label: 'Picture URL', optional: true },
  locations: { type: Array, label: 'Locations', optional: true },
  'locations.$': { type: String, allowedValues: allLocations },
});

/** Renders the Page for editing a single document. */
class EditCompany extends React.Component {

  // On successful submit, insert the data.
  submit(data) {
    Meteor.call(updateCompanyMethod, data, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Profile updated successfully', 'success');
      }
    });
  }

  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  renderPage() {
    const email = Meteor.user().username;
    const allLocations = _.pluck(Locations.collection.find().fetch(), 'name');
    const formSchema = makeSchema(allLocations);
    const bridge = new SimpleSchema2Bridge(formSchema);
    const locations = _.pluck(ProfilesLocations.collection.find({ profile: email }).fetch(), 'location');
    const profile = Profiles.collection.findOne({ email });
    const model = _.extend({}, profile, { locations });
    return (
      <Grid container centered id="editCompanyPage" >
        <Grid.Column>
          <Header as="h2" textAlign="center">Edit Company Info</Header>
          <AutoForm model={model} schema={bridge} onSubmit={data => this.submit(data)}>
            <Segment>
              <TextField label="Company Name" id="companyName" name='firstName' unique='true'/>
              <TextField id="contact" name='email' unique='true'/>
              <TextField id="image" name='picture'/>
              <LongTextField id="description" name='bio'/>
              <MultiSelectField name='locations' showInlineError={true} placeholder={'Locations'}/>
              <SubmitField id="submit" value='Submit'/>
              <ErrorsField/>
            </Segment>
          </AutoForm>
        </Grid.Column>
      </Grid>
    );
  }
}

// Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use.
EditCompany.propTypes = {
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Profiles.userPublicationName);
  const sub2 = Meteor.subscribe(ProfilesLocations.userPublicationName);
  const sub3 = Meteor.subscribe(Locations.userPublicationName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready(),
  };
})(EditCompany);
