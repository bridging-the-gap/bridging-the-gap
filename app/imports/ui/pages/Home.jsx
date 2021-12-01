import React from 'react';
import { Container, Form, Table, Header, Segment, Grid, Button, Card, Loader, Icon, Item } from 'semantic-ui-react';
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
import ReportItem from '../components/ReportItem';
import { Profiles } from '../../api/profiles/Profiles';
import Email from '../components/Email';
import DeleteUser from '../components/DeleteUser';
import { Companies } from '../../api/company/Companies';
import Company from '../components/Company';
import { Jobs } from '../../api/job/Jobs';
import Job from '../components/Job';

function getEventData(eventName) {
  const data = Events.collection.findOne({ eventName });
  return _.extend({ }, data);
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
// For admin page: create new category section.
const formSchema1 = new SimpleSchema({
  name: String,
  description: String,
});

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

const bridge1 = new SimpleSchema2Bridge(formSchema1);

const bridge2 = new SimpleSchema2Bridge(studentSchema);

class Home extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready ? this.renderPage() : <Loader active>Getting data</Loader>);
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    let fRef = null;
    const events = _.pluck(Events.collection.find().fetch(), 'eventName');
    const eventData = events.map(event => getEventData(event));
    return (
      <Container id='home-page'>
        {/* Start of admin page */}
        {Roles.userIsInRole(Meteor.userId(), 'admin') ?
          <div id='admin-page'>
            <div style={{ paddingBottom: '50px' }}>
              <Header as="h2" textAlign="center" style={{ color: 'blue' }}>Create New Categories</Header>
              <AutoForm ref={ref => { fRef = ref; }} schema={bridge1} onSubmit={data => this.submit(data, fRef)}
                style={{ backgroundColor: 'blue', padding: '50px 20px 70px 20px' }}>
                <Segment>
                  <Form.Group widths={'equal'}>
                    <TextField id='name' name='name' placeholder='Category name'/>
                  </Form.Group>
                  <Form.Group widths={'equal'}>
                    <LongTextField id='description' name='description' placeholder='Describe the new category here'/>
                  </Form.Group>
                  <SubmitField id='submit' value='Submit' style={{ float: 'right', marginTop: '20px', marginRight: '-15px' }}/>
                  <ErrorsField/>
                </Segment>
              </AutoForm>
            </div>
            <div style={{ paddingBottom: '50px' }}>
              <Header as="h2" textAlign="center" style={{ color: 'red' }}>Inappropriate Content Reports</Header>
              <div style={{ maxHeight: '400px', overflowX: 'scroll' }}>
                <Table celled color='red' inverted>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>From</Table.HeaderCell>
                      <Table.HeaderCell>About</Table.HeaderCell>
                      <Table.HeaderCell>Description</Table.HeaderCell>
                      <Table.HeaderCell>Delete</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {this.props.reports.map((report) => <ReportItem key={report._id} report={report}
                      Reports={Reports}/>)}
                  </Table.Body>
                </Table>
              </div>
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
            <Grid.Column width={6} style={{ backgroundColor: 'white' }}>
              <Header as="h3" textAlign="center">Make Student Profile</Header>
              <AutoForm ref={ref => { fRef = ref; }} schema={bridge2} onSubmit={data => this.submit(data, fRef)}>
                <Segment>
                  <TextField name='firstName'/>
                  <TextField name='lastName'/>
                  <TextField name='email'/>
                  <TextField name='title'/>
                  <TextField name='locations'/>
                  <TextField name='skills'/>
                  <TextField name='projects'/>
                  <TextField name='picture'/>
                  <LongTextField name='bio'/>
                  <SubmitField value='Submit'/>
                  <ErrorsField/>
                </Segment>
              </AutoForm>
            </Grid.Column>
            <Grid.Column width={10} style={{ backgroundColor: 'white' }}>
              <Header as="h3" textAlign="center">Suggested for you</Header>
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
              {Companies.collection.find({ owner: Meteor.user().username }).fetch().length === 0 ?
                <Button attached='top'><Link to={'/addCompany'}>Create Profile</Link></Button> :
                <Button attached='top'>Profile</Button>
              }
              {this.props.companies.map((company, index1) => <Company key={index1} company={company} />)}
            </Grid.Column>
            <Grid.Column width={10}>
              <Button attached={'top'}><Link to={'/addJob'}>Add Job Listing</Link></Button>
              <Header as="h2" textAlign="center" inverted>Your job listings</Header>
              <Segment>
                <Card.Group>
                  {this.props.jobs.map((job, index2) => <Job key={index2} job={job} />)}
                </Card.Group>
              </Segment>
              <Button attached={'top'} id="home-addEvent"><Link to={'/addEvent'}>Add Event</Link></Button>
              <Header as="h2" textAlign="center" inverted>Your upcoming events</Header>
              <Item.Group divided>
                {_.map(eventData, (event, index) => <MakeItem key={index} event={event}/>)}
              </Item.Group>
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
  companies: PropTypes.array.isRequired,
  jobs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Roles.subscription;
  const sub2 = Meteor.subscribe(Reports.userPublicationName);
  const sub3 = Meteor.subscribe(Profiles.userPublicationName);
  const sub4 = Meteor.subscribe(Companies.userPublicationName);
  const sub5 = Meteor.subscribe(Jobs.userPublicationName);
  const sub6 = Meteor.subscribe(Events.userPublicationName);

  // Get the Reports documents
  const reports = Reports.collection.find({}).fetch();
  // Get the Profiles documents
  const profiles = Profiles.collection.find({}).fetch();
  // Get access to Companies documents
  const companies = Companies.collection.find({}).fetch();
  // Get access to Jobs documents
  const jobs = Jobs.collection.find({}).fetch();
  return {
    reports,
    profiles,
    companies,
    jobs,
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready(),
  };
})(Home);
