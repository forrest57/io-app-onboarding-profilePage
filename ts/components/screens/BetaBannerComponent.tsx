import { Text, View } from "native-base";
import * as React from "react";
import { StyleSheet } from "react-native";
import I18n from "../../i18n";
import customVariables from "../../theme/variables";
import IconFont from "../ui/IconFont";
import { IOColors } from "../core/variables/IOColors";

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  flex: { flex: 1 },
  bordered: {
    borderTopColor: customVariables.contentPrimaryBackground,
    borderTopWidth: 2,
    paddingHorizontal: customVariables.contentPadding
  },
  separator: {
    width: 1,
    height: "100%",
    marginHorizontal: 16,
    borderRightColor: customVariables.contentPrimaryBackground,
    borderRightWidth: 1
  },
  badgeContainer: {
    backgroundColor: customVariables.brandHighLighter,
    marginLeft: 4,
    paddingLeft: 0,
    paddingRight: 0,
    height: 8,
    marginTop: 3
  },
  badgeText: {
    color: IOColors.bluegrey,
    fontSize: 6,
    paddingLeft: 3,
    paddingRight: 3,
    lineHeight: 8,
    paddingTop: 0.5
  }
});

export default function BetaBannerComponent() {
  return (
    <View footer={true} style={styles.bordered}>
      <View style={styles.row}>
        <IconFont
          name={"io-logo"}
          size={24}
          color={customVariables.contentPrimaryBackground}
        />
        <View style={styles.separator} />
        <View style={styles.flex}>
          <Text primary={true}>{I18n.t("betaBanner.description")}</Text>
        </View>
      </View>
      <View spacer={true} />
    </View>
  );
}
