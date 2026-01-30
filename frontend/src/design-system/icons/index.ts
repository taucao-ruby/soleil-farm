/**
 * Soleil Farm Design System - Icons Index
 * =======================================
 * Export all custom icons and re-export lucide-react icons.
 */

// ===== CUSTOM FARM ICONS =====
export {
  FertilizerIcon,
  HarvestIcon,
  LandParcelIcon,
  SoilIcon,
  SeedlingIcon,
  IrrigationIcon,
  PestControlIcon,
  WeatherIcon,
  CropCycleIcon,
  YieldIcon,
  GreenhouseIcon,
  FarmWorkerIcon,
  WaterSourceIcon,
  PlowingIcon,
  SowingIcon,
  WeedingIcon,
  SeasonIcon,
  ActivityLogIcon,
  FarmIcons,
  type IconProps,
} from './FarmIcons';

// ===== RE-EXPORT LUCIDE ICONS =====
// Common icons used throughout the app
export {
  // Navigation
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  MoreHorizontal,
  MoreVertical,
  
  // Actions
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  Download,
  Upload,
  Copy,
  Clipboard,
  Check,
  RefreshCw,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  
  // Status
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  
  // Farm related (from lucide)
  Sprout,
  Leaf,
  TreePine,
  Trees,
  Flower2,
  
  // Water & Weather
  Droplets,
  Droplet,
  CloudRain,
  Sun,
  Cloud,
  Thermometer,
  Wind,
  
  // Farming activities
  Bug,
  Scissors,
  Shovel,
  
  // Equipment
  Tractor,
  Wrench,
  Settings,
  
  // Data & Analytics
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  
  // Calendar & Time
  Calendar,
  CalendarDays,
  CalendarClock,
  History,
  
  // Location
  MapPin,
  Map,
  Compass,
  
  // Users
  User,
  Users,
  UserPlus,
  
  // Files
  File,
  FileText,
  Folder,
  FolderOpen,
  Image,
  
  // Communication
  Bell,
  BellRing,
  MessageCircle,
  Mail,
  
  // UI Elements
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ExternalLink,
  Link,
  Share2,
  LogOut,
  LogIn,
  HelpCircle,
  
  // Misc
  Package,
  Box,
  Layers,
  Grid,
  List,
  Table2,
  Maximize,
  Minimize,
} from 'lucide-react';

// ===== ICON MAPPING FOR ACTIVITY TYPES =====
export const activityTypeIcons = {
  // Làm đất
  plowing: 'Shovel',
  // Gieo hạt
  sowing: 'Sprout',
  // Tưới tiêu
  irrigation: 'Droplets',
  // Bón phân
  fertilizing: 'Package',
  // Phun thuốc
  pesticide: 'Bug',
  // Làm cỏ
  weeding: 'Scissors',
  // Thu hoạch
  harvest: 'Package',
  // Kiểm tra
  inspection: 'Eye',
  // Other
  other: 'Clipboard',
} as const;

// ===== ICON MAPPING FOR STATUS =====
export const statusIcons = {
  available: 'CheckCircle',
  in_use: 'Clock',
  resting: 'Clock',
  maintenance: 'Wrench',
  planned: 'Calendar',
  active: 'Sprout',
  harvested: 'Package',
  completed: 'CheckCircle',
  failed: 'XCircle',
  cancelled: 'XCircle',
  pending: 'Clock',
  in_progress: 'Loader2',
  done: 'CheckCircle',
  skipped: 'Minus',
} as const;
