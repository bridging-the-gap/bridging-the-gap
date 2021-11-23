import { Meteor } from 'meteor/meteor';
import { Projects } from '../../api/projects/Projects';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesLocations } from '../../api/profiles/ProfilesLocations';
import { ProfilesSkills } from '../../api/profiles/ProfilesSkills';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { ProjectsLocations } from '../../api/projects/ProjectsLocations';
import { ProjectsSkills } from '../../api/projects/ProjectsSkills';
import { Events } from '../../api/events/Events';

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
 * A simple solution to this is to use Meteor Methods (https://guide.meteor.com/methods.html). By defining and
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
  'Profiles.update'({ email, firstName, lastName, bio, title, webpage, picture, locations, skills, projects, role }) {
    Profiles.collection.update({ email }, { $set: { email, firstName, lastName, bio, title, webpage, picture, role } });
    ProfilesLocations.collection.remove({ profile: email });
    ProfilesSkills.collection.remove({ profile: email });
    ProfilesProjects.collection.remove({ profile: email });
    locations.map((location) => ProfilesLocations.collection.insert({ profile: email, location }));
    skills.map((skill) => ProfilesSkills.collection.insert({ profile: email, skill }));
    projects.map((project) => ProfilesProjects.collection.insert({ profile: email, project }));
  },
});

const addProjectMethod = 'Projects.add';

/** Creates a new project in the Projects collection, and also updates ProfilesProjects and ProjectsLocations. */
Meteor.methods({
  'Projects.add'({ name, description, picture, locations, skills, participants, homepage, role }) {
    Projects.collection.insert({ name, description, picture, homepage, role });
    ProfilesProjects.collection.remove({ project: name });
    ProjectsLocations.collection.remove({ project: name });
    ProjectsSkills.collection.remove({ project: name });
    if (locations) {
      locations.map((location) => ProjectsLocations.collection.insert({ project: name, location }));
    } else {
      throw new Meteor.Error('At least one location is required.');
    }
    if (skills) {
      skills.map((skill) => ProjectsSkills.collection.insert({ project: name, skill }));
    } else {
      throw new Meteor.Error('At least one skill is required.');
    }
    if (participants) {
      participants.map((participant) => ProfilesProjects.collection.insert({ project: name, profile: participant }));
    }
  },
});

export { updateProfileMethod, addProjectMethod };
