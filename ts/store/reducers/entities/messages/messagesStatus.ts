import * as O from "fp-ts/lib/Option";
import { createSelector } from "reselect";
import { getType } from "typesafe-actions";
import { pipe } from "fp-ts/lib/function";
import {
  DEPRECATED_loadMessage,
  removeMessages,
  DEPRECATED_setMessageReadState,
  DEPRECATED_setMessagesArchivedState
} from "../../../actions/messages";
import { Action } from "../../../actions/types";
import { GlobalState } from "../../types";
import { differentProfileLoggedIn } from "../../../actions/crossSessions";

export type MessageStatus = {
  isRead: boolean;
  isArchived: boolean;
};

export type MessagesStatus = Readonly<{
  [key: string]: MessageStatus | undefined;
}>;

export const EMPTY_MESSAGE_STATUS: MessageStatus = {
  isRead: false,
  isArchived: false
};
const INITIAL_STATE: MessagesStatus = {};

const reducer = (
  state: MessagesStatus = INITIAL_STATE,
  action: Action
): MessagesStatus => {
  switch (action.type) {
    case getType(DEPRECATED_loadMessage.success): {
      const { id } = action.payload;
      // if hits, skip it!
      if (state[id] !== undefined) {
        return state;
      }
      return {
        ...state,
        [id]: EMPTY_MESSAGE_STATUS
      };
    }

    case getType(DEPRECATED_setMessageReadState): {
      const { id, read } = action.payload;
      // if misses, set the default values for given message
      const prevState = state[id] || EMPTY_MESSAGE_STATUS;
      return {
        ...state,
        [id]: {
          ...prevState,
          isRead: read
        }
      };
    }
    case getType(DEPRECATED_setMessagesArchivedState): {
      const { ids, archived } = action.payload;
      const updatedMessageStates = ids.reduce<{
        [key: string]: MessageStatus;
      }>((accumulator, id) => {
        // if misses, set the default values for given message
        const prevState = state[id] || EMPTY_MESSAGE_STATUS;
        return {
          ...accumulator,
          [id]: {
            ...prevState,
            isArchived: archived
          }
        };
      }, {});
      return {
        ...state,
        ...updatedMessageStates
      };
    }
    case getType(removeMessages):
      const idsToRemove = action.payload;
      return Object.keys(state).reduce<MessagesStatus>(
        (acc: MessagesStatus, curr: string) => {
          if (idsToRemove.indexOf(curr) !== -1) {
            return acc;
          }
          return { ...acc, [curr]: state[curr] };
        },
        {} as MessagesStatus
      );
    // clear state if the current profile is different from the previous one
    case getType(differentProfileLoggedIn):
      return INITIAL_STATE;
    default:
      return state;
  }
};

// return messagesStatus
export const messagesStatusSelector = (state: GlobalState) =>
  state.entities.messagesStatus;

// return all unread messages id
export const messagesUnreadSelector = createSelector(
  messagesStatusSelector,
  items =>
    Object.keys(items).filter(messageId =>
      pipe(
        items[messageId],
        O.fromNullable,
        O.map(item => item.isRead === false),
        O.getOrElse(() => true)
      )
    )
);

// return all read messages id
export const messagesReadSelector = createSelector(
  messagesStatusSelector,
  items =>
    Object.keys(items).filter(messageId =>
      pipe(
        items[messageId],
        O.fromNullable,
        O.map(item => item.isRead === true),
        O.getOrElse(() => false)
      )
    )
);

// return all archived messages id
export const messagesArchivedSelector = createSelector(
  messagesStatusSelector,
  items =>
    Object.keys(items).filter(messageId =>
      pipe(
        items[messageId],
        O.fromNullable,
        O.map(item => item.isArchived === true),
        O.getOrElse(() => false)
      )
    )
);

// return all unarchived messages id
export const messagesUnarchivedSelector = createSelector(
  messagesStatusSelector,
  items =>
    Object.keys(items).filter(messageId =>
      pipe(
        items[messageId],
        O.fromNullable,
        O.map(item => item.isArchived === false),
        O.getOrElse(() => true)
      )
    )
);

// return all unarchived and unread messages id
export const messagesUnreadAndUnarchivedSelector = createSelector(
  messagesUnreadSelector,
  messagesUnarchivedSelector,
  (messagesUnread, messageUnarchived) =>
    messagesUnread.filter(
      messageId => messageUnarchived.indexOf(messageId) !== -1
    )
);

// some util functions

// return true if message is read
export const isMessageRead = createSelector(
  [messagesStatusSelector, (_: GlobalState, messageId: string) => messageId],
  (messagesStatus, messageId) =>
    pipe(
      messagesStatus[messageId],
      O.fromNullable,
      O.map(ms => ms.isRead),
      O.getOrElse(() => false)
    )
);

/**
 * Retrieve the MessageStatus given an ID.
 * Fallback to all false if not found.
 *
 * @param state
 * @param messageId
 */
export const getMessageStatus = createSelector(
  [messagesStatusSelector, (_: GlobalState, messageId: string) => messageId],
  (messagesStatus, messageId) =>
    pipe(
      messagesStatus[messageId],
      O.fromNullable,
      O.getOrElse(() => ({
        isRead: false,
        isArchived: false
      }))
    )
);

export default reducer;
