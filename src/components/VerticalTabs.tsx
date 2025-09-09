import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { X } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { GOVUKButton } from '@/components/GOVUKButton';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  isActive?: boolean;
}

interface VerticalTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function VerticalTabs({ tabs, activeTab, onTabChange, className }: VerticalTabsProps) {
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<Tab | null>(null);
  
  // Force cache refresh

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && tabs.find(tab => tab.id === hash) && hash !== activeTab) {
        onTabChange(hash);
      }
    };

    // Set initial tab from URL hash only if different from current
    const initialHash = window.location.hash.slice(1);
    if (initialHash && tabs.find(tab => tab.id === initialHash) && initialHash !== activeTab) {
      onTabChange(initialHash);
    }
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [tabs, activeTab]); // Remove onTabChange from dependencies to prevent re-runs

  const handleKeyDown = (event: React.KeyboardEvent, tabId: string) => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowDown':
        event.preventDefault();
        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = tabs.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onTabChange(tabId);
        return;
    }

    const newTab = tabs[newIndex];
    if (newTab) {
      onTabChange(newTab.id);
      // Focus the new tab button
      const newButton = document.querySelector(`[data-tab-id="${newTab.id}"]`) as HTMLButtonElement;
      newButton?.focus();
    }
  };

  const handleTabClick = (tab: Tab) => {
    setSelectedTab(tab);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedTab(null);
  };

  const handleSave = () => {
    if (selectedTab) {
      onTabChange(selectedTab.id);
    }
    handleDrawerClose();
  };

  // Mobile vertical tabs layout with drawer
  if (isMobile) {
    return (
      <>
        <div className={cn('w-full', className)}>
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className="w-full px-4 py-4 text-left border-l-4 border-govuk-light-grey bg-white hover:bg-govuk-light-grey focus:outline-none focus:ring-4 focus:ring-govuk-blue focus:ring-offset-0 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-govuk-black">{tab.label}</span>
                  <div className="flex items-center gap-2">
                    {tab.isActive && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-govuk-green text-white rounded">
                        Active
                      </span>
                    )}
                    <svg 
                      className="w-5 h-5 text-govuk-mid-grey" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent className="h-screen w-[90vw] fixed right-0 top-0 ml-[10vw] rounded-l-lg rounded-r-none border-0 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
            <div className="flex flex-col h-full">
              {/* Sticky Header */}
              <div className="sticky top-0 bg-white border-b border-govuk-light-grey px-4 py-3 flex items-center justify-between">
                <GOVUKButton
                  variant="link"
                  size="sm"
                  onClick={handleDrawerClose}
                  className="p-0 h-auto font-normal"
                >
                  <X className="w-5 h-5 mr-1" />
                  Close
                </GOVUKButton>
                
                <DrawerTitle className="text-lg font-bold text-govuk-black">
                  {selectedTab?.label}
                </DrawerTitle>
                
                <GOVUKButton
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                >
                  Save
                </GOVUKButton>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {selectedTab?.content}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // Desktop tab layout
  return (
    <div className={cn('flex flex-col lg:flex-row gap-8', className)}>
      {/* Tabs Navigation */}
      <nav 
        role="tablist" 
        aria-orientation="vertical"
        className="lg:w-80 flex-shrink-0"
      >
        <div className="border-l-4 border-govuk-light-grey">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-tab-id={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={cn(
                'block w-full text-left px-4 py-3 text-base font-medium border-l-4 transition-colors relative',
                'focus:outline-none focus:ring-4 focus:ring-govuk-blue focus:ring-offset-0',
                activeTab === tab.id
                  ? 'border-govuk-blue bg-govuk-light-blue text-govuk-blue'
                  : 'border-transparent text-govuk-black hover:border-govuk-mid-grey hover:bg-govuk-light-grey'
              )}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
            >
              <div className="flex items-center justify-between">
                <span>{tab.label}</span>
                {tab.isActive && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-govuk-green text-white rounded">
                    Active
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* Tab Content */}
      <main className="flex-1 min-w-0">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            className={activeTab === tab.id ? 'block' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </main>
    </div>
  );
}