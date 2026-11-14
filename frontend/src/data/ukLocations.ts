type CityLocation = {
  position: [number, number];
  region: string;
};

export const ukLocations: Record<string, CityLocation> = {
  Manchester: {
    position: [53.4808, -2.2426],
    region: "North West",
  },
  London: {
    position: [51.5074, -0.1278],
    region: "London",
  },
  Glasgow: {
    position: [55.8642, -4.2518],
    region: "Scotland",
  },
  Birmingham: {
    position: [52.4862, -1.8904],
    region: "West Midlands",
  },
  Southampton: {
    position: [50.9097, -1.4044],
    region: "South East",
  },
  Nottingham: {
    position: [52.9548, -1.1581],
    region: "East Midlands",
  },
  Sheffield: {
    position: [53.3811, -1.4701],
    region: "Yorkshire and The Humber",
  },
  Liverpool: {
    position: [53.4084, -2.9916],
    region: "North West",
  },
  Edinburgh: {
    position: [55.9533, -3.1883],
    region: "Scotland",
  },
  Newcastle: {
    position: [54.9783, -1.6178],
    region: "North East",
  },
  Leicester: {
    position: [52.6369, -1.1398],
    region: "East Midlands",
  },
  Bristol: {
    position: [51.4545, -2.5879],
    region: "South West",
  },
  Cardiff: {
    position: [51.4816, -3.1791],
    region: "Wales",
  },
  Leeds: {
    position: [53.8008, -1.5491],
    region: "Yorkshire and The Humber",
  },
};

export const cityCoordinates: Record<string, [number, number]> = {};

for (const city in ukLocations) {
  cityCoordinates[city] = ukLocations[city].position;
}