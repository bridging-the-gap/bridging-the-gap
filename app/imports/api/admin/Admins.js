import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

class AdminsCollection {
  constructor() {
    this.name = 'AdminsCollection';
    this.collection = new Mongo.Collection(this.name);
    this.schema = new SimpleSchema({
      admin: { type: String, unique: true },
    }, { tracker: Tracker });
    this.collection.attachSchema(this.schema);
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}
export const Admins = new AdminsCollection();
