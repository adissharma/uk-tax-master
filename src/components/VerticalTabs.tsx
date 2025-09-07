import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight, X } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  isActive?: boolean;
  isSaved?: boolean;
}

interface VerticalTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function VerticalTabs({ tabs, activeTab, onTabChange, className }: VerticalTabsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<Tab | null>(null);
  const [savedTabs, setSavedTabs] = useState<Set<string>>(new Set());

  const handleTabClick = (tab: Tab) => {
    setSelectedTab(tab);
    setIsOpen(true);
    onTabChange(tab.id);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedTab(null);
  };

  const handleSave = () => {
    if (selectedTab) {
      setSavedTabs(prev => new Set(prev).add(selectedTab.id));
    }
    handleClose();
  };

  return (
    <>
      <div className={cn('w-full', className)}>
        <div className="space-y-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className="w-full bg-white border border-border rounded-lg p-6 text-left transition-all hover:shadow-md hover:border-primary/20 active:scale-[0.98] touch-manipulation"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {tab.label}
                    </h3>
                    {(tab.isActive || savedTabs.has(tab.id)) && (
                      <div className="flex items-center gap-2">
                        {savedTabs.has(tab.id) && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                        {tab.isActive && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          className="w-[90vw] sm:w-[90vw] md:w-[80vw] lg:w-[60vw] max-w-none p-0 flex flex-col"
        >
          {selectedTab && (
            <>
              <SheetHeader className="flex-shrink-0 sticky top-0 z-10 bg-background border-b px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClose}
                      className="h-8 w-8 rounded-full"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                    <SheetTitle className="text-xl font-semibold">
                      {selectedTab.label}
                    </SheetTitle>
                  </div>
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              </SheetHeader>
              
              <div className="flex-1 overflow-auto px-6 py-4">
                {selectedTab.content}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}