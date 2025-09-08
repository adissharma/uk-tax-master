export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      {/* Skip link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-yellow-400 focus:text-black focus:no-underline"
      >
        Skip to main content
      </a>
      
      {/* Logo */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <img 
          src="/lovable-uploads/09f9d6fc-85f2-4e97-97bf-fc9a78aaeb62.png" 
          alt="whatismypay.co.uk"
          className="h-12"
        />
      </div>
    </header>
  );
}