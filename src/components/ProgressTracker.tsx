import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Search } from 'lucide-react';

interface SearchStep {
  id: number;
  label: string;
  query: string;
  queryType: 'text' | 'video' | 'image';
  resultsCount: number;
  completed: boolean;
}

interface ProgressTrackerProps {
  searchHistory: SearchStep[];
  currentStep: number;
}

export default function ProgressTracker({ searchHistory, currentStep }: ProgressTrackerProps) {
  if (searchHistory.length === 0) return null;

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Search className="h-5 w-5" />
        <h3 className="font-semibold">Search Progress</h3>
        <Badge variant="secondary" className="ml-auto">
          Step {currentStep} of {searchHistory.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {searchHistory.map((step, index) => {
          const isActive = index === currentStep - 1;
          const isCompleted = step.completed;
          
          return (
            <div 
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-primary/5 border border-primary/20' : 'bg-muted/30'
              }`}
            >
              {/* Step Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-medium text-sm ${isActive ? 'text-primary' : 'text-foreground'}`}>
                    {step.label}
                  </span>
                  <Badge 
                    variant={step.queryType === 'text' ? 'default' : 'secondary'} 
                    className="text-xs"
                  >
                    {step.queryType}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground truncate mb-1">
                  Query: "{step.query}"
                </p>
                
                {isCompleted && (
                  <p className="text-xs text-muted-foreground">
                    Found {step.resultsCount} result{step.resultsCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Progress Line */}
              {index < searchHistory.length - 1 && (
                <div className="absolute left-8 mt-8 w-px h-4 bg-border"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{Math.round((currentStep / searchHistory.length) * 100)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary rounded-full h-2 transition-all duration-500"
            style={{ width: `${(currentStep / searchHistory.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}