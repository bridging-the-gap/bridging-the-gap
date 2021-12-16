import { Meteor } from 'meteor/meteor';
import { Locations } from '../../api/locations/Locations';
import { Skills } from '../../api/skills/Skills';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesLocations } from '../../api/profiles/ProfilesLocations';
import { ProfilesSkills } from '../../api/profiles/ProfilesSkills';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { ProfilesJobs } from '../../api/profiles/ProfilesJobs';
import { ProfilesEvents } from '../../api/profiles/ProfilesEvents';
import { Events } from '../../api/events/Events';
import { Reports } from '../../api/reports/Reports';
import { Jobs } from '../../api/job/Jobs';
import { Admins } from '../../api/admin/Admins';

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

/** Define a publication to publish this collection. */
Meteor.publish(ProfilesJobs.userPublicationName, () => ProfilesJobs.collection.find());
Meteor.publish(ProfilesEvents.userPublicationName, () => ProfilesEvents.collection.find());

Meteor.publish(Events.userPublicationName, () => Events.collection.find());
Meteor.publish(Jobs.userPublicationName, () => Jobs.collection.find());

/** Define a publication to publish all reports. */
Meteor.publish(Reports.adminPublicationName, () => Reports.collection.find());

/** Define a publication to publish all admins. */
Meteor.publish(Admins.adminPublicationName, () => Admins.collection.find());

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
