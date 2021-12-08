import React from 'react';
import { Container, Header, Segment, Grid, Button, Card, Loader, Icon, Item } from 'semantic-ui-react';
import { AutoForm, ErrorsField, TextField, LongTextField, SubmitField } from 'uniforms-semantic';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Events } from '../../api/events/Events';
import { Reports } from '../../api/reports/Reports';
import { Profiles } from '../../api/profiles/Profiles';
import Email from '../components/Email';
import DeleteUser from '../components/DeleteUser';
import Company from '../components/Company';
import { Jobs } from '../../api/job/Jobs';
import Job from '../components/Job';
import Event from '../components/Event';
import NewCategory from '../components/NewCategory';
import ReportFilter from '../components/ReportFilter';
import { ProfilesLocations } from '../../api/profiles/ProfilesLocations';
import { ProfilesSkills } from '../../api/profiles/ProfilesSkills';
// import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
// import { Projects } from '../../api/projects/Projects';

function getProfileData(email) {
  const data = Profiles.collection.findOne({ email });
  const locations = _.pluck(ProfilesLocations.collection.find({ profile: email }).fetch(), 'location');
  const skills = _.pluck(ProfilesSkills.collection.find({ profile: email }).fetch(), 'skill');
  // const projects = _.pluck(ProfilesProjects.collection.find({ profile: email }).fetch(), 'project');
  // const projectPictures = projects.map(project => Projects.collection.findOne({ name: project }).picture);
  return _.extend({ }, data, { locations, skills });
}

const MakeItem = (props) => (
  <Item>
    <Item.Image size="small" src={props.event.picture}/>
    <Item.Content verticalAlign='middle'>
      <Item.Header as='a'>{props.event.eventName}</Item.Header>
      <Item.Meta>
        <span className='date'>{props.event.date} {'at'} {props.event.location}</span>
      </Item.Meta>
      <Item.Description>{props.event.description}</Item.Description>
      <Item.Extra>
        <Button primary floated='right'>
          Register for event
          <Icon name='right chevron' />
        </Button>
      </Item.Extra>
    </Item.Content>
  </Item>
);

MakeItem.propTypes = {
  event: PropTypes.object.isRequired,
};

// Create a schema to specify the structure of the data to appear in the form.
// For admin page: email section.
const studentSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  email: String,
  title: String,
  locations: String,
  skills: String,
  projects: String,
  picture: String,
  bio: String,
});

const bridge1 = new SimpleSchema2Bridge(studentSchema);

class Home extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready ? this.renderPage() : <Loader active>Getting data</Loader>);
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    let fRef = null;
    const email = Meteor.user().username;
    // const profileData = Profiles.collection.findOne({ email });
    const companyData = getProfileData(email);
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
              <Header as="h3" textAlign="center">Your Events</Header>
              <Segment>
                <Item.Group divided>
                  <Item>
                    <Item.Content>
                      <Item.Header>Favorite event</Item.Header>
                    </Item.Content>
                  </Item>
                </Item.Group></Segment>
            </Grid.Column>
            <Grid.Column width={8} style={{ backgroundColor: 'white' }}>
              <Header as="h3" textAlign="center">Your Job Listings</Header>
              <Segment>
                <Item.Group divided>
                  <Item>
                    <Item.Content>
                      <Item.Header>Create Job Agent</Item.Header>
                      <Item.Meta>
                        <Button primary>Submit CV</Button>
                      </Item.Meta>
                    </Item.Content>
                  </Item>
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

  // Get the Reports documents
  const reports = Reports.collection.find({}).fetch();
  // Get the Profiles documents
  const profiles = Profiles.collection.find({}).fetch();
  // Get access to Jobs documents
  const jobs = Jobs.collection.find({}).fetch();
  const events = Events.collection.find({}).fetch();
  return {
    reports,
    profiles,
    jobs,
    events,
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub5.ready() && sub6.ready(),
  };
})(Home);
