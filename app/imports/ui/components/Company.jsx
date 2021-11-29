import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Company extends React.Component {
  render() {
    return (
      <Table.Body>
        <Table.Row>
          <Table.Cell>Company: </Table.Cell>
          <Table.Cell textAlign='center'> {this.props.company.companyName}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Location: </Table.Cell>
          <Table.Cell textAlign='center'> {this.props.company.location}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Contact: </Table.Cell>
          <Table.Cell textAlign='center'> {this.props.company.contact}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Industry: </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell> {this.props.company.industry}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Description: </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell> {this.props.company.description}</Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  }
}

// Require a document to be passed to this component.
Company.propTypes = {
  company: PropTypes.object.isRequired,
  notes: PropTypes.array.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(Company);
