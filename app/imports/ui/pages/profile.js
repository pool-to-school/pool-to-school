import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveArray } from 'meteor/manuel:reactivearray';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Majors } from '/imports/api/interest/MajorCollection';
import { Tracker } from 'meteor/tracker';
// import { Roles } from '/imports/api/interest/RoleCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';
// const errorMessages = 'errorMessages';


// for (const meridium of ['am', 'pm']) {
//   for (const hour of [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
//     for (const minute of ['00', '30']) {
//       const time = `${hour}:${minute}${meridium}`;
//       times.push({ label: time, value: time});
//     }
//   }
// }

let _profile = null;
function getProfile() {
  if (!_profile) {
    _profile = Profiles.findDoc(FlowRouter.getParam('username'));
  }

  return _profile;
}

let _schedule = null;
function getSchedule() {
  if (!_schedule) {
    _schedule = getProfile().schedule;
  }

  return _schedule;
}

function getTimes(day, param) {
  const schedule = getSchedule();
  const times = [];
  const timesArr = ['6am', '7am', '8am', '9am', '10am', '11am',
    '12pm', '1pm', '2pm', '3pm', '4pm', '5pm',
    '6pm', '7pm', '8pm', '9pm', '10pm'];
  _.each(timesArr, function (value, key) {
    times.push({ label: `${value}`, value: `${key}` });
  });

  // console.log(times);
  if (schedule &&
      schedule[day] &&
      schedule[day][param] !== null) {
    const val = schedule[day][param];
    if (times[val]) {
      times[val].selected = true;
      // console.log(`${day}-${param}: ${val}`);
    }
  }
  return times;
}

function getScheduleProp(day, param) {
  const schedule = getSchedule();
  let val = null;
  if (schedule &&
      schedule[day] &&
      schedule[day][param]) {
    val = schedule[day][param];
  }
  return val;
}

function isRole(role) {
  return role === getProfile().role;
}

const days = [
  { name: 'Sunday', id: 'sun' },
  { name: 'Monday', id: 'mon' },
  { name: 'Tuesday', id: 'tues' },
  { name: 'Wednesday', id: 'wednes' },
  { name: 'Thursday', id: 'thurs' },
  { name: 'Friday', id: 'fri' },
  { name: 'Saturday', id: 'satur' },
];

Template.registerHelper('concat', function (...args) {
  return Array.prototype.slice.call(args, 0, -1).join('');
});

// blaze templates are frustrating and i couldn't get these working as just helpers
Template.registerHelper('times', getTimes);
Template.registerHelper('schedule', getScheduleProp);
Template.registerHelper('role', isRole);

Template.Profile_Page.onCreated(function onCreated() {
  this.subscribe(Majors.getPublicationName());
  // this.subscribe(Roles.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.errors = new ReactiveArray([]);
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
    return getProfile();
  },
  // schedule(day, param) {
  //   const profile = Profiles.findDoc(FlowRouter.getParam('username'));
  //   let val = null;
  //   if (profile[day] && profile[day][param]) {
  //     val = profile[day];
  //   }
  //   return val;
  // },
  days() {
    return days;
  },
  interests() {
    const profile = getProfile();
    const selectedInterests = profile.interests;
    return profile && _.map(Interests.findAll(),
            function makeInterestObject(interest) {
              return { label: interest.name, selected: _.contains(selectedInterests, interest.name) };
            });
  },
  majors() {
    const profile = getProfile();
    return _.map(Majors.findAll(),
        function makeMajorObject(major) {
          // console.log(major);
          return { label: major.name, selected: profile.major === major.name };
        });
  },
});


Template.Profile_Page.events({
  'submit .profile-data-form': function (event, instance) {
    // const f = event.target;
    const get = function (prop) {
      return event.target[prop].value;
    };
    const getChecked = function (prop) {
      return event.target[prop].checked;
    };
    const getSelected = function (prop, multiple) {
      let options = _.filter(event.target[prop].selectedOptions, (option) => option.selected);
      options = _.map(options, (option) => option.value);
      if (!multiple) {
        options = options[0];
      }
      // console.log(options);
      return options;
    };
    event.preventDefault();

    // const selectedMajors = _.filter(event.target.majors.selectedOptions, (option) => option.selected);
    // const majors = _.map(selectedMajors, (option) => option.value);
    const schedule = {};
    _.each(days, function (day) {
      const id = day.id;
      const has = getChecked(`${id}-has`);
      const arrive = getSelected(`${id}-arrive`);
      const depart = getSelected(`${id}-depart`);
      if (has && arrive !== '' && depart !== '') {
        schedule[id] = { has, arrive, depart };
      } else {
        schedule[id] = { has: false };
      }
    });
    let role = '';
    if (getChecked('role-driver')) {
      role = 'driver';
    }
    if (getChecked('role-passenger')) {
      role = 'passenger';
    }

    // console.log(role);

    const data = {
      username: FlowRouter.getParam('username'),
      firstName: get('first-name'),
      lastName: get('last-name'),
      role,
      location: get('location'),
      picture: get('picture'),
      bio: get('bio'),
      // location: get('location'),
      // picture: get('picture'),
      // bio: get('Bio'),
      // facebook: get('Facebook') !== '' ? get('Facebook') : null,
      interests: getSelected('interests', true),
      major: getSelected('major'),
      schedule,
    };

    console.log(getSelected('major'));

    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    Profiles.getSchema().clean(data);
    // Determine validity.
    instance.context.validate(data);

    if (instance.context.isValid()) {
      // console.log('"valid"');
      const docID = getProfile()._id;
      const id = Profiles.update(docID, { $set: data });
      instance.errors.clear();
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      // console.log('"invalid"');

      const errors = _.map(instance.context.invalidKeys(), function (o) {
        return _.extend({ message: instance.context.keyErrorMessage(o.name) }, o);
      });
      instance.errors.clear();
      _.each(errors, function (error) { instance.errors.push(error); });
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
      console.log(instance.messageFlags[displaySuccessMessage]);
      console.log(instance.messageFlags[displayErrorMessages]);
      console.log(instance.errors);
      // console.log(errors);
    }
    // return true;
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

    role.value = getProfile().role; // TODO: populate in meteor
    // console.log(role.value);

    const switchRole = function (ob, to) {
      const obj = ob;
      return function () {
        _.each(obj.fields, function (field, key) {
          if (key === to) {
            field.radio.prop('checked', true);
            field.button.removeClass('basic');
          } else {
            field.radio.prop('checked', false);
            field.button.addClass('basic');
          }
        });
        obj.value = to;
      };
    };

    // if (!!role.fields[role.value]) {
    //   switchRole(role, role.value);
    // }
    // connect menu to radio
    _.each(role.fields, function (field, key) {
      console.log(field);
      console.log(key);
      field.button.on('click', switchRole(role, key));
    });
  }

  // SCHEDULE
  {
    schedule.values = {};
    schedule.fields = {};
    // const dayids = ['sun', 'mon', 'tues', 'wednes', 'thurs', 'fri', 'satur'];

    const valueToggle = function (val, fi) {
      const value = val;
      const field = fi;
      // const dropdowns = dd;
      return function () {
        value.has = !value.has;

        field.checkbox.prop('checked', value.has);

        let action;
        if (value.has) {
          action = 'removeClass';
        } else {
          action = 'addClass';
        }
        field.button[action]('basic');
      };
    };
    _.each(days, function (v) {
      const day = v.id;
      // TODO: populate using meteor
      schedule.values[day] = {
        has: getScheduleProp(day, 'has'),
        arrive: getScheduleProp(day, 'arrive'),
        depart: getScheduleProp(day, 'depart'),
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

      field.button.on('click', valueToggle(value, field));

      // for (const dropdown of ['arrive', 'depart']) {
      //   field[dropdown].on('change', valueUpdate(value, dropdown));
      //   if (value[dropdown] === '') {
      //     field[dropdown].addClass('disabled');
      //   }
      // }
    });
  }


  this.$('.ui.dropdown').dropdown();
};


Template.Profile_Page.onRendered(function () {
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      Tracker.afterFlush(() => {
        // console.log(Template.Profile_Page.__helpers[' profile']());
        // console.log(Template.Profile_Page.__helpers[' majors']());
        onRendered();
      });
    }
  });
});

function activateDropdown() {
  this.$('select.dropdown').dropdown();
}
Template.Field_Dropdown.onRendered(activateDropdown);
// Template.Field_Time.onRendered(activateDropdown);

Template.Field_Day.onRendered(function () {
  // this.$('.has.field input').prop('checked', this.data.has);
  // console.log(this.$('input'));
  // console.log(this.data);
});
