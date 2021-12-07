import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Form, Grid, Header, Segment } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import PropTypes from 'prop-types';
import { Events } from '../../api/events/Events';

/** Renders the Page for adding a document. */
class AddEvent extends React.Component {

  /** On submit, insert the data. */
  submit(data, formRef) {
    const { eventName, date, location, description, picture } = data;
    const owner = Meteor.user().username;
    Events.collection.insert({ eventName, date, location, description, picture, owner },
      (error) => {
        // Meteor.call(addJobMethod, data, (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Event added successfully', 'success').then(() => formRef.reset());
        }
      });
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    const formSchema = new SimpleSchema({
      eventName: { type: String },
      date: { type: String },
      location: { type: String },
      description: { type: String },
      picture: { type: String },
    });
    const bridge = new SimpleSchema2Bridge(formSchema);
    return (
      <Grid id="add-event-page" container centered>
        <Grid.Column>
          <Header as="h2" textAlign="center">Add Event</Header>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)}>
            <Segment>
              <Form.Group widths={'equal'}>
                <TextField id='eventName' name='eventName' showInlineError={true} placeholder='Event name'/>
                <TextField id='date' name='date' showInlineError={true} placeholder='Date'/>
                <TextField id='location' name='location' showInlineError={true} placeholder='Location'/>
                <TextField id='picture' name='picture' showInlineError={true} placeholder='Picture'/>
              </Form.Group>
              <LongTextField id='description' name='description' placeholder='Describe the event here'/>
              <SubmitField id='submit' value='Submit'/>
              <ErrorsField/>
            </Segment>
          </AutoForm>
        </Grid.Column>
      </Grid>
    );
  }
}

AddEvent.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub = Meteor.subscribe(Events.userPublicationName);
  return {
    ready: sub.ready(),
  };
})(AddEvent);
