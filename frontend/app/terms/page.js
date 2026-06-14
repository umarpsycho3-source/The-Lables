export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-32 px-6 pb-20">
      <div className="container mx-auto max-w-4xl text-white space-y-8">
        <h1 className="serif text-4xl md:text-5xl font-bold text-center mb-12">Terms & <span className="text-primary italic">Conditions</span></h1>
        
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. General Overview</h2>
            <p className="leading-relaxed mb-4">
              This website is operated by The Label. Throughout the site, the terms "we", "us" and "our" refer to The Label. We offer this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Online Store Terms</h2>
            <p className="leading-relaxed mb-4">
              By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Products or Services</h2>
            <p className="leading-relaxed mb-4">
              Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy. We have made every effort to display as accurately as possible the colors and images of our products that appear at the store.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Accuracy of Billing and Account Information</h2>
            <p className="leading-relaxed mb-4">
              We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
