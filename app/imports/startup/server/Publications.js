import { Meteor } from 'meteor/meteor';
import { Locations } from '../../api/locations/Locations';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesLocations } from '../../api/profiles/ProfilesLocations';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import { ProjectsLocations } from '../../api/projects/ProjectsLocations';

/** Define a publication to publish all locations. */
Meteor.publish(Locations.userPublicationName, () => Locations.collection.find());

/** Define a publication to publish all profiles. */
Meteor.publish(Profiles.userPublicationName, () => Profiles.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(ProfilesLocations.userPublicationName, () => ProfilesLocations.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(ProfilesProjects.userPublicationName, () => ProfilesProjects.collection.find());

/** Define a publication to publish all projects. */
Meteor.publish(Projects.userPublicationName, () => Projects.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(ProjectsLocations.userPublicationName, () => ProjectsLocations.collection.find());

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
