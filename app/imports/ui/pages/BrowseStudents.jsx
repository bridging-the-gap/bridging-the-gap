import React from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Container, Loader, Card, Image, Label, Header, Segment } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { AutoForm, SubmitField } from 'uniforms-semantic';
import { Locations } from '../../api/locations/Locations';
import { Skills } from '../../api/skills/Skills';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesLocations } from '../../api/profiles/ProfilesLocations';
import { ProfilesSkills } from '../../api/profiles/ProfilesSkills';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import MultiSelectField from '../forms/controllers/MultiSelectField';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allSkills) => new SimpleSchema({
  skills: { type: Array, label: 'Skills', optional: true },
  'skills.$': { type: String, allowedValues: allSkills },
});

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
      <Card.Meta>
        <span>Contact email:</span>
        {/* If I split the lines up, there is extra space between the word 'user' and the e-mailer's username. */ }
        {/* eslint-disable-next-line max-len */}
        <a style={{ color: 'blue' }} href={`mailto:${props.profile.email}?subject=Message from BTG user ${Meteor.user().username}`}>{props.profile.email} </a>
      </Card.Meta>
      <Card.Meta>
        <span>Webpage:</span>
        <a style={{ color: 'blue' }} href={props.profile.webpage}>{props.profile.webpage} </a>
      </Card.Meta>
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

/** Properties */
MakeCard.propTypes = {
  profile: PropTypes.object.isRequired,
};

/** Renders the Profile Collection as a set of Cards. */
class BrowseStudents extends React.Component {

  constructor(props) {
    super(props);
    this.state = { skills: [] };
  }

  submit(data) {
    this.setState({ skills: data.skills || [] });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const allSkills = _.pluck(Skills.collection.find().fetch(), 'name');
    const formSchema = makeSchema(allSkills);
    const bridge = new SimpleSchema2Bridge(formSchema);
    const emails = _.pluck(ProfilesSkills.collection.find({ skill: { $in: this.state.skills } }).fetch(), 'profile');
    const profileData = _.uniq(emails).map(email => getProfileData(email));
    const studentData = _.filter(profileData, function (oneprofile) {
      return oneprofile.role === 'student';
    });
    return (
      <Container id="browse-students-page">
        <AutoForm schema={bridge} onSubmit={data => this.submit(data)} >
          <Segment>
            <MultiSelectField id='skills' name='skills' showInlineError={true} placeholder={'Choose skills'}/>
            <SubmitField id='submit' value='Submit'/>
          </Segment>
        </AutoForm>
        <Card.Group style={{ paddingTop: '10px' }}>
          {_.map(studentData, (profile, index) => <MakeCard key={index} profile={profile}/>)}
        </Card.Group>
      </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
BrowseStudents.propTypes = {
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
  const sub6 = Meteor.subscribe(Locations.userPublicationName);
  const sub7 = Meteor.subscribe(Skills.userPublicationName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready(),
  };
})(BrowseStudents);
