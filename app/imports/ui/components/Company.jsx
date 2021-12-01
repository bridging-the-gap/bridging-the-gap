import React from 'react';
import { Header, Grid, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Company extends React.Component {
  render() {
    return (
      <Grid container columns={1} style={{ backgroundColor: 'white', marginTop: '10px' }}>
        <Grid.Column>
          <List>
            <List.Item><Header as={'h4'}>Company:</Header></List.Item>
            <List.Item>{this.props.company.companyName}</List.Item>
          </List>
          <List>
            <List.Item><Header as={'h4'}>Location:</Header></List.Item>
            <List.Item>{this.props.company.location}</List.Item>
          </List>
          <List>
            <List.Item><Header as={'h4'}>Contact:</Header> </List.Item>
            <List.Item>{this.props.company.contact}</List.Item>
          </List>
          <List>
            <List.Item><Header as={'h4'}>Industry:</Header> </List.Item>
            <List.Item>{this.props.company.industry}</List.Item>
          </List>
          <List>
            <List.Item><Header as={'h4'}>Description:</Header></List.Item>
          </List>
          <List>
            <List.Item><p>{this.props.company.description}</p></List.Item>
          </List>
          <List>
            <List.Item><Link to={`/editCompany/${this.props.company._id}`}>Edit</Link></List.Item>
          </List>
        </Grid.Column>
      </Grid>
    );
  }
}

// Require a document to be passed to this component.
Company.propTypes = {
  company: PropTypes.object.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(Company);
