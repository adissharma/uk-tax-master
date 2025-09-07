export function GOVUKFooter() {
  return (
    <footer className="bg-govuk-light-grey border-t-4 border-govuk-mid-grey mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Links */}
          <div>
            <h2 className="font-bold text-lg mb-4">Support and guidance</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-govuk-blue hover:text-govuk-black underline">
                  Methodology & data sources
                </a>
              </li>
              <li>
                <a href="#" className="text-govuk-blue hover:text-govuk-black underline">
                  About this calculator
                </a>
              </li>
              <li>
                <a href="#" className="text-govuk-blue hover:text-govuk-black underline">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#" className="text-govuk-blue hover:text-govuk-black underline">
                  Give feedback
                </a>
              </li>
            </ul>
          </div>
          
          {/* Version info */}
          <div>
            <h2 className="font-bold text-lg mb-4">Tax year information</h2>
            <ul className="space-y-2">
              <li className="text-govuk-dark-grey">
                Current tax year: 2024-25
              </li>
              <li className="text-govuk-dark-grey">
                Rates updated: April 2024
              </li>
              <li className="text-govuk-dark-grey">
                Calculator version: 1.0.0
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-govuk-mid-grey mt-8 pt-8">
          <p className="text-sm text-govuk-dark-grey">
            All content is available under the{' '}
            <a href="#" className="text-govuk-blue hover:text-govuk-black underline">
              Open Government Licence v3.0
            </a>
            , except where otherwise stated
          </p>
          <p className="text-sm text-govuk-dark-grey mt-2">
            Built using the GOV.UK Design System
          </p>
        </div>
      </div>
    </footer>
  );
}