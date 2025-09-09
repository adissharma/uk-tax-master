export function Header() {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <a
        href="#main-content" 
        className="skip-link"
      >
        Skip to main content
      </a>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
          <h1 className="heading-xl text-foreground mb-0">
            UK Salary Calculator 2024-2025
          </h1>
        </div>
      </div>
    </header>
  );
}