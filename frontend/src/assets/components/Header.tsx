export default function Header() {
  return (
    <header className="flex px-[32px] py-[25px] items-center justify-between border-b border-[#D4D4D4]">
      <h1 className="text-title text-2xl font-bold">UK Tick Tracker</h1>
      <nav className="flex items-center gap-8 text-base text-title font-bold">
        <a href="/">Map</a>
        <a href="/learn">Learn</a>
        <a
          href="/report"
          className="text-white bg-buttons px-[84px] py-[12px] rounded-[4px] ml-[24px]"
        >
          Report a Sighting
        </a>
      </nav>
    </header>
  )
}
