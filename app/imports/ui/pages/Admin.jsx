import React from 'react';
import { Container, Form, Label, Icon, Table, TextArea, Header, Segment } from 'semantic-ui-react';
import { AutoForm, ErrorsField, TextField, LongTextField, SubmitField } from 'uniforms-semantic';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  name: String,
  description: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

class Admin extends React.Component {
  // Implement On submit, insert the data.

  render() {
    let fRef = null;
    return (
      <Container id='admin-page' centered>
        <div style={{ paddingBottom: '50px' }}>
          <Header as="h2" textAlign="center">Create New Categories</Header>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)}>
            <Segment>
              <Form.Group widths={'equal'}>
                <TextField id='name' name='name' showInlineError={true} placeholder='Category name'/>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <LongTextField id='description' name='description' showInlineError={true} placeholder='Describe the new category here'/>
              </Form.Group>
              <SubmitField id='submit' value='Submit'/>
              <ErrorsField/>
            </Segment>
          </AutoForm>
        </div>

        <div style={{ paddingBottom: '50px' }}>
          <Header as="h2" textAlign="center">Inappropriate Content Reports</Header>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>From</Table.HeaderCell>
                <Table.HeaderCell>About</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell width={5}>Name1</Table.Cell>
                <Table.Cell>Report1</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell width={5}>Name2</Table.Cell>
                <Table.Cell>Report2</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table></div>

        <Header as="h2" textAlign="center">Send Email to Clients</Header>
        <Container className='blue-background' style={{ height: '400px' }}>
          <Label ribbon style={{ marginLeft: '20px' }}><Icon name='mail'/></Label>
          <AutoForm schema={bridge}>
            <Form.Group>
              <TextArea showInlineError={true} placeholder='Email Description...' style={{
                width:
                        '500px', height: '300px', marginLeft: '320px',
              }}/>
            </Form.Group>
            <SubmitField id='submit' value='Send' style={{ marginLeft: '740px' }} />
            <ErrorsField/>
          </AutoForm>
        </Container>
      </Container>
    );
  }
}

export default Admin;
