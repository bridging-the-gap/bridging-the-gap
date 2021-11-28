import React, { useState } from 'react';
import { send } from 'emailjs-com';
import { Form, Grid, TextArea } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import Swal from 'sweetalert2';

function Email() {
  /**
   * toSend is the object with the 4 props specified below.
   * setToSend is the function used to update toSend.
   */
  const [toSend, setToSend] = useState({
    to_name: '',
    description: '',
  });
  /** Sends the user's message to the bridgingthegap email if it is valid. */
  const onSubmit = (e) => {
    /** Conditions to check that the content of the fields is not just blank spaces. */
    if (toSend.to_name.trim() === '' || toSend.description.trim() === '') {
      Swal.fire({
        title: 'Cannot Send Email.',
        text: 'You may have one or more fields with just blank spaces. Please fix this to send Email.',
        icon: 'error',
      });
    } else {
      e.preventDefault();
      send(
        'service_wkj8itv',
        'template_0p00ejd',
        toSend,
        'user_Ey34lRfmT3AeUH9zvqgTX',
      )
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
          Swal.fire({
            title: 'Message Sent',
            text: 'Email was successfully sent.',
            icon: 'success',
          }).then(() => setToSend({
            to_name: '',
            description: '' }));
        })
        .catch((err) => {
          console.log('FAILED...', err);
          Swal.fire({
            title: 'Failed to Receive Message',
            text: 'You may have found a bug.',
            icon: 'error',
          });
        });
    }
  };
  /** Updates value of each field as user types. */
  const handleChange = (e) => {
    setToSend({ ...toSend, [e.target.name]: e.target.value });
  };

  return (
    <Grid style={{ height: '400px', backgroundColor: 'blue' }} centered columns={1}>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <TextArea id='description' name='description' placeholder='Email Description...' style={{
            width:
              '600px', height: '300px', maxHeight: '300px', marginTop: '20px',
          }} value={toSend.description} onChange={handleChange}/>
        </Form.Group>
        <Form.Group>
          <Form.Input id='to_name' name='to_name' placeholder='email of recipient'
            style={{ width: '485px', marginLeft: '-5px' }} value={toSend.to_name}
            onChange={handleChange}/>
          <Form.Button type='submit' size='large' style={{ float: 'right' }}>Submit</Form.Button>
        </Form.Group>
      </Form>
    </Grid>
  );
}

/** Declare the types of all properties. */
Email.propTypes = {
  currentUser: PropTypes.string,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const EmailContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : 'anonymous',
}))(Email);

export default withRouter(EmailContainer);
