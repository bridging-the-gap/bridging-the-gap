import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SubmitField, TextField, LongTextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Profiles } from '../../api/profiles/Profiles';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  firstName: String,
  email: String,
  picture: { type: String, optional: true },
  bio: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */
class AddCompany extends React.Component {

  // On submit, insert the data.
  submit(data, formRef) {
    const { firstName, email, picture, bio } = data;
    const owner = Meteor.user().username;
    Profiles.collection.insert({ firstName, email, picture, bio, owner },
      (error) => {
        if (error) {
          swal('Error', 'Company name or contact info (or both) is already taken and cannot be used.', 'error');
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
      <Grid container centered id="addCompanyPage">
        <Grid.Column>
          <Header as="h2" textAlign="center">Company Information</Header>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)} >
            <Segment>
              <TextField id="companyName" name='firstName'/>
              <TextField id="contact" name='email'/>
              <TextField id="image" name='picture'/>
              <LongTextField id="description" name='bio'/>
              <SubmitField id="submit" value='Submit'/>
              <ErrorsField/>
            </Segment>
          </AutoForm>
        </Grid.Column>
      </Grid>
    );
  }
}

export default AddCompany;
