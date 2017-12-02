import { Template } from 'meteor/templating';

Template.Roles_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

