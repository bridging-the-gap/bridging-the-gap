import React from 'react';
import PropTypes from 'prop-types';
import { Table, Dropdown } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { _ } from 'meteor/underscore';
import ReportItem from './ReportItem';
import { Reports } from '../../api/reports/Reports';

const filters = [
  { key: 'Bug', text: 'Bug', value: 'bug' },
  { key: 'User Abuse', text: 'User Abuse', value: 'user-abuse' },
  { key: 'Other', text: 'Other', value: 'other' },
];

/** Renders a single row in the Report table in the admin page. See pages/Home.jsx. */
class ReportFilter extends React.Component {
  /** Initialize state fields. */
  constructor(props) {
    super(props);
    this.state = { reportKind: '' };
  }

  /** Update the form controls each time the user interacts with them. */
  handleChange= (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  render() {
    const data = Reports.collection.find({}).fetch();
    const reportData1 = _.filter(data, function (oneReport) {
      return oneReport.reportType === 'bug';
    });
    const reportData2 = _.filter(data, function (oneReport) {
      return oneReport.reportType === 'user-abuse';
    });
    const reportData3 = _.filter(data, function (oneReport) {
      return oneReport.reportType === 'other';
    });
    return (
      <div>
        <Dropdown clearable placeholder={'Filter problems by'} name='reportKind' selection options={filters}
          onChange={this.handleChange}/>
        <div style={{ maxHeight: '400px', overflowX: 'scroll' }}>
          <Table celled color='red' inverted>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>From</Table.HeaderCell>
                <Table.HeaderCell>Problem</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            {this.state.reportKind === 'bug' ?
              <Table.Body>
                {_.map(reportData1, (report, index) => <ReportItem key={index} report={report} Reports={Reports}/>)}
              </Table.Body> : <Table.Body/>
            }
            {this.state.reportKind === 'user-abuse' ?
              <Table.Body>
                {_.map(reportData2, (report, index) => <ReportItem key={index} report={report} Reports={Reports}/>)}
              </Table.Body> : <Table.Body/>
            }
            {this.state.reportKind === 'other' ?
              <Table.Body>
                {_.map(reportData3, (report, index) => <ReportItem key={index} report={report} Reports={Reports}/>)}
              </Table.Body> : <Table.Body/>
            }
            {this.state.reportKind === '' ?
              <Table.Body>
                {data.map((report) => <ReportItem key={report._id} report={report} Reports={Reports}/>)}
              </Table.Body> : <Table.Body/>
            }
          </Table>
        </div>
      </div>
    );
  }
}

// Require a document to be passed to this component.
ReportFilter.propTypes = {
  Reports: PropTypes.object.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withRouter(ReportFilter);
