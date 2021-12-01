import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Job extends React.Component {
  render() {
    return (
      <Card fluid color={'blue'}>
        <Card.Content>
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
