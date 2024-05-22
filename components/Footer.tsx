import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-12">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-8">
          <div>
            <img
              className="h-7"
              src="/img/logo.png"
              alt="Company name"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Solutions</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Custom Sewing</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Fabric Selection</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Design Services</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Workshops</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Documentation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Guides</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">API Reference</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Jobs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Press</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Partners</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Claim</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Terms</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;