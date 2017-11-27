import { Interests } from '/imports/api/interest/InterestCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Majors } from '/imports/api/interest/MajorCollection';
import { Roles } from '/imports/api/interest/RoleCollection';

Interests.publish();
Majors.publish();
Profiles.publish();
Roles.publish();
