export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background pt-32 px-6 pb-20">
      <div className="container mx-auto max-w-4xl text-white space-y-8">
        <h1 className="serif text-4xl md:text-5xl font-bold text-center mb-12">Privacy <span className="text-primary italic">Policy</span></h1>
        
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="leading-relaxed mb-4">
              When you visit The Label, we may collect certain information about your device, your interaction with the site, and information necessary to process your purchases. This includes your name, billing address, shipping address, payment information, email address, and phone number.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="leading-relaxed mb-4">
              We use the order information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
            <p className="leading-relaxed mb-4">
              To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Your Rights</h2>
            <p className="leading-relaxed mb-4">
              If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
