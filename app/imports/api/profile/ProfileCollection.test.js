/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Majors } from '/imports/api/interest/MajorCollection';
// import { Roles } from '/imports/api/interest/RoleCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

if (Meteor.isServer) {
  describe('ProfileCollection', function testSuite() {
    const interestName = 'Software Engineering';
    const interestDescription = 'Tools for software development';
    const majorName = 'Computer Engineering';
    const majorDescription = 'Tools for software development';
    // const roleName = 'Driver';
    // const roleDescription = 'A driver';
    const firstName = 'Philip';
    const lastName = 'Johnson';
    const username = 'johnson';
    const bio = 'I have been a professor of computer science at UH since 1990.';
    const interests = [interestName];
    const majors = [majorName];
    // const roles = [roleName];
    const picture = 'http://philipmjohnson.org/headshot.jpg';
    const title = 'Professor Computer Science';
    const location = 'Honolulu, HI';
    const github = 'http://github.com/philipjohnson';
    const facebook = 'http://github.com/philipjohnson';
    const instagram = 'http://github.com/philipjohnson';
    const defineObject = { firstName, lastName, username, bio, interests,
      majors, picture, title, github, facebook, instagram,
    location };

    before(function setup() {
      removeAllEntities();
      // Define a sample interest.
      Interests.define({ name: interestName, description: interestDescription });
      Majors.define({ name: majorName, description: majorDescription });
      // Roles.define({ name: roleName, description: roleDescription });
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = Profiles.define(defineObject);
      expect(Profiles.isDefined(docID)).to.be.true;
      // Check that fields are available
      const doc = Profiles.findDoc(docID);
      expect(doc.firstName).to.equal(firstName);
      expect(doc.lastName).to.equal(lastName);
      expect(doc.username).to.equal(username);
      expect(doc.bio).to.equal(bio);
      expect(doc.interests[0]).to.equal(interestName);
      expect(doc.majors[0]).to.equal(majorName);
      expect(doc.roles[0]).to.equal(roleName);
      expect(doc.picture).to.equal(picture);
      expect(doc.title).to.equal(title);
      expect(doc.location).to.equal(location);
      expect(doc.github).to.equal(github);
      expect(doc.facebook).to.equal(facebook);
      expect(doc.instagram).to.equal(instagram);
      // Check that multiple definitions with the same email address fail
      expect(function foo() { Profiles.define(defineObject); }).to.throw(Error);
      // Check that we can dump and restore a Profile.
      const dumpObject = Profiles.dumpOne(docID);
      Profiles.removeIt(docID);
      expect(Profiles.isDefined(docID)).to.be.false;
      docID = Profiles.restoreOne(dumpObject);
      expect(Profiles.isDefined(docID)).to.be.true;
      Profiles.removeIt(docID);
    });
  });
}

