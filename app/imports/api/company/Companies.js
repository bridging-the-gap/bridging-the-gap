import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

class CompaniesCollection {
  constructor() {
    this.name = 'CompaniesCollection';
    this.collection = new Mongo.Collection(this.name);
    this.schema = new SimpleSchema({
      companyName: { type: String, unique: true },
      location: String,
      contact: { type: String, unique: true },
      industry: String,
      image: String,
      description: String,
      owner: { type: String, unique: true },
    }, { tracker: Tracker });
    this.collection.attachSchema(this.schema);
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}
export const Companies = new CompaniesCollection();
