type HeaderProps = {
  onReportSighting: () => void
}

export default function Header({ onReportSighting }: HeaderProps) {
  return (
    <header className="flex px-[32px] py-[25px] items-center justify-between border-b border-[#D4D4D4]">
      <h1 className="text-title text-[24px] font-bold">UK Tick Tracker</h1>
      <nav className="flex items-center gap-8 text-[16px] text-title font-bold">
        <a href="/">Map</a>
        <a href="/learn">Learn</a>
        <button
          type="button"
          onClick={onReportSighting}
          className="text-white bg-buttons px-[84px] py-[12px] rounded-[4px] ml-[24px]"
        >
          Report a Sighting
        </button>
      </nav>
    </header>
  )
}
