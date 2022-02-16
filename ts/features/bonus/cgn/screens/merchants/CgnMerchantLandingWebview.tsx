import * as React from "react";
import { SafeAreaView } from "react-native";
import { NavigationInjectedProps } from "react-navigation";
import { IOStyles } from "../../../../../components/core/variables/IOStyles";
import WebviewComponent from "../../../../../components/WebviewComponent";
import { useNavigationContext } from "../../../../../utils/hooks/useOnFocus";
import BaseScreenComponent from "../../../../../components/screens/BaseScreenComponent";

type NavigationParams = Readonly<{
  landingPageUrl: string;
  landingPageReferrer: string;
}>;

type Props = NavigationInjectedProps<NavigationParams>;

const CgnMerchantLandingWebview: React.FunctionComponent<Props> = (
  props: Props
) => {
  const navigation = useNavigationContext();
  const landingPageUrl = props.navigation.getParam("landingPageUrl");
  const landingPageReferrer = props.navigation.getParam("landingPageReferrer");

  return (
    <BaseScreenComponent
      customRightIcon={{
        iconName: "io-close",
        onPress: () => navigation.goBack()
      }}
    >
      <SafeAreaView style={IOStyles.flex}>
        <WebviewComponent
          source={{
            uri: landingPageUrl as string,
            headers: {
              referer: landingPageReferrer
            }
          }}
        />
      </SafeAreaView>
    </BaseScreenComponent>
  );
};

export default CgnMerchantLandingWebview;
