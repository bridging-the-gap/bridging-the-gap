import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Loader, Card, Image, Label, Header, Grid, Segment, List } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import { Link } from 'react-router-dom';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesLocations } from '../../api/profiles/ProfilesLocations';
import { ProfilesSkills } from '../../api/profiles/ProfilesSkills';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import Job from '../components/JobPro';
import { Jobs } from '../../api/job/Jobs';

/** Returns the Profile and associated Projects and Locations associated with the passed user email. */
// function getProfileData(email) {
// const data = Profiles.collection.findOne({ email });
// const locations = _.pluck(ProfilesLocations.collection.find({ profile: email }).fetch(), 'location');
// const skills = _.pluck(ProfilesSkills.collection.find({ profile: email }).fetch(), 'skill');
// const projects = _.pluck(ProfilesProjects.collection.find({ profile: email }).fetch(), 'project');
// const projectPictures = projects.map(project => Projects.collection.findOne({ name: project }).picture);
// console.log(_.extend({ }, data, { locations, projects: projectPictures }));
// return _.extend({}, data, { locations, skills, projects: projectPictures });}

function getProfileData(email) {
  const data = Profiles.collection.findOne({ email });
  const locations = _.pluck(ProfilesLocations.collection.find({ profile: email }).fetch(), 'location');
  const skills = _.pluck(ProfilesSkills.collection.find({ profile: email }).fetch(), 'skill');
  // const projects = _.pluck(ProfilesProjects.collection.find({ profile: email }).fetch(), 'project');
  // const projectPictures = projects.map(project => Projects.collection.findOne({ name: project }).picture);
  return _.extend({ }, data, { locations, skills });
}

/** Component for layout out a Profile Card. */
const MakeCard = (props) => (
  <Card centered>
    <Card.Content>
      <Image floated='left' size='big' src={props.profile.picture} />
      <Card.Header>{props.profile.firstName} {props.profile.lastName}</Card.Header>
      <Card.Meta>
        <span className='date'>{props.profile.title}</span>
      </Card.Meta>
      <Card.Meta>
        <a style={{ color: 'blue' }} href={props.profile.webpage}>{props.profile.webpage} </a>
      </Card.Meta>
      <Card.Description>
        {props.profile.bio}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Skills</Header>
      {_.map(props.profile.skills,
        (skill, index) => <Label key={index} size='tiny' color='teal'>{skill}</Label>)}
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Preferred Locations</Header>
      {_.map(props.profile.locations,
        (skill, index) => <Label key={index} size='tiny' color='teal'>{skill}</Label>)}
    </Card.Content>
  </Card>
);

MakeCard.propTypes = {
  profile: PropTypes.object.isRequired,
};

/** Renders the Profile Collection as a set of Cards. */
class ProfilesPage extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    // const emails = _.pluck(Profiles.collection.find().fetch(), 'email');
    // const profileData = emails.map(email => getProfileData(email));
    const email = Meteor.user().username;
    const companyData = getProfileData(email);
    // const profileData = Profiles.collection.findOne({ email });
    const profileData = getProfileData(email);
    // console.log(profileData);
    return (
      <Container>
        {/* Start of student page */}
        {Roles.userIsInRole(Meteor.userId(), 'student') ?
          // const profileData = emails.map(email => getProfileData(email));
          <Container id="profiles-page">
            <MakeCard profile={profileData}/>
            <Link to={`/editProfile/${profileData._id}`}>Edit</Link>
          </Container> : ''}
        {/* End of student page */}
        {/* Start of company page */}
        {Roles.userIsInRole(Meteor.userId(), 'company') ?
          <div className={'home-background'} id="company-profile" >
            <Segment padded size='massive'>
              <Header as={'h1'} textAlign='center'>{companyData.firstName}</Header>
            </Segment>
            <Grid id='company-home' columns={2}>
              <Grid.Column width={6} style={{ backgroundColor: 'blue' }}>
                <Segment>
                  <List size={'large'}>
                    <List.Item icon={'mail'} content={companyData.email}/>
                    <List.Item/>
                    <List.Item icon={'globe'} content={companyData.webpage}/>
                    <List.Item/>
                    <List.Item icon={'industry'} content={companyData.title}/>
                    <List.Item/>
                    <List.Item icon={'map marker alternate'}
                      content={_.pluck(ProfilesLocations.collection.find({ profile: email }).fetch(), 'location')}/>
                    <List.Item/>
                    <List.Item>
                      <List.Icon name={'address card outline'}/>
                      <List.Content>
                        <List.Header>Description:</List.Header>
                        <List.Description>{companyData.bio}</List.Description>
                      </List.Content>
                    </List.Item>
                  </List>
                </Segment>
              </Grid.Column>
              <Grid.Column width={10} style={{ backgroundColor: 'blue' }}>
                <Header as="h2" textAlign="center" inverted> Job listings</Header>
                <Segment>
                  <Card.Group>
                    {this.props.jobs.map((job, index2) => { if (job.owner === email) { return <Job key={index2} job={job} />; } return ''; })}
                  </Card.Group>
                </Segment>
              </Grid.Column>
            </Grid>
          </div> : ''}
        {/* End of company page */}
      </Container>
    );
  }
}

ProfilesPage.propTypes = {
  ready: PropTypes.bool.isRequired,
  jobs: PropTypes.array.isRequired,
  // company: PropTypes.object.isRequired,
  // profile: PropTypes.object.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Profiles.userPublicationName);
  const sub2 = Meteor.subscribe(ProfilesLocations.userPublicationName);
  const sub3 = Meteor.subscribe(ProfilesSkills.userPublicationName);
  const sub4 = Meteor.subscribe(ProfilesProjects.userPublicationName);
  const sub5 = Meteor.subscribe(Projects.userPublicationName);
  const sub6 = Meteor.subscribe(Jobs.userPublicationName);
  const jobs = Jobs.collection.find({}).fetch();
  return {
    jobs,
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready(),
  };
})(ProfilesPage);
