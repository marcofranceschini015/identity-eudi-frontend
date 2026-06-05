export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <strong>EUDI Verify</strong>
          <p className="muted">
            A demo storefront showing how the EU Digital Identity Wallet can power
            instant, paperless onboarding for everyday products.
          </p>
        </div>
        <div className="site-footer__cols">
          <div>
            <h4>Products</h4>
            <ul>
              <li>Bank loan</li>
              <li>Rent a car</li>
              <li>Insurance (soon)</li>
            </ul>
          </div>
          <div>
            <h4>Trust</h4>
            <ul>
              <li>eIDAS 2.0</li>
              <li>Verifiable credentials</li>
              <li>Privacy by design</li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li>Apache-2.0 License</li>
              <li>Imprint</li>
              <li>Privacy</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="site-footer__bar">
        <div className="container">© {year} EUDI Verify — Demo project. Not a real financial service.</div>
      </div>
    </footer>
  );
}
