/**
 * This file imports all the variables defined inside the native-base material
 * theme than overwrites or add more variables. The combined variables are
 * exported to be used in our components theme files (check `./components`
 * directory).
 */

/* eslint-disable no-invalid-this */

import { Millisecond } from "@pagopa/ts-commons/lib/units";
import materialVariables from "native-base/src/theme/variables/material";
import { Platform } from "react-native";
import { IOColors } from "../components/core/variables/IOColors";
import { FontWeight, makeFontStyleObject } from "./fonts";
import { ThemeSimpleValue } from "./types";

export const VIBRATION_LONG_PRESS_DURATION = 50 as Millisecond;

export const VIBRATION_BARCODE_SCANNED_DURATION = 50 as Millisecond;

// eslint-disable-next-line
const customVariables = Object.assign(materialVariables, {
  minTouchableAreaSize: 48,

  // Android
  buttonUppercaseAndroidText: false /* NB Theme variable, don't remove */,

  // Button
  btnTextFontWeight: "700" as FontWeight,
  textLightButtonWeight: "600" as FontWeight,

  btnHeight: 40,
  btnWidgetHeight: 24,
  btnFontSize: 16,
  btnIconSize: 24,

  btnXSmallHeight: 32,
  btnXSmallLineHeight: 18,
  btnXSmallFontSize: 14,
  btnXSmallIconSize: 18,

  btnSmallHeight: 39,
  btnSmallLineHeight: 20,
  btnSmallFontSize: 14,
  btnSmallIconSize: 20,

  get btnLightTextColor(): ThemeSimpleValue {
    return this.textColor;
  },

  /* ALIAS TOKENS */
  /* Don't put hardcoded color values here.
    Add them to IOColors object, instead.
  */
  brandPrimary: "#0066CC",
  brandPrimaryLight: "#99CCFF",
  brandHighlight: "#00C5CA",
  brandHighLighter: "#00CDD2",
  brandSuccess: "#007005",
  brandDanger: "#CC3333",

  btnLightBorderColor: IOColors.grey,

  cardShadow: IOColors.black,
  cardExpiredTextColor: "#FF0000",
  cardTextColor: IOColors.bluegreyDark,

  calendarExpirableColor: "#D0021B",

  itemSeparator: IOColors.bluegreyLight,

  toastColor: "#C1f4f2",
  badgeYellow: "#ffc824",

  /* When the background is dark */
  headerIconDark: IOColors.milderGray,
  /* When the background is light */
  headerIconLight: IOColors.greyLight,

  // Font
  ...makeFontStyleObject(Platform.select),
  fontSizeBase: 16,
  get fontSizeSmaller(): number {
    return this.fontSizeBase * 0.75;
  },
  get fontSizeXSmall(): number {
    return this.fontSizeBase * 0.8125;
  },
  get fontSizeSmall(): number {
    return this.fontSizeBase * 0.875;
  },
  get fontSize1(): number {
    return this.fontSizeBase;
  },
  get fontSize2(): number {
    return this.fontSizeBase * 1.25;
  },
  get fontSize3(): number {
    return this.fontSizeBase * 1.5;
  },
  get fontSize4(): number {
    return this.fontSizeBase * 1.75;
  },
  get fontSize5(): number {
    return this.fontSizeBase * 2;
  },
  get fontSize6(): number {
    return this.fontSizeBase * 2.5;
  },
  lineHeightBase: 24,
  lineHeightSmall: 18,
  lineHeightXSmall: 17,
  get lineHeightFontSizeRatio(): number {
    return this.lineHeightBase / this.fontSizeBase;
  },
  get lineHeight1(): number {
    return this.lineHeightBase * this.lineHeightFontSizeRatio;
  },
  // LineHeigth = 26 for the icon font in message details component
  get lineHeight2(): number {
    return this.lineHeightBase * (26 / 24);
  },
  get lineHeightH1(): number {
    return this.lineHeightBase * (48 / 24);
  },
  get lineHeightH2(): number {
    return this.lineHeightBase * (40 / 24);
  },
  get lineHeightH3(): number {
    return this.lineHeightBase * (32 / 24);
  },
  get lineHeightH4(): number {
    return this.lineHeightBase * (28 / 24);
  },

  // Icon
  iconFamily: "Entypo",
  iconSizeBase: 24,

  get iconSize1(): number {
    return this.iconSizeBase * (2 / 3);
  },
  get iconSize2(): number {
    return this.iconSizeBase * (5 / 6);
  },
  get iconSize3(): number {
    return this.iconSizeBase * 1;
  },
  get iconSize4(): number {
    return this.iconSizeBase * (7 / 6);
  },
  get iconSize5(): number {
    return this.iconSizeBase * 1.5;
  },
  get iconSize6(): number {
    return this.iconSizeBase * 2;
  },
  // Content
  contentPadding: 24,
  contentPaddingLarge: 48,
  contentBackground: "#FFFFFF",
  contentPrimaryBackground: "#0073E6",

  // Footer
  footerBackground: IOColors.white,
  footerElevation: 20,
  footerPaddingTop: 16,
  footerPaddingLeft: 24,
  footerPaddingBottom: 16,
  footerPaddingRight: 24,
  footerShadowColor: IOColors.black,
  footerShadowOffsetWidth: 0,
  footerShadowOffsetHeight: 50,
  footerShadowOpacity: 0.5,
  footerShadowRadius: 37,
  footerBottomBorderWidth: 1,

  // Grid
  gridGutter: 10,

  // H1
  h1Color: "#17324D",
  h1FontWeight: "700" as FontWeight,
  h1LetterSpacing: -1,
  get h1FontSize(): number {
    return this.fontSize6;
  },
  get h1LineHeight(): number {
    return this.lineHeightH1;
  },

  // H2
  h2Color: "#17324D",
  h2FontWeight: "700" as FontWeight,
  get h2FontSize(): number {
    return this.fontSize5;
  },
  get h2LineHeight(): number {
    return this.lineHeightH2;
  },

  // H3
  h3Color: "#17324D",
  h3FontWeight: "700" as FontWeight,
  get h3FontSize(): number {
    return this.fontSize4;
  },
  get h3LineHeight(): number {
    return this.lineHeightH3;
  },

  // H4
  h4Color: "#17324D",
  h4FontWeight: "600" as FontWeight,
  get h4FontSize(): number {
    return this.fontSize3;
  },
  get h4LineHeight(): number {
    return this.lineHeightH4;
  },

  // H5
  h5Color: "#17324D",
  h5FontWeight: "600" as FontWeight,
  get h5FontSize(): number {
    return this.fontSize2;
  },
  get h5LineHeight(): number {
    return this.lineHeightBase;
  },

  // H6
  h6Color: "#17324D",
  h6FontWeight: "600" as FontWeight,
  get h6FontSize(): number {
    return this.fontSize1;
  },
  get h6LineHeight(): number {
    return this.lineHeightBase;
  },

  // Header
  appHeaderHeight: 56,
  appHeaderPaddingHorizontal: 12,
  titleHeaderPaddingHorizontal: 24,
  headerBorderBottomWidth: 0,
  headerBodyFontSize: 14,
  headerFontColor: "#000000",
  headerBodyFontWeight: "600" as FontWeight,
  toolbarDefaultBg: "#FFFFFF",
  get toolbarTextColor(): ThemeSimpleValue {
    return this.textColor;
  },
  get toolbarBtnColor(): ThemeSimpleValue {
    return this.textColor;
  },
  androidStatusBarColor: "#FFFFFF",

  // Modal
  modalMargin: 0,
  modalPadding: 24,
  modalHeaderHeight: 75,

  // Text
  textColor: IOColors.bluegrey,
  textColorDark: IOColors.bluegreyDark,
  textLinkColor: "#0073E6",
  textMessageDetailLinkColor: "#0073E6",
  textNormalWeight: "400" as FontWeight,
  textBoldWeight: "700" as FontWeight,
  textLinkWeight: "600" as FontWeight,

  // Skeleton/Placeholder
  colorSkeleton: IOColors.bluegreyLight,

  // Label
  labelNormalWeight: "400" as FontWeight,

  // Input
  inputNormalWeight: "400" as FontWeight,

  // Spacer
  spacerExtrasmallHeight: 4,
  spacerSmallHeight: 8,
  spacerHeight: 16,
  spacerLargeHeight: 24,
  spacerExtralargeHeight: 40,

  // Vertical spacer
  spacerWidth: 16,
  spacerLargeWidth: 24,
  spacerExtralargeWidth: 40,

  borderRadiusBase: 4,

  // Tabs
  tabDefaultBg: "#FFFFFF",
  tabUnderlineColor: IOColors.greyUltraLight,
  tabUnderlineHeight: 2,
  topTabBarTextColor: IOColors.bluegrey,
  topTabBarActiveTextColor: "#0066CC",

  // Animations
  activeOpacity: 0.25,

  // Spacing
  spacingBase: 8,

  // IconFont
  selectedColor: "#0073E6",
  unselectedColor: IOColors.bluegrey,

  // Checkbox
  checkboxDefaultColor: "transparent"
});

export default customVariables;
