import * as pot from "@pagopa/ts-commons/lib/pot";
import * as E from "fp-ts/lib/Either";
import { call, put, select } from "typed-redux-saga/macro";
import { ActionType } from "typesafe-actions";
import { BackendClient } from "../../api/backend";
import { loadMessageWithRelations } from "../../store/actions/messages";
import { loadServiceDetail } from "../../store/actions/services";
import { serviceByIdSelector } from "../../store/reducers/entities/services/servicesById";
import { ReduxSagaEffect, SagaCallReturnType } from "../../types/utils";
import { convertUnknownToMessagesFailure } from "../../utils/errors";
import { loadMessage } from "../messages/loadMessage";

/**
 * Load message with related entities (e.g. the sender service).
 *
 * @param getMessage API call to fetch the message detail
 * @param messageWithRelationsLoadRequest
 */
export function* watchLoadMessageWithRelationsSaga(
  getMessage: ReturnType<typeof BackendClient>["getMessage"],
  messageWithRelationsLoadRequest: ActionType<
    typeof loadMessageWithRelations["request"]
  >
): Generator<ReduxSagaEffect, void, any> {
  // Extract the message id from the action payload
  const messageId = messageWithRelationsLoadRequest.payload;

  try {
    const messageOrError: SagaCallReturnType<typeof loadMessage> = yield* call(
      loadMessage,
      getMessage,
      messageId
    );

    if (E.isLeft(messageOrError)) {
      throw new Error(messageOrError.left.message);
    }

    const message = messageOrError.right;
    yield* put(loadMessageWithRelations.success());

    const serviceById = serviceByIdSelector(message.sender_service_id);

    const potService: ReturnType<typeof serviceById> = yield* select(
      serviceById
    );

    // We have the message try to load also the sender service only if there's
    // no such service or if we are already loading it
    if (
      potService === undefined ||
      (!pot.isSome(potService) && !pot.isLoading(potService))
    ) {
      yield* put(loadServiceDetail.request(message.sender_service_id));
    }
  } catch (e) {
    yield* put(
      loadMessageWithRelations.failure(convertUnknownToMessagesFailure(e))
    );
  }
}
