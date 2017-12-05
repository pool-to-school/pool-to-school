import { Template } from 'meteor/templating';

Template.Majors_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

