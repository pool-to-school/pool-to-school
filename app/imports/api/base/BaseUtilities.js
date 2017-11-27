import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Majors } from '/imports/api/interest/MajorCollection';
import { Roles } from '/imports/api/interest/RoleCollection';

export function removeAllEntities() {
  Roles.removeAll();
  Majors.removeAll();
  Profiles.removeAll();
  Interests.removeAll();
}
