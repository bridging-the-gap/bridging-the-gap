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
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesLocations } from '../../api/profiles/ProfilesLocations';
import MultiSelectField from '../forms/controllers/MultiSelectField';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allLocations) => new SimpleSchema({
  locations: { type: Array, label: 'Locations', optional: true },
  'locations.$': { type: String, allowedValues: allLocations },
});

function getProfileData(email) {
  const data = Profiles.collection.findOne({ email });
  const locations = _.pluck(ProfilesLocations.collection.find({ profile: email }).fetch(), 'location');
  return _.extend({ }, data, { locations });
}

/** Component for layout out a Profile Card. */
const MakeCard = (props) => (
  <Card>
    <Card.Content>
      <Image floated='right' size='mini' src={props.profile.picture}/>
      <Card.Header href={props.profile.webpage}>{props.profile.firstName} {props.profile.lastName}</Card.Header>
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
        <a style={{ color: 'blue' }} href={`mailto:${props.profile.email}?subject=Message from BTG user ${Meteor.user().username}`}>{props.profile.email}</a>
      </Card.Meta>
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Locations</Header>
      {_.map(props.profile.locations,
        (location, index) => <Label key={index} size='tiny' color='teal'>{location}</Label>)}
    </Card.Content>
  </Card>
);

/** Properties */
MakeCard.propTypes = {
  profile: PropTypes.object.isRequired,
};

/** Renders the Profile Collection as a set of Cards. */
class BrowseCompanies extends React.Component {

  constructor(props) {
    super(props);
    this.state = { locations: [] };
  }

  submit(data) {
    this.setState({ locations: data.locations || [] });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const allLocations = _.pluck(Locations.collection.find().fetch(), 'name');
    const formSchema = makeSchema(allLocations);
    const bridge = new SimpleSchema2Bridge(formSchema);
    const emails = _.pluck(ProfilesLocations.collection.find({ location: { $in: this.state.locations } }).fetch(), 'profile');
    const profileData = _.uniq(emails).map(email => getProfileData(email));
    const companyData = _.filter(profileData, function (oneprofile) {
      return oneprofile.role === 'company';
    });
    return (
      <Container id="browse-companies-page">
        <AutoForm schema={bridge} onSubmit={data => this.submit(data)} >
          <Segment>
            <MultiSelectField id='locations' name='locations' showInlineError={true} placeholder={'Choose locations'}/>
            <SubmitField id='submit' value='Submit'/>
          </Segment>
        </AutoForm>
        <Card.Group style={{ paddingTop: '10px' }}>
          {_.map(companyData, (profile, index) => <MakeCard key={index} profile={profile}/>)}
        </Card.Group>
      </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
BrowseCompanies.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Profiles.userPublicationName);
  const sub2 = Meteor.subscribe(ProfilesLocations.userPublicationName);
  const sub3 = Meteor.subscribe(Locations.userPublicationName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready(),
  };
})(BrowseCompanies);
