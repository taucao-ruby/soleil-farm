/**
 * Crop Cycles Feature
 * ====================
 * Complete crop cycle management with:
 * - State machine workflow
 * - Multi-step creation wizard
 * - Gantt timeline view
 * - Detail page with actions
 */

// Pages
export {
  CropCyclesPage,
  CropCycleDetailPage,
  CropCycleGanttView,
} from './pages';

// Components
export {
  CreateCycleWizard,
  StatusBadge,
  LargeStatusIndicator,
  StateMachineVisualizer,
  StageProgressTimeline,
  CycleActionButtons,
  CycleFilters,
} from './components';

// Hooks
export {
  // State machine
  useCropCycleStateMachine,
  getAvailableTransitions,
  canTransition,
  isTerminalStatus,
  isCycleEditable,
  CROP_CYCLE_STATES,
  STATE_TRANSITIONS,
  // Validation
  validateDateRange,
  datesOverlap,
  calculateEndDate,
  canActivateCycle,
  canDeleteCycle,
  useCropCycleValidation,
  // Extended hooks
  useCropCyclesForGantt,
  useAvailableParcels,
  useCreateCropCycleWizard,
  useBatchActivate,
  useCropCycleStats,
} from './hooks';
