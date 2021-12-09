import React, { useState } from 'react';
import { send } from 'emailjs-com';
import { Button, Form, Grid, TextArea } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

function Feedback() {
  /**
   * toSend is the object with the 4 props specified below.
   * setToSend is the function used to update toSend.
   */
  const [toSend, setToSend] = useState({
    from_name: '',
    to_name: 'Bridging the Gap',
    feedback: '',
    reply_to: '',
  });
  /** Sends the user's message to the bridgingthegap email if it is valid. */
  const onSubmit = (e) => {
    /** Conditions to check that the content of the fields is not just blank spaces. */
    if (toSend.feedback.trim() === '' || toSend.from_name.trim() === '' || toSend.reply_to.trim() === '') {
      Swal.fire({
        title: 'Cannot Send Feedback.',
        text: 'You may have one or more fields with just blank spaces. Please fix this to send feedback.',
        icon: 'error',
      });
    } else {
      e.preventDefault();
      send(
        'service_wkj8itv',
        'template_ocfhyks',
        toSend,
        'user_Ey34lRfmT3AeUH9zvqgTX',
      )
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
          swal('Message received!', 'Thank you for your feedback!', 'success');
        })
        .catch((err) => {
          console.log('FAILED...', err);
          Swal.fire({
            title: 'Failed to Receive Message',
            text: 'You may have found a bug. ' +
              'Please send us an email at bridgingthegap@gmail.com so we can resolve the issue.',
            icon: 'error',
          });
        });
    }
  };
  /** Updates value of each field as user types. */
  const handleChange = (e) => {
    setToSend({ ...toSend, [e.target.name]: e.target.value });
  };
  /** Resets field values if reset button is pressed. */
  const handleClick = () => {
    setToSend({
      from_name: '',
      to_name: 'Bridging the Gap',
      feedback: '',
      reply_to: '' });
  };
  /** Do not clear field if enter key is pressed. */
  const keypress = (e) => {
    if (e.key === 'Enter') {
      console.log('Enter key was hit. Do not clear value in field.');
      e.preventDefault();
    }
  };
  return (
    <Grid.Row>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Input required id='from_name' name='from_name' type='text' placeholder='Name'
            value={toSend.from_name} onChange={handleChange} onKeyPress={keypress} width={7} />
          <Form.Input required id='reply_to' name='reply_to' placeholder='Email' type='email'
            value={toSend.reply_to} onChange={handleChange} onKeyPress={keypress} width={6} />
          <Button type='submit' size='small' style={{ float: 'right' }} onClick={handleClick}>Reset Fields</Button>
        </Form.Group>
        <Form.Group>
          <TextArea required id='feedback' name='feedback' placeholder='Let us know what you think!'
            style={{ width: '500px', maxHeight: '200px', minHeight: '100px' }}
            type='text' value={toSend.feedback} onChange={handleChange} onKeyPress={keypress} />
          <Button id='feedback-button' type='submit' size='huge' style={{ float: 'right' }}>Send</Button>
        </Form.Group>
      </Form>
    </Grid.Row>
  );
}

/** Declare the types of all properties. */
Feedback.propTypes = {
  currentUser: PropTypes.string,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const FeedbackContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : 'anonymous',
}))(Feedback);

export default withRouter(FeedbackContainer);
