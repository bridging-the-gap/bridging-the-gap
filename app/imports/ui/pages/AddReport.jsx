import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Reports } from '../../api/reports/Reports';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  reportName: String,
  description: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */
class AddReport extends React.Component {

  // On submit, insert the data.
  submit(data, formRef) {
    const { reportName, description } = data;
    const email = Meteor.user().username;
    console.log('the owner:', email);
    Reports.collection.insert({ reportName, email, description },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Your report has been received!', 'Thanks for your report. Our team will look into the issue as soon as we can.', 'success');
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
          <Header as="h2" textAlign="center">Report Inappropriate Content</Header>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)} >
            <Segment>
              <TextField name='reportName' placeholder='Give a descriptive title for your report.'/>
              <LongTextField name='description' placeholder='Write your report here.
              If there is a particular offender, be sure to mention their email and/or name in your message.'/>
              <SubmitField value='Submit'/>
              <ErrorsField/>
            </Segment>
          </AutoForm>
        </Grid.Column>
      </Grid>
    );
  }
}

export default AddReport;
