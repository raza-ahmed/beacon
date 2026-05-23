"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import {
  BeaconIcon,
  SearchIcon,
  SearchFilledIcon,
  PaletteIcon,
  PaletteFilledIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  SunIcon,
  SunFilledIcon,
  MoonIcon,
  MoonFilledIcon,
  ListIcon,
  ListCheckIcon,
  MenuIcon,
  CloseIcon,
  CopyIcon,
  CheckIcon,
  LoaderIcon,
  GrowthIcon,
  DownloadIcon,
  LinkIcon,
  DownArrowIcon,
  LeftArrowIcon,
  RightArrowIcon,
  UpArrowIcon,
  DiagonalArrowIcon,
  MinusDashIcon,
  ShoppingBagIcon,
  ShoppingBagFilledIcon,
  SettingsGearIcon,
  SettingsGearFilledIcon,
  HomeIcon,
  HomeFilledIcon,
  BriefcaseIcon,
  BriefcaseFilledIcon,
  GraduateHatIcon,
  GraduateHatFilledIcon,
  LocationPinIcon,
  LocationPinFilledIcon,
  BellIcon,
  BellFilledIcon,
  CameraIcon,
  CameraFilledIcon,
  CalendarIcon,
  CalendarFilledIcon,
  EmailEnvelopeIcon,
  EmailEnvelopeFilledIcon,
  ClipboardIcon,
  ClipboardFilledIcon,
  UserPersonIcon,
  UserPersonFilledIcon,
  UserCircleIcon,
  UserCircleFilledIcon,
  SpannerSettingsIcon,
  SpannerSettingsFilledIcon,
  DeleteBinIcon,
  DeleteBinFilledIcon,
  TimerAlarmIcon,
  TimerAlarmFilledIcon,
  ErrorSearchIcon,
  ErrorSearchFilledIcon,
  ListDetailsIcon,
  ListDetailsFilledIcon,
  MessageDotsIcon,
  MessageDotsFilledIcon,
  LockIcon,
  LockFilledIcon,
  PencilIcon,
  PencilFilledIcon,
  AlertTriangleErrorIcon,
  AlertTriangleErrorFilledIcon,
  CircleErrorIcon,
  CircleErrorFilledIcon,
  PageFileIcon,
  PageFileFilledIcon,
  AIVibeCodeIcon,
  AIVibeCodeFilledIcon,
  StackResourceIcon,
  StackResourceFilledIcon,
  GridUILayoutIcon,
  GridUILayoutFilledIcon,
  PhoneCallIcon,
  PhoneCallFilledIcon,
  DeviceMobilePhoneIcon,
  DeviceMobilePhoneFilledIcon,
  DotCirclePointIcon,
  DotCirclePointFilledIcon,
  QuoteUpIcon,
  QuoteDowncon,
  QuoteUpFilledIcon,
  QuoteDownFilledIcon,
  RedoArrowForwardUpIcon,
  UploadFileSendShareIcon,
  UploadDocumentIcon,
  ArrowDownFallTurnRightIcon,
  ArrowsExpandMoveHorizontalIcon,
  ArrowsMaximizeExpandIcon,
  ArrowsMinimizeCollapseIcon,
  ArrowsMoveVerticalExpandIcon,
  BluetoothIcon,
  DeviceDesktopIcon,
  DeviceDesktopFilledIcon,
  DotsMenuOverflowIcon,
  FolderOpenFileIcon,
  FolderOpenFileFilledIcon,
  FolderIcon,
  FolderFilledIcon,
  HeartIcon,
  HeartFilledIcon,
  HourglassEmptyTimeWaitIcon,
  HourglassEmptyTimeWaitFilledIcon,
  HourglassHighTimeWaitIcon,
  HourglassHighTimeWaitFilledIcon,
  LayoutDashboardGridIcon,
  LayoutDashboardGridFilledIcon,
  LayoutGridIcon,
  LayoutGridFilledIcon,
  LayoutCardsAlignIcon,
  LayoutCardsAlignFilledIcon,
  LayoutGridAddIcon,
  LayoutGridAddFilledIcon,
  LockPasswordSecurityIcon,
  LockPasswordSecurityFilledIcon,
  LockSecureIcon,
  LockSecureFilledIcon,
  LockUnlockIcon,
  LockUnlockFilledIcon,
  PointerCursorIcon,
  PointerCursorFilledIcon,
  ShoppingCartIcon,
  ShoppingCartFilledIcon,
  SmartHomeIcon,
  SmartHomeFilledIcon,
  UndoArrowForwardUpIcon,
  VolumeMuteIcon,
  VolumeMuteFilledIcon,
  VolumeSpeakLowIcon,
  VolumeSpeakLowFilledIcon,
  VolumeSpeakIcon,
  VolumeSpeakFilledIcon,
  ArrowDownLeftIcon,
  ArrowDotChevronReplaceIcon,
  DownloadInDownAddArrowDashedDownIcon,
  PlayMusicIcon,
  PlayMusicFilledIcon,
  HistoryClockIcon,
  PlusAddIcon,
  WorldGlobeIcon,
  AddPlusCircleSlotIcon,
  DownloadDownDashedIcon,
  EyeViewShowIcon,
  EyeViewShowFilledIcon,
  LocationDirectionMarkIcon,
  LocationDirectionMarkFilledIcon,
  AnchorIcon,
  ArrowLeftFromArcExitIcon,
  BackwardPreviousPlayerPreviousIcon,
  BackwardPreviousPlayerPreviousFilledIcon,
  Battery0Icon,
  Battery1Icon,
  Battery2Icon,
  Battery3Icon,
  BatteryFulllIcon,
  CodeScriptIcon,
  CodeAsteriskScriptIcon,
  DropletWaterIcon,
  DropletWaterFilledIcon,
  EqualDashMathIcon,
  FallDownTrendingDownCrashIcon,
  FilterVerticalAlignLinesIcon,
  FocusGpsLocationIcon,
  ForkKnifeToolsKitchenIcon,
  ForkSpoonToolsKitchenIcon,
  ForwardNextPlayerTrackIcon,
  ForwardNextPlayerTrackFilledIcon,
  FunnelFilterSortIcon,
  FunnelFilterSortFilledIcon,
  InfinityLoopIcon,
  LandPlaneArrivalIcon,
  LandPlaneArrivalFilledIcon,
  LandPlaneDepartureIcon,
  LandPlaneDepartureFilledIcon,
  LandPlaneInflightIcon,
  LandPlaneInflightFilledIcon,
  LayoutAlignBottomIcon,
  LayoutAlignBottomFilledIcon,
  LayoutAlignCenterIcon,
  LayoutAlignCenterFilledIcon,
  LayoutAlignLeftIcon,
  LayoutAlignLeftFilledIcon,
  LayoutAlignMiddleIcon,
  LayoutAlignMiddleFilledIcon,
  LayoutAlignRightIcon,
  LayoutAlignRightFilledIcon,
  LayoutAlignTopIcon,
  LayoutAlignTopFilledIcon,
  MagnetLeadAttractIcon,
  MagnetLeadAttractFilledIcon,
  MenuRightIcon,
  MenuStaggeredIcon,
  MinimizeIcon,
  MobiledataUpDownArrowIcon,
  MoneybagPouchIcon,
  MoneybagPouchFilledIcon,
  MugCupCoffeeIcon,
  MugCupCoffeeFilledIcon,
  MusicSongIcon,
  PausePlayerIcon,
  PausePlayerFilledIcon,
  PennantPoleFlagIcon,
  PennantPoleFlagFilledIcon,
  PigBankMoneyIcon,
  PigBankMoneyFilledIcon,
  PlaneAircraftFlyIcon,
  PlaneAircraftFlyFilledIcon,
  PlaneTiltAircraftFlyIcon,
  PlaneTiltAircraftFlyFilledIcon,
  PlanetSaturnIcon,
  PlayerSkipBackIcon,
  PlayerSkipBackFilledIcon,
  PlayerSkipForwardIcon,
  PlayerSkipForwardFilledIcon,
  Plug2PinConnectIcon,
  Plug2PinConnectFilledIcon,
  PowerSwitchIcon,
  QrcodeIcon,
  RefreshReloadIcon,
  RouteAltRightIcon,
  ScissorsCutIcon,
  SelectorUpDownArrowSortIcon,
  SendKiteForwardIcon,
  SendKiteForwardFilledIcon,
  SendTiltedKiteForwardIcon,
  SendTiltedKiteForwardFilledIcon,
  ServerStorgaeIcon,
  ServerStorgaeFilledIcon,
  ShieldProtectSecureIcon,
  ShieldProtectSecureFilledIcon,
  SnowflakeIceIcon,
  SortAscendingGridIcon,
  SortAscendingLineIcon,
  SortDescendingGridIcon,
  SortDescendingLineIcon,
  SpyIncognitoAnonymousIcon,
  SpyIncognitoAnonymousFilledIcon,
  StackForwardLayerIcon,
  StackFrontLayerIcon,
  StairsRideGrowthIcon,
  StarBookmarkFavouriteIcon,
  StarBookmarkFavouriteFilledIcon,
  StopPlayerIcon,
  StopPlayerFilledIcon,
  SwipeCardIcon,
  SwipeCardFilledIcon,
  SwitchShuffleIcon,
  TagBookmarkSaveIcon,
  TagBookmarkSaveFilledIcon,
  TaxMoneyBagDollarIcon,
  TaxMoneyBagDollarFilledIcon,
  TelescopeIcon,
  TelescopeFilledIcon,
  TrophyPrizeWinIcon,
  TrophyPrizeWinFilledIcon,
  UfoAlienSpaceshipIcon,
  UfoAlienSpaceshipFilledIcon,
  UserStarProfileIcon,
  UsersGroupIcon,
  VideoCameraRecordIcon,
  VideoCameraRecordFilledIcon,
  WalletMoneyIcon,
  WalletMoneyFilledIcon,
  WifiIcon,
  YinYangIcon,
  MenuCenterIcon,
  RotateAnticlockwiseIcon,
  RotateClockwiseIcon,
  IconsTemperatureThermomemterIcon,
  DotsVerticalIcon,
  EyeOffIcon,
  ClockTimeIcon,
  ClockTimeFilledIcon,
  CloudIcon,
  CloudFilledIcon,
  HandStopCursorIcon,
  ChartBarLeaderboardIcon,
  ChartBarLeaderboardFilledIcon,
  GraphInvestChartIcon,
  GraphInvestChartFilledIcon,
  CubeBoxIcon,
  EyeglassSpecIcon,
  KayakBoatIcon,
  ToggleSwitchIcon,
  InputCheckboxIcon,
} from "beacon-icons";
import { Input } from "beacon-ui";

interface IconItem {
  name: string;
  component: React.ComponentType<{ size?: number | "xs" | "sm" | "rg" | "rm" | "md" | "lg" | "xl" | "2xl"; className?: string }>;
}

const ALL_ICONS_UNSORTED: IconItem[] = [
  { name: "LocationDirectionMarkIcon", component: LocationDirectionMarkIcon },
  { name: "LocationDirectionMarkFilledIcon", component: LocationDirectionMarkFilledIcon },
  { name: "AnchorIcon", component: AnchorIcon },
  { name: "ArrowLeftFromArcExitIcon", component: ArrowLeftFromArcExitIcon },
  { name: "BackwardPreviousPlayerPreviousIcon", component: BackwardPreviousPlayerPreviousIcon },
  { name: "BackwardPreviousPlayerPreviousFilledIcon", component: BackwardPreviousPlayerPreviousFilledIcon },
  { name: "Battery0Icon", component: Battery0Icon },
  { name: "Battery1Icon", component: Battery1Icon },
  { name: "Battery2Icon", component: Battery2Icon },
  { name: "Battery3Icon", component: Battery3Icon },
  { name: "BatteryFulllIcon", component: BatteryFulllIcon },
  { name: "CodeScriptIcon", component: CodeScriptIcon },
  { name: "CodeAsteriskScriptIcon", component: CodeAsteriskScriptIcon },
  { name: "DropletWaterIcon", component: DropletWaterIcon },
  { name: "DropletWaterFilledIcon", component: DropletWaterFilledIcon },
  { name: "EqualDashMathIcon", component: EqualDashMathIcon },
  { name: "FallDownTrendingDownCrashIcon", component: FallDownTrendingDownCrashIcon },
  { name: "FilterVerticalAlignLinesIcon", component: FilterVerticalAlignLinesIcon },
  { name: "FocusGpsLocationIcon", component: FocusGpsLocationIcon },
  { name: "ForkKnifeToolsKitchenIcon", component: ForkKnifeToolsKitchenIcon },
  { name: "ForkSpoonToolsKitchenIcon", component: ForkSpoonToolsKitchenIcon },
  { name: "ForwardNextPlayerTrackIcon", component: ForwardNextPlayerTrackIcon },
  { name: "ForwardNextPlayerTrackFilledIcon", component: ForwardNextPlayerTrackFilledIcon },
  { name: "FunnelFilterSortIcon", component: FunnelFilterSortIcon },
  { name: "FunnelFilterSortFilledIcon", component: FunnelFilterSortFilledIcon },
  { name: "InfinityLoopIcon", component: InfinityLoopIcon },
  { name: "LandPlaneArrivalIcon", component: LandPlaneArrivalIcon },
  { name: "LandPlaneArrivalFilledIcon", component: LandPlaneArrivalFilledIcon },
  { name: "LandPlaneDepartureIcon", component: LandPlaneDepartureIcon },
  { name: "LandPlaneDepartureFilledIcon", component: LandPlaneDepartureFilledIcon },
  { name: "LandPlaneInflightIcon", component: LandPlaneInflightIcon },
  { name: "LandPlaneInflightFilledIcon", component: LandPlaneInflightFilledIcon },
  { name: "LayoutAlignBottomIcon", component: LayoutAlignBottomIcon },
  { name: "LayoutAlignBottomFilledIcon", component: LayoutAlignBottomFilledIcon },
  { name: "LayoutAlignCenterIcon", component: LayoutAlignCenterIcon },
  { name: "LayoutAlignCenterFilledIcon", component: LayoutAlignCenterFilledIcon },
  { name: "LayoutAlignLeftIcon", component: LayoutAlignLeftIcon },
  { name: "LayoutAlignLeftFilledIcon", component: LayoutAlignLeftFilledIcon },
  { name: "LayoutAlignMiddleIcon", component: LayoutAlignMiddleIcon },
  { name: "LayoutAlignMiddleFilledIcon", component: LayoutAlignMiddleFilledIcon },
  { name: "LayoutAlignRightIcon", component: LayoutAlignRightIcon },
  { name: "LayoutAlignRightFilledIcon", component: LayoutAlignRightFilledIcon },
  { name: "LayoutAlignTopIcon", component: LayoutAlignTopIcon },
  { name: "LayoutAlignTopFilledIcon", component: LayoutAlignTopFilledIcon },
  { name: "MagnetLeadAttractIcon", component: MagnetLeadAttractIcon },
  { name: "MagnetLeadAttractFilledIcon", component: MagnetLeadAttractFilledIcon },
  { name: "MenuRightIcon", component: MenuRightIcon },
  { name: "MenuStaggeredIcon", component: MenuStaggeredIcon },
  { name: "MinimizeIcon", component: MinimizeIcon },
  { name: "MobiledataUpDownArrowIcon", component: MobiledataUpDownArrowIcon },
  { name: "MoneybagPouchIcon", component: MoneybagPouchIcon },
  { name: "MoneybagPouchFilledIcon", component: MoneybagPouchFilledIcon },
  { name: "MugCupCoffeeIcon", component: MugCupCoffeeIcon },
  { name: "MugCupCoffeeFilledIcon", component: MugCupCoffeeFilledIcon },
  { name: "MusicSongIcon", component: MusicSongIcon },
  { name: "PausePlayerIcon", component: PausePlayerIcon },
  { name: "PausePlayerFilledIcon", component: PausePlayerFilledIcon },
  { name: "PennantPoleFlagIcon", component: PennantPoleFlagIcon },
  { name: "PennantPoleFlagFilledIcon", component: PennantPoleFlagFilledIcon },
  { name: "PigBankMoneyIcon", component: PigBankMoneyIcon },
  { name: "PigBankMoneyFilledIcon", component: PigBankMoneyFilledIcon },
  { name: "PlaneAircraftFlyIcon", component: PlaneAircraftFlyIcon },
  { name: "PlaneAircraftFlyFilledIcon", component: PlaneAircraftFlyFilledIcon },
  { name: "PlaneTiltAircraftFlyIcon", component: PlaneTiltAircraftFlyIcon },
  { name: "PlaneTiltAircraftFlyFilledIcon", component: PlaneTiltAircraftFlyFilledIcon },
  { name: "PlanetSaturnIcon", component: PlanetSaturnIcon },
  { name: "PlayerSkipBackIcon", component: PlayerSkipBackIcon },
  { name: "PlayerSkipBackFilledIcon", component: PlayerSkipBackFilledIcon },
  { name: "PlayerSkipForwardIcon", component: PlayerSkipForwardIcon },
  { name: "PlayerSkipForwardFilledIcon", component: PlayerSkipForwardFilledIcon },
  { name: "Plug2PinConnectIcon", component: Plug2PinConnectIcon },
  { name: "Plug2PinConnectFilledIcon", component: Plug2PinConnectFilledIcon },
  { name: "PowerSwitchIcon", component: PowerSwitchIcon },
  { name: "QrcodeIcon", component: QrcodeIcon },
  { name: "RefreshReloadIcon", component: RefreshReloadIcon },
  { name: "RouteAltRightIcon", component: RouteAltRightIcon },
  { name: "ScissorsCutIcon", component: ScissorsCutIcon },
  { name: "SelectorUpDownArrowSortIcon", component: SelectorUpDownArrowSortIcon },
  { name: "SendKiteForwardIcon", component: SendKiteForwardIcon },
  { name: "SendKiteForwardFilledIcon", component: SendKiteForwardFilledIcon },
  { name: "SendTiltedKiteForwardIcon", component: SendTiltedKiteForwardIcon },
  { name: "SendTiltedKiteForwardFilledIcon", component: SendTiltedKiteForwardFilledIcon },
  { name: "ServerStorgaeIcon", component: ServerStorgaeIcon },
  { name: "ServerStorgaeFilledIcon", component: ServerStorgaeFilledIcon },
  { name: "ShieldProtectSecureIcon", component: ShieldProtectSecureIcon },
  { name: "ShieldProtectSecureFilledIcon", component: ShieldProtectSecureFilledIcon },
  { name: "SnowflakeIceIcon", component: SnowflakeIceIcon },
  { name: "SortAscendingGridIcon", component: SortAscendingGridIcon },
  { name: "SortAscendingLineIcon", component: SortAscendingLineIcon },
  { name: "SortDescendingGridIcon", component: SortDescendingGridIcon },
  { name: "SortDescendingLineIcon", component: SortDescendingLineIcon },
  { name: "SpyIncognitoAnonymousIcon", component: SpyIncognitoAnonymousIcon },
  { name: "SpyIncognitoAnonymousFilledIcon", component: SpyIncognitoAnonymousFilledIcon },
  { name: "StackForwardLayerIcon", component: StackForwardLayerIcon },
  { name: "StackFrontLayerIcon", component: StackFrontLayerIcon },
  { name: "StairsRideGrowthIcon", component: StairsRideGrowthIcon },
  { name: "StarBookmarkFavouriteIcon", component: StarBookmarkFavouriteIcon },
  { name: "StarBookmarkFavouriteFilledIcon", component: StarBookmarkFavouriteFilledIcon },
  { name: "StopPlayerIcon", component: StopPlayerIcon },
  { name: "StopPlayerFilledIcon", component: StopPlayerFilledIcon },
  { name: "SwipeCardIcon", component: SwipeCardIcon },
  { name: "SwipeCardFilledIcon", component: SwipeCardFilledIcon },
  { name: "SwitchShuffleIcon", component: SwitchShuffleIcon },
  { name: "TagBookmarkSaveIcon", component: TagBookmarkSaveIcon },
  { name: "TagBookmarkSaveFilledIcon", component: TagBookmarkSaveFilledIcon },
  { name: "TaxMoneyBagDollarIcon", component: TaxMoneyBagDollarIcon },
  { name: "TaxMoneyBagDollarFilledIcon", component: TaxMoneyBagDollarFilledIcon },
  { name: "TelescopeIcon", component: TelescopeIcon },
  { name: "TelescopeFilledIcon", component: TelescopeFilledIcon },
  { name: "TrophyPrizeWinIcon", component: TrophyPrizeWinIcon },
  { name: "TrophyPrizeWinFilledIcon", component: TrophyPrizeWinFilledIcon },
  { name: "UfoAlienSpaceshipIcon", component: UfoAlienSpaceshipIcon },
  { name: "UfoAlienSpaceshipFilledIcon", component: UfoAlienSpaceshipFilledIcon },
  { name: "UserStarProfileIcon", component: UserStarProfileIcon },
  { name: "UsersGroupIcon", component: UsersGroupIcon },
  { name: "VideoCameraRecordIcon", component: VideoCameraRecordIcon },
  { name: "VideoCameraRecordFilledIcon", component: VideoCameraRecordFilledIcon },
  { name: "WalletMoneyIcon", component: WalletMoneyIcon },
  { name: "WalletMoneyFilledIcon", component: WalletMoneyFilledIcon },
  { name: "WifiIcon", component: WifiIcon },
  { name: "YinYangIcon", component: YinYangIcon },
  { name: "MenuCenterIcon", component: MenuCenterIcon },
  { name: "RotateAnticlockwiseIcon", component: RotateAnticlockwiseIcon },
  { name: "RotateClockwiseIcon", component: RotateClockwiseIcon },
  { name: "IconsTemperatureThermomemterIcon", component: IconsTemperatureThermomemterIcon },
  { name: "DotsVerticalIcon", component: DotsVerticalIcon },
  { name: "EyeOffIcon", component: EyeOffIcon },
  { name: "EyeViewShowIcon", component: EyeViewShowIcon },
  { name: "EyeViewShowFilledIcon", component: EyeViewShowFilledIcon },
  { name: "HistoryClockIcon", component: HistoryClockIcon },
  { name: "PlusAddIcon", component: PlusAddIcon },
  { name: "WorldGlobeIcon", component: WorldGlobeIcon },
  { name: "AddPlusCircleSlotIcon", component: AddPlusCircleSlotIcon },
  { name: "DownloadDownDashedIcon", component: DownloadDownDashedIcon },
  { name: "PlayMusicIcon", component: PlayMusicIcon },
  { name: "PlayMusicFilledIcon", component: PlayMusicFilledIcon },
  { name: "ArrowDotChevronReplaceIcon", component: ArrowDotChevronReplaceIcon },
  { name: "DownloadInDownAddArrowDashedDownIcon", component: DownloadInDownAddArrowDashedDownIcon },
  { name: "UploadFileSendShareIcon", component: UploadFileSendShareIcon },
  { name: "UploadDocumentIcon", component: UploadDocumentIcon },
  { name: "ArrowDownFallTurnRightIcon", component: ArrowDownFallTurnRightIcon },
  { name: "ArrowsExpandMoveHorizontalIcon", component: ArrowsExpandMoveHorizontalIcon },
  { name: "ArrowsMaximizeExpandIcon", component: ArrowsMaximizeExpandIcon },
  { name: "ArrowsMinimizeCollapseIcon", component: ArrowsMinimizeCollapseIcon },
  { name: "ArrowsMoveVerticalExpandIcon", component: ArrowsMoveVerticalExpandIcon },
  { name: "BluetoothIcon", component: BluetoothIcon },
  { name: "DeviceDesktopIcon", component: DeviceDesktopIcon },
  { name: "DeviceDesktopFilledIcon", component: DeviceDesktopFilledIcon },
  { name: "DotsMenuOverflowIcon", component: DotsMenuOverflowIcon },
  { name: "DownloadIcon", component: DownloadIcon },
  { name: "FolderOpenFileIcon", component: FolderOpenFileIcon },
  { name: "FolderOpenFileFilledIcon", component: FolderOpenFileFilledIcon },
  { name: "FolderIcon", component: FolderIcon },
  { name: "FolderFilledIcon", component: FolderFilledIcon },
  { name: "HeartIcon", component: HeartIcon },
  { name: "HeartFilledIcon", component: HeartFilledIcon },
  { name: "HourglassEmptyTimeWaitIcon", component: HourglassEmptyTimeWaitIcon },
  { name: "HourglassEmptyTimeWaitFilledIcon", component: HourglassEmptyTimeWaitFilledIcon },
  { name: "HourglassHighTimeWaitIcon", component: HourglassHighTimeWaitIcon },
  { name: "HourglassHighTimeWaitFilledIcon", component: HourglassHighTimeWaitFilledIcon },
  { name: "LayoutDashboardGridIcon", component: LayoutDashboardGridIcon },
  { name: "LayoutDashboardGridFilledIcon", component: LayoutDashboardGridFilledIcon },
  { name: "LayoutGridIcon", component: LayoutGridIcon },
  { name: "LayoutGridFilledIcon", component: LayoutGridFilledIcon },
  { name: "LayoutCardsAlignIcon", component: LayoutCardsAlignIcon },
  { name: "LayoutCardsAlignFilledIcon", component: LayoutCardsAlignFilledIcon },
  { name: "LayoutGridAddIcon", component: LayoutGridAddIcon },
  { name: "LayoutGridAddFilledIcon", component: LayoutGridAddFilledIcon },
  { name: "LockPasswordSecurityIcon", component: LockPasswordSecurityIcon },
  { name: "LockPasswordSecurityFilledIcon", component: LockPasswordSecurityFilledIcon },
  { name: "LockSecureIcon", component: LockSecureIcon },
  { name: "LockSecureFilledIcon", component: LockSecureFilledIcon },
  { name: "LockUnlockIcon", component: LockUnlockIcon },
  { name: "LockUnlockFilledIcon", component: LockUnlockFilledIcon },
  { name: "LockIcon", component: LockIcon },
  { name: "LockFilledIcon", component: LockFilledIcon },
  { name: "PointerCursorIcon", component: PointerCursorIcon },
  { name: "PointerCursorFilledIcon", component: PointerCursorFilledIcon },
  { name: "ShoppingCartIcon", component: ShoppingCartIcon },
  { name: "ShoppingCartFilledIcon", component: ShoppingCartFilledIcon },
  { name: "SmartHomeIcon", component: SmartHomeIcon },
  { name: "SmartHomeFilledIcon", component: SmartHomeFilledIcon },
  { name: "UndoArrowForwardUpIcon", component: UndoArrowForwardUpIcon },
  { name: "VolumeMuteIcon", component: VolumeMuteIcon },
  { name: "VolumeMuteFilledIcon", component: VolumeMuteFilledIcon },
  { name: "VolumeSpeakLowIcon", component: VolumeSpeakLowIcon },
  { name: "VolumeSpeakLowFilledIcon", component: VolumeSpeakLowFilledIcon },
  { name: "VolumeSpeakIcon", component: VolumeSpeakIcon },
  { name: "VolumeSpeakFilledIcon", component: VolumeSpeakFilledIcon },
  { name: "ArrowDownLeftIcon", component: ArrowDownLeftIcon },
  { name: "RedoArrowForwardUpIcon", component: RedoArrowForwardUpIcon },
  { name: "BeaconIcon", component: BeaconIcon },
  { name: "SearchIcon", component: SearchIcon },
  { name: "SearchFilledIcon", component: SearchFilledIcon },
  { name: "PaletteIcon", component: PaletteIcon },
  { name: "PaletteFilledIcon", component: PaletteFilledIcon },
  { name: "ChevronDownIcon", component: ChevronDownIcon },
  { name: "ChevronUpIcon", component: ChevronUpIcon },
  { name: "ChevronRightIcon", component: ChevronRightIcon },
  { name: "ChevronLeftIcon", component: ChevronLeftIcon },
  { name: "SunIcon", component: SunIcon },
  { name: "SunFilledIcon", component: SunFilledIcon },
  { name: "MoonIcon", component: MoonIcon },
  { name: "MoonFilledIcon", component: MoonFilledIcon },
  { name: "ListIcon", component: ListIcon },
  { name: "ListCheckIcon", component: ListCheckIcon },
  { name: "MenuIcon", component: MenuIcon },
  { name: "CloseIcon", component: CloseIcon },
  { name: "CopyIcon", component: CopyIcon },
  { name: "CheckIcon", component: CheckIcon },
  { name: "LoaderIcon", component: LoaderIcon },
  { name: "GrowthIcon", component: GrowthIcon },
  { name: "LinkIcon", component: LinkIcon },
  { name: "DownArrowIcon", component: DownArrowIcon },
  { name: "LeftArrowIcon", component: LeftArrowIcon },
  { name: "RightArrowIcon", component: RightArrowIcon },
  { name: "UpArrowIcon", component: UpArrowIcon },
  { name: "DiagonalArrowIcon", component: DiagonalArrowIcon },
  { name: "MinusDashIcon", component: MinusDashIcon },
  { name: "ShoppingBagIcon", component: ShoppingBagIcon },
  { name: "ShoppingBagFilledIcon", component: ShoppingBagFilledIcon },
  { name: "SettingsGearIcon", component: SettingsGearIcon },
  { name: "SettingsGearFilledIcon", component: SettingsGearFilledIcon },
  { name: "HomeIcon", component: HomeIcon },
  { name: "HomeFilledIcon", component: HomeFilledIcon },
  { name: "BriefcaseIcon", component: BriefcaseIcon },
  { name: "BriefcaseFilledIcon", component: BriefcaseFilledIcon },
  { name: "GraduateHatIcon", component: GraduateHatIcon },
  { name: "GraduateHatFilledIcon", component: GraduateHatFilledIcon },
  { name: "LocationPinIcon", component: LocationPinIcon },
  { name: "LocationPinFilledIcon", component: LocationPinFilledIcon },
  { name: "BellIcon", component: BellIcon },
  { name: "BellFilledIcon", component: BellFilledIcon },
  { name: "CameraIcon", component: CameraIcon },
  { name: "CameraFilledIcon", component: CameraFilledIcon },
  { name: "CalendarIcon", component: CalendarIcon },
  { name: "CalendarFilledIcon", component: CalendarFilledIcon },
  { name: "EmailEnvelopeIcon", component: EmailEnvelopeIcon },
  { name: "EmailEnvelopeFilledIcon", component: EmailEnvelopeFilledIcon },
  { name: "ClipboardIcon", component: ClipboardIcon },
  { name: "ClipboardFilledIcon", component: ClipboardFilledIcon },
  { name: "UserPersonIcon", component: UserPersonIcon },
  { name: "UserPersonFilledIcon", component: UserPersonFilledIcon },
  { name: "UserCircleIcon", component: UserCircleIcon },
  { name: "UserCircleFilledIcon", component: UserCircleFilledIcon },
  { name: "SpannerSettingsIcon", component: SpannerSettingsIcon },
  { name: "SpannerSettingsFilledIcon", component: SpannerSettingsFilledIcon },
  { name: "DeleteBinIcon", component: DeleteBinIcon },
  { name: "DeleteBinFilledIcon", component: DeleteBinFilledIcon },
  { name: "TimerAlarmIcon", component: TimerAlarmIcon },
  { name: "TimerAlarmFilledIcon", component: TimerAlarmFilledIcon },
  { name: "ErrorSearchIcon", component: ErrorSearchIcon },
  { name: "ErrorSearchFilledIcon", component: ErrorSearchFilledIcon },
  { name: "ListDetailsIcon", component: ListDetailsIcon },
  { name: "ListDetailsFilledIcon", component: ListDetailsFilledIcon },
  { name: "MessageDotsIcon", component: MessageDotsIcon },
  { name: "MessageDotsFilledIcon", component: MessageDotsFilledIcon },
  { name: "PencilIcon", component: PencilIcon },
  { name: "PencilFilledIcon", component: PencilFilledIcon },
  { name: "AlertTriangleErrorIcon", component: AlertTriangleErrorIcon },
  { name: "AlertTriangleErrorFilledIcon", component: AlertTriangleErrorFilledIcon },
  { name: "CircleErrorIcon", component: CircleErrorIcon },
  { name: "CircleErrorFilledIcon", component: CircleErrorFilledIcon },
  { name: "PageFileIcon", component: PageFileIcon },
  { name: "PageFileFilledIcon", component: PageFileFilledIcon },
  { name: "AIVibeCodeIcon", component: AIVibeCodeIcon },
  { name: "AIVibeCodeFilledIcon", component: AIVibeCodeFilledIcon },
  { name: "StackResourceIcon", component: StackResourceIcon },
  { name: "StackResourceFilledIcon", component: StackResourceFilledIcon },
  { name: "GridUILayoutIcon", component: GridUILayoutIcon },
  { name: "GridUILayoutFilledIcon", component: GridUILayoutFilledIcon },
  { name: "PhoneCallIcon", component: PhoneCallIcon },
  { name: "PhoneCallFilledIcon", component: PhoneCallFilledIcon },
  { name: "DeviceMobilePhoneIcon", component: DeviceMobilePhoneIcon },
  { name: "DeviceMobilePhoneFilledIcon", component: DeviceMobilePhoneFilledIcon },
  { name: "DotCirclePointIcon", component: DotCirclePointIcon },
  { name: "DotCirclePointFilledIcon", component: DotCirclePointFilledIcon },
  { name: "QuoteUpIcon", component: QuoteUpIcon },
  { name: "QuoteDowncon", component: QuoteDowncon },
  { name: "QuoteUpFilledIcon", component: QuoteUpFilledIcon },
  { name: "QuoteDownFilledIcon", component: QuoteDownFilledIcon },
];

// Sort icons alphabetically by name
const ALL_ICONS: IconItem[] = [
  { name: "ToggleSwitchIcon", component: ToggleSwitchIcon },
  { name: "InputCheckboxIcon", component: InputCheckboxIcon },
  { name: "KayakBoatIcon", component: KayakBoatIcon },
  { name: "EyeglassSpecIcon", component: EyeglassSpecIcon },
  { name: "CubeBoxIcon", component: CubeBoxIcon },
  { name: "ChartBarLeaderboardIcon", component: ChartBarLeaderboardIcon },
  { name: "ChartBarLeaderboardFilledIcon", component: ChartBarLeaderboardFilledIcon },
  { name: "GraphInvestChartIcon", component: GraphInvestChartIcon },
  { name: "GraphInvestChartFilledIcon", component: GraphInvestChartFilledIcon },
  { name: "ClockTimeIcon", component: ClockTimeIcon },
  { name: "ClockTimeFilledIcon", component: ClockTimeFilledIcon },
  { name: "CloudIcon", component: CloudIcon },
  { name: "CloudFilledIcon", component: CloudFilledIcon },
  { name: "HandStopCursorIcon", component: HandStopCursorIcon },...ALL_ICONS_UNSORTED].sort((a, b) => a.name.localeCompare(b.name));

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Fallback for older browsers
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "true");
  el.style.position = "absolute";
  el.style.left = "0";
  el.style.top = "0";
  el.style.transform = "translateX(-100%)";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

interface IconCardProps {
  icon: IconItem;
  onCopy: (name: string) => void;
  copiedName: string | null;
}

function IconCard({ icon, onCopy, copiedName }: IconCardProps) {
  const IconComponent = icon.component;
  const isCopied = copiedName === icon.name;

  return (
    <button
      type="button"
      className="ds-icon-card"
      onClick={() => onCopy(icon.name)}
      aria-label={`Copy ${icon.name} to clipboard`}
    >
      <div className="ds-icon-card__preview">
        <IconComponent size="md" />
      </div>
      <div className="ds-icon-card__name">
        {isCopied ? (
          <span className="ds-icon-card__copied">
            <CheckIcon size="xs" />
            <span>Copied!</span>
          </span>
        ) : (
          <code>{icon.name}</code>
        )}
      </div>
    </button>
  );
}

export default function IconsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return ALL_ICONS;
    }
    const query = searchQuery.toLowerCase();
    return ALL_ICONS.filter((icon) => icon.name.toLowerCase().includes(query));
  }, [searchQuery]);

  const tocItems: TocItem[] = useMemo(() => {
    return [
      { id: "overview", label: "Overview" },
      { id: "search", label: "Search Icons" },
    ];
  }, []);

  const handleCopy = async (name: string) => {
    await copyToClipboard(name);
    setCopiedName(name);
    setTimeout(() => {
      setCopiedName(null);
    }, 2000);
  };

  return (
    <PageLayout tocItems={tocItems} currentPath="/foundations/icons">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Icons</h3>
          <p className="ds-content__subtitle">
            A comprehensive collection of {ALL_ICONS.length} icons available in the Beacon Design System. Click any icon to copy its variable name.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            The Beacon icon library provides a consistent set of SVG icons built as React components. All icons are available from the <code>beacon-icons</code> package and can be imported individually.
          </p>
          <p className="ds-content__text">
            Icons support multiple size options including token-based sizes (<code>xs</code>, <code>sm</code>, <code>rg</code>, <code>md</code>, <code>lg</code>, <code>xl</code>, <code>2xl</code>) and numeric pixel values.
          </p>
          <p className="ds-content__text">
            All icons support a <code>color</code> prop for custom color override while defaulting to <code>currentColor</code> for easy theming.
          </p>
        </section>

        <section id="search" className="ds-content__section">
          <h6 className="ds-content__section-title">Search Icons</h6>
          <div className="ds-icons-search">
            <Input
              placeholder="Search icons by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startIcon={<SearchIcon size="xs" />}
              size="md"
            />
            {searchQuery && (
              <p className="ds-icons-search__results">
                {filteredIcons.length} {filteredIcons.length === 1 ? "icon" : "icons"} found
              </p>
            )}
          </div>
        </section>

        <section id="grid" className="ds-content__section">
          {filteredIcons.length === 0 ? (
            <p className="ds-content__text">No icons found matching your search.</p>
          ) : (
            <div className="ds-icons-grid">
              {filteredIcons.map((icon) => (
                <IconCard
                  key={icon.name}
                  icon={icon}
                  onCopy={handleCopy}
                  copiedName={copiedName}
                />
              ))}
            </div>
          )}
        </section>
      </article>
    </PageLayout>
  );
}

