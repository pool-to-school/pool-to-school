import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Majors } from '/imports/api/interest/MajorCollection';
import { Roles } from '/imports/api/interest/RoleCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Profile_Page.onCreated(function onCreated() {
  this.subscribe(Majors.getPublicationName());
  this.subscribe(Roles.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Profiles.getSchema().namedContext('Profile_Page');
});

Template.Profile_Page.helpers({
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  fieldError(fieldName) {
    const invalidKeys = Template.instance().context.invalidKeys();
    const errorObject = _.find(invalidKeys, (keyObj) => keyObj.name === fieldName);
    return errorObject && Template.instance().context.keyErrorMessage(errorObject.name);
  },
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  interests() {
    const profile = Profiles.findDoc(FlowRouter.getParam('username'));
    const selectedInterests = profile.interests;
    return profile && _.map(Interests.findAll(),
            function makeInterestObject(interest) {
              return { label: interest.name, selected: _.contains(selectedInterests, interest.name) };
            });
  },
  majors() {
    const profile = Profiles.findDoc(FlowRouter.getParam('username'));
    const selectedMajors = profile.majors;
    return profile && _.map(Majors.findAll(),
        function makeInterestObject(major) {
          return { label: major.name, selected: _.contains(selectedMajors, major.name) };
        });
  },
   roles() {
     const profile = Profiles.findDoc(FlowRouter.getParam('username'));
     const selectedRoles = profile.roles;
     return profile && _.map(Roles.findAll(),
                           function makeInterestObject(role) {
                             return { label: role.name, selected: _.contains(selectedRoles, role.name) };
                    });
 },
});


Template.Profile_Page.events({
  'submit .profile-data-form'(event, instance) {
    event.preventDefault();
    const firstName = event.target.First.value;
    const lastName = event.target.Last.value;
    const title = '';
    const location = event.target.Location.value;
    const username = FlowRouter.getParam('username'); // schema requires username.
    const picture = event.target.Picture.value;
    // const github = '';
    let fb = '';
    if (event.target.Facebook.value !== '') {
      fb = event.target.Facebook.value;
    }
    const facebook = fb;
    // const instagram = '';
    const bio = event.target.Bio.value;
    const selectedInterests = _.filter(event.target.Interests.selectedOptions, (option) => option.selected);
    const interests = _.map(selectedInterests, (option) => option.value);
    const selectedMajors = _.filter(event.target.Majors.selectedOptions, (option) => option.selected);
    const majors = _.map(selectedMajors, (option) => option.value);
    const selectedRoles = _.filter(event.target.Roles.selectedOptions, (option) => option.selected);
    const roles = _.map(selectedRoles, (option) => option.value);

    const updatedProfileData = { firstName, lastName, title, picture, facebook, bio, interests,
      majors, username, location };

    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    Profiles.getSchema().clean(updatedProfileData);
    // Determine validity.
    instance.context.validate(updatedProfileData);

    if (instance.context.isValid()) {
      const docID = Profiles.findDoc(FlowRouter.getParam('username'))._id;
      const id = Profiles.update(docID, { $set: updatedProfileData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});


// i can't figure out how to get this working sorry, meteor is bad sometimes
/*
Template.Profile_Page.onRendered(function () {

  console.log("that's me!");
  const role = {};
  const schedule = {};

  // ROLE
  {
    // setup fields and menu
    role.fields = {
      driver: {
        radio: this.$('.role .static .driver input'),
        button: this.$('.role .dynamic .driver .button'),
      },
      passenger: {
        radio: this.$('.role .static .passenger  input'),
        button: this.$('.role .dynamic  .passenger .button'),
      },
    };

    role.value = '';

    const switchRole = function (ob, to) {
      const obj = ob;
      return function () {
        for (const field in obj.fields) {
          if (field === to) {
            obj.fields[field].radio.prop('checked', true);
            obj.fields[field].button.removeClass('basic');
          } else {
            obj.fields[field].radio.prop('checked', false);
            obj.fields[field].button.addClass('basic');
          }
        }
        obj.value = to;
      };
    };

    if (!!role.fields[role.value]) {
      switchRole(role, role.value);
    }
    // connect menu to radio
    for (const field in role.fields) {
      // console.log(`role.fields[${field}]`);
      if (role.fields[field]) {
        role.fields[field].button.on('click', switchRole(role, field));
      }
    }
  }

  // SCHEDULE
  {
    schedule.values = {};
    schedule.fields = {};
    const days = ['sun', 'mon', 'tues', 'wednes', 'thurs', 'fri', 'satur'];

    const valueToggle = function (val, fi, dd) {
      const value = val;
      const field = fi;
      const dropdowns = dd;
      return function () {
        value.has = !value.has;
        field.checkbox.prop('checked', value.has);

        let action;
        if (value.has) {
          action = 'removeClass';
          for (const dropdown of dropdowns) {
            dropdown.dropdown('set text', 'Select latest arrival time');
          }
        } else {
          action = 'addClass';
          for (const dropdown of dropdowns) {
            dropdown.dropdown('clear', null);
          }
        }

        field.button[action]('basic');
        field.arrive[action]('disabled');
        field.depart[action]('disabled');
      };
    };

    const valueUpdate = function (val, what) {
      const value = val;
      return function (event) {
        value[what] = event.target.value;
      };
    };

    for (const day of days) {

      schedule.values[day] = {
        has: false,
        arrive: '',
        depart: '',
      };
      schedule.fields[day] = {
        checkbox: this.$(`.schedule .${day}.day.fields .has.field input`),
        button: this.$(`.schedule .${day}.day.fields .has.field .button`),
        arrive: this.$(`.schedule .${day}.day.fields .arrive.field`),
        depart: this.$(`.schedule .${day}.day.fields .depart.field`),
      };

      // field functionality
      const value = schedule.values[day];
      const field = schedule.fields[day];
      const dropdowns = [
        field.arrive.find('.dropdown'),
        field.depart.find('.dropdown'),
      ];

      field.button.on('click', valueToggle(value, field, dropdowns));

      for (const dropdown of ['arrive', 'depart']) {
        field[dropdown].on('change', valueUpdate(value, dropdown));
        if (value[dropdown] === '') {
          field[dropdown].addClass('disabled');
        }
      }
    }
  }
});
*/
