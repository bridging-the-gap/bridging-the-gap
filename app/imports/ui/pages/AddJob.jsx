import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SubmitField, TextField, LongTextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import { addJobMethod } from '../../startup/both/Methods';
import { Jobs } from '../../api/job/Jobs';



/** Renders the Page for adding a document. */
class AddJob extends React.Component {
  // On submit, insert the data.
  submit(data, formRef) {
    const { jobTitle, location, salary, industry, image, description } = data;
    const owner = Meteor.user().username;
    Jobs.collection.insert({ jobTitle, location, salary, industry, image, description, owner },
      (error) => {
      // Meteor.call(addJobMethod, data, (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Job added successfully', 'success').then(() => formRef.reset());
        }
      });
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  render() {
    let fRef = null;
    // Create a schema to specify the structure of the data to appear in the form.
    const formSchema = new SimpleSchema({
      jobTitle: String,
      location: String,
      salary: String,
      industry: String,
      image: { type: String, optional: true },
      description: String,
    });

    const bridge = new SimpleSchema2Bridge(formSchema);
    return (
      <Grid container centered id="addJobPage">
        <Grid.Column>
          <Header as="h2" textAlign="center">Add Job</Header>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)} >
            <Segment>
              <TextField id="jobTitle" name='jobTitle'/>
              <TextField id="location" name='location'/>
              <TextField id="salary" name='salary'/>
              <TextField id="industry" name='industry'/>
              <TextField id="image" name='image'/>
              <LongTextField id="description" name='description'/>
              <SubmitField id="submit" value='Submit'/>
              <ErrorsField/>
            </Segment>
          </AutoForm>
        </Grid.Column>
      </Grid>
    );
  }
}
AddJob.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub = Meteor.subscribe(Jobs.userPublicationName);
  return {
    ready: sub.ready(),
  };
})(AddJob);
