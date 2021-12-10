import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import { removeJobMethod } from '../../startup/both/Methods';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Job extends React.Component {
  handleClick = (job) => {
    Meteor.call(removeJobMethod, job, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      }
    });
  }

  render() {
    return (
      <Card fluid color={'blue'}>
        <Card.Content>
          <Card.Header style={{ float: 'right' }}>
            <Button basic compact id='companyRemoveJob' size='mini' icon='times' style={{ boxShadow: 'none' }}
              onClick={this.handleClick.bind(this, this.props.job)}/>
          </Card.Header>
          <Image floated={'left'} size={'small'} src={this.props.job.image}/>
          <Card.Header>{this.props.job.jobTitle}</Card.Header>
          <Card.Meta>Location: {this.props.job.location}</Card.Meta>
          <Card.Meta>Salary:  {this.props.job.salary}</Card.Meta>
          <Card.Meta>Industry: {this.props.job.industry}</Card.Meta>
          <Card.Description>{this.props.job.description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Link to={`/editJob/${this.props.job._id}`} id="editJob" >Edit</Link>
        </Card.Content>
      </Card>
    );
  }
}

// Require a document to be passed to this component.
Job.propTypes = {
  job: PropTypes.object.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(Job);
