import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { Text, View } from "native-base";
import * as React from "react";
import { Image, StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";
import CopyButtonComponent from "../../../../components/CopyButtonComponent";
import I18n from "../../../../i18n";
import customVariables from "../../../../theme/variables";

type Props = {
  qrCode: string;
  logo?: string;
  codeToCopy: string;
  codeToDisplay: string;
};

const styles = StyleSheet.create({
  modalBox: {
    height: "100%",
    alignSelf: "center",
    width: "100%",
    paddingTop: 16
  },
  image: {
    height: 249,
    width: 249,
    alignSelf: "center"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  codeText: {
    alignSelf: "center",
    fontSize: customVariables.fontSize2,
    lineHeight: 27,
    color: customVariables.selectedColor
  },
  uniqueCode: {
    color: customVariables.textColor
  },
  bonusLogo: {
    height: 48,
    width: 48
  },
  icon: {
    paddingRight: 0
  }
});

const renderQRCode = (base64: string) =>
  pipe(
    base64,
    O.fromNullable,
    O.fold(
      () => null,
      s => <SvgXml xml={s} height={249} width={249} />
    )
  );

const QrModalBox: React.FunctionComponent<Props> = (props: Props) => {
  const { qrCode, codeToDisplay, codeToCopy } = props;

  return (
    <View style={styles.modalBox}>
      <View style={styles.row}>
        <View>
          <Text style={styles.uniqueCode}>
            {I18n.t("bonus.bonusVacanze.uniqueCode")}
          </Text>
          <View style={styles.row}>
            <Text style={styles.codeText} bold={true}>
              {codeToDisplay}
            </Text>
            <View hspacer={true} />
            <CopyButtonComponent
              textToCopy={codeToCopy}
              onPressWithGestureHandler={true}
            />
          </View>
        </View>
        {props.logo && (
          <Image
            source={{ uri: props.logo }}
            resizeMode={"contain"}
            style={styles.bonusLogo}
          />
        )}
      </View>
      <View spacer={true} extralarge={true} />
      <View style={styles.image}>{renderQRCode(qrCode)}</View>
    </View>
  );
};

export default QrModalBox;
