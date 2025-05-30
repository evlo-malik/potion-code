import type React from 'react';

import type { VariantProps } from 'class-variance-authority';

import {
  type LucideProps,
  Activity,
  Album,
  AlertCircleIcon,
  AlertTriangleIcon,
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowLeftIcon,
  ArrowLeftRightIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BadgeHelp,
  Bold,
  Calendar,
  Captions,
  Check,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsLeftRightIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon,
  CircleIcon,
  CircleStop,
  Clock,
  Clock9,
  Code2,
  Columns3,
  Combine,
  CopyIcon,
  CopyX,
  CornerDownLeft,
  CornerDownRightIcon,
  CornerUpLeft,
  CreditCardIcon,
  DownloadIcon,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  File,
  FileCode,
  FileIcon,
  FileTextIcon,
  FileVideo,
  GlobeIcon,
  GripVertical,
  GripVerticalIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  ImageIcon,
  Indent,
  InfoIcon,
  Italic,
  Keyboard,
  Languages,
  Lightbulb,
  Link,
  Link2,
  Link2Off,
  List,
  ListEnd,
  ListMinus,
  ListOrdered,
  ListPlus,
  Loader2Icon,
  LogOutIcon,
  MenuIcon,
  MessageSquareIcon,
  MessageSquarePlus,
  MessageSquareText,
  MessagesSquareIcon,
  Minus,
  Moon,
  MoreHorizontal,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  MoveUpRight,
  Outdent,
  PaintbrushIcon,
  PaintBucket,
  PaintRoller,
  Paperclip,
  PartyPopper,
  PencilLine,
  PenLine,
  Pilcrow,
  Plus,
  PlusCircleIcon,
  PlusIcon,
  Quote,
  Radical,
  RectangleHorizontal,
  RectangleVertical,
  RefreshCw,
  RotateCcw,
  RotateCcwIcon,
  Search,
  SearchSlash,
  Settings,
  ShapesIcon,
  ShareIcon,
  SidebarIcon,
  Sigma,
  SlidersHorizontalIcon,
  Smile,
  SmileIcon,
  Sparkles,
  Square,
  SquareIcon,
  SquarePenIcon,
  Strikethrough,
  Subscript,
  SunMedium,
  Superscript,
  Table,
  Text,
  Trash2,
  Underline,
  UndoIcon,
  Ungroup,
  UploadCloudIcon,
  UploadIcon,
  UserIcon,
  Wand,
  WrapText,
  X,
  XIcon,
  ZoomOut,
} from 'lucide-react';

import { GitHubIcon } from '../icons/GitHubIcon';
import { ImageUploadIcon } from '../icons/ImageUploadIcon';
import { LogoIcon } from '../icons/LogoIcon';
import { TwitterXIcon } from '../icons/TwitterXIcon';
import { type iconVariants, createIcon } from './icon';

const iconMap = {
  add: Plus,
  ai: Sparkles,
  alertCircle: AlertCircleIcon,
  alignCenter: AlignCenter,
  alignJustify: AlignJustify,
  alignLeft: AlignLeft,
  alignRight: AlignRight,
  arrowDown: ChevronDownIcon,
  arrowLeft: ArrowLeftIcon,
  arrowLeftRight: ArrowLeftRightIcon,
  arrowRight: ArrowRightIcon,
  arrowUp: ArrowUpIcon,
  audioUpload: Activity,
  bg: PaintBucket,
  blockquote: Quote,
  bold: Bold,
  calendar: Calendar,
  callout: Lightbulb,
  caption: Captions,
  check: Check,
  checked: CheckIcon,
  chevronDown: ChevronDownIcon,
  chevronLeft: ChevronLeftIcon,
  chevronRight: ChevronRightIcon,
  chevronsLeft: ChevronsLeftIcon,
  chevronsLeftRight: ChevronsLeftRightIcon,
  chevronsRight: ChevronsRightIcon,
  chevronsUpDown: ChevronsUpDownIcon,
  chevronUp: ChevronUpIcon,
  circle: CircleIcon,
  clear: X,
  clock: Clock,
  close: X,
  code: Code2,
  codeblock: FileCode,
  color: PaintRoller,
  column: RectangleVertical,
  columns3: Columns3,
  combine: Combine,
  comment: MessageSquareText,
  commentAdd: MessageSquarePlus,
  continueWrite: PenLine,
  copy: CopyIcon,
  copyLink: Link,
  creditCard: CreditCardIcon,
  delete: Trash2,
  document: FileTextIcon,
  done: Check,
  download: DownloadIcon,
  dragHandle: GripVertical,
  dropzone: UploadIcon,
  edit: PencilLine,
  editing: Edit2,
  editor: FileTextIcon,
  emoji: Smile,
  empty: SearchSlash,
  enter: CornerDownLeft,
  equation: CopyX,
  explain: BadgeHelp,
  externalLink: ExternalLink,
  file: FileIcon,
  fileUpload: Paperclip,
  github: GitHubIcon,
  globe: GlobeIcon,
  gripVertical: GripVerticalIcon,
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  h4: Heading4,
  h5: Heading5,
  h6: Heading6,
  hidden: EyeOff,
  hide: XIcon,
  history: Clock9,
  image: ImageIcon,
  imageUpload: ImageUploadIcon,
  improve: Wand,
  indent: Indent,
  info: InfoIcon,
  inlineEquation: Radical,
  insertBelow: ListEnd,
  italic: Italic,
  kbd: Keyboard,
  lineHeight: WrapText,
  link: Link2,
  logo: LogoIcon,
  logout: LogOutIcon,
  logoX: TwitterXIcon,
  makeLonger: ListPlus,
  makeShorter: ListMinus,
  mediaFile: File,
  menu: MenuIcon,
  message: MessageSquareIcon,
  messages: MessagesSquareIcon,
  minus: Minus,
  moon: Moon,
  more: MoreHorizontal,
  moreX: MoreHorizontalIcon,
  moreY: MoreVerticalIcon,
  newPage: SquarePenIcon,
  ol: ListOrdered,
  original: MoveUpRight,
  outdent: Outdent,
  paintbrush: PaintbrushIcon,
  paragraph: Pilcrow,
  plus: PlusIcon,
  plusCircle: PlusCircleIcon,
  refresh: RotateCcw,
  reset: RotateCcwIcon,
  row: RectangleHorizontal,
  search: Search,
  sendMessage: CornerDownRightIcon,
  settings: Settings,
  share: ShareIcon,
  sidebar: SidebarIcon,
  sigma: Sigma,
  simplify: PartyPopper,
  slidersHorizontal: SlidersHorizontalIcon,
  smile: SmileIcon,
  spinner: Loader2Icon,
  square: SquareIcon,
  stop: CircleStop,
  strikethrough: Strikethrough,
  submit: ArrowUpIcon,
  subscript: Subscript,
  summarize: Album,
  sun: SunMedium,
  superscript: Superscript,
  table: Table,
  templates: ShapesIcon,
  text: Text,
  todo: Square,
  translate: Languages,
  trash: Trash2,
  tryAgain: CornerUpLeft,
  turnInto: RefreshCw,
  ul: List,
  underline: Underline,
  undo: UndoIcon,
  ungroup: Ungroup,
  unlink: Link2Off,
  upload: UploadIcon,
  uploadCloud: UploadCloudIcon,
  user: UserIcon,
  videoUpload: FileVideo,
  viewing: Eye,
  warning: AlertTriangleIcon,
  x: XIcon,
  zoomIn: Plus,
  zoomOut: ZoomOut,
  logoDiscord: (_props: LucideProps) => null,
} satisfies Record<string, React.FC<LucideProps>>;

export const Icons = Object.fromEntries(
  Object.entries(iconMap).map(([key, IconComponent]) => [
    key,
    createIcon(IconComponent, key === 'spinner' ? { spin: true } : {}),
  ])
) as Record<IconName, ReturnType<typeof createIcon>>;

export type IconFC = React.FC<IconProps>;

export type IconName = keyof typeof iconMap;

export type IconProps = {
  /**
   * All icons must be associated with an label, either next to the icon (using
   * sr-only) or on an interactive parent element (using aria-label). The latter
   * case is preferred (e.g. inside a button). If the icon does not add any new
   * information, it can be safely hidden.
   */
  label?: string;
} & LucideProps &
  VariantProps<typeof iconVariants>;
