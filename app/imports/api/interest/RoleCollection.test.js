import { Roles } from '/imports/api/interest/RoleCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('RoleCollection', function testSuite() {
    const name = 'Driver';
    const description = 'Tools and techniques for team-based development of high quality software systems';
    const defineObject = { name, description };

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = Roles.define(defineObject);
      expect(Roles.isDefined(docID)).to.be.true;
      // Check that fields are available
      const doc = Roles.findDoc(docID);
      expect(doc.name).to.equal(name);
      expect(doc.description).to.equal(description);
      // Check that multiple definitions with the same name fail
      expect(function foo() { Roles.define(defineObject); }).to.throw(Error);
      // Check that we can dump and restore a Interest.
      const dumpObject = Roles.dumpOne(docID);
      Roles.removeIt(docID);
      expect(Roles.isDefined(docID)).to.be.false;
      docID = Roles.restoreOne(dumpObject);
      expect(Roles.isDefined(docID)).to.be.true;
      Roles.removeIt(docID);
    });

    it('#findID, #findIDs', function test() {
      const docID = Roles.define(defineObject);
      expect(Roles.isDefined(docID)).to.be.true;
      const docID2 = Roles.findID(name);
      expect(docID).to.equal(docID2);
      Roles.findIDs([name, name]);
      Roles.removeIt(docID);
    });
  });
}
