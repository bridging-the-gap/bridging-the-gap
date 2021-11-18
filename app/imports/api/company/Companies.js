import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Ecpasulates state and variable values for this collection. */
class CompaniesCollection {
  constructor() {
    // name of collection
    this.name = 'CompanyCollection';
    // Define Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define structure of collection
    this.schema = new SimpleSchema({
      companyName: { type: String, index: true, unique: true },
      location: String,
      contactInfo: { type: String, index: true, unique: true },
      image: String,
      description: String,
    }, { tracker: Tracker });
    // Ensure collection documents obey schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
  }
}

export const Companies = new CompaniesCollection();