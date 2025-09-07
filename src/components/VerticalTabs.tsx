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
        <div className="space-y-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className="w-full bg-white border-2 border-govuk-mid-grey hover:border-govuk-blue focus:border-govuk-yellow focus:ring-4 focus:ring-govuk-yellow focus:ring-offset-0 p-govuk-4 text-left transition-all active:scale-[0.98] touch-manipulation focus:outline-none"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-govuk-3">
                  <div className="flex items-center gap-govuk-2">
                    <h3 className="text-govuk-19 font-bold text-govuk-black leading-tight">
                      {tab.label}
                    </h3>
                    {(tab.isActive || savedTabs.has(tab.id)) && (
                      <div className="flex items-center gap-2">
                        {savedTabs.has(tab.id) && (
                          <Check className="w-4 h-4 text-govuk-green" />
                        )}
                        {tab.isActive && (
                          <span className="inline-flex items-center px-2 py-1 text-govuk-14 font-bold bg-govuk-blue text-white">
                            ACTIVE
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-govuk-dark-grey flex-shrink-0" />
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
              <SheetHeader className="flex-shrink-0 sticky top-0 z-10 bg-white border-b-2 border-govuk-mid-grey px-govuk-4 py-govuk-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-govuk-3">
                    <button
                      onClick={handleClose}
                      className="flex items-center justify-center h-8 w-8 border-2 border-govuk-mid-grey bg-white hover:border-govuk-blue focus:border-govuk-yellow focus:ring-4 focus:ring-govuk-yellow focus:ring-offset-0 focus:outline-none transition-colors"
                    >
                      <X className="h-4 w-4 text-govuk-black" />
                      <span className="sr-only">Close</span>
                    </button>
                    <SheetTitle className="text-govuk-24 font-bold text-govuk-black leading-tight">
                      {selectedTab.label}
                    </SheetTitle>
                  </div>
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 px-govuk-3 py-govuk-2 bg-govuk-green text-white font-bold border-2 border-govuk-green hover:bg-green-700 hover:border-green-700 focus:bg-govuk-yellow focus:text-govuk-black focus:border-govuk-black focus:ring-4 focus:ring-govuk-yellow focus:ring-offset-0 focus:outline-none transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    Save
                  </button>
                </div>
              </SheetHeader>
              
               <div className="flex-1 overflow-auto px-govuk-4 py-govuk-4 bg-govuk-light-grey">
                 {selectedTab.content}
               </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}