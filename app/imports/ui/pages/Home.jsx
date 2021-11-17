import React from 'react';
import { Container, Form, Label, Icon, Table, TextArea, Header, Segment } from 'semantic-ui-react';
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

const bridge = new SimpleSchema2Bridge(formSchema1);

const bridge2 = new SimpleSchema2Bridge(formSchema2);

class Home extends React.Component {
  // Implement On submit, insert the data.

  render() {
    let fRef = null;
    return (
      <Container id='home-page'>
        {/* Start of admin page */}
        { Roles.userIsInRole(Meteor.userId(), 'admin') ?
          <div id='admin-page'>
            <div style={{ paddingBottom: '50px' }}>
              <Header as="h2" textAlign="center" style={{ color: 'blue' }}>Create New Categories</Header>
              <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)}
                style={{ backgroundColor: 'blue', padding: '50px 20px 70px 20px' }}>
                <Segment>
                  <Form.Group widths={'equal'}>
                    <TextField id='name' name='name' showInlineError={true} placeholder='Category name'/>
                  </Form.Group>
                  <Form.Group widths={'equal'}>
                    <LongTextField id='description' name='description' showInlineError={true} placeholder='Describe the new category here'/>
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
            <Container style={{ height: '400px', backgroundColor: 'blue' }}>
              <Label ribbon style={{ marginLeft: '20px' }}><Icon name='mail'/></Label>
              <AutoForm schema={bridge2} onSubmit={data => this.submit(data, fRef)}>
                <Form.Group>
                  <TextArea showInlineError={true} placeholder='Email Description...' style={{
                    width:
                      '500px', height: '300px', marginLeft: '320px',
                  }}/>
                </Form.Group>
                <SubmitField id='submit' value='Send' style={{ marginLeft: '740px' }}/>
                <ErrorsField/>
              </AutoForm>
            </Container>
          </div> : '' }
        {/* End of admin page */}
        {/* Start of student page */}
        {/* End of student page */}
        {/* Start of company page */}
        {/* End of company page */}
      </Container>
    );
  }
}

export default Home;
