import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SubmitField, TextField, LongTextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Jobs } from '../../api/job/Jobs';

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

/** Renders the Page for adding a document. */
class AddJob extends React.Component {

  // On submit, insert the data.
  submit(data, formRef) {
    const { jobTitle, location, salary, industry, image, description } = data;
    const owner = Meteor.user().username;
    Jobs.collection.insert({ jobTitle, location, salary, industry, image, description, owner },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
        }
      });
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  render() {
    let fRef = null;
    return (
      <Grid container centered>
        <Grid.Column>
          <Header as="h2" textAlign="center">Add Job</Header>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)} >
            <Segment>
              <TextField name='jobTitle'/>
              <TextField name='location'/>
              <TextField name='salary'/>
              <TextField name='industry'/>
              <TextField name='image'/>
              <LongTextField name='description'/>
              <SubmitField value='Submit'/>
              <ErrorsField/>
            </Segment>
          </AutoForm>
        </Grid.Column>
      </Grid>
    );
  }
}

export default AddJob;
