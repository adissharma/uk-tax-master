export function MaterialHeader() {
  return (
    <header className="bg-md-primary-container text-md-on-primary-container elevation-2">
      {/* Skip link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-md-tertiary focus:text-md-on-tertiary focus:no-underline rounded-md focus:md-focus"
      >
        Skip to main content
      </a>
      
      {/* Material Design 3 styled header */}
      <div className="border-b border-md-outline-variant">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            {/* App icon placeholder */}
            <div className="w-10 h-10 bg-md-primary rounded-full flex items-center justify-center">
              <span className="text-md-on-primary font-medium text-lg">💰</span>
            </div>
            <div>
              <h1 className="headline-medium text-md-on-surface mb-0">
                Salary Calculator
              </h1>
              <p className="body-small text-md-on-surface-variant mb-0">
                Calculate your take-home pay
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}