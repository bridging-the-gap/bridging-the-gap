import React from 'react';
import { Header, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Company extends React.Component {
  render() {
    return (
      <Table.Body>
        <Table.Row>
          <Table.Cell><Header as={'h4'}>Company: </Header></Table.Cell>
          <Table.Cell textAlign='center'> {this.props.company.companyName}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell><Header as={'h4'}>Location:</Header> </Table.Cell>
          <Table.Cell textAlign='center'> {this.props.company.location}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell><Header as={'h4'}>Contact:</Header> </Table.Cell>
          <Table.Cell textAlign='center'> {this.props.company.contact}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell><Header as={'h4'}>Industry:</Header> </Table.Cell>
          <Table.Cell>{this.props.company.industry}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell><Header as={'h4'}>Description:</Header> </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell verticalAlign='bottom'> {this.props.company.description}</Table.Cell>
        </Table.Row>
        <Link to={`/editCompany/${this.props.company._id}`}>Edit</Link>
      </Table.Body>
    );
  }
}

// Require a document to be passed to this component.
Company.propTypes = {
  company: PropTypes.object.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(Company);
