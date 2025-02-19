import { Col, Grid, Row, View } from "native-base";
import * as React from "react";

import { StyleSheet } from "react-native";
import IconFont from "../ui/IconFont";

import variables from "../../theme/variables";
import { IOColors } from "../core/variables/IOColors";

type MarkerState = "SCANNING" | "VALID" | "INVALID";

type Props = {
  screenWidth: number;
  state: MarkerState;
};

/**
 * Renders a square camera marker.
 *
 * This is overlayed on the camera preview of the QR code scanner.
 */
export const CameraMarker: React.SFC<Props> = ({ screenWidth, state }) => {
  const iconName =
    state === "INVALID"
      ? "io-close"
      : state === "VALID"
      ? "io-tick-big"
      : undefined;

  const sideLength = screenWidth / 2;

  const borderLength = screenWidth / 6;

  const styles = StyleSheet.create({
    rectangleContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent"
    },

    rectangle: {
      height: sideLength,
      width: sideLength,
      borderWidth: 0,
      backgroundColor: "transparent"
    },

    smallBorded: {
      height: borderLength,
      width: borderLength,
      borderColor: IOColors.white,
      backgroundColor: "transparent",
      position: "absolute"
    },

    topRightCorner: {
      borderTopWidth: 2,
      borderRightWidth: 2,
      top: 0,
      right: 0
    },

    topLeftCorner: {
      borderTopWidth: 2,
      borderLeftWidth: 2,
      top: 0,
      left: 0
    },

    bottomLeftCorner: {
      borderBottomWidth: 2,
      borderLeftWidth: 2,
      bottom: 0,
      left: 0
    },

    bottomRightCorner: {
      borderBottomWidth: 2,
      borderRightWidth: 2,
      bottom: 0,
      right: 0
    },

    iconContainer: {
      position: "absolute",
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center"
    },

    icon: {
      fontSize: sideLength,
      lineHeight: sideLength,
      opacity: 0.7
    },

    iconValid: {
      color: variables.brandSuccess
    },

    iconInvalid: {
      color: variables.brandDanger
    }
  });
  return (
    <View style={styles.rectangleContainer}>
      <View style={styles.rectangle}>
        {iconName && (
          <View style={styles.iconContainer}>
            <IconFont
              name={iconName}
              style={[
                styles.icon,
                state === "VALID" ? styles.iconValid : styles.iconInvalid
              ]}
            />
          </View>
        )}
        <Grid>
          <Row>
            <Col>
              <View style={[styles.topLeftCorner, styles.smallBorded]} />
            </Col>
            <Col>
              <View style={[styles.topRightCorner, styles.smallBorded]} />
            </Col>
          </Row>
          <Row>
            <Col>
              <View style={[styles.bottomLeftCorner, styles.smallBorded]} />
            </Col>
            <Col>
              <View style={[styles.bottomRightCorner, styles.smallBorded]} />
            </Col>
          </Row>
        </Grid>
      </View>
    </View>
  );
};
