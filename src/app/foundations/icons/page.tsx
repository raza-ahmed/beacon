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
  ArrowDownFallSlotIcon,
  QuoteUpIcon,
  QuoteDowncon,
  QuoteUpFilledIcon,
  QuoteDownFilledIcon,
} from "beacon-icons";
import { Input } from "beacon-ui";

interface IconItem {
  name: string;
  component: React.ComponentType<{ size?: number | "xs" | "sm" | "rg" | "rm" | "md" | "lg" | "xl" | "2xl"; className?: string }>;
}

const ALL_ICONS: IconItem[] = [
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
  { name: "DownloadIcon", component: DownloadIcon },
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
  { name: "LockIcon", component: LockIcon },
  { name: "LockFilledIcon", component: LockFilledIcon },
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
  { name: "ArrowDownFallSlotIcon", component: ArrowDownFallSlotIcon },
  { name: "QuoteUpIcon", component: QuoteUpIcon },
  { name: "QuoteDowncon", component: QuoteDowncon },
  { name: "QuoteUpFilledIcon", component: QuoteUpFilledIcon },
  { name: "QuoteDownFilledIcon", component: QuoteDownFilledIcon },
];

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

