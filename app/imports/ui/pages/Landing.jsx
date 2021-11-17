import { Container, Grid, Header, Image, List, ListItem, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { withRouter } from 'react-router-dom';
import React from 'react';
import Feedback from '../components/Feedback';

/** Renders a color-blocked static landing page. */
class Landing extends React.Component {

  render() {
    return (
      <div id="landing-page">
        <div className='landing-blue-background'>
          <Container textAlign='center'>
            <Image src='images/bridge-logo.png' size='huge' centered/>
          </Container>
        </div>
        <div className='landing-white-background'>
          <Container textAlign='center' style={{ width: '700px' }}>
            <Header style={{ paddingTop: '50px', paddingBottom: '50px', color: '#376551', fontSize: '20px' }} as='h3'>
              <List>
                <ListItem className='text-spacing'>
                  <p>Bridging the Gap provides a new way for local and non-local
                    companies who want to recruit students from UH to make their (potential)
                    opportunities known to students.</p>
                </ListItem>
                <ListItem className='text-spacing'>
                  <p>At the same time, students can create profiles on the site with their
                    interests. The site can match students to employers and vice-versa.</p>
                </ListItem>
                <ListItem className='text-spacing'>
                  <p>
                    To get started, click the login link in the top right and then click sign up.
                  </p>
                </ListItem>
              </List>
            </Header>
          </Container>
        </div>
        <div className='landing-blue-background'>
          <Container align='center' style={{ paddingTop: '30px', paddingBottom: '80px' }}>
            <Header as='h3' textAlign='center' inverted>
            Have feedback?
            </Header>
            <Grid centered columns='1'>
              <Feedback/>
            </Grid>
          </Container>
        </div>
      </div>
    );
  }
}

/** Declare the types of all properties. */
Landing.propTypes = {
  currentUser: PropTypes.string,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const LandingContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(Landing);

/** Enable ReactRouter so that links work. */
export default withRouter(LandingContainer);
