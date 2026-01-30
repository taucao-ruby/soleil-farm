/**
 * Create Cycle Wizard
 * ====================
 * Multi-step wizard for creating crop cycles
 */

import { useState, useCallback } from 'react';
import {
  MapPin,
  Sprout,
  Calendar,
  Clock,
  ListChecks,
  Check,
  X,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import { Step1SelectParcel } from './Step1SelectParcel';
import { Step2SelectCrop } from './Step2SelectCrop';
import { Step3SelectSeason } from './Step3SelectSeason';
import { Step4SetDates } from './Step4SetDates';
import { Step5ConfigureStages } from './Step5ConfigureStages';
import {
  WIZARD_STEPS,
  initialWizardData,
  type WizardFormData,
  type WizardStepId,
} from './types';
import { useCreateCropCycleWizard } from '../../hooks/useCropCycles';

// Icon mapping
const STEP_ICONS: Record<string, React.ReactNode> = {
  'map-pin': <MapPin className="h-5 w-5" />,
  'sprout': <Sprout className="h-5 w-5" />,
  'calendar': <Calendar className="h-5 w-5" />,
  'clock': <Clock className="h-5 w-5" />,
  'list-checks': <ListChecks className="h-5 w-5" />,
};

interface StepIndicatorProps {
  steps: typeof WIZARD_STEPS;
  currentStep: WizardStepId;
  completedSteps: Set<WizardStepId>;
}

function StepIndicator({ steps, currentStep, completedSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = completedSteps.has(step.id);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                  isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : isActive
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  STEP_ICONS[step.icon]
                )}
              </div>
              <div className="mt-2 text-center hidden sm:block">
                <p
                  className={cn(
                    'text-xs font-medium',
                    isActive || isCompleted
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </p>
              </div>
            </div>
            {!isLast && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2',
                  isCompleted ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface CreateCycleWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (cycleId: number) => void;
}

export function CreateCycleWizard({
  open,
  onOpenChange,
  onSuccess,
}: CreateCycleWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStepId>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<WizardStepId>>(new Set());
  const [formData, setFormData] = useState<WizardFormData>(initialWizardData);

  const createMutation = useCreateCropCycleWizard();

  const handleUpdate = useCallback((updates: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleNext = useCallback(() => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep((currentStep + 1) as WizardStepId);
    } else {
      // Submit form
      handleSubmit();
    }
  }, [currentStep]);

  const handlePrev = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStepId);
    }
  }, [currentStep]);

  const handleSubmit = async () => {
    if (!formData.land_parcel_id || !formData.crop_type_id || !formData.season_id) {
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        land_parcel_id: formData.land_parcel_id,
        crop_type_id: formData.crop_type_id,
        season_id: formData.season_id,
        name: formData.name,
        planned_start_date: formData.planned_start_date,
        planned_end_date: formData.planned_end_date,
        expected_yield: formData.expected_yield,
        yield_unit_id: formData.yield_unit_id,
        notes: formData.notes,
        stages: formData.stages,
      });

      // Reset and close
      handleReset();
      onOpenChange(false);
      onSuccess?.(result.id);
    } catch {
      // Error handled by mutation
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setCompletedSteps(new Set());
    setFormData(initialWizardData);
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  const renderStep = () => {
    const stepProps = {
      data: formData,
      onUpdate: handleUpdate,
      onNext: handleNext,
      onPrev: handlePrev,
      isFirstStep: currentStep === 1,
      isLastStep: currentStep === WIZARD_STEPS.length,
    };

    switch (currentStep) {
      case 1:
        return <Step1SelectParcel {...stepProps} />;
      case 2:
        return <Step2SelectCrop {...stepProps} />;
      case 3:
        return <Step3SelectSeason {...stepProps} />;
      case 4:
        return <Step4SetDates {...stepProps} />;
      case 5:
        return <Step5ConfigureStages {...stepProps} />;
      default:
        return null;
    }
  };

  const currentStepInfo = WIZARD_STEPS.find((s) => s.id === currentStep);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Tạo chu kỳ canh tác mới</DialogTitle>
              <DialogDescription>
                Bước {currentStep} / {WIZARD_STEPS.length}: {currentStepInfo?.description}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Step indicator */}
        <div className="py-6 border-b">
          <StepIndicator
            steps={WIZARD_STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </div>

        {/* Step content */}
        <div className="py-6 min-h-[400px]">
          {createMutation.isPending ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Đang tạo chu kỳ canh tác...</p>
            </div>
          ) : (
            renderStep()
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
