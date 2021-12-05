import React from 'react';
import { Form, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Profiles } from '../../api/profiles/Profiles';
import { Skills } from '../../api/skills/Skills';
import { Locations } from '../../api/locations/Locations';
import { addCategoryMethod } from '../../startup/both/Methods';

// Create a schema to specify the structure of the data to appear in the form.
// For admin page: create new category section.
const formSchema1 = new SimpleSchema({
  category_type: String,
  category_name: String,
});

const bridge1 = new SimpleSchema2Bridge(formSchema1);

/** Renders a single row in the Report table in the admin page. See pages/Home.jsx. */
class NewCategory extends React.Component {

  submit = (data) => {
    Meteor.call(addCategoryMethod, data, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('New category added successfully.',
          'This category should now be available for users to filter by.', 'success');
      }
    });
  }

  render() {
    let fRef = null;
    const categories = [
      { label: 'Skills', value: 'new_skill' },
      { label: 'Locations', value: 'new_location' },
    ];
    return (
      <AutoForm ref={ref => { fRef = ref; }} schema={bridge1} onSubmit={data => this.submit(data, fRef)}
        style={{ backgroundColor: 'blue', padding: '50px 20px 70px 20px' }}>
        <Segment>
          <Form.Group widths={'equal'}>
            <SelectField id='skill-or-location' name='category_type' label='Type' options={categories}/>
          </Form.Group>
          <Form.Group widths={'equal'}>
            <TextField id='category-name' name='category_name' label='Category Name' placeholder='Name of new category'/>
          </Form.Group>
          <SubmitField id='add-cat-button' value='Submit' style={{ float: 'right', marginTop: '20px', marginRight: '-15px' }}/>
          <ErrorsField/>
        </Segment>
      </AutoForm>
    );
  }
}

// Require a document to be passed to this component.
NewCategory.propTypes = {
  profiles: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  locations: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Profiles.userPublicationName);
  const sub2 = Meteor.subscribe(Skills.userPublicationName);
  const sub3 = Meteor.subscribe(Locations.userPublicationName);
  // Get the Profiles documents
  const profiles = Profiles.collection.find({}).fetch();
  const skills = Skills.collection.find({}).fetch();
  const locations = Locations.collection.find({}).fetch();
  return {
    profiles,
    skills,
    locations,
    ready: sub1.ready() && sub2.ready() && sub3.ready(),
  };
})(NewCategory);
