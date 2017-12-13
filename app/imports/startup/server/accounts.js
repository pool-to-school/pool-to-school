import { Accounts } from 'meteor/accounts-base';
import { Profiles } from '/imports/api/profile/ProfileCollection';

/* eslint-disable no-console */
/* Create a profile document for this user if none exists already. */
Accounts.validateNewUser(function validate(user) {
  if (user) {
    const username = user.services.cas.id;
    console.log(user.services.cas);
    if (!Profiles.isDefined(username)) {
      Profiles.define({ username });
    }
    // Profiles.define();
  }
  // All UH users are valid for BowFolios.
  return true;
});
