export function MaterialFooter() {
  return (
    <footer className="bg-md-surface-container border-t border-md-outline-variant mt-12">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Support and guidance */}
          <div>
            <h3 className="title-medium text-md-on-surface mb-4">Support and guidance</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-md-primary hover:text-md-primary-hover underline body-medium">
                  How to use this calculator
                </a>
              </li>
              <li>
                <a href="#" className="text-md-primary hover:text-md-primary-hover underline body-medium">
                  Understanding your payslip
                </a>
              </li>
              <li>
                <a href="#" className="text-md-primary hover:text-md-primary-hover underline body-medium">
                  Tax and National Insurance rates
                </a>
              </li>
              <li>
                <a href="#" className="text-md-primary hover:text-md-primary-hover underline body-medium">
                  Contact HMRC
                </a>
              </li>
            </ul>
          </div>
          
          {/* Tax year information */}
          <div>
            <h3 className="title-medium text-md-on-surface mb-4">Tax year information</h3>
            <ul className="space-y-2">
              <li className="text-md-on-surface-variant body-medium">
                Current tax year: 2024-25
              </li>
              <li className="text-md-on-surface-variant body-medium">
                Rates updated: April 2024
              </li>
              <li className="text-md-on-surface-variant body-medium">
                Calculator version: 3.1.0
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright and licensing */}
        <div className="border-t border-md-outline-variant mt-8 pt-8">
          <p className="body-small text-md-on-surface-variant">
            Built with{' '}
            <a href="https://m3.material.io/" className="text-md-primary hover:text-md-primary-hover underline">
              Material Design 3
            </a>
            {' '}design system
          </p>
          
          <p className="body-small text-md-on-surface-variant mt-2">
            © 2024 Salary Calculator. This tool is for estimation purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}