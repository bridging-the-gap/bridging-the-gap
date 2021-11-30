import React from 'react';
import { Container, Form, Table, Header, Segment, Grid, Button, Item, Label, Loader } from 'semantic-ui-react';
import { AutoForm, ErrorsField, TextField, LongTextField, SubmitField } from 'uniforms-semantic';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Reports } from '../../api/reports/Reports';
import ReportItem from '../components/ReportItem';
import { Profiles } from '../../api/profiles/Profiles';
import Email from '../components/Email';
import DeleteUser from '../components/DeleteUser';
import { Companies } from '../../api/company/Companies';
import Company from '../components/Company';

// Create a schema to specify the structure of the data to appear in the form.
// For admin page: create new category section.
const formSchema1 = new SimpleSchema({
  name: String,
  description: String,
});

const bridge1 = new SimpleSchema2Bridge(formSchema1);

class Home extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready ? this.renderPage() : <Loader active>Getting data</Loader>);
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    let fRef = null;
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
        {/* End of student page */}
        {/* Start of company page */}
        {Roles.userIsInRole(Meteor.userId(), 'company') ?
          <Grid id='company-home' columns={2}>
            <Grid.Column width={6} style={{ backgroundColor: 'blue' }}>
              <Button attached='top'><Link to={'/addCompany'}>Edit Profile</Link></Button>
              <Segment>
                {this.props.companies.map((company, index) => <Company key={index} company={company} />)}
              </Segment>
            </Grid.Column>
            <Grid.Column width={10} style={{ backgroundColor: 'black' }}>
              <Button color={'white'}><Link to={'/addJob'}>Add Job Listing</Link></Button>
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
                    </Item.Content>
                  </Item>
                </Item.Group></Segment>
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
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Roles.subscription;
  const sub2 = Meteor.subscribe(Reports.userPublicationName);
  const sub3 = Meteor.subscribe(Profiles.userPublicationName);
  const sub4 = Meteor.subscribe(Companies.userPublicationName);
  // Get the Reports documents
  const reports = Reports.collection.find({}).fetch();
  // Get the Profiles documents
  const profiles = Profiles.collection.find({}).fetch();
  // Get access to Companies documents
  const companies = Companies.collection.find({}).fetch();
  return {
    reports,
    profiles,
    companies,
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready(),
  };
})(Home);
