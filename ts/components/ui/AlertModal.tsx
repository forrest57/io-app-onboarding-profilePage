import { Text } from "native-base";
import React from "react";
import {
  BackHandler,
  NativeEventSubscription,
  StyleSheet,
  View
} from "react-native";
import variables from "../../theme/variables";
import { Overlay } from "./Overlay";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "auto",
    width: "auto",
    backgroundColor: "#fff",
    padding: variables.contentPadding,
    marginLeft: variables.contentPadding,
    marginRight: variables.contentPadding,
    borderRadius: 8
  },
  message: {
    color: "#000"
  }
});

type Props = Readonly<{
  message: string;
}>;

/**
 * A custom alert to show a message
 */
export class AlertModal extends React.PureComponent<Props> {
  private subscription: NativeEventSubscription | undefined;
  constructor(props: Props) {
    super(props);
  }

  public componentDidMount() {
    // eslint-disable-next-line functional/immutable-data
    this.subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      this.onBackPressed
    );
  }

  public componentWillUnmount() {
    this.subscription?.remove();
  }

  private onBackPressed() {
    return true;
  }

  public render() {
    return (
      <Overlay
        backgroundColor={"rgba(0,0,0,0.6)"}
        foreground={
          <View style={styles.container}>
            <Text style={styles.message}>{this.props.message}</Text>
          </View>
        }
      />
    );
  }
}
