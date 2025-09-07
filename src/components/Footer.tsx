export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-black mb-3">About</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-600 hover:text-black">
                  How it works
                </a>
              </li>
              <li>
                <a href="#methodology" className="text-gray-600 hover:text-black">
                  Methodology
                </a>
              </li>
              <li>
                <a href="#accuracy" className="text-gray-600 hover:text-black">
                  Accuracy & Updates
                </a>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="font-semibold text-black mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#privacy" className="text-gray-600 hover:text-black">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-600 hover:text-black">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#cookies" className="text-gray-600 hover:text-black">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-semibold text-black mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#contact" className="text-gray-600 hover:text-black">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#feedback" className="text-gray-600 hover:text-black">
                  Feedback
                </a>
              </li>
              <li>
                <a href="#help" className="text-gray-600 hover:text-black">
                  Help & FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2024 whatismypay.co.uk. All rights reserved.
            </p>
            <p className="text-sm text-gray-600 mt-2 md:mt-0">
              Tax year 2024-25 • Updated April 2024
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}