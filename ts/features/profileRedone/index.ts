// onmount dispatch something along the lines of {type: 'profile/firstload'}
//  dispatch gets intercepted by saga, which calls BE to get data
// store gets updated, and so does component
// todo:: refactor state with createSlice()

import { FiscalCode } from "@pagopa/ts-commons/lib/strings";
export type InitializedProfile = {
  name: string;
  familyName: string;
  nameSurname: `${string} ${string}`;
  fiscalCode: FiscalCode;
  email: `${string}@${string}.${string}`;
};
