import Header from '../assets/components/Header'
import ReportSightingForm from '../assets/components/ReportSightingForm'

type ReportSightingProps = {
  onCancel: () => void
  onSubmitted: () => void
  speciesOptions: string[]
  initialPosition?: [number, number] | null
}

export default function ReportSighting({
  onCancel,
  onSubmitted,
  speciesOptions,
  initialPosition = null,
}: ReportSightingProps) {
  return (
    <div className="min-h-dvh bg-white">
      <Header onReportSighting={() => window.scrollTo({ top: 0 })} />

      <main className="mx-auto w-full max-w-[620px] px-6 py-10">
        <h1 className="text-title text-[28px] font-bold">
          Report a Tick Sighting
        </h1>

        <p className="text-text mt-3 text-[14px] leading-6">
          Your reports help pet owners and vets understand where ticks are
          active.
          <br />
          Share what you saw to help build a clearer picture across the UK.
        </p>

        <div className="mt-6">
          <ReportSightingForm
            onSubmitted={onSubmitted}
            onCancel={onCancel}
            speciesOptions={speciesOptions}
            initialPosition={initialPosition}
          />
        </div>
      </main>
    </div>
  )
}