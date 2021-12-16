import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { ProfilesLocations } from '../../api/profiles/ProfilesLocations';
import { ProfilesSkills } from '../../api/profiles/ProfilesSkills';
import { Locations } from '../../api/locations/Locations';
import { Events } from '../../api/events/Events';
import { Skills } from '../../api/skills/Skills';
import { Reports } from '../../api/reports/Reports';
import { Jobs } from '../../api/job/Jobs';
import { Admins } from '../../api/admin/Admins';

/* eslint-disable no-console */

/** Define a user in the Meteor accounts package. This enables login. Username is the email address. */
function createUser(email, role) {
  const userID = Accounts.createUser({ username: email, email, password: 'foo' });
  if (role === 'admin') {
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, 'admin');
  }
  if (role === 'student') {
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, 'student');
  }
  if (role === 'company') {
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, 'company');
  }
}

/** Define an location.  Has no effect if location already exists. */
function addLocation(location) {
  Locations.collection.update({ name: location }, { $set: { name: location } }, { upsert: true });
}

function addSkill(skill) {
  Skills.collection.update({ name: skill }, { $set: { name: skill } }, { upsert: true });
}

/** Defines a new user and associated profile. Error if user already exists. */
function addProfile({ firstName, lastName, bio, title, webpage, locations, skills, projects, picture, email, role }) {
  console.log(`Defining profile ${email}`);
  // Define the user in the Meteor accounts package.
  createUser(email, role);
  // Create the profile.
  Profiles.collection.insert({ firstName, lastName, bio, title, webpage, picture, email, role });
  // Add locations and projects.
  if (typeof skills !== 'undefined') {
    skills.map(skill => ProfilesSkills.collection.insert({ profile: email, skill }));
    skills.map(skill => addSkill(skill));
  }
  if (typeof projects !== 'undefined') {
    projects.map(project => ProfilesProjects.collection.insert({ profile: email, project }));
  }
  if (typeof locations !== 'undefined') {
    locations.map(location => ProfilesLocations.collection.insert({ profile: email, location }));
    locations.map(location => addLocation(location));
  }
}

/** Define a new admin. Error if admin already exists.  */
function addAdmin({ admin }) {
  // Define the user in the Meteor accounts package.
  console.log(`Defining admin ${admin}`);
  createUser(admin, 'admin');
  // Create the admin.
  Admins.collection.insert({ admin: admin });
}

/** Define a new event. Error if event already exists.  */
function addEvent({ eventName, company, date, location, description, picture, owner }) {
  console.log(`Defining event ${eventName}`);
  Events.collection.insert({ eventName, company, date, location, description, picture, owner });
}

function addJob({ jobTitle, location, salary, industry, image, description, link, owner }) {
  console.log(`Defining job ${jobTitle}`);
  Jobs.collection.insert({ jobTitle, location, salary, industry, image, description, link, owner });
}

/** Define a new report. Error if report already exists.  */
function addReport({ reportType, email, description }) {
  console.log(`Defining report from ${email} of type ${reportType}`);
  // Create the report.
  Reports.collection.insert({ reportType, email, description });
}

/** Initialize company database if empty */
if (Jobs.collection.find().count() === 0) {
  if (Meteor.settings.defaultJob) {
    console.log('Creating default job.');
    Meteor.settings.defaultJob.map(jobData => addJob(jobData));
  }
}
/** Initialize DB if it appears to be empty (i.e. no users defined.) */
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultAdmins && Meteor.settings.defaultProfiles && Meteor.settings.defaultEvents) {
    console.log('Creating the default admins');
    Meteor.settings.defaultAdmins.map(admin => addAdmin(admin));
    console.log('Creating the default profiles');
    Meteor.settings.defaultProfiles.map(profile => addProfile(profile));
    console.log('Creating the default events');
    Meteor.settings.defaultEvents.map(event => addEvent(event));
    console.log('Creating the default reports');
    Meteor.settings.defaultReports.map(report => addReport(report));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
