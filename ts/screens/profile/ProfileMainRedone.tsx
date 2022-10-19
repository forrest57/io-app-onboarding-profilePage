import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { List, ListItem, Text, View } from "native-base";
import * as React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { SvgProps } from "react-native-svg";
import { connect } from "react-redux";
import EmailIcon from "../../../img/assistance/email.svg";
import FiscalCode from "../../../img/assistance/fiscalCode.svg";
import NameSurname from "../../../img/assistance/nameSurname.svg";
import { ContextualHelpPropsMarkdown } from "../../components/screens/BaseScreenComponent";
import ScreenContent from "../../components/screens/ScreenContent";
import TopScreenComponent from "../../components/screens/TopScreenComponent";
import { LightModalContextInterface } from "../../components/ui/LightModal";
import TypedI18n from "../../i18n";
import { IOStackNavigationRouteProps } from "../../navigation/params/AppParamsList";
import { MainTabParamsList } from "../../navigation/params/MainTabParamsList";
import {
  hasProfileEmailSelector,
  isProfileEmailValidatedSelector,
  newFiscalCodeSelector,
  profileEmailSelector,
  profileFiscalCodeSelector,
  profileNameSurnameSelector
} from "../../store/reducers/profile";
import { GlobalState } from "../../store/reducers/types";

const styles = StyleSheet.create({
  flexRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  flexCol: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "center",
    marginLeft: 10
  },
  paddedList: {
    paddingHorizontal: 20
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 17
  }
  //   itemLeft: {
  //     flexDirection: "column",
  //     alignItems: "flex-start"
  //   },
  //   itemLeftText: {
  //     alignSelf: "flex-start"
  //   },
  //   developerSectionItem: {
  //     width: "100%",
  //     flexDirection: "row",
  //     alignItems: "center",
  //     justifyContent: "space-between"
  //   },
  //   developerSectionItemLeft: {
  //     flex: 1
  //   },
  //   developerSectionItemRight: {
  //     flex: 0
  //   },
  //   modalHeader: {
  //     lineHeight: 40
  //   },
  //   whiteBg: {
  //     backgroundColor: IOColors.white
  //   },

  //   noRightPadding: {
  //     paddingRight: 0
  //   }
});

const mapStateToProps = (state: GlobalState) => ({
  profileEmail: profileEmailSelector(state),
  isEmailValidated: isProfileEmailValidatedSelector(state),
  hasProfileEmail: hasProfileEmailSelector(state),
  nameSurname: profileNameSurnameSelector(state),
  fiscalCode: newFiscalCodeSelector(state)
});

type Props = IOStackNavigationRouteProps<MainTabParamsList, "PROFILE_MAIN"> &
  LightModalContextInterface &
  ReturnType<typeof mapStateToProps>;

const contextualHelpMarkdown: ContextualHelpPropsMarkdown = {
  title: "profile.main.contextualHelpTitle",
  body: "profile.main.contextualHelpContent"
};

type Name = { datatype: "NAME"; value: `${string} ${string}` | undefined };
type Email = {
  datatype: "EMAIL";
  value: `${string}@${string}.${string}` | string; // some way to force i18n errorstr?
};
type FiscCode = { datatype: "FISC_CODE"; value: string };
type ValueType = Name | Email | FiscCode;

type ListItemProps = {
  Icon: React.FunctionComponent<SvgProps>;
  title: string;
  isLast?: boolean;
} & ValueType;

const CustomListItem: React.FunctionComponent<ListItemProps> = ({
  isLast = false,

  ...props
}) => (
  <ListItem last={isLast} style={{ paddingLeft: 0 }}>
    <View style={styles.flexRow}>
      {props.Icon({ width: 27, height: 27 })}

      <View style={styles.flexCol}>
        <Text style={styles.titleText}>{props.title}</Text>
        <Text>{props.value}</Text>
      </View>
    </View>
  </ListItem>
);

const ProfileMainRedone: React.FC<Props> = ({
  profileEmail,
  nameSurname,
  fiscalCode
}) => {
  const getElse = (func: O.Option<string>): string =>
    pipe(
      func,
      O.getOrElse(() => "loading error")
    );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopScreenComponent
        goBack
        contextualHelpMarkdown={contextualHelpMarkdown}
      >
        <ScreenContent
          title={TypedI18n.t("profile.data.title")}
          subtitle={TypedI18n.t("profile.data.subtitle")}
        >
          <List style={styles.paddedList}>
            <CustomListItem
              datatype="NAME"
              value={nameSurname} // is now giving problems because of a string literal type casting; will fix when making saga
              Icon={NameSurname}
              title={TypedI18n.t("profile.data.list.nameSurname")}
            />

            <CustomListItem
              datatype="FISC_CODE"
              value={getElse(fiscalCode)}
              Icon={FiscalCode}
              title={TypedI18n.t("profile.fiscalCode.fiscalCode")}
            />
            <CustomListItem
              datatype="EMAIL"
              value={
                getElse(profileEmail)
                // pipe(
                // profileEmail,
                // O.getOrElse(() =>
                //   TypedI18n.t("global.remoteStates.notAvailable")
                // )
                //   )
              }
              isLast={true}
              Icon={EmailIcon}
              title={TypedI18n.t("profile.data.list.email")}
            />
          </List>
        </ScreenContent>
      </TopScreenComponent>
    </SafeAreaView>
  );
};

export default connect(mapStateToProps)(ProfileMainRedone);
