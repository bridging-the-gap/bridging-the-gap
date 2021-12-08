import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesLocations } from '../../api/profiles/ProfilesLocations';
import { ProfilesSkills } from '../../api/profiles/ProfilesSkills';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Skills } from '../../api/skills/Skills';
import { Locations } from '../../api/locations/Locations';
import { Jobs } from '../../api/job/Jobs';

/**
 * In Bowfolios, insecure mode is enabled, so it is possible to update the server's Mongo database by making
 * changes to the client MiniMongo DB.
 *
 * However, updating the database via client-side calls can be inconvenient for two reasons:
 *   1. If we want to update multiple collections, we need to use nested callbacks in order to trap errors, leading to
 *      the dreaded "callback hell".
 *   2. For update and removal, we can only provide a docID as the selector on the client-side, making bulk deletes
 *      hard to do via nested callbacks.
 *
 * A simple solution to this is to use Meteor Methods (httpsx://guide.meteor.com/methods.html). By defining and
 * calling a Meteor Method, we can specify code to be run on the server-side but invoked by clients. We don't need
 * to use callbacks, because any errors are thrown and sent back to the client. Also, the restrictions on the selectors
 * are removed for server-side code.
 *
 * Meteor Methods are commonly introduced as the necessary approach to updating the DB once the insecure package is
 * removed, and that is definitely true, but Bowfolios illustrates that they can simplify your code significantly
 * even when prototyping. It turns out that we can remove insecure mode if we want, as we use Meteor methods to update
 * the database.
 *
 * Note that it would be even better if each method was wrapped in a transaction so that the database would be rolled
 * back if any of the intermediate updates failed. Left as an exercise to the reader.
 */

const updateProfileMethod = 'Profiles.update';

/**
 * The server-side Profiles.update Meteor Method is called by the client-side Home page after pushing the update button.
 * Its purpose is to update the Profiles, ProfilesLocations, and ProfilesProjects collections to reflect the
 * updated situation specified by the user.
 */
Meteor.methods({
  'Profiles.update'({ email, firstName, lastName, bio, title, webpage, picture, locations, skills, role }) {
    Profiles.collection.update({ email }, { $set: { email, firstName, lastName, bio, title, webpage, picture, role } });
    ProfilesLocations.collection.remove({ profile: email });
    ProfilesSkills.collection.remove({ profile: email });
    // ProfilesProjects.collection.remove({ profile: email });
    locations.map((location) => ProfilesLocations.collection.insert({ profile: email, location }));
    skills.map((skill) => ProfilesSkills.collection.insert({ profile: email, skill }));
    // projects.map((project) => ProfilesProjects.collection.insert({ profile: email, project }));
  },
});

const updateCompanyMethod = 'Company.update';
Meteor.methods({
  'Company.update'({ email, firstName, lastName, bio, title, webpage, picture, locations, role }) {
    Profiles.collection.update({ email }, { $set: { email, firstName, lastName, bio, title, webpage, picture, role } });
    ProfilesLocations.collection.remove({ profile: email });
    ProfilesSkills.collection.remove({ profile: email });
    // ProfilesProjects.collection.remove({ profile: email });
    locations.map((location) => ProfilesLocations.collection.insert({ profile: email, location }));
    // projects.map((project) => ProfilesProjects.collection.insert({ profile: email, project }));
  },
});
const deleteProfileMethod = 'Profiles.delete';

/**
 * The server-side Profiles.delete Meteor Method is called by the client-side Admin Home page (in Home.jsx) after
 * pushing the "Delete User" button.
 * Its purpose is to update the Profiles, ProfilesLocations, and ProfilesProjects collections to reflect the
 * the deletion of the user specified by the admin.
 */
Meteor.methods({
  'Profiles.delete'({ email, role }) {
    Roles.removeUsersFromRoles([email], [role]);
    Profiles.collection.remove({ email });
    ProfilesLocations.collection.remove({ profile: email });
    ProfilesSkills.collection.remove({ profile: email });
    ProfilesProjects.collection.remove({ profile: email });
    Meteor.users.remove({ username: email });
  },
});

const addJobMethod = 'Jobs.add';

/** Creates a new project in the Projects collection, and also updates ProfilesProjects and ProjectsLocations. */
Meteor.methods({
  'Jobs.add'({ jobTitle, location, salary, industry, image, description, link, owner }) {
    Jobs.collection.insert({ jobTitle, location, salary, industry, image, description, link, owner });
  },
});

const addRoleMethod = 'Roles.add';

/**
 * The server-side Roles.add Meteor Method is called by the client-side Signup page after pushing the submit button.
 * Its purpose is to give the user the role they specified in the registration form (either student or company).
 */
Meteor.methods({
  'Roles.add'({ role }) {
    if (role === 'student') {
      Roles.createRole(role, { unlessExists: true });
      Roles.addUsersToRoles([Meteor.userId()], 'student', null);
    }
    if (role === 'company') {
      Roles.createRole(role, { unlessExists: true });
      Roles.addUsersToRoles([Meteor.userId()], 'company', null);
    }
    console.log('role of registered user:', role);
  },
});

const addSpecificInfoMethod = 'SpecificInfo.add';

/**
 * The server-side SpecificInfo.add Meteor Method is called by the client-side Signup page after pushing the submit button.
 * Its purpose is to add the user's skill/location info to the ProfilesSkills and/or ProfilesLocations collections,
 * which is needed for the BrowseCompanies and BrowseStudents pages.
 */
Meteor.methods({
  'SpecificInfo.add'({ role, email, skills, locations }) {
    if (role === 'student') {
      ProfilesSkills.collection.insert({ profile: email, skill: skills });
      ProfilesLocations.collection.insert({ profile: email, location: locations });
    }
    if (role === 'company') {
      ProfilesLocations.collection.insert({ profile: email, location: locations });
    }
    console.log('role of registered user:', role);
  },
});

const addCategoryMethod = 'Categories.add';

/**
 * The server-side Categories.add Meteor Method is called by NewCategory.jsx in the client-side Home page
 * after pushing the submit button to create a new category.
 * Its purpose is to update the Skills and Locations collections to reflect the
 * updated situation specified by the admin.
 */
Meteor.methods({
  'Categories.add'({ category_type, category_name }) {
    if (category_type === 'new_skill') {
      // console.log('New skill:', category_name);
      Skills.collection.insert({ name: category_name });
    }
    if (category_type === 'new_location') {
      // console.log('New location:', category_name);
      Locations.collection.insert({ name: category_name });
    }
  },
});

export { updateProfileMethod, updateCompanyMethod, deleteProfileMethod, addRoleMethod,
  addCategoryMethod, addSpecificInfoMethod, addJobMethod };
