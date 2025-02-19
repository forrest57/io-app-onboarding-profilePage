import * as O from "fp-ts/lib/Option";
import { Text, View } from "native-base";
import * as React from "react";
import { StyleSheet } from "react-native";
import { BonusActivationWithQrCode } from "../../../../../definitions/bonus_vacanze/BonusActivationWithQrCode";
import TouchableDefaultOpacity from "../../../../components/TouchableDefaultOpacity";
import IconFont from "../../../../components/ui/IconFont";
import I18n from "../../../../i18n";
import customVariables from "../../../../theme/variables";
import { formatNumberAmount } from "../../../../utils/stringBuilder";
import { validityInterval } from "../utils/bonus";
import { IOColors } from "../../../../components/core/variables/IOColors";

type Props = {
  bonus: BonusActivationWithQrCode;
  validFrom?: Date;
  validTo?: Date;
  onPress: (
    bonus: BonusActivationWithQrCode,
    validFrom?: Date,
    validTo?: Date
  ) => void;
};

const ICON_WIDTH = 24;

const styles = StyleSheet.create({
  smallSpacer: {
    width: "100%",
    height: 4
  },
  spaced: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  text3: {
    fontSize: 18,
    color: IOColors.white
  },
  text12: {
    lineHeight: 18,
    marginBottom: -4,
    justifyContent: "flex-end",
    color: IOColors.white
  },
  icon: {
    width: 64,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  text3Line: {
    flex: 1,
    flexDirection: "row"
  },
  text3Container: {
    flex: 1,
    flexDirection: "row",
    minHeight: 24
  },
  textWhite: {
    color: IOColors.white
  },
  containerColor: {
    padding: customVariables.appHeaderPaddingHorizontal,
    backgroundColor: "#2C489D",
    color: IOColors.white
  }
});

/**
 * Component to display the current active bonus if it is present
 * in the store
 */
const ActiveBonus: React.FunctionComponent<Props> = (props: Props) => {
  const bonusValidityInterval = validityInterval(
    props.validFrom,
    props.validTo
  );

  return (
    <TouchableDefaultOpacity
      style={styles.containerColor}
      onPress={() => props.onPress(props.bonus, props.validFrom, props.validTo)}
    >
      <View style={styles.spaced}>
        {O.isSome(bonusValidityInterval) && (
          <Text>{`${I18n.t("bonus.bonusVacanze.validity")} ${
            bonusValidityInterval.value.e1
          } - ${bonusValidityInterval.value.e2}`}</Text>
        )}
        <Text bold={true} style={styles.text12}>
          {formatNumberAmount(props.bonus.dsu_request.max_amount, true)}
        </Text>
      </View>
      <View small={true} />
      <View style={styles.spaced}>
        <Text style={styles.textWhite}>
          {I18n.t("bonus.bonusVacanze.taxBenefit")}
        </Text>
        <Text bold={true} style={styles.text12}>
          {formatNumberAmount(props.bonus.dsu_request.max_tax_benefit, true)}
        </Text>
      </View>
      <View style={styles.smallSpacer} />
      <View style={styles.text3Line}>
        <View style={styles.text3Container}>
          <Text numberOfLines={2} style={styles.text3}>
            {/* TODO replace this hardcoded string */}
            {"Bonus Vacanze"}
          </Text>
        </View>
        <View style={styles.icon}>
          <IconFont name="io-right" size={ICON_WIDTH} color={IOColors.white} />
        </View>
      </View>
    </TouchableDefaultOpacity>
  );
};

export default ActiveBonus;
