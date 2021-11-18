import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Segment, Grid, Button, Loader } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, SubmitField, ErrorsField } from 'uniforms-semantic';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Companies } from '../../api/company/Companies';

const formSchema = new SimpleSchema({
  companyName: String,
  location: String,
  contact: String,
  industry: String,
  image: String,
  description: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Profile Collection as a set of Cards. */
class CompanyHome extends React.Component {

  // Check for subscriptions.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    let fRef = null;
    return (
      <Grid id='company-home' columns={2}>
        <Grid.Column width={6} color={'black'}>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)}>
            <Segment>
              <TextField name='companyName'/>
              <TextField name='location'/>
              <TextField name='contact'/>
              <TextField name='industry'/>
              <TextField name='image'/>
              <LongTextField name='description'/>
              <SubmitField value='Submit'/>
              <ErrorsField/>
            </Segment>
          </AutoForm>
        </Grid.Column>
        <Grid.Column class="createJob" width={10} color={'grey'}>
          <Button primary>Add Job Listing</Button>
        </Grid.Column>
      </Grid>
    );
  }
}

CompanyHome.propTypes = {
  companies: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Companies.userPublicationName);
  return {
    companies: Companies.collection.find({}).fetch(),
    ready: sub1.ready(),
  };
})(CompanyHome);
