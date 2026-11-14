export default function Sidebar() {
  return (
    <section className="p-[26px] w-[356px] shrink-0 border-r border-[#D4D4D4]">
      <h2 className="text-title text-[24px] font-bold">Filters</h2>
      <div className="grid grid-cols-2 gap-[15px] mt-[22px] pb-6 border-b border-[#D4D4D4]">
        <h2 className="text-title text-[14px] font-bold col-span-2">
          Date range
        </h2>
        <div className="flex flex-col gap-2 min-w-0">
          <label
            htmlFor="date-from"
            className="text-text text-[14px] font-medium"
          >
            From
          </label>
          <input
            id="date-from"
            className="w-full min-w-0 border border-[#A6A6A6] rounded-[4px] p-[10px]"
            type="date"
          />
          <button
            type="button"
            className="text-title w-full py-[15px] border border-[#A6A6A6] rounded-[4px]"
          >
            Last 7 days
          </button>
          <button
            type="button"
            className="text-title w-full py-[15px] border border-[#A6A6A6] rounded-[4px]"
          >
            This year
          </button>
        </div>

        <div className="flex flex-col gap-2 min-w-0">
          <label
            htmlFor="date-to"
            className="text-text text-[14px] font-medium"
          >
            To
          </label>
          <input
            id="date-to"
            className="w-full min-w-0 border border-[#A6A6A6] rounded-[4px] p-[10px]"
            type="date"
          />
          <button
            type="button"
            className="text-title w-full py-[15px] border border-[#A6A6A6] rounded-[4px]"
          >
            Last 30 days
          </button>
        </div>
      </div>
      <div className=" mt-[22px] pb-6 border-b border-[#D4D4D4]">
        <h2 className="text-title text-[14px] font-bold col-span-2">Species</h2>
        <select
          className="text-title w-full py-[15px] mt-6 mb-4 border border-[#A6A6A6] rounded-[4px]"
          name="species"
          id="species"
        >
          <option value="">All species</option>
        </select>
        <p className="text-text text-[12px]">Select one or more species</p>
      </div>
      <div className=" mt-[22px] pb-6 border-b flex flex-col gap-3 border-[#D4D4D4]">
        <h2 className="text-title text-[14px] font-bold col-span-2">
          Location
        </h2>
        <p className="text-text text-[12px]">Town, city or postcode</p>
        <input
          id="date-to"
          className="w-full min-w-0 border border-[#A6A6A6] rounded-[4px] p-[10px]"
          type="search"
          placeholder="Search location"
        />
        <button
          type="button"
          className="text-title w-full py-[15px] border border-[#A6A6A6] rounded-[4px]"
        >
          Use my location
        </button>

        <button
          type="button"
          className="text-title w-full py-[14px] underline underline-offset-4"
        >
          Reset Filters
        </button>
      </div>
      <div className=" mt-[22px] pb-6">
        <h2 className="text-title text-[14px] font-bold col-span-2">
          Showing 1,240 sightings
        </h2>
        <p className="text-text text-[12px]">Filters apply to the map</p>
      </div>
    </section>
  )
}
