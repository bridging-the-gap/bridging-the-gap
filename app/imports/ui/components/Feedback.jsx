import React, { useState } from 'react';
import { send } from 'emailjs-com';
import { Button, Form, Grid, TextArea } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

function Feedback() {
  const [toSend, setToSend] = useState({
    from_name: '',
    to_name: 'Bridging the Gap',
    feedback: '',
    reply_to: '',
  });
  const onSubmit = (e) => {
    e.preventDefault();
    send(
      'service_wkj8itv',
      'template_ocfhyks',
      toSend,
      'user_Ey34lRfmT3AeUH9zvqgTX',
    )
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
      })
      .catch((err) => {
        console.log('FAILED...', err);
      });
  };
  const handleChange = (e) => {
    setToSend({ ...toSend, [e.target.name]: e.target.value });
  };
  return (
    <Grid.Row>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Input id='from_name' name='from_name' type='text' placeholder='Name (optional)'
            value={toSend.from_name} onChange={handleChange} width={7} />
          <Form.Input id='reply_to' name='reply_to' placeholder='Email (optional)' type='text'
            value={toSend.reply_to} onChange={handleChange} width={6} />
        </Form.Group>
        <Form.Group>
          <TextArea required id='feedback' name='feedback' placeholder='Let us know what you think!'
            style={{ width: '500px' }} type='text' value={toSend.feedback} onChange={handleChange}/>
          <Button type='submit' size='huge' style={{ float: 'right' }}>Send</Button></Form.Group>
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
