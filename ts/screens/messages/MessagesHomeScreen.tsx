/**
 * A screen that contains all the Tabs related to messages.
 */
import * as pot from "@pagopa/ts-commons/lib/pot";
import { Millisecond } from "@pagopa/ts-commons/lib/units";
import { CompatNavigationProp } from "@react-navigation/compat";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { Tab, Tabs } from "native-base";
import * as React from "react";
import { Animated, Platform, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { IOStyles } from "../../components/core/variables/IOStyles";
import MessagesArchive from "../../components/messages/MessagesArchive";
import MessagesDeadlines from "../../components/messages/MessagesDeadlines";
import MessagesInbox from "../../components/messages/MessagesInbox";
import MessagesSearch from "../../components/messages/MessagesSearch";
import { ContextualHelpPropsMarkdown } from "../../components/screens/BaseScreenComponent";
import { ScreenContentHeader } from "../../components/screens/ScreenContentHeader";
import TopScreenComponent from "../../components/screens/TopScreenComponent";
import { MIN_CHARACTER_SEARCH_TEXT } from "../../components/search/SearchButton";
import { SearchNoResultMessage } from "../../components/search/SearchNoResultMessage";
import SectionStatusComponent from "../../components/SectionStatus";
import FocusAwareStatusBar from "../../components/ui/FocusAwareStatusBar";
import I18n from "../../i18n";
import { IOStackNavigationProp } from "../../navigation/params/AppParamsList";
import { MainTabParamsList } from "../../navigation/params/MainTabParamsList";
import {
  DEPRECATED_loadMessages as loadMessages,
  DEPRECATED_setMessagesArchivedState
} from "../../store/actions/messages";
import { navigateToMessageRouterScreen } from "../../store/actions/navigation";
import { loadServiceDetail } from "../../store/actions/services";
import { Dispatch } from "../../store/actions/types";
import { sectionStatusSelector } from "../../store/reducers/backendStatus";
import { lexicallyOrderedMessagesStateSelector } from "../../store/reducers/entities/messages";
import { paymentsByRptIdSelector } from "../../store/reducers/entities/payments";
import {
  servicesByIdSelector,
  ServicesByIdState
} from "../../store/reducers/entities/services/servicesById";
import {
  isSearchMessagesEnabledSelector,
  searchTextSelector
} from "../../store/reducers/search";
import { GlobalState } from "../../store/reducers/types";
import { makeFontStyleObject } from "../../theme/fonts";
import {
  isScreenReaderEnabled,
  setAccessibilityFocus
} from "../../utils/accessibility";
import { HEADER_HEIGHT, MESSAGE_ICON_HEIGHT } from "../../utils/constants";

import customVariables from "../../theme/variables";
import { IOColors } from "../../components/core/variables/IOColors";

type Props = {
  navigation: CompatNavigationProp<
    IOStackNavigationProp<MainTabParamsList, "MESSAGES_HOME">
  >;
} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  currentTab: number;
  isScreenReaderEnabled: boolean;
};

const styles = StyleSheet.create({
  tabBarContainer: {
    elevation: 0,
    height: 40
  },
  tabBarUnderline: {
    borderBottomColor: customVariables.tabUnderlineColor,
    borderBottomWidth: customVariables.tabUnderlineHeight
  },
  tabBarUnderlineActive: {
    height: customVariables.tabUnderlineHeight,
    // borders do not overlap eachother, but stack naturally
    marginBottom: -customVariables.tabUnderlineHeight,
    backgroundColor: customVariables.contentPrimaryBackground
  },
  searchDisableIcon: {
    color: customVariables.headerFontColor
  },
  activeTextStyle: {
    ...makeFontStyleObject(Platform.select, "600"),
    fontSize: Platform.OS === "android" ? 16 : undefined,
    fontWeight: Platform.OS === "android" ? "normal" : "bold",
    color: customVariables.brandPrimary
  },
  textStyle: {
    color: customVariables.textColor
  }
});

const AnimatedScreenContentHeader =
  Animated.createAnimatedComponent(ScreenContentHeader);

const AnimatedTabs = Animated.createAnimatedComponent(Tabs);

const contextualHelpMarkdown: ContextualHelpPropsMarkdown = {
  title: "messages.contextualHelpTitle",
  body: "messages.contextualHelpContent"
};

/**
 * A screen that contains all the Tabs related to messages.
 */
class MessagesHomeScreen extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentTab: 0,
      isScreenReaderEnabled: false
    };
  }

  private animatedTabScrollPositions: ReadonlyArray<Animated.Value> = [
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ];

  // It create a mostly 2 states output: it value is mostly 0 or HEADER_HEIGHT
  private getHeaderHeight = (): Animated.AnimatedInterpolation =>
    this.animatedTabScrollPositions[this.state.currentTab].interpolate({
      inputRange: [0, HEADER_HEIGHT],
      outputRange: [0, 1],
      extrapolate: "clamp"
    });

  private onRefreshMessages = () => {
    this.props.refreshMessages(
      this.props.lexicallyOrderedMessagesState,
      this.props.servicesById
    );
  };

  public async componentDidMount() {
    this.onRefreshMessages();
    const srEnabled = await isScreenReaderEnabled();
    this.setState({ isScreenReaderEnabled: srEnabled });
  }

  public render() {
    const { isSearchEnabled } = this.props;

    const statusComponent = (
      <SectionStatusComponent
        sectionKey={"messages"}
        onSectionRef={v => {
          setAccessibilityFocus(v, 100 as Millisecond);
        }}
      />
    );

    return (
      <TopScreenComponent
        accessibilityEvents={{
          disableAccessibilityFocus:
            this.props.messageSectionStatusActive !== undefined
        }}
        accessibilityLabel={I18n.t("messages.contentTitle")}
        contextualHelpMarkdown={contextualHelpMarkdown}
        faqCategories={["messages"]}
        headerTitle={I18n.t("messages.contentTitle")}
        isSearchAvailable={{ enabled: true, searchType: "Messages" }}
        appLogo={true}
      >
        <FocusAwareStatusBar
          barStyle={"dark-content"}
          backgroundColor={IOColors.white}
        />
        {this.state.isScreenReaderEnabled && statusComponent}
        {!isSearchEnabled && (
          <React.Fragment>
            <AnimatedScreenContentHeader
              title={I18n.t("messages.contentTitle")}
              iconFont={{ name: "io-home-messaggi", size: MESSAGE_ICON_HEIGHT }}
              dynamicHeight={this.getHeaderHeight()}
            />
            {this.renderTabs()}
          </React.Fragment>
        )}
        {isSearchEnabled && this.renderSearch()}
        {!this.state.isScreenReaderEnabled && statusComponent}
      </TopScreenComponent>
    );
  }

  // Disable longPress options the horizontal scroll
  // overcome the 50% of the tab width
  private handleOnTabsScroll = (value: number) => {
    const { currentTab } = this.state;
    if (Math.abs(value - currentTab) > 0.5) {
      const nextTab = currentTab + (value - currentTab > 0 ? 1 : -1);
      this.setState({
        currentTab: nextTab
      });
    }
  };

  // Update cuttentTab state when horizontal scroll is completed
  private handleOnChangeTab = (evt: any) => {
    const nextTab: number = evt.i;
    this.setState({
      currentTab: nextTab
    });
  };

  /**
   * Render Inbox, Deadlines and Archive tabs.
   */
  private renderTabs = () => {
    const {
      lexicallyOrderedMessagesState,
      servicesById,
      paymentsByRptId,
      navigateToMessageDetail,
      updateMessagesArchivedState
    } = this.props;
    return (
      <View style={IOStyles.flex}>
        <AnimatedTabs
          tabContainerStyle={[styles.tabBarContainer, styles.tabBarUnderline]}
          tabBarUnderlineStyle={styles.tabBarUnderlineActive}
          onScroll={this.handleOnTabsScroll}
          onChangeTab={this.handleOnChangeTab}
          initialPage={0}
        >
          <Tab
            activeTextStyle={styles.activeTextStyle}
            textStyle={styles.textStyle}
            heading={I18n.t("messages.tab.inbox")}
          >
            <MessagesInbox
              currentTab={this.state.currentTab}
              messagesState={lexicallyOrderedMessagesState}
              servicesById={servicesById}
              paymentsByRptId={paymentsByRptId}
              onRefresh={this.onRefreshMessages}
              setMessagesArchivedState={updateMessagesArchivedState}
              navigateToMessageDetail={navigateToMessageDetail}
              animated={{
                onScroll: Animated.event([
                  {
                    nativeEvent: {
                      contentOffset: { y: this.animatedTabScrollPositions[0] }
                    }
                  }
                ]),
                scrollEventThrottle: 8
              }}
            />
          </Tab>
          <Tab
            activeTextStyle={styles.activeTextStyle}
            textStyle={styles.textStyle}
            heading={I18n.t("messages.tab.deadlines")}
          >
            <MessagesDeadlines
              currentTab={this.state.currentTab}
              messagesState={lexicallyOrderedMessagesState}
              servicesById={servicesById}
              paymentsByRptId={paymentsByRptId}
              setMessagesArchivedState={updateMessagesArchivedState}
              navigateToMessageDetail={navigateToMessageDetail}
            />
          </Tab>

          <Tab
            activeTextStyle={styles.activeTextStyle}
            textStyle={styles.textStyle}
            heading={I18n.t("messages.tab.archive")}
          >
            <MessagesArchive
              currentTab={this.state.currentTab}
              messagesState={lexicallyOrderedMessagesState}
              servicesById={servicesById}
              paymentsByRptId={paymentsByRptId}
              onRefresh={this.onRefreshMessages}
              setMessagesArchivedState={updateMessagesArchivedState}
              navigateToMessageDetail={navigateToMessageDetail}
              animated={{
                onScroll: Animated.event([
                  {
                    nativeEvent: {
                      contentOffset: { y: this.animatedTabScrollPositions[2] }
                    }
                  }
                ]),
                scrollEventThrottle: 8
              }}
            />
          </Tab>
        </AnimatedTabs>
      </View>
    );
  };

  /**
   * Render MessageSearch component.
   */
  private renderSearch = () => {
    const {
      lexicallyOrderedMessagesState,
      servicesById,
      paymentsByRptId,
      navigateToMessageDetail
    } = this.props;

    return pipe(
      this.props.searchText,
      O.map(_ =>
        _.length < MIN_CHARACTER_SEARCH_TEXT ? (
          <SearchNoResultMessage errorType="InvalidSearchBarText" />
        ) : (
          <MessagesSearch
            messagesState={lexicallyOrderedMessagesState}
            servicesById={servicesById}
            paymentsByRptId={paymentsByRptId}
            onRefresh={this.onRefreshMessages}
            navigateToMessageDetail={navigateToMessageDetail}
            searchText={_}
          />
        )
      ),
      O.getOrElse(() => (
        <SearchNoResultMessage errorType="InvalidSearchBarText" />
      ))
    );
  };
}

const mapStateToProps = (state: GlobalState) => ({
  lexicallyOrderedMessagesState: lexicallyOrderedMessagesStateSelector(state),
  servicesById: servicesByIdSelector(state),
  paymentsByRptId: paymentsByRptIdSelector(state),
  searchText: searchTextSelector(state),
  messageSectionStatusActive: sectionStatusSelector("messages")(state),
  isSearchEnabled: isSearchMessagesEnabledSelector(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  refreshMessages: (
    lexicallyOrderedMessagesState: ReturnType<
      typeof lexicallyOrderedMessagesStateSelector
    >,
    servicesById: ServicesByIdState
  ) => {
    dispatch(loadMessages.request());
    // Refresh services related to messages received by the user
    if (pot.isSome(lexicallyOrderedMessagesState)) {
      lexicallyOrderedMessagesState.value.forEach(item => {
        if (servicesById[item.meta.sender_service_id] === undefined) {
          dispatch(loadServiceDetail.request(item.meta.sender_service_id));
        }
      });
    }
  },
  refreshService: (serviceId: string) => {
    dispatch(loadServiceDetail.request(serviceId));
  },
  navigateToMessageDetail: (messageId: string) =>
    navigateToMessageRouterScreen({ messageId }),
  updateMessagesArchivedState: (
    ids: ReadonlyArray<string>,
    archived: boolean
  ) => dispatch(DEPRECATED_setMessagesArchivedState(ids, archived))
});

export default connect(mapStateToProps, mapDispatchToProps)(MessagesHomeScreen);
