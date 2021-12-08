import React from 'react';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Header, Grid, List, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { ProfilesLocations } from '../../api/profiles/ProfilesLocations';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Company extends React.Component {
  render() {
    const email = Meteor.user().username;
    return (
      <Grid container columns={1} style={{ backgroundColor: 'white', marginTop: '10px' }}>
        <Grid.Column>
          <List>
            <List.Item><Header as={'h4'}>Company:</Header></List.Item>
            <List.Item>{this.props.company.firstName}</List.Item>
          </List>
          <List>
            <List.Item><Header as={'h4'}>Contact:</Header> </List.Item>
            <List.Item>{this.props.company.email}</List.Item>
          </List>
          <List>
            <List.Item><Header as={'h4'}>Location:</Header> </List.Item>
            <List.Item>
              <Label tag>{_.pluck(ProfilesLocations.collection.find({ profile: email }).fetch(), 'location')}</Label>
            </List.Item>
          </List>
          <List>
            <List.Item><Header as={'h4'}>Webpage:</Header> </List.Item>
            <List.Item>{this.props.company.webpage}</List.Item>
          </List>
          <List>
            <List.Item><Header as={'h4'}>Industry:</Header> </List.Item>
            <List.Item>{this.props.company.title}</List.Item>
          </List>
          <List>
            <List.Item><Header as={'h4'}>Description:</Header></List.Item>
          </List>
          <List>
            <List.Item><p>{this.props.company.bio}</p></List.Item>
          </List>
          <List>
            <List.Item><Link to={`/editCompany/${this.props.company._id}`} id="editCompany" >Edit</Link></List.Item>
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
