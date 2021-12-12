import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Loader, Card, Image, Label, Header } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesLocations } from '../../api/profiles/ProfilesLocations';
import { ProfilesSkills } from '../../api/profiles/ProfilesSkills';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';

/** Returns the Profile and associated Projects and Locations associated with the passed user email. */
function getProfileData(email) {
  const data = Profiles.collection.findOne({ email });
  const locations = _.pluck(ProfilesLocations.collection.find({ profile: email }).fetch(), 'location');
  const skills = _.pluck(ProfilesSkills.collection.find({ profile: email }).fetch(), 'skill');
  const projects = _.pluck(ProfilesProjects.collection.find({ profile: email }).fetch(), 'project');
  const projectPictures = projects.map(project => Projects.collection.findOne({ name: project }).picture);
  return _.extend({ }, data, { locations, skills, projects: projectPictures });
}

/** Component for layout out a Profile Card. */
const MakeCard = (props) => (
  <Card>
    <Card.Content>
      <Image floated='right' size='mini' src={props.profile.picture} />
      <Card.Header>{props.profile.firstName} {props.profile.lastName}</Card.Header>
      <Card.Meta>
        <span className='date'>{props.profile.title}</span>
      </Card.Meta>
      <Card.Description>
        {props.profile.bio}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Locations</Header>
      {_.map(props.profile.locations,
        (location, index) => <Label key={index} size='tiny' color='teal'>{location}</Label>)}
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Skills</Header>
      {_.map(props.profile.skills,
        (skill, index) => <Label key={index} size='tiny' color='teal'>{skill}</Label>)}
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Projects</Header>
      {_.map(props.profile.projects, (project, index) => <Image key={index} size='mini' src={project}/>)}
    </Card.Content>
  </Card>
);

MakeCard.propTypes = {
  profile: PropTypes.object.isRequired,
};

/** Renders the Profile Collection as a set of Cards. */
class StudentProfilePage extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const emails = _.pluck(Profiles.collection.find().fetch(), 'email');
    const profileData = emails.map(email => getProfileData(email));
    return (
      <Container id="profiles-page">
        <Header as="h2" textAlign="center">Student profile page</Header>
        <Card.Group>
          {_.map(profileData, (profile, index) => <MakeCard key={index} profile={profile}/>)}
        </Card.Group>
      </Container>
    );
  }
}

StudentProfilePage.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Profiles.userPublicationName);
  const sub2 = Meteor.subscribe(ProfilesLocations.userPublicationName);
  const sub3 = Meteor.subscribe(ProfilesSkills.userPublicationName);
  const sub4 = Meteor.subscribe(ProfilesProjects.userPublicationName);
  const sub5 = Meteor.subscribe(Projects.userPublicationName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready(),
  };
})(StudentProfilePage);
