import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Locations } from './Locations';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('LocationsCollection', function testSuite() {
    it('Check that a new interest can be defined and retrieved', function test() {
      const name = `test-location-${new Date().getTime()}`;
      Locations.collection.insert({ name });
      expect(Locations.collection.findOne({ name }).name).to.equal(name);
    });
  });
}
