import SeasonalChart from '../assets/components/SeasonalChart'

const species = [
  {
    name: 'Sheep tick',
    latinName: 'Ixodes ricinus',
    size: '3–3.6 mm',
    habitat: 'Woodland, moorland, grassland',
    concern: 'Lyme disease risk',
    image: '/images/ticks/sheep-tick.jpg',
    credit: 'Amada44, CC BY-SA 4.0',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Gemeiner_Holzbock_-_Ixodes_ricinus_-_3327.jpg',
  },
  {
    name: 'Hedgehog tick',
    latinName: 'Ixodes hexagonus',
    size: '3.5–4 mm',
    habitat: 'Gardens, pets in towns',
    concern: 'Bites pets and people',
    image: '/images/ticks/hedgehog-tick.jpg',
    credit: 'André Karwath, CC BY-SA 2.5',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Ixodes_hexagonus_(aka).jpg',
  },
  {
    name: 'Ornate dog tick',
    latinName: 'Dermacentor reticulatus',
    size: '3.8–4.2 mm',
    habitat: 'Coastal Wales, Essex',
    concern: 'Dangerous for dogs',
    image: '/images/ticks/ornate-dog-tick.jpg',
    credit: 'Christian Fischer, CC BY-SA 4.0',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:DermacentorReticulatus_CF.jpg',
  },
  {
    name: 'Brown dog tick',
    latinName: 'Rhipicephalus sanguineus',
    size: '3–4.5 mm',
    habitat: 'Indoors, travelled dogs',
    concern: 'Can infest homes',
    image: '/images/ticks/brown-dog-tick.jpg',
    credit: 'Alan R Walker, CC BY-SA 3.0',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Rhipicephalus-sanguineus-female.JPG',
  },
]

const petTips = [
  'Check your pet after outdoor activity.',
  'Check ears, neck, skin folds and between toes.',
  'Ask your vet about suitable tick prevention.',
  'Remove ticks promptly with a tick-removal tool.',
]

const peopleTips = [
  'Cover skin; tuck trousers into socks.',
  'Use insect repellent as directed on the label.',
  'Keep to clear paths where possible.',
  'Check skin and clothing after being outdoors.',
]

export default function Learn() {
  return (
    <div className="min-h-dvh bg-white">
      <main className="mx-auto max-w-[1200px] px-6 py-10 lg:px-10">
        <section>
          <h1 className="text-title text-3xl font-bold">
            Ticks in the UK
          </h1>

          <p className="text-text mt-3 max-w-[760px] text-base leading-6">
            Learn to recognise ticks, understand seasonal activity, and
            protect yourself and your pets.
            <br />
            Ticks can be active throughout the year, especially in mild,
            damp conditions.
          </p>
        </section>

        <section className="mt-9">
          <h2 className="text-title text-2xl font-bold">
            Identify tick species
          </h2>

          <p className="text-text mt-2 text-base">
            Sizes are for adults before feeding. Use this as a rough guide only.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {species.map((tick) => (
              <article
                key={tick.name}
                className="flex flex-col rounded-[4px] border border-[#BDBDBD] bg-white p-4"
              >
                <img
                  src={tick.image}
                  alt={`${tick.name} (${tick.latinName})`}
                  className="h-[160px] w-full object-contain"
                />

                <h3 className="text-title mt-4 text-lg font-semibold">
                  {tick.name}
                </h3>
                <p className="text-text text-sm italic">{tick.latinName}</p>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex gap-2">
                    <dt className="text-text w-[70px] shrink-0">Size</dt>
                    <dd className="text-title">{tick.size}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-text w-[70px] shrink-0">Found in</dt>
                    <dd className="text-title">{tick.habitat}</dd>
                  </div>
                </dl>

                <div className="mt-auto pt-4">
                  <p className="text-title inline-block rounded-full bg-[#F2F2F2] px-3 py-1 text-sm font-medium">
                    {tick.concern}
                  </p>

                  <a
                    href={tick.creditUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text mt-4 block text-xs underline"
                  >
                    Photo: {tick.credit}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-title text-2xl font-bold">
            Seasonal tick activity
          </h2>

          <SeasonalChart />
        </section>

        <section className="mt-12">
          <h2 className="text-title text-2xl font-bold">
            How to prevent tick bites
          </h2>

          <div className="mt-5 grid gap-7 md:grid-cols-2 md:gap-12">
            <div>
              <h3 className="text-title text-lg font-semibold">
                For pets
              </h3>

              <ul className="mt-4 space-y-4">
                {petTips.map((tip) => (
                  <li
                    key={tip}
                    className="text-title flex items-start gap-3 text-base leading-6"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#888888] text-sm"
                    >
                      ✓
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-title text-lg font-semibold">
                For people
              </h3>

              <ul className="mt-4 space-y-4">
                {peopleTips.map((tip) => (
                  <li
                    key={tip}
                    className="text-title flex items-start gap-3 text-base leading-6"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#888888] text-sm"
                    >
                      ✓
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <a
            href="https://www.nhs.uk/conditions/lyme-disease/"
            className="text-title mt-8 block rounded-[4px] border border-[#A6A6A6] bg-[#F2F2F2] px-5 py-4 text-base hover:bg-[#E8E8E8]"
          >
            Found a tick? How to remove it safely →
          </a>

        </section>
      </main>

      <footer className="mt-5 bg-[#F2F2F2]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-6 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p className="text-text text-base">
            Help build a clearer picture of tick activity across the UK.
          </p>

          <a
            href="/report"
            className="shrink-0 rounded-[4px] bg-[#383838] px-8 py-3 text-base text-white hover:bg-[#262626]"
          >
            Seen a tick? Report a sighting
          </a>
        </div>
      </footer>
    </div>
  )
}