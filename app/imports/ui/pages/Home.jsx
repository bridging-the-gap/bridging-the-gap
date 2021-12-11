import React from 'react';
import { Container, Header, Segment, Grid, Button, Card, Loader, Item } from 'semantic-ui-react';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Events } from '../../api/events/Events';
import { Reports } from '../../api/reports/Reports';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesEvents } from '../../api/profiles/ProfilesEvents';
import Email from '../components/Email';
import DeleteUser from '../components/DeleteUser';
import Company from '../components/Company';
import { Jobs } from '../../api/job/Jobs';
import Job from '../components/Job';
import Event from '../components/Event';
import NewCategory from '../components/NewCategory';
import ReportFilter from '../components/ReportFilter';
import { ProfilesJobs } from '../../api/profiles/ProfilesJobs';
import { ProfilesLocations } from '../../api/profiles/ProfilesLocations';
import { ProfilesSkills } from '../../api/profiles/ProfilesSkills';
import MakeEvent from '../components/MakeEvent';
import MakeJob from '../components/MakeJob';

function getProfileData(email) {
  const data = Profiles.collection.findOne({ email });
  const locations = _.pluck(ProfilesLocations.collection.find({ profile: email }).fetch(), 'location');
  const skills = _.pluck(ProfilesSkills.collection.find({ profile: email }).fetch(), 'skill');
  // const projects = _.pluck(ProfilesProjects.collection.find({ profile: email }).fetch(), 'project');
  // const projectPictures = projects.map(project => Projects.collection.findOne({ name: project }).picture);
  return _.extend({ }, data, { locations, skills });
}

function getProfileEventsData(event) {
  const data = Events.collection.findOne({ eventName: event });
  return _.extend({ }, data);
}

function getProfileJobsData(jobTitle) {
  const data = Jobs.collection.findOne({ jobTitle });
  return _.extend({ }, data);
}

class Home extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready ? this.renderPage() : <Loader active>Getting data</Loader>);
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    // const fRef = null;
    const email = Meteor.user().username;
    const events = _.pluck(ProfilesEvents.collection.find({ }).fetch(), 'event');
    const profilesEventsData = _.uniq(events).map(event => getProfileEventsData(event, email));
    // const profileData = Profiles.collection.findOne({ email });
    const companyData = getProfileData(email);
    // const profileData = getProfileData(email);
    // const profilesEvents = _.pluck(ProfilesEvents.collection.find({ profile: email }).fetch(), 'event');
    // const profilesEventsData = profilesEvents.map(events => getProfileEventsData(events));
    // console.log(profilesEvents);
    const profilesJobs = _.pluck(ProfilesJobs.collection.find({ profile: email }).fetch(), 'job');
    const profilesJobsData = profilesJobs.map(jobs => getProfileJobsData(jobs));
    // const profilesEvents = _.pluck(ProfilesEvents.collection.find().fetch(), { email });
    // const profilesEventsData = profilesEvents.map(events => getProfileEventsData(events));
    // const profilesJobs = _.pluck(ProfilesJobs.collection.find().fetch(), { email });
    /// const profilesJobsData = profilesJobs.map(jobs => getProfileJobsData(jobs));
    // const email = Meteor.user().username;
    // const profile = Profiles.collection.findOne({ email });
    return (
      <Container id='home-page'>
        {/* Start of admin page */}
        {Roles.userIsInRole(Meteor.userId(), 'admin') ?
          <div id='admin-page'>
            <div style={{ paddingBottom: '50px' }}>
              <Header as="h2" textAlign="center" style={{ color: 'blue' }}>Create New Categories</Header>
              <NewCategory/>
            </div>
            <div style={{ paddingBottom: '50px' }}>
              <Header as="h2" textAlign="center" style={{ color: 'red' }}>User Problem Reports</Header>
              <ReportFilter Reports={Reports}/>
              <Grid container style={{ border: '1px solid red', width: '510px', paddingTop: '30px', marginTop: '-10px' }} centered>
                <Header as="h3" style={{ paddingTop: '10px' }}>Delete Offending User</Header>
                <DeleteUser/>
              </Grid>
            </div>
            <Header as="h2" textAlign="center" style={{ color: 'blue' }}>Send Email to Clients</Header>
            <Email/>
          </div> : ''}
        {/* End of admin page */}
        {/* Start of student page */}
        {Roles.userIsInRole(Meteor.userId(), 'student') ?
          <Grid id='student-home' columns={2}>
            <Grid.Column width={8} style={{ backgroundColor: 'white' }}>
              <Header as="h3" textAlign="center">Your Favourite Job Listings</Header>
              <Item.Meta>The job listings you ave favourited from the Jobs page will show up here.</Item.Meta>
              <Segment>
                <Item.Group divided>
                  {_.map(profilesJobsData, (job, index) => {
                    if (ProfilesJobs.collection.find({ profile: Meteor.user().username, job: job.jobTitle }).fetch().length === 1) {
                      return <MakeJob key={index} job={job}/>;
                    } return '';
                  })
                  }
                </Item.Group></Segment>
            </Grid.Column>
            <Grid.Column width={8} style={{ backgroundColor: 'white' }}>
              <Header as="h3" textAlign="center">Your Favourite Events</Header>
              <Item.Meta>The events you ave favourited from the Events page will show up here.</Item.Meta>
              <Segment>
                <Item.Group divided>
                  {_.map(profilesEventsData, (event, index) => {
                    if (ProfilesEvents.collection.find({ profile: Meteor.user().username, event: event.eventName }).fetch().length === 1) {
                      return <MakeEvent key={index} event={event}/>;
                    }
                    return '';
                  })
                  }
                </Item.Group></Segment>
            </Grid.Column>
          </Grid> : ''}
        {/* End of student page */}
        {/* Start of company page */}
        {Roles.userIsInRole(Meteor.userId(), 'company') ?
          <Grid id='company-home' columns={2}>
            <Grid.Column width={6} style={{ backgroundColor: 'blue' }}>
              <Company company={companyData} />
            </Grid.Column>
            <Grid.Column width={10}>
              <Button attached={'top'} id="addJob" ><Link to={'/addJob'}>Add Job Listing</Link></Button>
              <Header as="h2" textAlign="center" inverted>Your job listings</Header>
              <Segment>
                <Card.Group>
                  {this.props.jobs.map((job, index2) => { if (job.owner === email) { return <Job key={index2} job={job} />; } return ''; })}
                </Card.Group>
              </Segment>
              <Button attached={'top'} id="home-addEvent"><Link to={'/addEvent'}>Add Event</Link></Button>
              <Header as="h2" textAlign="center" inverted>Your upcoming events</Header>
              <Segment>
                <Card.Group>
                  {this.props.events.map((event, index2) => {
                    if (event.owner === email) { return <Event key={index2} event={event} />; } return '';
                  })}
                </Card.Group>
              </Segment>
            </Grid.Column>
          </Grid> : ''}
        {/* End of company page */}
      </Container>
    );
  }
}

Home.propTypes = {
  reports: PropTypes.array.isRequired,
  profiles: PropTypes.array.isRequired,
  profilesEvents: PropTypes.array.isRequired,
  profilesJobs: PropTypes.array.isRequired,
  jobs: PropTypes.array.isRequired,
  events: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Roles.subscription;
  const sub2 = Meteor.subscribe(Reports.userPublicationName);
  const sub3 = Meteor.subscribe(Profiles.userPublicationName);
  const sub5 = Meteor.subscribe(Jobs.userPublicationName);
  const sub6 = Meteor.subscribe(Events.userPublicationName);
  const sub7 = Meteor.subscribe(ProfilesEvents.userPublicationName);
  const sub8 = Meteor.subscribe(ProfilesJobs.userPublicationName);
  const sub9 = Meteor.subscribe(ProfilesLocations.userPublicationName);
  // Get the Reports documents
  const reports = Reports.collection.find({}).fetch();
  // Get the Profiles documents
  const profiles = Profiles.collection.find({}).fetch();
  const profilesLocations = ProfilesLocations.collection.find({}).fetch();
  // Get access to Jobs documents
  const jobs = Jobs.collection.find({}).fetch();
  const events = Events.collection.find({}).fetch();
  const profilesEvents = ProfilesEvents.collection.find({}).fetch();
  const profilesJobs = ProfilesJobs.collection.find({}).fetch();
  return {
    reports,
    profiles,
    profilesEvents,
    profilesJobs,
    profilesLocations,
    jobs,
    events,
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub5.ready() && sub6.ready() && sub7.ready() && sub8.ready() && sub9.ready(),
  };
})(Home);
