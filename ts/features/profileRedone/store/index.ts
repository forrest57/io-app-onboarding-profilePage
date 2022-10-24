import { pot } from "@pagopa/ts-commons";
import { FiscalCode } from "@pagopa/ts-commons/lib/strings";
import createSagaMiddleware from "@redux-saga/core";
import {
  configureStore,
  createSelector,
  createSlice,
  PayloadAction
} from "@reduxjs/toolkit";
import * as O from "fp-ts/lib/Option";
import { capitalize } from "../../../utils/strings";
import saga from "../sagas";

export type InitializedProfile = {
  name: string;
  familyName: string;
  nameSurname: `${string} ${string}`;
  fiscalCode: FiscalCode;
  email: `${string}@${string}.${string}`;
};
export type ProfileState = pot.Pot<InitializedProfile, Error>;

const initialState: ProfileState = pot.none;

// type SetOnboardingOriginPayload = {
//   onboardingOrigin: string;
// };

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    profileLoadRequest(state: ProfileState) {
      pot.toLoading(state);
    },
    profileLoadSuccess(_, action: PayloadAction<InitializedProfile>) {
      pot.some(action.payload);
    },
    profileLoadFailure(state: ProfileState, action: PayloadAction<Error>) {
      pot.toError(state, action.payload);
    }
    // setOnboardingOrigin: (
    //   state,
    //   action: PayloadAction<SetOnboardingOriginPayload>
    // ) => {
    //   // eslint-disable-next-line functional/immutable-data
    //   state.onboardingOrigin = action.payload.onboardingOrigin;
    // }
  }
});

export const { profileLoadRequest, profileLoadSuccess, profileLoadFailure } =
  profileSlice.actions;

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: profileSlice.reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware)
});

sagaMiddleware.run(saga);

export default store;

// SELECTORS

export const getProfile = (state: ProfileState): ProfileState => state;

type EmailAddress = `${string}@${string}.${string}`;

export const getProfileEmail = (
  user: InitializedProfile
): O.Option<EmailAddress> => O.fromNullable(user.email);

// export const getProfileSpidEmail = (
//   user: InitializedProfile
// ): O.Option<EmailAddress> => O.fromNullable(user.spid_email);

// return the email address (as a string) if the profile pot is some and its value is of kind InitializedProfile and it has an email
export const profileEmailSelector = createSelector(
  getProfile,
  (profile: ProfileState): O.Option<string> =>
    pot.getOrElse(
      pot.map(profile, p => getProfileEmail(p)),
      O.none
    )
);

// NEW FISCAL CODE SELECTOR BLOCK
export const newFiscalCodeSelector = createSelector(
  getProfile,
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
  getProfile,
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
  getProfile,
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
  getProfile,
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
  getProfile,
  (profile: ProfileState): boolean =>
    pot.getOrElse(
      pot.map(profile, p => hasProfileEmail(p)),
      false
    )
);
