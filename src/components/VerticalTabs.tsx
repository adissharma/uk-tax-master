import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface VerticalTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function VerticalTabs({ tabs, activeTab, onTabChange, className }: VerticalTabsProps) {
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
                'block w-full text-left px-4 py-3 text-base font-medium border-l-4 transition-colors',
                'focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-0',
                activeTab === tab.id
                  ? 'border-govuk-blue bg-govuk-light-blue text-govuk-blue'
                  : 'border-transparent text-govuk-black hover:border-govuk-mid-grey hover:bg-govuk-light-grey'
              )}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
            >
              {tab.label}
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