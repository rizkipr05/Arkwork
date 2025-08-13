export default function HomePage() {
  return (
    <>
      <section
        className="min-h-screen flex items-center text-white"
        style={{
          backgroundImage:
            `linear-gradient(rgba(19,74,145,.7), rgba(19,74,145,.7)),url("data:image/svg+xml,${encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'><rect fill='#e5e7eb' width='1200' height='600'/><g fill='#134a91' opacity='0.1'><circle cx='200' cy='150' r='80'/><circle cx='800' cy='200' r='60'/><circle cx='1000' cy='400' r='100'/><rect x='300' y='300' width='200' height='150' rx='10'/><rect x='600' y='100' width='150' height='200' rx='10'/></g></svg>`
            )}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Build Your Career in the National Energy & Oil & Gas Industry</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">Find the latest jobs, tenders, and trainings only on ArkWork</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/jobs" className="px-8 py-4 bg-brand-blue text-white rounded-lg text-lg font-semibold hover:bg-brand-blue-light text-center">Browse Jobs</a>
            <button className="px-8 py-4 bg-brand-yellow text-white rounded-lg text-lg font-semibold hover:bg-yellow-600">For Employers</button>
          </div>
        </div>
      </section>

      <section className="bg-brand-blue py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">We simplify nationwide hiring for your technical projects.</h2>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto">Beyond payroll services, ArkWork brings experience, expertise, and nationwide reach to help you get the best results.</p>
        </div>
      </section>
    </>
  )
}
