import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the Report table in the admin page. See pages/Home.jsx. */
class ReportItem extends React.Component {
  render() {
    return (
      <Table.Row>
        <Table.Cell>{this.props.report.email}</Table.Cell>
        <Table.Cell>{this.props.report.reportName}</Table.Cell>
        <Table.Cell>{this.props.report.description}</Table.Cell>
      </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
ReportItem.propTypes = {
  report: PropTypes.shape({
    reportName: PropTypes.string,
    email: PropTypes.string,
    description: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(ReportItem);
