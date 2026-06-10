export interface Chapter {
  id: string
  title: string
  subtitle: string
  description: string
  coordinates: { longitude: number; latitude: number }
  zoom: number
  pitch: number
  bearing: number
  mapStyle?: string
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'intro',
    title: 'Argentina',
    subtitle: 'A geographic journey',
    description:
      'Discover the geographic diversity of the eighth largest country in the world. From the tropical waterfalls of the north to the glaciers of the south, Argentina offers a mosaic of unique landscapes.',
    coordinates: { longitude: -64, latitude: -34 },
    zoom: 4,
    pitch: 30,
    bearing: 0,
  },
  {
    id: 'buenos-aires',
    title: 'Buenos Aires',
    subtitle: 'The Paris of South America',
    description:
      'Argentina’s largest capital, home to 15 million people in its metropolitan area. The economic, cultural and political center of the country. From Puerto Madero to La Boca, the city vibrates with tango, European architecture and world-class cuisine.',
    coordinates: { longitude: -58.38, latitude: -34.6 },
    zoom: 11,
    pitch: 45,
    bearing: -20,
  },
  {
    id: 'pampa',
    title: 'The Humid Pampas',
    subtitle: 'The breadbasket of the world',
    description:
      'The most productive agricultural region in Argentina. More than 30 million hectares dedicated to soy, corn, wheat and sunflower. This fertile plain accounts for 60% of the country’s exports and feeds millions of people around the world.',
    coordinates: { longitude: -61, latitude: -34 },
    zoom: 7,
    pitch: 20,
    bearing: 10,
  },
  {
    id: 'mendoza',
    title: 'Mendoza',
    subtitle: 'Land of Malbec',
    description:
      'At the foot of the Andes mountain range, Mendoza is the capital of Argentine wine. Its vineyards at over 1000 meters of altitude produce the famous Malbec. Aconcagua, the highest peak in the Americas at 6,962m, dominates the horizon.',
    coordinates: { longitude: -68.84, latitude: -32.89 },
    zoom: 10,
    pitch: 60,
    bearing: -30,
  },
  {
    id: 'patagonia',
    title: 'Patagonia',
    subtitle: 'The end of the world',
    description:
      'One of the most remote and spectacular regions on the planet. The Perito Moreno Glacier, turquoise lakes and endless steppes define this land of wind and adventure. Home to guanacos, condors and penguins.',
    coordinates: { longitude: -73.05, latitude: -50.5 },
    zoom: 9,
    pitch: 50,
    bearing: 20,
  },
  {
    id: 'noa',
    title: 'Argentine Northwest',
    subtitle: 'Colors of the Quebrada',
    description:
      'The Quebrada de Humahuaca, a World Heritage Site, unfolds hills of seven colors. The NOA is the pre-Hispanic cultural heart of Argentina, with salt flats, highland puna and the growing lithium triangle that promises to transform the regional economy.',
    coordinates: { longitude: -65.5, latitude: -23.5 },
    zoom: 9,
    pitch: 40,
    bearing: -15,
  },
]
