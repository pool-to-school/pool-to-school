import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Majors } from '/imports/api/interest/MajorCollection';
import { Tracker } from 'meteor/tracker';
// import { Roles } from '/imports/api/interest/RoleCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Profile_Page.onCreated(function onCreated() {
  this.subscribe(Majors.getPublicationName());
  // this.subscribe(Roles.getPublicationName());
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
  schedule() {
    // const profile = Profiles.findDoc(FlowRouter.getParam('username'));
    // const schedule = profile.schedule;
    const days = [
      { name: 'Sunday', id: 'sun' },
      { name: 'Monday', id: 'mon' },
      { name: 'Tuesday', id: 'tues' },
      { name: 'Wednesday', id: 'wednes' },
      { name: 'Thursday', id: 'thurs' },
      { name: 'Friday', id: 'fri' },
      { name: 'Saturday', id: 'satur' },
    ];
    // for (const day in days) {
    //   if (days[day]) {
    //     days[day].value = schedule[day];
    //   }
    // }
    return days;
  },
  days() {
    // const profile = Profiles.findDoc(FlowRouter.getParam('username'));
    // const schedule = profile.schedule;
    const days = [
      { name: 'Sunday', id: 'sun' },
      { name: 'Monday', id: 'mon' },
      { name: 'Tuesday', id: 'tues' },
      { name: 'Wednesday', id: 'wednes' },
      { name: 'Thursday', id: 'thurs' },
      { name: 'Friday', id: 'fri' },
      { name: 'Saturday', id: 'satur' },
    ];
    // for (const day in days) {
    //   if (days[day]) {
    //     days[day].value = schedule[day];
    //   }
    // }
    return days;
  },
  times() {
    return [
    ];
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
});


Template.Profile_Page.events({
  'submit .profile-data-form'(event, instance) {
    // const f = event.target;
    const get = function (prop) {
      return event.target[prop].value;
    };
    event.preventDefault();

    const selectedInterests = _.filter(event.target.Interests.selectedOptions, (option) => option.selected);
    const interests = _.map(selectedInterests, (option) => option.value);
    const selectedMajors = _.filter(event.target.Majors.selectedOptions, (option) => option.selected);
    const majors = _.map(selectedMajors, (option) => option.value);

    const data = {
      username: FlowRouter.getParam('username'),
      firstName: get('first-name'),
      lastName: get('last-name'),
      location: get('location'),
      // picture: get('picture'),
      // bio: get('Bio'),
      // facebook: get('Facebook') !== '' ? get('Facebook') : null,
      interests,
      majors,
    };

    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    Profiles.getSchema().clean(data);
    // Determine validity.
    instance.context.validate(data);

    if (instance.context.isValid()) {
      const docID = Profiles.findDoc(FlowRouter.getParam('username'))._id;
      const id = Profiles.update(docID, { $set: data });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

const onRendered = function () {
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

    role.value = ''; // TODO: populate in meteor

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
          dropdowns.arrive.dropdown('set text', 'Select latest arrival time');
          dropdowns.depart.dropdown('set text', 'Select earliest departure time');
        } else {
          action = 'addClass';
          dropdowns.arrive.dropdown('clear', null);
          dropdowns.depart.dropdown('clear', null);
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
      // TODO: populate using meteor
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
      const dropdowns = {
        arrive: field.arrive.find('.dropdown'),
        depart: field.depart.find('.dropdown'),
      };

      field.button.on('click', valueToggle(value, field, dropdowns));

      for (const dropdown of ['arrive', 'depart']) {
        field[dropdown].on('change', valueUpdate(value, dropdown));
        if (value[dropdown] === '') {
          field[dropdown].addClass('disabled');
        }
      }
    }
  }

  this.$('.ui.dropdown').dropdown();
};


Template.Profile_Page.onRendered(function () {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      Tracker.afterFlush(() => {
        onRendered();
      });
    }
  });
});
