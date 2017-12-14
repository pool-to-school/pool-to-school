import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
// import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveArray } from 'meteor/manuel:reactivearray';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
// import { Interests } from '/imports/api/interest/InterestCollection';
// import { Tracker } from 'meteor/tracker';

// const selectedInterestsKey = 'selectedInterests';

/* eslint-disable no-console */

Template.registerHelper('equals', function (a, b) {
  return a === b;
});

let user = null;

Template.Matches_Page.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.matches = new ReactiveArray([]);
  this.matchesUpdate = new ReactiveVar(false);
  this.sortedBy = new ReactiveVar('best');
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      user = Profiles.findDoc(FlowRouter.getParam('username'));
      user.days = [];
      const icons = { sun: 'U', mon: 'M', tues: 'T', wednes: 'W', thurs: 'H', fri: 'F', satur: 'S' };
      _.each(user.schedule, function (v, k) {
        if (v.has) {
          user.days.push({ id: k, icon: icons[k] });
        }
      });

      const matches = this.matches;
      const allProfiles = Profiles.findAll().map((doc) => (doc));
      console.log(`loaded ${allProfiles.length}`);
      console.log(allProfiles);

      const profiles = _.filter(allProfiles, function (profile) {
        if (profile.username === user.username) {
          return false;
        }
        return _.some(profile.schedule, function (theirs, k) {
          const mine = user.schedule[k];
          console.log(`${mine.has} ?== ${theirs.has}`);
          return mine.has && theirs.has;
        });
      });


      console.log(`found ${profiles.length}`);
      _.each(profiles, function (profile) {
        const sameInterests = _.intersection(profile.interests, user.interests);
        const sameSchedule = {}; // TODO: _.pick wasn't working, why?
        _.each(profile.schedule, function (theirs, k) {
          const mine = user.schedule[k];
          console.log(`${profile.username}, ${k}, ${mine.has === theirs.has}`);
          if (mine.has && theirs.has) {
            sameSchedule[k] = theirs;
          }
        });
        console.log(profile.schedule);
        console.log(sameSchedule);
        // console.log(`${profile.username}`);
        matches.push({
          // id,
          username: profile.username,
          firstName: profile.firstName,
          lastName: profile.lastName,
          bio: profile.bio,
          picture: profile.picture,
          interests: sameInterests,
          schedule: sameSchedule,
          location: profile.location,
          major: profile.major,
        });
      });

      matches.sort(function (a, b) {
        return a.firstName < b.firstName;
      });
    }
  });
});

Template.Matches_Page.helpers({
  matches() {
    console.log('getting matches...');
    Template.instance().matchesUpdate.set(false);
    return {
      data: Template.instance().matches,
      fresh: Template.instance().matchesUpdate.get(), // hack because ReactiveArr doesn't work on .sort()
    };
  },
  sortedBy() {
    return Template.instance().sortedBy.get();
  },
});

Template.Matches_Page_Item.helpers({
  scheduleHas(schedule, day) {
    return !!schedule &&
      !!schedule[day] &&
      !!schedule[day].has;
  },
  days() {
    return user.days;
    // return [
    //   { id: 'sun', icon: 'U' },
    //   { id: 'mon', icon: 'M' },
    //   { id: 'tues', icon: 'T' },
    //   { id: 'wednes', icon: 'W' },
    //   { id: 'thurs', icon: 'H' },
    //   { id: 'fri', icon: 'F' },
    //   { id: 'satur', icon: 'S' },
    // ];
  },
  sameLocation(location) {
    return location === user.location;
  },
  sameMajor(major) {
    return major === user.major;
  },
});

// Matches_Page
{
  function sort(by) {
    return function (event, instance) {
      console.log(`sort: ${by}`);
      instance.sortedBy.set(by);
      instance.matchesUpdate.set(true);
      switch (by) {
        case 'best':
          instance.matches.sort(function (a, b) {
            return a.firstName < b.firstName;
          });
          break;
        case 'interest':
          instance.matches.sort(function (a, b) {
            return a.interests.length < b.interests.length;
          });
          break;
        case 'schedule':
          instance.matches.sort(function (a, b) {
            if (!(a.schedule && b.schedule)) {
              return false;
            }
            return (_.keys(a.schedule).length || 0) < (_.keys(b.schedule).length || 0);
          });
          break;
        case 'location':
          instance.matches.sort(function (a) {
            if (!(a.location && user.location)) {
              return false;
            }
            return a.location !== user.location;
          });
          break;
        default:
          console.log('how did you do this.');
          break;
      }
    };
  }

  const events = {};

  _.each(['best', 'interest', 'schedule', 'location'], function (category) {
    events[`click .sort.menu .${category}.item`] = sort(category);
  });

  Template.Matches_Page.events(events);
}

// Matches_Page_Item
{
  function toggle(details) {
    return function (event, instance) {
      console.log(`toggle: ${details}`);
      const button = instance.$(event.currentTarget);
      const id = button.attr('data-user');
      const div = instance.$(`.browse .item .${details}.details[data-user="${id}"]`);
      if (button.hasClass('active')) {
        button.removeClass('active');
      } else {
        button.addClass('active');
      }

      div.transition({
        animation: 'fade down',
      });
    };
  }

  const events = {
    'click .item .join.button': function (event, instance) {
      const button = instance.$(event.currentTarget);
      const id = button.attr('data-user');
      console.log(`join ${id}`);
    },
  };

  _.each(['interest', 'schedule', 'location'], function (details) {
    events[`click .browse .item .${details}.button`] = toggle(details);
  });


  Template.Matches_Page.events(events);
}
