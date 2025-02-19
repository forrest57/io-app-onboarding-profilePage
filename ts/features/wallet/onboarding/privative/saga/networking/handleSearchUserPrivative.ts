/**
 * Load the user's privative card.
 */
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { call, put, select } from "typed-redux-saga/macro";
import { ActionType } from "typesafe-actions";
import { CobadgeResponse } from "../../../../../../../definitions/pagopa/walletv2/CobadgeResponse";
import { PaymentManagerClient } from "../../../../../../api/pagopa";
import { PaymentManagerToken } from "../../../../../../types/pagopa";
import { SagaCallReturnType } from "../../../../../../types/utils";
import { GenericError, getGenericError } from "../../../../../../utils/errors";
import { readablePrivacyReport } from "../../../../../../utils/reporters";
import { SessionManager } from "../../../../../../utils/SessionManager";
import { searchUserCobadge } from "../../../cobadge/saga/networking/searchUserCobadge";
import { CoBadgePayload } from "../../../cobadge/screens/search/SearchAvailableCoBadgeScreen";
import { PrivativeResponse, searchUserPrivative } from "../../store/actions";
import { onboardingPrivativeSearchRequestId } from "../../store/reducers/searchPrivativeRequestId";

/**
 * Try to convert a CobadgeResponse to a PrivativeResponse (only one paymentInstrument is allowed)
 * @param response
 */
const toPrivativeResponse = (
  response: CobadgeResponse
): E.Either<GenericError, PrivativeResponse> =>
  pipe(
    response.payload,
    CoBadgePayload.decode,
    E.mapLeft(errors =>
      getGenericError(new Error(readablePrivacyReport(errors)))
    ),
    E.chain(x =>
      x.paymentInstruments.length > 1
        ? E.left(
            getGenericError(
              new Error(
                `paymentInstruments in privative response should be only 0 or 1, received ${x.paymentInstruments.length}`
              )
            )
          )
        : E.right({
            paymentInstrument:
              x.paymentInstruments.length === 0
                ? null
                : x.paymentInstruments[0],
            searchRequestId: x.searchRequestId,
            searchRequestMetadata: x.searchRequestMetadata
          })
    )
  );

export function* handleSearchUserPrivative(
  getCobadgePans: ReturnType<typeof PaymentManagerClient>["getCobadgePans"],
  searchCobadgePans: ReturnType<
    typeof PaymentManagerClient
  >["searchCobadgePans"],
  sessionManager: SessionManager<PaymentManagerToken>,
  searchAction: ActionType<typeof searchUserPrivative.request>
) {
  // try to retrieve the searchRequestId for privative search
  const searchRequestId: ReturnType<typeof onboardingPrivativeSearchRequestId> =
    yield* select(onboardingPrivativeSearchRequestId);

  // get the results
  const result: SagaCallReturnType<typeof searchUserCobadge> = yield* call(
    searchUserCobadge,
    {
      abiCode: searchAction.payload.id,
      panCode: searchAction.payload.cardNumber
    },
    getCobadgePans,
    searchCobadgePans,
    sessionManager,
    searchRequestId
  );

  const eitherPrivative = pipe(result, E.chainW(toPrivativeResponse));
  // dispatch the related action
  if (E.isRight(eitherPrivative)) {
    yield* put(searchUserPrivative.success(eitherPrivative.right));
  } else {
    yield* put(searchUserPrivative.failure(eitherPrivative.left));
  }
}
