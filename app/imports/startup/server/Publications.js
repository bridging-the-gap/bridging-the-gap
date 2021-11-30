import { Meteor } from 'meteor/meteor';
import { Locations } from '../../api/locations/Locations';
import { Skills } from '../../api/skills/Skills';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesLocations } from '../../api/profiles/ProfilesLocations';
import { ProfilesSkills } from '../../api/profiles/ProfilesSkills';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import { ProjectsLocations } from '../../api/projects/ProjectsLocations';
import { ProjectsSkills } from '../../api/projects/ProjectsSkills';
import { Events } from '../../api/events/Events';
import { Reports } from '../../api/reports/Reports';
import { Companies } from '../../api/company/Companies';
import { Jobs } from '../../api/job/Jobs';

/** Define a publication to publish all locations. */
Meteor.publish(Locations.userPublicationName, () => Locations.collection.find());

Meteor.publish(Skills.userPublicationName, () => Skills.collection.find());
/** Define a publication to publish all profiles. */
Meteor.publish(Profiles.userPublicationName, () => Profiles.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(ProfilesLocations.userPublicationName, () => ProfilesLocations.collection.find());

Meteor.publish(ProfilesSkills.userPublicationName, () => ProfilesSkills.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(ProfilesProjects.userPublicationName, () => ProfilesProjects.collection.find());

/** Define a publication to publish all projects. */
Meteor.publish(Projects.userPublicationName, () => Projects.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(ProjectsLocations.userPublicationName, () => ProjectsLocations.collection.find());

Meteor.publish(ProjectsSkills.userPublicationName, () => ProjectsSkills.collection.find());

Meteor.publish(Events.userPublicationName, () => Events.collection.find());

/** Define a publication to publish all reports. */
Meteor.publish(Reports.userPublicationName, () => Reports.collection.find());

/** If logged in, publish documents owned by this company. */
Meteor.publish(Companies.userPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Companies.collection.find({ owner: username });
  }
  return this.ready();
});

/** If logged in, publish documents of jobs. */
Meteor.publish(Jobs.userPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Jobs.collection.find({ owner: username });
  }
  return this.ready();
});

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
