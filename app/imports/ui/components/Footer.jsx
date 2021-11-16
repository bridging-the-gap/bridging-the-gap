import React from 'react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
class Footer extends React.Component {
  render() {
    const divStyle = { paddingBottom: '10px', paddingTop: '10px' };
    return (
      <div className='landing-green-background' style={divStyle}>
        <footer>
          <div className="ui center aligned container">
              Bridging the Gap <br />
              University of Hawaii<br />
              Honolulu, HI 96822 <br />
            <a style={{ color: 'blue' }} href="https://bridging-the-gap.github.io/">https://bridging-the-gap.github.io/</a>
          </div>
        </footer>
      </div>
    );
  }
}

export default Footer;
