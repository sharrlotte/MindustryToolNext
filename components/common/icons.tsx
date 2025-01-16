import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowDownFromLine,
  ArrowDownToLine,
  ArrowLeft,
  ArrowLeftCircle,
  ArrowUpDown,
  BellIcon,
  BookOpenIcon,
  BotIcon,
  Box,
  Check,
  CheckCircle,
  CheckSquare2,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ClipboardList,
  Copy,
  Crown,
  Expand,
  ExternalLink,
  Facebook,
  File,
  Filter,
  Folder,
  GanttChart,
  Github,
  Globe,
  HistoryIcon,
  Home,
  LayoutDashboard,
  LayoutGrid,
  LineChart,
  Link,
  List,
  LogIn,
  LogOut,
  Map,
  Menu,
  MessageCircleIcon,
  MessageSquareIcon,
  Moon,
  Paperclip,
  Pencil,
  Plug,
  Search,
  Send,
  Server,
  SettingsIcon,
  ShieldCheckIcon,
  Shrink,
  Sigma,
  Smile,
  Square,
  SquareKanbanIcon,
  Sun,
  Tag,
  TerminalIcon,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Upload,
  User,
  Users,
  X,
  XCircle,
  Loader,
} from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import googleIcon from '@/public/icons/google.svg';

import { DiscordLogoIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';

type Props = {
  className?: string;
};

export const LoaderIcon = ({ className }: Props) => <Loader className={cn(className ?? 'lucide')} />;
export const TagIcon = ({ className }: Props) => <Tag className={cn(className ?? 'lucide')} />;
export const BoxIcon = ({ className }: Props) => <Box className={cn(className ?? 'lucide')} />;
export const CommentIcon = ({ className }: Props) => <MessageSquareIcon className={cn(className ?? 'lucide')} />;
export const AlertTriangleIcon = ({ className }: Props) => <AlertTriangle className={cn(className ?? 'lucide')} />;
export const AnalyticIcon = ({ className }: Props) => <LineChart className={cn(className ?? 'lucide')} />;
export const XCircleIcon = ({ className }: Props) => <XCircle className={cn(className ?? 'lucide')} />;
export const CheckCircleIcon = ({ className }: Props) => <CheckCircle className={cn(className ?? 'lucide')} />;
export const BackIcon = ({ className }: Props) => <ArrowLeft className={cn(className ?? 'lucide')} />;
export const SunIcon = ({ className }: Props) => <Sun className={cn(className ?? 'lucide')} />;
export const MoonIcon = ({ className }: Props) => <Moon className={cn(className ?? 'lucide')} />;
export const ExternalLinkIcon = ({ className }: Props) => <ExternalLink className={cn(className ?? 'lucide')} />;
export const DislikeIcon = ({ className }: Props) => <ThumbsDown className={cn(className ?? 'lucide')} />;
export const LikeIcon = ({ className }: Props) => <ThumbsUp className={cn(className ?? 'lucide')} />;
export const FolderIcon = ({ className }: Props) => <Folder className={cn(className ?? 'lucide')} />;
export const ChevronRightIcon = ({ className }: Props) => <ChevronRight className={cn(className ?? 'lucide')} />;
export const ChevronLeftIcon = ({ className }: Props) => <ChevronLeft className={cn(className ?? 'lucide')} />;
export const LayoutListIcon = ({ className }: Props) => <List className={cn(className ?? 'lucide')} />;
export const LayoutGridIcon = ({ className }: Props) => <LayoutGrid className={cn(className ?? 'lucide')} />;
export const ArrowUpDownIcon = ({ className }: Props) => <ArrowUpDown className={cn(className ?? 'lucide')} />;
export const CheckIcon = ({ className }: Props) => <Check className={cn(className ?? 'lucide')} />;
export const ArrowLeftCircleIcon = ({ className }: Props) => <ArrowLeftCircle className={cn(className ?? 'lucide')} />;
export const FilterIcon = ({ className }: Props) => <Filter className={cn(className ?? 'lucide')} />;
export const GanttChartIcon = ({ className }: Props) => <GanttChart className={cn(className ?? 'lucide')} />;
export const LogoutIcon = ({ className }: Props) => <LogOut className={cn(className ?? 'lucide')} />;
export const SquareIcon = ({ className }: Props) => <Square className={cn(className ?? 'lucide')} />;
export const SquareCheckedIcon = ({ className }: Props) => <CheckSquare2 className={cn(className ?? 'lucide')} />;
export const GlobIcon = ({ className }: Props) => <Globe className={cn(className ?? 'lucide')} />;
export const LinkIcon = ({ className }: Props) => <Link className={cn(className ?? 'lucide')} />;
export const PostIcon = ({ className }: Props) => <BookOpenIcon className={cn(className ?? 'lucide')} />;
export const MindustryGptIcon = ({ className }: Props) => <BotIcon className={cn(className ?? 'lucide')} />;
export const FileIcon = ({ className }: Props) => <File className={cn(className ?? 'lucide')} />;
export const DocumentIcon = ({ className }: Props) => <Folder className={cn(className ?? 'lucide')} />;
export const HomeIcon = ({ className }: Props) => <Home className={cn(className ?? 'lucide')} />;
export const MapIcon = ({ className }: Props) => <Map className={cn(className ?? 'lucide')} />;
export const ServerIcon = ({ className }: Props) => <Server className={cn(className ?? 'lucide')} />;
export const VerifyIcon = ({ className }: Props) => <ShieldCheckIcon className={cn(className ?? 'lucide')} />;
export const UserIcon = ({ className }: Props) => <User className={cn(className ?? 'lucide')} />;
export const ChartIcon = ({ className }: Props) => <SquareKanbanIcon className={cn(className ?? 'lucide')} />;
export const ChatIcon = ({ className }: Props) => <MessageCircleIcon className={cn(className ?? 'lucide')} />;
export const LogIcon = ({ className }: Props) => <HistoryIcon className={cn(className ?? 'lucide')} />;
export const SchematicIcon = ({ className }: Props) => <ClipboardList className={cn(className ?? 'lucide')} />;
export const SettingIcon = ({ className }: Props) => <SettingsIcon className={cn(className ?? 'lucide')} />;
export const RoleIcon = ({ className }: Props) => <Users className={cn(className ?? 'lucide')} />;
export const CmdIcon = ({ className }: Props) => <TerminalIcon className={cn(className ?? 'lucide')} />;
export const PluginIcon = ({ className }: Props) => <Plug className={cn(className ?? 'lucide')} />;
export const WarningIcon = ({ className }: Props) => <AlertCircle className={cn(className ?? 'lucide')} />;
export const EllipsisIcon = ({ className }: Props) => <DotsHorizontalIcon className={cn(className ?? 'lucide')} />;
export const NotificationIcon = ({ className }: Props) => <BellIcon className={cn(className ?? 'lucide')} />;
export const GithubIcon = ({ className }: Props) => <Github className={cn(className ?? 'lucide')} />;
export const FacebookIcon = ({ className }: Props) => <Facebook className={cn(className ?? 'lucide')} />;
export const DiscordIcon = ({ className }: Props) => <DiscordLogoIcon className={cn(className ?? 'lucide')} />;
export const ArrowDownIcon = ({ className }: Props) => <ArrowDown className={cn(className ?? 'lucide')} />;
export const MenuIcon = ({ className }: { className?: string }) => <Menu className={cn('size-10 lucide text-white', className)} />;
export const UploadIcon = ({ className }: Props) => <Upload className={cn(className ?? 'lucide')} />;
export const ExpandIcon = ({ className }: Props) => <Expand className={cn(className ?? 'lucide')} />;
export const ShrinkIcon = ({ className }: Props) => <Shrink className={cn(className ?? 'lucide')} />;
export const UsersIcon = ({ className }: Props) => <Users className={cn(className ?? 'lucide')} />;
export const PaperclipIcon = ({ className }: Props) => <Paperclip className={cn(className ?? 'lucide')} />;
export const SmileIcon = ({ className }: Props) => <Smile className={cn(className ?? 'lucide')} />;
export const SearchIcon = ({ className }: Props) => <Search className={cn(className ?? 'lucide')} />;
export const SendIcon = ({ className }: Props) => <Send className={cn(className ?? 'lucide')} />;
export const EditIcon = ({ className }: Props) => <Pencil className={cn(className ?? 'lucide')} />;
export const RatioIcon = ({ className }: Props) => <Sigma className={cn(className ?? 'lucide')} />;
export const XIcon = ({ className }: Props) => <X className={cn(className ?? 'lucide')} />;
export const CrownIcon = ({ className }: Props) => <Crown className={cn(className ?? 'lucide')} />;
export const ChevronsUpDownIcon = ({ className }: Props) => <ChevronsUpDown className={cn(className ?? 'lucide')} />;
export const LayoutDashboardIcon = ({ className }: Props) => <LayoutDashboard className={cn(className ?? 'lucide')} />;
export const CopyIcon = ({ className }: Props) => <Copy className={cn(className ?? 'lucide')} />;
export const DownloadIcon = ({ className }: Props) => <ArrowDownToLine className={cn(className ?? 'lucide')} />;
export const LoginIcon = ({ className }: Props) => <LogIn className={cn(className ?? 'lucide')} />;
export const TrashIcon = ({ className }: Props) => <Trash2 className={cn(className ?? 'lucide')} />;
export const GoogleIcon = ({ className }: Props) => <Image className={cn(className ?? 'lucide')} src={googleIcon} alt="google" />;
export const TakeDownIcon = ({ className }: Props) => <ArrowDownFromLine className={cn(className ?? 'lucide')} />;

export function HRIcon({ className }: Props) {
  return (
    <svg className={cn(className)} role="img" viewBox="0 0 175 175">
      <path
        fill="currentColor"
        d="M0,129 L175,129 L175,154 L0,154 L0,129 Z M3,9 L28.2158203,9 L28.2158203,47.9824219 L55.7695313,47.9824219 L55.7695313,9 L81.0966797,9 L81.0966797,107.185547 L55.7695313,107.185547 L55.7695313,68.0214844 L28.2158203,68.0214844 L28.2158203,107.185547 L3,107.185547 L3,9 Z M93.1855469,100.603516 L93.1855469,19 L135.211914,19 C143.004922,19 148.960917,19.6679621 153.080078,21.0039063 C157.199239,22.3398504 160.520495,24.8168764 163.043945,28.4350586 C165.567395,32.0532407 166.829102,36.459935 166.829102,41.6552734 C166.829102,46.1826398 165.864267,50.0883625 163.93457,53.3725586 C162.004873,56.6567547 159.351579,59.3193257 155.974609,61.3603516 C153.822255,62.6591862 150.872089,63.7353473 147.124023,64.5888672 C150.129898,65.5908253 152.319329,66.5927684 153.692383,67.5947266 C154.620122,68.2626987 155.965323,69.6913953 157.728027,71.8808594 C159.490731,74.0703234 160.668942,75.7587831 161.262695,76.9462891 L173,100.603516 L144.953125,100.603516 L131.482422,75.6660156 C129.775382,72.4374839 128.253913,70.3408251 126.917969,69.3759766 C125.0996,68.1142515 123.040051,67.4833984 120.739258,67.4833984 L118.512695,67.4833984 L118.512695,100.603516 L93.1855469,100.603516 Z M118.512695,52.0644531 L129.144531,52.0644531 C130.294928,52.0644531 132.521468,51.6933631 135.824219,50.9511719 C137.494149,50.6171858 138.857905,49.7636787 139.915527,48.390625 C140.97315,47.0175713 141.501953,45.4404386 141.501953,43.6591797 C141.501953,41.0244009 140.667001,39.0019602 138.99707,37.5917969 C137.32714,36.1816336 134.191429,35.4765625 129.589844,35.4765625 L117.512695,35.4765625 L118.512695,52.0644531 Z"
        transform="translate(0 9)"
      ></path>
    </svg>
  );
}

export function BoldIcon({ className }: Props) {
  return (
    <svg className={cn(className)} role="img" viewBox="0 0 384 512">
      <path
        fill="currentColor"
        d="M304.793 243.891c33.639-18.537 53.657-54.16 53.657-95.693 0-48.236-26.25-87.626-68.626-104.179C265.138 34.01 240.849 32 209.661 32H24c-8.837 0-16 7.163-16 16v33.049c0 8.837 7.163 16 16 16h33.113v318.53H24c-8.837 0-16 7.163-16 16V464c0 8.837 7.163 16 16 16h195.69c24.203 0 44.834-1.289 66.866-7.584C337.52 457.193 376 410.647 376 350.014c0-52.168-26.573-91.684-71.207-106.123zM142.217 100.809h67.444c16.294 0 27.536 2.019 37.525 6.717 15.828 8.479 24.906 26.502 24.906 49.446 0 35.029-20.32 56.79-53.029 56.79h-76.846V100.809zm112.642 305.475c-10.14 4.056-22.677 4.907-31.409 4.907h-81.233V281.943h84.367c39.645 0 63.057 25.38 63.057 63.057.001 28.425-13.66 52.483-34.782 61.284z"
      ></path>
    </svg>
  );
}

export function ItalicIcon({ className }: Props) {
  return (
    <svg className={cn(className)} role="img" viewBox="0 0 320 512">
      <path
        fill="currentColor"
        d="M204.758 416h-33.849l62.092-320h40.725a16 16 0 0 0 15.704-12.937l6.242-32C297.599 41.184 290.034 32 279.968 32H120.235a16 16 0 0 0-15.704 12.937l-6.242 32C96.362 86.816 103.927 96 113.993 96h33.846l-62.09 320H46.278a16 16 0 0 0-15.704 12.935l-6.245 32C22.402 470.815 29.967 480 40.034 480h158.479a16 16 0 0 0 15.704-12.935l6.245-32c1.927-9.88-5.638-19.065-15.704-19.065z"
      ></path>
    </svg>
  );
}

export function TitleIcon({ className }: Props) {
  return (
    <svg className={cn(className)} role="img" viewBox="0 0 520 520">
      <path
        fill="currentColor"
        d="M15.7083333,468 C7.03242448,468 0,462.030833 0,454.666667 L0,421.333333 C0,413.969167 7.03242448,408 15.7083333,408 L361.291667,408 C369.967576,408 377,413.969167 377,421.333333 L377,454.666667 C377,462.030833 369.967576,468 361.291667,468 L15.7083333,468 Z M21.6666667,366 C9.69989583,366 0,359.831861 0,352.222222 L0,317.777778 C0,310.168139 9.69989583,304 21.6666667,304 L498.333333,304 C510.300104,304 520,310.168139 520,317.777778 L520,352.222222 C520,359.831861 510.300104,366 498.333333,366 L21.6666667,366 Z M136.835938,64 L136.835937,126 L107.25,126 L107.25,251 L40.75,251 L40.75,126 L-5.68434189e-14,126 L-5.68434189e-14,64 L136.835938,64 Z M212,64 L212,251 L161.648438,251 L161.648438,64 L212,64 Z M378,64 L378,126 L343.25,126 L343.25,251 L281.75,251 L281.75,126 L238,126 L238,64 L378,64 Z M449.047619,189.550781 L520,189.550781 L520,251 L405,251 L405,64 L449.047619,64 L449.047619,189.550781 Z"
      ></path>
    </svg>
  );
}

export function StrikethroughIcon({ className }: Props) {
  return (
    <svg className={cn(className)} role="img" viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M496 288H16c-8.837 0-16-7.163-16-16v-32c0-8.837 7.163-16 16-16h480c8.837 0 16 7.163 16 16v32c0 8.837-7.163 16-16 16zm-214.666 16c27.258 12.937 46.524 28.683 46.524 56.243 0 33.108-28.977 53.676-75.621 53.676-32.325 0-76.874-12.08-76.874-44.271V368c0-8.837-7.164-16-16-16H113.75c-8.836 0-16 7.163-16 16v19.204c0 66.845 77.717 101.82 154.487 101.82 88.578 0 162.013-45.438 162.013-134.424 0-19.815-3.618-36.417-10.143-50.6H281.334zm-30.952-96c-32.422-13.505-56.836-28.946-56.836-59.683 0-33.92 30.901-47.406 64.962-47.406 42.647 0 64.962 16.593 64.962 32.985V136c0 8.837 7.164 16 16 16h45.613c8.836 0 16-7.163 16-16v-30.318c0-52.438-71.725-79.875-142.575-79.875-85.203 0-150.726 40.972-150.726 125.646 0 22.71 4.665 41.176 12.777 56.547h129.823z"
      ></path>
    </svg>
  );
}
export function LinkChainIcon({ className }: Props) {
  return (
    <svg className={cn(className)} role="img" viewBox="0 0 520 520">
      <path
        fill="currentColor"
        d="M331.751196,182.121107 C392.438214,241.974735 391.605313,337.935283 332.11686,396.871226 C332.005129,396.991316 331.873084,397.121413 331.751196,397.241503 L263.493918,464.491645 C203.291404,523.80587 105.345257,523.797864 45.151885,464.491645 C-15.0506283,405.187427 -15.0506283,308.675467 45.151885,249.371249 L82.8416853,212.237562 C92.836501,202.39022 110.049118,208.9351 110.56511,222.851476 C111.223305,240.5867 114.451306,258.404985 120.407566,275.611815 C122.424812,281.438159 120.983487,287.882964 116.565047,292.23621 L103.272145,305.332975 C74.8052033,333.379887 73.9123737,379.047937 102.098973,407.369054 C130.563883,435.969378 177.350591,436.139505 206.033884,407.879434 L274.291163,340.6393 C302.9257,312.427264 302.805844,266.827265 274.291163,238.733318 C270.531934,235.036561 266.74528,232.16442 263.787465,230.157924 C259.544542,227.2873 256.928256,222.609848 256.731165,217.542518 C256.328935,206.967633 260.13184,196.070508 268.613213,187.714278 L289.998463,166.643567 C295.606326,161.118448 304.403592,160.439942 310.906317,164.911276 C318.353355,170.034591 325.328531,175.793397 331.751196,182.121107 Z M240.704978,55.4828366 L172.447607,122.733236 C172.325719,122.853326 172.193674,122.983423 172.081943,123.103513 C117.703294,179.334654 129.953294,261.569283 185.365841,328.828764 C191.044403,335.721376 198.762988,340.914712 206.209732,346.037661 C212.712465,350.509012 221.510759,349.829503 227.117615,344.305363 L248.502893,323.234572 C256.984277,314.87831 260.787188,303.981143 260.384957,293.406218 C260.187865,288.338869 257.571576,283.661398 253.328648,280.790763 C250.370829,278.78426 246.58417,275.912107 242.824936,272.215337 C214.310216,244.121282 206.209732,204.825874 229.906702,179.334654 L298.164073,112.094263 C326.847404,83.8340838 373.633159,84.0042113 402.099123,112.604645 C430.285761,140.92587 429.393946,186.594095 400.92595,214.641114 L387.63303,227.737929 C383.214584,232.091191 381.773257,238.536021 383.790506,244.362388 C389.746774,261.569283 392.974779,279.387637 393.632975,297.122928 C394.149984,311.039357 411.361608,317.584262 421.356437,307.736882 L459.046288,270.603053 C519.249898,211.29961 519.249898,114.787281 459.047304,55.4828366 C398.853851,-3.82360914 300.907572,-3.83161514 240.704978,55.4828366 Z"
      ></path>
    </svg>
  );
}
export function QuoteIcon({ className }: Props) {
  return (
    <svg className={cn(className)} role="img" viewBox="0 0 520 520">
      <path
        fill="currentColor"
        d="M520,95.75 L520,225.75 C520,364.908906 457.127578,437.050625 325.040469,472.443125 C309.577578,476.586875 294.396016,464.889922 294.396016,448.881641 L294.396016,414.457031 C294.396016,404.242891 300.721328,395.025078 310.328125,391.554687 C377.356328,367.342187 414.375,349.711094 414.375,274.5 L341.25,274.5 C314.325781,274.5 292.5,252.674219 292.5,225.75 L292.5,95.75 C292.5,68.8257812 314.325781,47 341.25,47 L471.25,47 C498.174219,47 520,68.8257812 520,95.75 Z M178.75,47 L48.75,47 C21.8257813,47 0,68.8257812 0,95.75 L0,225.75 C0,252.674219 21.8257813,274.5 48.75,274.5 L121.875,274.5 C121.875,349.711094 84.8563281,367.342187 17.828125,391.554687 C8.22132813,395.025078 1.89601563,404.242891 1.89601563,414.457031 L1.89601563,448.881641 C1.89601563,464.889922 17.0775781,476.586875 32.5404687,472.443125 C164.627578,437.050625 227.5,364.908906 227.5,225.75 L227.5,95.75 C227.5,68.8257812 205.674219,47 178.75,47 Z"
      ></path>
    </svg>
  );
}
export function CodeBlockIcon({ className }: Props) {
  return (
    <svg className={cn(className)} role="img" viewBox="0 0 640 512">
      <path
        fill="currentColor"
        d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z"
      ></path>
    </svg>
  );
}

export function ImageIcon({ className }: Props) {
  return (
    <svg className={cn(className)} role="img" viewBox="0 0 20 20">
      <path fill="currentColor" d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"></path>
    </svg>
  );
}

export function ListIcon({ className }: Props) {
  return (
    <svg className={cn(className)} role="img" viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M96 96c0 26.51-21.49 48-48 48S0 122.51 0 96s21.49-48 48-48 48 21.49 48 48zM48 208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm0 160c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm96-236h352c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h352c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h352c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
      ></path>
    </svg>
  );
}

export function OrderedListIcon({ className }: Props) {
  return (
    <svg className={cn(className)} role="img" viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M3.263 139.527c0-7.477 3.917-11.572 11.573-11.572h15.131V88.078c0-5.163.534-10.503.534-10.503h-.356s-1.779 2.67-2.848 3.738c-4.451 4.273-10.504 4.451-15.666-1.068l-5.518-6.231c-5.342-5.341-4.984-11.216.534-16.379l21.72-19.938C32.815 33.602 36.732 32 42.785 32H54.89c7.656 0 11.749 3.916 11.749 11.572v84.384h15.488c7.655 0 11.572 4.094 11.572 11.572v8.901c0 7.477-3.917 11.572-11.572 11.572H14.836c-7.656 0-11.573-4.095-11.573-11.572v-8.902zM2.211 304.591c0-47.278 50.955-56.383 50.955-69.165 0-7.18-5.954-8.755-9.28-8.755-3.153 0-6.479 1.051-9.455 3.852-5.079 4.903-10.507 7.004-16.111 2.451l-8.579-6.829c-5.779-4.553-7.18-9.805-2.803-15.409C13.592 201.981 26.025 192 47.387 192c19.437 0 44.476 10.506 44.476 39.573 0 38.347-46.753 46.402-48.679 56.909h39.049c7.529 0 11.557 4.027 11.557 11.382v8.755c0 7.354-4.028 11.382-11.557 11.382h-67.94c-7.005 0-12.083-4.028-12.083-11.382v-4.028zM5.654 454.61l5.603-9.28c3.853-6.654 9.105-7.004 15.584-3.152 4.903 2.101 9.63 3.152 14.359 3.152 10.155 0 14.358-3.502 14.358-8.23 0-6.654-5.604-9.106-15.934-9.106h-4.728c-5.954 0-9.28-2.101-12.258-7.88l-1.05-1.926c-2.451-4.728-1.226-9.806 2.801-14.884l5.604-7.004c6.829-8.405 12.257-13.483 12.257-13.483v-.35s-4.203 1.051-12.608 1.051H16.685c-7.53 0-11.383-4.028-11.383-11.382v-8.755c0-7.53 3.853-11.382 11.383-11.382h58.484c7.529 0 11.382 4.027 11.382 11.382v3.327c0 5.778-1.401 9.806-5.079 14.183l-17.509 20.137c19.611 5.078 28.716 20.487 28.716 34.845 0 21.363-14.358 44.126-48.503 44.126-16.636 0-28.192-4.728-35.896-9.455-5.779-4.202-6.304-9.805-2.626-15.934zM144 132h352c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h352c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h352c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
      ></path>
    </svg>
  );
}
export function CheckListIcon({ className }: Props) {
  return (
    <svg className={cn(className)} role="img" viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M208 132h288c8.8 0 16-7.2 16-16V76c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16zm0 160h288c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16zm0 160h288c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16zM64 368c-26.5 0-48.6 21.5-48.6 48s22.1 48 48.6 48 48-21.5 48-48-21.5-48-48-48zm92.5-299l-72.2 72.2-15.6 15.6c-4.7 4.7-12.9 4.7-17.6 0L3.5 109.4c-4.7-4.7-4.7-12.3 0-17l15.7-15.7c4.7-4.7 12.3-4.7 17 0l22.7 22.1 63.7-63.3c4.7-4.7 12.3-4.7 17 0l17 16.5c4.6 4.7 4.6 12.3-.1 17zm0 159.6l-72.2 72.2-15.7 15.7c-4.7 4.7-12.9 4.7-17.6 0L3.5 269c-4.7-4.7-4.7-12.3 0-17l15.7-15.7c4.7-4.7 12.3-4.7 17 0l22.7 22.1 63.7-63.7c4.7-4.7 12.3-4.7 17 0l17 17c4.6 4.6 4.6 12.2-.1 16.9z"
      ></path>
    </svg>
  );
}
export function FullScreenIcon({ className }: Props) {
  return (
    <svg className={cn(className)} role="img" viewBox="0 0 520 520">
      <path
        fill="currentColor"
        d="M118 171.133334L118 342.200271C118 353.766938 126.675 365.333605 141.133333 365.333605L382.634614 365.333605C394.201281 365.333605 405.767948 356.658605 405.767948 342.200271L405.767948 171.133334C405.767948 159.566667 397.092948 148 382.634614 148L141.133333 148C126.674999 148 117.999999 156.675 118 171.133334zM465.353591 413.444444L370 413.444444 370 471.222222 474.0221 471.222222C500.027624 471.222222 520.254143 451 520.254143 425L520.254143 321 462.464089 321 462.464089 413.444444 465.353591 413.444444zM471.0221 43L367 43 367 100.777778 462.353591 100.777778 462.353591 196.111111 520.143647 196.111111 520.143647 89.2222219C517.254144 63.2222219 497.027624 43 471.0221 43zM57.7900547 100.777778L153.143646 100.777778 153.143646 43 46.2320439 43C20.2265191 43 0 63.2222219 0 89.2222219L0 193.222222 57.7900547 193.222222 57.7900547 100.777778zM57.7900547 321L0 321 0 425C0 451 20.2265191 471.222222 46.2320439 471.222223L150.254143 471.222223 150.254143 413.444445 57.7900547 413.444445 57.7900547 321z"
      ></path>
    </svg>
  );
}

export function EditPanelIcon({ className }: Props) {
  return (
    <svg className={cn(className)} role="img" viewBox="0 0 520 520">
      <polygon fill="currentColor" points="0 71.293 0 122 319 122 319 397 0 397 0 449.707 372 449.413 372 71.293"></polygon>
      <polygon fill="currentColor" points="429 71.293 520 71.293 520 122 481 123 481 396 520 396 520 449.707 429 449.413"></polygon>
    </svg>
  );
}

export function LivePanelIcon({ className }: Props) {
  return (
    <svg className={cn(className)} role="img" viewBox="0 0 520 520">
      <polygon fill="currentColor" points="0 71.293 0 122 179 122 179 397 0 397 0 449.707 232 449.413 232 71.293"></polygon>
      <polygon fill="currentColor" points="289 71.293 520 71.293 520 122 341 123 341 396 520 396 520 449.707 289 449.413"></polygon>
    </svg>
  );
}

export function PreviewPanelIcon({ className }: Props) {
  return (
    <svg className={cn(className)} role="img" viewBox="0 0 520 520">
      <polygon fill="currentColor" points="0 71.293 0 122 38.023 123 38.023 398 0 397 0 449.707 91.023 450.413 91.023 72.293"></polygon>
      <polygon fill="currentColor" points="148.023 72.293 520 71.293 520 122 200.023 124 200.023 397 520 396 520 449.707 148.023 450.413"></polygon>
    </svg>
  );
}
