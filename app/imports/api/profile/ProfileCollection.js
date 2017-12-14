import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Majors } from '/imports/api/interest/MajorCollection';
// import { Roles } from '/imports/api/interest/RoleCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

/** @module Profile */

SimpleSchema.debug = true;

const daySchema = new SimpleSchema({
  has: { type: Boolean, optional: true },
  with: { type: [String], optional: true }, // either your driver or all your passengers
  arrive: { type: Number, optional: true }, // 0 = 6am
  depart: { type: Number, optional: true }, // 0 = 6am
});

const scheduleSchema = new SimpleSchema({
  sun: { type: daySchema, optional: true },
  mon: { type: daySchema, optional: true },
  tues: { type: daySchema, optional: true },
  wednes: { type: daySchema, optional: true },
  thurs: { type: daySchema, optional: true },
  fri: { type: daySchema, optional: true },
  satur: { type: daySchema, optional: true },
});

/**
 * Profiles provide portfolio data for a user.
 * @extends module:Base~BaseCollection
 */
class ProfileCollection extends BaseCollection {

  /**
   * Creates the Profile collection.
   */
  constructor() {
    super('Profile', new SimpleSchema({
      username: { type: String },
      // Remainder are optional
      firstName: { type: String, optional: true },
      lastName: { type: String, optional: true },
      location: { type: String, optional: true },
      bio: { type: String, optional: true },
      interests: { type: [String], optional: true },
      major: { type: String, optional: true },
      role: { type: String, allowedValues: ['driver', 'passenger'], optional: true },
      schedule: { type: scheduleSchema, optional: true },
      picture: { type: SimpleSchema.RegEx.Url, optional: true },
      // facebook: { type: String, optional: true },
    }));
  }

  /**
   * Defines a new Profile.
   * @example
   * Profiles.define({ firstName: 'Philip',
   *                   lastName: 'Johnson',
   *                   username: 'johnson',
   *                   bio: 'I have been a professor of computer science at UH since 1990.',
   *                   interests: ['Application Development', 'Software Engineering', 'Databases'],
   *                   title: 'Professor of Information and Computer Sciences',
   *                   location: 'Honolulu, HI',
   *                   picture: 'http://philipmjohnson.org/headshot.jpg',
   *                   github: 'https://github.com/philipmjohnson',
   *                   facebook: 'https://facebook.com/philipmjohnson',
   *                   instagram: 'https://instagram.com/philipmjohnson' });
   * @param { Object } description Object with required key username.
   * Remaining keys are optional.
   * Username must be unique for all users. It should be the UH email account.
   * Interests is an array of defined interest names.
   * @throws { Meteor.Error } If a user with the supplied username already exists, or
   * if one or more interests are not defined, or if github, facebook, and instagram are not URLs.
   * @returns The newly created docID.
   */
  define({ username,
      firstName = '', lastName = '', bio = '', picture = '', location = '',
      interests = [], major = '', role = '' }, schedule = {}) {
    // make sure required fields are OK.
    const checkPattern = { firstName: String, lastName: String, username: String,
      bio: String, picture: String, location: String, role: String };
    check({ firstName, lastName, username, bio, picture, location, role }, checkPattern);

    if (this.find({ username }).count() > 0) {
      throw new Meteor.Error(`${username} is previously defined in another Profile`);
    }

    // Throw an error if any of the passed Interest names are not defined.
    Interests.assertNames(interests);
    Majors.assertNames(major);
    return this._collection.insert({
      username,
      firstName, lastName, bio, picture,
      location, interests, major, role, schedule,
    });
  }

  /**
   * Returns an object representing the Profile docID in a format acceptable to define().
   * @param docID The docID of a Profile.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const username = doc.username;
    const bio = doc.bio;
    const interests = doc.interests;
    const major = doc.major;
    // const roles = doc.roles;
    const picture = doc.picture;
    // const title = doc.title;
    const location = doc.location;
    // const github = doc.github;
    // const facebook = doc.facebook;
    // const instagram = doc.instagram;
    return { username, firstName, lastName, bio, interests, major, picture, location };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Profiles = new ProfileCollection();
