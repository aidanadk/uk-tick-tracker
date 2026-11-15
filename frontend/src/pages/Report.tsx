import Header from '../assets/components/Header'
import ReportSightingForm from '../assets/components/ReportSightingForm'

export default function Report() {
  return (
    <div className="min-h-dvh bg-white">
      <Header />

      <main className="mx-auto w-full max-w-[620px] px-6 py-10">
        <h1 className="text-title text-3xl font-bold">
          Report a Tick Sighting
        </h1>

        <p className="text-text mt-3 text-base leading-6">
          Your reports help pet owners and vets understand where ticks are
          active. Share what you saw to help build a clearer picture across the
          UK.
        </p>

        <div className="mt-6">
          <ReportSightingForm />
        </div>
      </main>
    </div>
  )
}
