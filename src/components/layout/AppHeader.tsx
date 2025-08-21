import { ReactNode } from 'react';
import { Video } from 'lucide-react';

interface AppHeaderProps {
    rightSlot?: ReactNode;
}

export default function AppHeader({ rightSlot }: AppHeaderProps) {
    return (
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 gradient-primary rounded-lg">
                            <Video className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">AI Video Search Assistant</h1>
                            <p className="text-sm text-muted-foreground">Know-Item Search for Video Database</p>
                        </div>
                    </div>
                    {rightSlot && (
                        <div className="flex items-center gap-2 ml-auto">
                            {rightSlot}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}


