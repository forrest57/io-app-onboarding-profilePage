/**
 * A reducer for the Profile.
 * It only manages SUCCESS actions because all UI state properties (like loading/error)
 * are managed by different global reducers.
 */
import * as pot from "@pagopa/ts-commons/lib/pot";
import { FiscalCode } from "@pagopa/ts-commons/lib/strings";
import * as O from "fp-ts/lib/Option";
import { createSelector } from "reselect";
import { getType } from "typesafe-actions";
import { capitalize } from "../../../utils/strings";
import {
  ProfileActions,
  profileLoadFailure,
  profileLoadRequest,
  profileLoadSuccess
} from "../actions";
import { InitializedProfile } from "..";
// import { GlobalState } from "./types";

export type ProfileState = pot.Pot<InitializedProfile, Error>;

const INITIAL_STATE: ProfileState = pot.none;

// Selectors

export const profileSelector = (state: ProfileState): ProfileState => state;
// todo:: DOES NOT MEMOIZE (and also is not a selector :P)
// export const isEmailEnabledSelector = createSelector(profileSelector, profile =>
//   pot.getOrElse(
//     pot.map(profile, p => p.is_email_enabled),
//     false
//   )
// );

// export const isInboxEnabledSelector = createSelector(profileSelector, profile =>
//   pot.isSome(profile) && InitializedProfile.is(profile.value)
//     ? profile.value.is_inbox_enabled
//     : false
// );

type EmailAddress = `${string}@${string}.${string}`;

export const getProfileEmail = (
  user: InitializedProfile
): O.Option<EmailAddress> => O.fromNullable(user.email);

// export const getProfileSpidEmail = (
//   user: InitializedProfile
// ): O.Option<EmailAddress> => O.fromNullable(user.spid_email);

// return the email address (as a string) if the profile pot is some and its value is of kind InitializedProfile and it has an email
export const profileEmailSelector = createSelector(
  profileSelector,
  (profile: ProfileState): O.Option<string> =>
    pot.getOrElse(
      pot.map(profile, p => getProfileEmail(p)),
      O.none
    )
);

// NEW FISCAL CODE SELECTOR BLOCK
export const newFiscalCodeSelector = createSelector(
  profileSelector,
  (profile: ProfileState): O.Option<string> =>
    pot.getOrElse(
      pot.map(profile, p => getProfileFiscalCode(p)),
      O.none
    )
);

export const getProfileFiscalCode = (
  user: InitializedProfile
): O.Option<FiscalCode> => O.fromNullable(user.fiscalCode);

//

/**
 * Return the name of the profile if some, else undefined
 */
export const profileNameSelector = createSelector(
  profileSelector,
  (profile: ProfileState): string | undefined =>
    pot.getOrElse(
      pot.map(profile, p => capitalize(p.name)),
      undefined
    )
);

/**
 * Return the fiscal code of the profile if some, else undefined
 */
export const profileFiscalCodeSelector = createSelector(
  profileSelector,
  (profile: ProfileState): string | undefined =>
    pot.getOrElse(
      pot.map(profile, p => p.fiscalCode),
      undefined
    )
);

/**
 * The complete name + surname
 */
export const profileNameSurnameSelector = createSelector(
  profileSelector,
  (profile: ProfileState): string | undefined =>
    pot.getOrElse(
      pot.map(profile, p => capitalize(`${p.name} ${p.familyName}`)),
      undefined
    )
);

// return true if the profile has an email
export const hasProfileEmail = (user: InitializedProfile): boolean =>
  user.email !== undefined;

// return true if the profile has an email
export const hasProfileEmailSelector = createSelector(
  profileSelector,
  (profile: ProfileState): boolean =>
    pot.getOrElse(
      pot.map(profile, p => hasProfileEmail(p)),
      false
    )
);

// TODO::
// export const isProfileEmailValidated = (user: InitializedProfile): boolean =>
//   user.is_email_validated !== undefined && user.is_email_validated === true;

// return true if the profile has version equals to 0

// export const isProfileFirstOnBoarding = (user: InitializedProfile): boolean =>
//   user.version === 0;

// return true if the profile pot is some and its field is_email_validated exists and it's true
// export const isProfileEmailValidatedSelector = createSelector(
//   profileSelector,
//   (profile: ProfileState): boolean =>
//     pot.getOrElse(
//       pot.map(profile, p => hasProfileEmail(p) && isProfileEmailValidated(p)),
//       false
//     )
// );
// TODO::ENDTODO

const reducer = (
  state: ProfileState = INITIAL_STATE,
  action: ProfileActions
): ProfileState => {
  switch (action.type) {
    case getType(profileLoadRequest):
      return pot.toLoading(state);

    case getType(profileLoadSuccess):
      // Store the loaded Profile in the store
      return pot.some(action.payload);

    case getType(profileLoadFailure):
      return pot.toError(state, action.payload);
  }
};

export default reducer;
