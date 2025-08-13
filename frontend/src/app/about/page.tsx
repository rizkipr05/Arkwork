export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            About <span className="text-blue-600">ArkWork</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ArkWork is an innovative platform that connects job opportunities, tenders, 
            and industry news with professionals and businesses across the energy sector.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become the leading bridge between talented professionals, companies, 
              and business opportunities—creating a collaborative ecosystem that drives 
              economic growth and innovation.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Provide easy access to the latest job openings and tenders.</li>
              <li>Help companies find the right talents efficiently.</li>
              <li>Deliver reliable and relevant industry news.</li>
              <li>Foster collaboration between industry players and professionals.</li>
            </ul>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Integrity", desc: "We uphold honesty and transparency in all aspects of our work." },
              { title: "Innovation", desc: "We continuously adapt and create creative solutions for market needs." },
              { title: "Collaboration", desc: "We believe in the power of synergy between individuals and organizations." },
              { title: "Quality", desc: "We are committed to delivering the best services to our users." },
            ].map((value, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing */}
        <div className="text-center bg-blue-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join ArkWork Today</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-6">
            Whether you are a professional seeking new opportunities or a company 
            looking to hire top talent, ArkWork is the right place to start.
          </p>
          <a
            href="/jobs"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Explore Opportunities
          </a>
        </div>
      </div>
    </div>
  )
}
