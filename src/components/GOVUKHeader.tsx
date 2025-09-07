export function GOVUKHeader() {
  return (
    <header className="bg-govuk-black text-white">
      {/* Skip link */}
      <a 
        href="#main-content" 
        className="govuk-skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-govuk-yellow focus:text-govuk-black focus:no-underline"
      >
        Skip to main content
      </a>
      
      {/* GOV.UK Crown and text */}
      <div className="border-b-4 border-govuk-yellow">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex items-center gap-2">
            {/* Crown icon placeholder - you could add the actual GOV.UK crown SVG here */}
            <div className="w-8 h-8 bg-govuk-yellow rounded-sm flex items-center justify-center">
              <span className="text-govuk-black font-bold text-sm">👑</span>
            </div>
            <span className="font-bold text-lg">GOV.UK</span>
          </div>
        </div>
      </div>
      
      {/* Service name */}
      <div className="bg-govuk-blue">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white m-0">
            Salary Calculator
          </h1>
        </div>
      </div>
    </header>
  );
}