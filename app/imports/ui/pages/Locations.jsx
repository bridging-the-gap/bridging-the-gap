import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Loader, Card, Image } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Locations } from '../../api/locations/Locations';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesLocations } from '../../api/profiles/ProfilesLocations';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import { ProjectsLocations } from '../../api/projects/ProjectsLocations';

/** Returns the Profiles and Projects associated with the passed Location. */
function getLocationData(name) {
  const profiles = _.pluck(ProfilesLocations.collection.find({ location: name }).fetch(), 'profile');
  const profilePictures = profiles.map(profile => Profiles.collection.findOne({ email: profile }).picture);
  const projects = _.pluck(ProjectsLocations.collection.find({ location: name }).fetch(), 'project');
  const projectPictures = projects.map(project => Projects.collection.findOne({ name: project }).picture);
  // console.log(_.extend({ }, data, { locations, projects: projectPictures }));
  return _.extend({ }, { name, profiles: profilePictures, projects: projectPictures });
}

/** Component for layout out an Location Card. */
const MakeCard = (props) => (
  <Card>
    <Card.Content>
      <Card.Header style={{ marginTop: '0px' }}>{props.location.name}</Card.Header>
    </Card.Content>
    <Card.Content extra>
      {_.map(props.location.profiles, (p, index) => <Image key={index} circular size='mini' src={p}/>)}
      {_.map(props.location.projects, (p, index) => <Image key={index} circular size='mini' src={p}/>)}
    </Card.Content>
  </Card>
);

MakeCard.propTypes = {
  location: PropTypes.object.isRequired,
};

/** Renders the Locations as a set of Cards. */
class LocationsPage extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const locations = _.pluck(Locations.collection.find().fetch(), 'name');
    const locationData = locations.map(location => getLocationData(location));
    return (
      <Container id="locations-page">
        <Card.Group>
          {_.map(locationData, (location, index) => <MakeCard key={index} location={location}/>)}
        </Card.Group>
      </Container>
    );
  }
}

LocationsPage.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(ProfilesProjects.userPublicationName);
  const sub2 = Meteor.subscribe(Projects.userPublicationName);
  const sub3 = Meteor.subscribe(ProjectsLocations.userPublicationName);
  const sub4 = Meteor.subscribe(Profiles.userPublicationName);
  const sub5 = Meteor.subscribe(Locations.userPublicationName);
  const sub6 = Meteor.subscribe(ProfilesLocations.userPublicationName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready(),
  };
})(LocationsPage);
