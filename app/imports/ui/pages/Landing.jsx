import React from 'react';
import { Container, FormTextArea, FormButton, Grid, Header, List, ListItem } from 'semantic-ui-react';

/** Renders a color-blocked static landing page. */
class Landing extends React.Component {
  render() {
    return (
      <div id="landing-page">
        <div className='landing-blue-background'>
          <Container textAlign='center'>
            <Header style={{ paddingTop: '100px', paddingBottom: '100px', color: 'white', fontSize: '40pt', fontFamily: 'roboto' }} as='h1'>
                Bridging The Gap
            </Header>
          </Container>
        </div>

        <div className='landing-white-background'>

          <Container textAlign='center' style={{ width: '700px' }}>
            <Header style={{ paddingTop: '50px', paddingBottom: '50px', color: '#376551', fontSize: '20px' }} as='h3'>
              <List>
                <ListItem className='text-spacing'>
                  <p>The Company Connector web application provides a new way for local and non-local
                    companies who want to recruit students from UH to make their (potential)
                    opportunities known to students.</p>
                </ListItem>
                <ListItem className='text-spacing'>
                  <p>At the same time, students can create profiles on the site with their
                    interests. The site can match students to employers and vice-versa.</p>
                </ListItem>
                <ListItem className='text-spacing'>
                  <p>
                    To get started, click the sign up link in the top right.
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
              <Grid.Row >
                <FormTextArea id='feedback' name='feedback' placeholder='Let us know what you think!' style={{ width: '500px' }}/>
                <FormButton type='submit' size='huge' style={{ float: 'right' }}>Send</FormButton>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
      </div>

    );
  }
}

export default Landing;
