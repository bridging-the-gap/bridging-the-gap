import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the Report table in the admin page. See pages/Home.jsx. */
class ReportItem extends React.Component {
  removeItem(docID) {
    console.log(`Item to remove: ${docID}`);
    this.props.Reports.collection.remove(docID);
  }

  render() {
    return (
      <Table.Row>
        <Table.Cell>{this.props.report.email}</Table.Cell>
        <Table.Cell>{this.props.report.reportType}</Table.Cell>
        <Table.Cell>{this.props.report.description}</Table.Cell>
        <Table.Cell onClick={ () => this.removeItem(this.props.report._id) }><Icon name='delete'/></Table.Cell>
      </Table.Row>
    );
  }
}

// Require a document to be passed to this component.
ReportItem.propTypes = {
  report: PropTypes.shape({
    reportType: PropTypes.string,
    email: PropTypes.string,
    description: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  Reports: PropTypes.object.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withRouter(ReportItem);
