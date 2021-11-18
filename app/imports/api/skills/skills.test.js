import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Skills } from './skills';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('SkillsCollection', function testSuite() {
    it('Check that a new interest can be defined and retrieved', function test() {
      const name = `test-interest-${new Date().getTime()}`;
      Skills.collection.insert({ name });
      expect(Skills.collection.findOne({ name }).name).to.equal(name);
    });
  });
}
