import { View } from "native-base";
import * as React from "react";
import I18n from "../../../../../../../../i18n";
import Markdown from "../../../../../../../../components/ui/Markdown";
import { useIOBottomSheetModal } from "../../../../../../../../utils/hooks/bottomSheet";

/**
 * Display information about the current period
 * @constructor
 */
const RankingNotReady = (): React.ReactElement => (
  <View>
    <View spacer={true} />
    <View style={{ flex: 1 }}>
      <Markdown>
        {I18n.t("bonus.bpd.details.components.ranking.notReady.body")}
      </Markdown>
    </View>
  </View>
);

export const useRankingNotReadyBottomSheet = () =>
  useIOBottomSheetModal(
    <RankingNotReady />,
    I18n.t("bonus.bpd.details.components.ranking.notReady.title"),
    450
  );
