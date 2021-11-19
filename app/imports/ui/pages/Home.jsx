import React from 'react';
import { Container, Form, Table, TextArea, Header, Segment, Grid, Button, Item, Label } from 'semantic-ui-react';
import { AutoForm, ErrorsField, TextField, LongTextField, SubmitField } from 'uniforms-semantic';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

// Create a schema to specify the structure of the data to appear in the form.
// For admin page: create new category section.
const formSchema1 = new SimpleSchema({
  name: String,
  description: String,
});

// Create a schema to specify the structure of the data to appear in the form.
// For admin page: email section.
const formSchema2 = new SimpleSchema({
  description: String,
});

// For company homepage
const companySchema = new SimpleSchema({
  companyName: String,
  location: String,
  contact: String,
  industry: String,
  image: String,
  description: String,
});

const bridge = new SimpleSchema2Bridge(formSchema1);

const bridge2 = new SimpleSchema2Bridge(formSchema2);

const bridge3 = new SimpleSchema2Bridge(companySchema);

class Home extends React.Component {
  // Implement On submit, insert the data.

  render() {
    let fRef = null;
    return (
      <Container id='home-page'>
        {/* Start of admin page */}
        {Roles.userIsInRole(Meteor.userId(), 'admin') ?
          <div id='admin-page'>
            <div style={{ paddingBottom: '50px' }}>
              <Header as="h2" textAlign="center" style={{ color: 'blue' }}>Create New Categories</Header>
              {/* eslint-disable-next-line max-len */}
              <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)} style={{ backgroundColor: 'blue', padding: '50px 20px 70px 20px' }}>
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
              <Table celled color='red' inverted>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>From</Table.HeaderCell>
                    <Table.HeaderCell>About</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell width={5}>johnson@hawaii.edu</Table.Cell>
                    <Table.Cell>student1@hawaii.edu has included vulgar and explicit content in their profile page.</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={5}>leighj@hawaii.edu</Table.Cell>
                    <Table.Cell>fake-company@hawaii.edu is masquerading as my company on the site.</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table></div>

            <Header as="h2" textAlign="center" style={{ color: 'blue' }}>Send Email to Clients</Header>
            <Grid style={{ height: '400px', backgroundColor: 'blue' }} centered columns={1}>
              <AutoForm schema={bridge2} onSubmit={data => this.submit(data, fRef)}>
                <Form.Group>
                  <TextArea placeholder='Email Description...' style={{
                    width:
                      '600px', height: '300px', marginTop: '20px',
                  }}/>
                </Form.Group>
                <SubmitField id='submit' value='Send' style={{ float: 'right', marginRight: '-5px' }}/>
                <ErrorsField/>
              </AutoForm>
            </Grid>
          </div> : ''}
        {/* End of admin page */}
        {/* Start of student page */}
        {/* End of student page */}
        {/* Start of company page */}
        {Roles.userIsInRole(Meteor.userId(), 'company') ?
          <Grid id='company-home' columns={2}>
            <Grid.Column width={6} style={{ backgroundColor: 'blue' }}>
              <AutoForm ref={ref => { fRef = ref; }} schema={bridge3} onSubmit={data => this.submit(data, fRef)}>
                <Segment>
                  <TextField name='companyName'/>
                  <TextField name='location'/>
                  <TextField name='contact'/>
                  <TextField name='industry'/>
                  <TextField name='image'/>
                  <LongTextField name='description'/>
                  <SubmitField value='Submit'/>
                  <ErrorsField/>
                </Segment>
              </AutoForm>
            </Grid.Column>
            <Grid.Column width={10} style={{ backgroundColor: 'grey' }}>
              <Button primary>Add Job Listing</Button>
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

export default Home;
