import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Projects } from '../../api/projects/Projects';
import { ProjectsLocations } from '../../api/projects/ProjectsLocations';
import { ProjectsSkills } from '../../api/projects/ProjectsSkills';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { ProfilesLocations } from '../../api/profiles/ProfilesLocations';
import { ProfilesSkills } from '../../api/profiles/ProfilesSkills';
import { Locations } from '../../api/locations/Locations';
import { Events } from '../../api/events/Events';
import { Skills } from '../../api/skills/Skills';
import { Reports } from '../../api/reports/Reports';
import { Companies } from '../../api/company/Companies';
import { Jobs } from '../../api/job/Jobs';

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
    console.log(typeof skills);
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

/** Define a new project. Error if project already exists.  */
function addProject({ name, homepage, description, locations, skills, picture, role }) {
  console.log(`Defining project ${name}`);
  Projects.collection.insert({ name, homepage, description, picture, role });
  if (typeof skills !== 'undefined') {
    skills.map(skill => ProjectsSkills.collection.insert({ project: name, skill }));
    skills.map(skill => addSkill(skill));
  }
  if (typeof locations !== 'undefined') {
    locations.map(location => ProjectsLocations.collection.insert({ project: name, location }));
    locations.map(location => addLocation(location));
  }
}

/** Define a new event. Error if event already exists.  */
function addEvent({ eventName, company, date, location, description, picture }) {
  console.log(`Defining event ${eventName}`);
  Events.collection.insert({ eventName, company, date, location, description, picture });
}

/** Define a new report. Error if report already exists.  */
function addReport({ reportType, email, description }) {
  console.log(`Defining report ${reportType}`);
  // Create the report.
  Reports.collection.insert({ reportType, email, description });
}

/** Initialize the database with default company info  */
function addCompany(companyData) {
  console.log(` Adding: ${companyData.companyName}`);
  Companies.collection.insert(companyData);
}
/** Initialize company database if empty */
if (Companies.collection.find().count() === 0) {
  if (Meteor.settings.defaultCompany) {
    console.log('Creating default company.');
    Meteor.settings.defaultCompany.map(companyData => addCompany(companyData));
  }
}

/** Initialize the database with default Job info  */
function addJob(jobData) {
  console.log(` Adding: ${jobData.jobTitle}`);
  Jobs.collection.insert(jobData);
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
  if (Meteor.settings.defaultProjects && Meteor.settings.defaultProfiles && Meteor.settings.defaultEvents) {
    console.log('Creating the default profiles');
    Meteor.settings.defaultProfiles.map(profile => addProfile(profile));
    console.log('Creating the default projects');
    Meteor.settings.defaultProjects.map(project => addProject(project));
    console.log('Creating the default events');
    Meteor.settings.defaultEvents.map(event => addEvent(event));
    console.log('Creating the default reports');
    Meteor.settings.defaultReports.map(report => addReport(report));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}

/**
 * If the loadAssetsFile field in settings.development.json is true, then load the data in private/data.json.
 * This approach allows you to initialize your system with large amounts of data.
 * Note that settings.development.json is limited to 64,000 characters.
 * We use the "Assets" capability in Meteor.
 * For more info on assets, see https://docs.meteor.com/api/assets.html
 * User count check is to make sure we don't load the file twice, which would generate errors due to duplicate info.
 */
if ((Meteor.settings.loadAssetsFile) && (Meteor.users.find().count() < 7)) {
  const assetsFileName = 'data.json';
  console.log(`Loading data from private/${assetsFileName}`);
  const jsonData = JSON.parse(Assets.getText(assetsFileName));
  jsonData.profiles.map(profile => addProfile(profile));
  jsonData.projects.map(project => addProject(project));
}
