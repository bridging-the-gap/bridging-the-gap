import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Reports } from './Reports';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('LocationsCollection', function testSuite() {
    it('Check that a new interest can be defined and retrieved', function test() {
      const name = `test-interest-${new Date().getTime()}`;
      Reports.collection.insert({ name });
      expect(Reports.collection.findOne({ name }).name).to.equal(name);
    });
  });
}
