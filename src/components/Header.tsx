export function Header() {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <a
        href="#main-content" 
        className="skip-link"
      >
        Skip to main content
      </a>
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/bf032563-ad79-4edf-9dd6-386b1866e55e.png" 
            alt="whatismypay.co.uk"
            className="h-20"
          />
        </div>
      </div>
    </header>
  );
}