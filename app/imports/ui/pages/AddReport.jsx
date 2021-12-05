import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, LongTextField, SelectField, SubmitField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Reports } from '../../api/reports/Reports';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  reportType: {
    label: 'Type',
    type: String,
    allowedValues: ['bug', 'user-abuse', 'other'],
  },
  description: {
    type: String,
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

const reportTypes = [
  { label: 'Bug', value: 'bug' },
  { label: 'User Abuse', value: 'user-abuse' },
  { label: 'Other', value: 'other' },
];

/** Renders the Page for adding a document. */
class AddReport extends React.Component {

  // On submit, insert the data.
  submit(data, formRef) {
    const { reportType, description } = data;
    const email = Meteor.user().username;
    // console.log('the owner:', email);
    Reports.collection.insert({ reportType, email, description },
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
      <Grid container centered id='add-report-page'>
        <Grid.Column>
          <Header as="h2" textAlign="center">Report A Problem</Header>
          <Segment style={{ paddingBottom: '50px' }}>
            <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)}>
              <SelectField id='reportType' name='reportType' options={reportTypes}/>
              <LongTextField id='reportDescription' name='description' placeholder='Write your report here.
              If there is a particular offender, be sure to mention their email and/or name in your message.' />
              <SubmitField id='reportSubmit' value='Submit' style={{ float: 'right' }}/>
              <ErrorsField/>
            </AutoForm>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default AddReport;
