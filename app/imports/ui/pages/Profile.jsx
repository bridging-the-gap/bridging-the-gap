import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Divider, Container, Loader, Card, Image, Label, Header, Grid, Item, Segment, Button, Icon } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesLocations } from '../../api/profiles/ProfilesLocations';
import { ProfilesSkills } from '../../api/profiles/ProfilesSkills';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import { Link } from 'react-router-dom';

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
  const projects = _.pluck(ProfilesProjects.collection.find({ profile: email }).fetch(), 'project');
  const projectPictures = projects.map(project => Projects.collection.findOne({ name: project }).picture);
  return _.extend({ }, data, { locations, skills, projects: projectPictures });
}

/** Component for layout out a Profile Card. */
const MakeCard = (props) => (
  <Card centered>
    <Card.Content>
      <Image floated='center' size='big' src={props.profile.picture} />
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
    // const profileData = Profiles.collection.findOne({ email });
    const profileData = getProfileData(email);
    console.log(profileData);
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
          <div className={'home-background'}>
            <Grid stackable columns={3}>
              <Grid.Row/>
              <Grid.Row/>
              <Grid.Row/>
              <Grid.Row/>
              <Grid.Row>
                <Grid.Column/>
                <Grid.Column textAlign={'center'}>University of Hawaii at Manoa</Grid.Column>
                <Grid.Column/>
              </Grid.Row>
            </Grid>
            <Grid columns={2}>
              <Grid.Column width={6} style={{ backgroundColor: 'blue' }}>
                <Segment>
                  <Header as={'h3'}>Location</Header>
                  <p>Hawaii</p>
                  <Divider section />
                  <Header as={'h3'}>Contact Info</Header>
                  <p>Contact@hawaii.edu</p>
                  <Divider section />
                  <Header as={'h3'}>Industry</Header>
                  <Label as='a' color='teal' tag>
                    Liberal Arts
                  </Label>
                  <Label as='a' color='teal' tag>
                    Psychology
                  </Label>
                  <Divider section />
                  <Header as={'h3'}>Description</Header>
                  <p> Founded in 1907, the University of Hawaiʻi at Mānoa is a destination of choice for students and faculty
                    from across the nation and the world. UH Mānoa offers unique research opportunities, a diverse community,
                    a nationally-ranked Division I athletics program and much more. </p>
                  <Divider section />
                </Segment>
              </Grid.Column>
              <Grid.Column width={10} style={{ backgroundColor: 'black' }}>
                <Segment>
                  <Item.Group divided>
                    <Item>
                      <Item.Image size='tiny' src='https://www.pngfind.com/pngs/m/183-1834345_uh-manoa-seal-logo-university-of-hawaii-hd.png'/>

                      <Item.Content>
                        <Item.Header>Public Safety</Item.Header>
                        <Item.Meta>
                          <span className='price'>$1200</span>
                          <span className='stay'>Semester</span>
                        </Item.Meta>
                        <Item.Extra>
                          <Label>Hawaii</Label>
                        </Item.Extra>
                        <Item.Extra>
                          <Label>Liberal Arts</Label>
                        </Item.Extra>
                        <Item.Description> Walk around and look intimidating </Item.Description>
                        <Button primary floated='right'>
                        Apply
                          <Icon name='right chevron' />
                        </Button>
                      </Item.Content>
                    </Item>

                    <Item>
                      <Item.Image size='tiny' src='https://www.pngfind.com/pngs/m/183-1834345_uh-manoa-seal-logo-university-of-hawaii-hd.png'/>

                      <Item.Content>
                        <Item.Header> Dorm RA </Item.Header>
                        <Item.Meta>
                          <span className='price'>$1000</span>
                          <span className='stay'>Semester</span>
                        </Item.Meta>
                        <Item.Extra>
                          <Label>Hawaii</Label>
                        </Item.Extra>
                        <Item.Extra>
                          <Label>Psychology</Label>
                        </Item.Extra>
                        <Item.Description>Deal with drunk students</Item.Description>
                        <Button primary floated='right'>
                          Apply
                          <Icon name='right chevron' />
                        </Button>
                      </Item.Content>
                    </Item>
                  </Item.Group></Segment>
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
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready(),
  };
})(ProfilesPage);
