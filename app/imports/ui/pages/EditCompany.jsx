import React from 'react';
import { Grid, Loader, Header, Segment } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, HiddenField, SubmitField, TextField, LongTextField } from 'uniforms-semantic';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Profiles } from '../../api/profiles/Profiles';

const bridge = new SimpleSchema2Bridge(Profiles.schema);

/** Renders the Page for editing a single document. */
class EditCompany extends React.Component {

  // On successful submit, insert the data.
  submit(data) {
    const { firstName, location, email, industry, picture, bio, _id } = data;
    Profiles.collection.update(_id, { $set: { firstName, location, email, industry, picture, bio } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Item updated successfully', 'success')));
  }

  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  renderPage() {
    return (
      <Grid container centered id="editCompanyPage" >
        <Grid.Column>
          <Header as="h2" textAlign="center">Edit Company Info</Header>
          <AutoForm schema={bridge} onSubmit={data => this.submit(data)} model={this.props.doc}>
            <Segment>
              <TextField id="companyName" name='firstName' unique='true'/>
              <TextField id="location" name='location'/>
              <TextField id="contact" name='email' unique='true'/>
              <TextField id="industry" name='industry'/>
              <TextField id="image" name='picture'/>
              <LongTextField id="description" name='bio'/>
              <SubmitField id="submit" value='Submit'/>
              <ErrorsField/>
              <HiddenField name='owner' unique='true'/>
            </Segment>
          </AutoForm>
        </Grid.Column>
      </Grid>
    );
  }
}

// Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use.
EditCompany.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Profiles.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the document
  const doc = Profiles.collection.findOne(documentId);
  return {
    doc,
    ready,
  };
})(EditCompany);
