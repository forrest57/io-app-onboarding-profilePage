import * as E from "fp-ts/lib/Either";
import { call, put, takeLatest } from "typed-redux-saga/macro";
import { getType } from "typesafe-actions";
import { InitializedProfile } from "..";
import { BackendClient } from "../../../api/backend";
import { apiUrlPrefix } from "../../../config";
import { SessionToken } from "../../../types/SessionToken";
import { SagaCallReturnType } from "../../../types/utils";
import { profileLoadSuccess } from "../actions";
import { profileLoadRequest } from "../store";

// const sagaActions = {
//   PROFILE_LOAD_REQUEST: "PROFILE_LOAD_REQUEST",
//   PROFILE_LOAD_FAILURE: "PROFILE_LOAD_FAILURE",
//   PROFILE_LOAD_SUCCESS: "PROFILE_LOAD_SUCCESS"
// } as const;

declare const someToken: SessionToken; // TODO:: implement token

type MyBackend = ReturnType<typeof BackendClient>;
const backendClient: MyBackend = BackendClient(apiUrlPrefix, someToken);

const getProfile = backendClient.getProfile;
function* saga() {
  yield* takeLatest(getType(profileLoadRequest), loadProfile, getProfile);
}

// TODO || THIS is the main saga the middleware will run
// component dispatches custom saga action => saga action triggers store action

function* loadProfile(getProfile: MyBackend["getProfile"]) {
  yield* put(profileLoadRequest());
  const res = yield* call(getProfile, {});
  // E.isLeft(res);
  // E.isLeft(res);
  const validResponse = yield* switchResult(res);
}

type responseType = SagaCallReturnType<MyBackend["getProfile"]>;

function* switchResult(res: responseType) {
  if (E.isRight(res)) {
    switch (res.right.status) {
      case 200:
        const values = res.right.value;
        const newProfile: InitializedProfile = {
          name: values.name,
          nameSurname: `${values.name} ${values.family_name}`,
          familyName: values.family_name,
          fiscalCode: values.fiscal_code,
          email: values.email as `${string}@${string}.${string}`
        };
        yield* put(profileLoadSuccess(newProfile));
        break;
      // default:
      //   if (E.isLeft(res)) {
      //     yield* res;
      //   }
    }
  } else {
    throw new Error();
  }
}

export default saga;
