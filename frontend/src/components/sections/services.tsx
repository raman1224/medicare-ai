"use client"

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-32 text-shadow-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Services</h2>
          <p className="text-xl text-white text-secondary/70 max-w-2xl mx-auto">Comprehensive healthcare solutions for Nepal</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-white">
          <div className=" rounded-2xl p-8 border border-gray-border hover:shadow-lg transition">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mb-6">
              <span className="text-3xl">🏥</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Hospital Network</h3>
            <p className="text-gray-muted mb-6">
              Access to 500+ hospitals across Nepal with real-time bed availability and emergency services
            </p>
            <a href="/hospitals" className="text-primary font-semibold hover:text-primary-dark">
              Learn more →
            </a>
          </div>

          <div className=" rounded-2xl p-8 border border-gray-border hover:shadow-lg transition">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-light rounded-2xl flex items-center justify-center mb-6">
              <span className="text-3xl">👨‍⚕️</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Expert Doctors</h3>
            <p className="text-gray-muted mb-6">
              Connect with 1000+ verified healthcare professionals available for consultations
            </p>
            <a href="/doctors" className="text-primary font-semibold hover:text-primary-dark">
              Learn more →
            </a>
          </div>

          <div className=" rounded-2xl p-8 border border-gray-border hover:shadow-lg transition">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-light to-primary rounded-2xl flex items-center justify-center mb-6">
              <span className="text-3xl">🧬</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">AI Diagnostics</h3>
            <p className="text-gray-muted mb-6">Advanced AI-powered analysis for quick preliminary assessments</p>
            <a href="/chat" className="text-primary font-semibold hover:text-primary-dark">
              Learn more →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
