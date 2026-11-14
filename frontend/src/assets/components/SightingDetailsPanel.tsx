import type { Sighting } from '../../types/sighting'

type SightingDetailsPanelProps = {
  location: string
  sightings: Sighting[]
  onClose: () => void
}

export default function SightingDetailsPanel({
  location,
  sightings,
  onClose,
}: SightingDetailsPanelProps) {
  return (
    <section className="w-[400px] shrink-0 border-r border-[#D4D4D4] p-[26px]">
      <div className="flex items-center justify-between">
        <h2 className="text-title text-[24px] font-bold">
          {location} sightings
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sighting details"
          className="text-text flex h-9 w-9 shrink-0 items-center justify-center rounded hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="mt-[22px] grid grid-cols-2 gap-[15px] pb-6">
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-text text-[12px]">Species</p>
          <p className="text-title text-[14px] font-medium">Sheep tick</p>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-text text-[12px]">Date seen</p>
          <p className="text-title text-[14px] font-medium">9 Nov 2026</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-text text-[12px]">Location</p>
          <p className="text-title text-[14px] font-medium">{location}</p>
          <p className="text-text text-[12px]">
            {sightings.length} sightings · Approximate location, city centre
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-text text-[12px]">Reported by</p>
          <p className="text-title text-[14px] font-medium">Community</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-text text-[12px]">Notes</p>
          <p className="text-title text-[14px] font-medium">
            Found on a dog after a woodland walk. One tick removed.
          </p>
        </div>
      </div>

      <div className="mt-[22px] flex gap-2 border-b border-[#A6A6A6] pb-6">
        <button
          type="button"
          className="text-title flex-1 rounded-[4px] border border-[#A6A6A6] py-[15px]"
        >
          Get directions
        </button>
        <button
          type="button"
          className="text-title flex-1 rounded-[4px] border border-[#A6A6A6] py-[15px]"
        >
          Share
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-text text-[20px] font-bold">
          Activity in this area
        </h2>

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            className="text-title flex-1 rounded-[4px] border border-[#A6A6A6] py-[15px]"
          >
            Weekly
          </button>
          <button
            type="button"
            className="flex-1 rounded-[4px] border border-[#383838] bg-[#383838] py-[15px] text-white"
          >
            Monthly
          </button>
        </div>

        <div className="mt-5 border-b border-[#D4D4D4] pb-6">
          <p className="text-text text-[12px]">
            Sightings per month · last 12 months
          </p>

          <svg
            viewBox="0 0 340 100"
            className="mt-3 w-full"
            role="img"
            aria-label="Sample monthly sightings over the last twelve months"
          >
            {[0, 10, 20].map((value) => {
              const y = 70 - value * 3

              return (
                <g key={value}>
                  <text x="0" y={y + 3} fontSize="10" fill="#666666">
                    {value}
                  </text>
                  <line
                    x1="28"
                    y1={y}
                    x2="332"
                    y2={y}
                    stroke="#D4D4D4"
                    strokeWidth="1"
                  />
                </g>
              )
            })}

            <polyline
              points={[3, 2, 4, 7, 12, 17, 14, 18, 11, 8, 6, 4]
                .map((value, index) => {
                  const x = 28 + (index * 304) / 11
                  const y = 70 - value * 3
                  return `${x},${y}`
                })
                .join(' ')}
              fill="none"
              stroke="#484848"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {['D', 'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N'].map(
              (month, index) => (
                <text
                  key={index}
                  x={28 + (index * 304) / 11}
                  y="92"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#666666"
                >
                  {month}
                </text>
              ),
            )}
          </svg>
        </div>

        <div className="mt-5">
          <h3 className="text-title text-[18px] font-bold">
            Sightings in {location}
          </h3>

          <ul className="mt-2 divide-y divide-[#D4D4D4]">
            {sightings.map((sighting) => (
              <li
                key={sighting.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <span className="text-title text-[13px] font-medium">
                  {sighting.species || 'Unknown species'}
                </span>

                <span className="text-text text-[12px]">{sighting.date}</span>
              </li>
            ))}
          </ul>

          <a
            href="/learn"
            className="text-title mt-4 inline-block text-[14px] underline underline-offset-4"
          >
            How to identify this species →
          </a>
        </div>
      </div>
    </section>
  )
}
