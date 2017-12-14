import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';

const selectedInterestsKey = 'selectedInterests';

Template.Schedule_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedInterestsKey, undefined);
});

Template.Schedule_Page.helpers({
  monday() {
    if (!Template.instance().messageFlags.get(selectedInterestsKey)) {
      Template.instance().messageFlags.set(selectedInterestsKey, _.map(Interests.findAll(), interest => interest.name));
    }
    // Find all profiles with the currently selected interests.
    const allProfiles = Profiles.findAll();
    console.log(allProfiles);
    const mySchedule = allProfiles[allProfiles.length - 1].schedule;
    const times = ['6am', '7am', '8am', '9am', '10am', '11am',
      '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm',
      '7pm', '8pm', '9pm', '10pm', '11pm'];

    if (mySchedule.mon.has == true) {
      console.log('Monday');
      console.log(`${times[mySchedule.mon.arrive]}-${times[mySchedule.mon.depart]}`);
      return `Monday ${times[mySchedule.mon.arrive]}-${times[mySchedule.mon.depart]}`;
    }
    else {
      return '';
    }
  },
  tuesday() {
    if (!Template.instance().messageFlags.get(selectedInterestsKey)) {
      Template.instance().messageFlags.set(selectedInterestsKey, _.map(Interests.findAll(), interest => interest.name));
    }
    // Find all profiles with the currently selected interests.
    const allProfiles = Profiles.findAll();
    const mySchedule = allProfiles[allProfiles.length - 1].schedule;
    const times = ['6am', '7am', '8am', '9am', '10am', '11am',
      '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm',
      '7pm', '8pm', '9pm', '10pm', '11pm'];

    if (mySchedule.tues.has == true) {
      console.log('Tuesday');
      console.log(`${times[mySchedule.tues.arrive]}-${times[mySchedule.tues.depart]}`);
      return `Tuesday ${times[mySchedule.tues.arrive]}-${times[mySchedule.tues.depart]}`;
    }
    else {
      return '';
    }
  },
  wednesday() {
    if (!Template.instance().messageFlags.get(selectedInterestsKey)) {
      Template.instance().messageFlags.set(selectedInterestsKey, _.map(Interests.findAll(), interest => interest.name));
    }
    // Find all profiles with the currently selected interests.
    const allProfiles = Profiles.findAll();
    const mySchedule = allProfiles[allProfiles.length - 1].schedule;
    const times = ['6am', '7am', '8am', '9am', '10am', '11am',
      '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm',
      '7pm', '8pm', '9pm', '10pm', '11pm'];

    if (mySchedule.wednes.has == true) {
      console.log('Wednesday');
      console.log(`${times[mySchedule.wednes.arrive]}-${times[mySchedule.wednes.depart]}`);
      return `Wednesday ${times[mySchedule.wednes.arrive]}-${times[mySchedule.wednes.depart]}`;
    }
    else {
      return '';
    }
  },
  thursday() {
    if (!Template.instance().messageFlags.get(selectedInterestsKey)) {
      Template.instance().messageFlags.set(selectedInterestsKey, _.map(Interests.findAll(), interest => interest.name));
    }
    // Find all profiles with the currently selected interests.
    const allProfiles = Profiles.findAll();
    const mySchedule = allProfiles[allProfiles.length - 1].schedule;
    const times = ['6am', '7am', '8am', '9am', '10am', '11am',
      '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm',
      '7pm', '8pm', '9pm', '10pm', '11pm'];

    if (mySchedule.thurs.has == true) {
      console.log('Thursday');
      console.log(`${times[mySchedule.thurs.arrive]}-${times[mySchedule.thurs.depart]}`);
      return `Thursday ${times[mySchedule.thurs.arrive]}-${times[mySchedule.thurs.depart]}`;
    }
    else {
      return '';
    }
  },
  friday() {
    if (!Template.instance().messageFlags.get(selectedInterestsKey)) {
      Template.instance().messageFlags.set(selectedInterestsKey, _.map(Interests.findAll(), interest => interest.name));
    }
    // Find all profiles with the currently selected interests.
    const allProfiles = Profiles.findAll();
    const mySchedule = allProfiles[allProfiles.length - 1].schedule;
    const times = ['6am', '7am', '8am', '9am', '10am', '11am',
      '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm',
      '7pm', '8pm', '9pm', '10pm', '11pm'];

    if (mySchedule.fri.has == true) {
      console.log('Friday');
      console.log(`${times[mySchedule.fri.arrive]}-${times[mySchedule.fri.depart]}`);
      return `Friday ${times[mySchedule.fri.arrive]}-${times[mySchedule.fri.depart]}`;
    }
    else {
      return '';
    }
  },
  saturday() {
    if (!Template.instance().messageFlags.get(selectedInterestsKey)) {
      Template.instance().messageFlags.set(selectedInterestsKey, _.map(Interests.findAll(), interest => interest.name));
    }
    // Find all profiles with the currently selected interests.
    const allProfiles = Profiles.findAll();
    const mySchedule = allProfiles[allProfiles.length - 1].schedule;
    const times = ['6am', '7am', '8am', '9am', '10am', '11am',
      '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm',
      '7pm', '8pm', '9pm', '10pm', '11pm'];

    if (mySchedule.satur.has == true) {
      console.log('Saturday');
      console.log(`${times[mySchedule.satur.arrive]}-${times[mySchedule.satur.depart]}`);
      return `Saturday ${times[mySchedule.satur.arrive]}-${times[mySchedule.satur.depart]}`;
    }
    else {
      return '';
    }
  },
  sunday() {
    if (!Template.instance().messageFlags.get(selectedInterestsKey)) {
      Template.instance().messageFlags.set(selectedInterestsKey, _.map(Interests.findAll(), interest => interest.name));
    }
    // Find all profiles with the currently selected interests.
    const allProfiles = Profiles.findAll();
    const mySchedule = allProfiles[allProfiles.length - 1].schedule;
    const times = ['6am', '7am', '8am', '9am', '10am', '11am',
      '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm',
      '7pm', '8pm', '9pm', '10pm', '11pm'];

    if (mySchedule.sun.has == true) {
      console.log('Sunday');
      console.log(`${times[mySchedule.sun.arrive]}-${times[mySchedule.sun.depart]}`);
      return `Sunday ${times[mySchedule.sun.arrive]}-${times[mySchedule.sun.depart]}`;
    }
    else {
      return '';
    }
  },
  profiles() {
    // Initialize selectedInterests to all of them if messageFlags is undefined.
    if (!Template.instance().messageFlags.get(selectedInterestsKey)) {
      Template.instance().messageFlags.set(selectedInterestsKey, _.map(Interests.findAll(), interest => interest.name));
    }
    // Find all profiles with the currently selected interests.
    const allProfiles = Profiles.findAll();
    // console.log('All profiles: ');
    // console.log(allProfiles);
    //console.log('My schedule: ');
    const mySchedule = allProfiles[allProfiles.length - 1].schedule;
    //console.log(mySchedule);
    const times = ['6:00 am', '7:00 am', '8:00 am', '9:00 am', '10:00 am', '11:00 am',
      '12:00 pm', '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm', '6:00 pm',
      '7:00 pm', '8:00 pm', '9:00 pm', '10:00 pm', '11:00 pm'];

    if (mySchedule.mon.has == true) {
      console.log('Monday');
      console.log(`${times[mySchedule.mon.arrive]}-${times[mySchedule.mon.depart]}`);
    }
    if (mySchedule.tues.has == true) {
      console.log('Tuesday');
      console.log(`${times[mySchedule.tues.arrive]}-${times[mySchedule.tues.depart]}`);
    }
    if (mySchedule.wednes.has == true) {
      console.log('Wednesday');
      console.log(`${times[mySchedule.wednes.arrive]}-${times[mySchedule.wednes.depart]}`);
    }
    if (mySchedule.thurs.has == true) {
      console.log('Thursday');
      console.log(`${times[mySchedule.thurs.arrive]}-${times[mySchedule.thurs.depart]}`);
    }
    if (mySchedule.fri.has == true) {
      console.log('Friday');
      console.log(`${times[mySchedule.fri.arrive]}-${times[mySchedule.fri.depart]}`);
    }
    if (mySchedule.satur.has == true) {
      console.log('Saturday');
      console.log(`${times[mySchedule.satur.arrive]}-${times[mySchedule.satur.depart]}`);
    }
    if (mySchedule.sun.has == true) {
      console.log('Sunday');
      console.log(`${times[mySchedule.sun.arrive]}-${times[mySchedule.sun.depart]}`);
    }

    const selectedInterests = Template.instance().messageFlags.get(selectedInterestsKey);
    return _.filter(allProfiles, profile => _.intersection(profile.interests, selectedInterests).length > 0);
  },

  interests() {
    return _.map(Interests.findAll(),
        function makeInterestObject(interest) {
          return {
            label: interest.name,
            selected: _.contains(Template.instance().messageFlags.get(selectedInterestsKey), interest.name),
          };
        });
  },
});

Template.Schedule_Page.events({
  'submit .filter-data-form': function (event, instance) {
    event.preventDefault();
    const selectedOptions = _.filter(event.target.Interests.selectedOptions, (option) => option.selected);
    instance.messageFlags.set(selectedInterestsKey, _.map(selectedOptions, (option) => option.value));
  },
});

