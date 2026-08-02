export function Footer() {
  return (
    <footer className="bg-wood-800 text-wood-200">
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-8 sm:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold text-wood-50 mb-2">YourCompany</h3>
          <p className="text-sm leading-relaxed text-wood-300">
            Craftsmanship in wood. Precision in renovation.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-wood-50 uppercase tracking-wide mb-3">
            Services
          </h4>
          <ul className="space-y-1 text-sm text-wood-300">
            <li>Custom Furniture</li>
            <li>Kitchen Renovations</li>
            <li>Decking &amp; Fencing</li>
            <li>Interior Fit-outs</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-wood-50 uppercase tracking-wide mb-3">
            Contact
          </h4>
          <ul className="space-y-1 text-sm text-wood-300">
            <li>hello@yourcompany.com</li>
            <li>+48 123 456 789</li>
            <li>Warsaw, Poland</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-wood-700 text-center text-xs text-wood-400 py-4">
        &copy; {new Date().getFullYear()} YourCompany. All rights reserved.
      </div>
    </footer>
  );
}
