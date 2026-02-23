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
    subtitle: 'Un recorrido geográfico',
    description:
      'Descubrí la diversidad geográfica del octavo país más grande del mundo. Desde las cataratas tropicales del norte hasta los glaciares del sur, Argentina ofrece un mosaico de paisajes únicos.',
    coordinates: { longitude: -64, latitude: -34 },
    zoom: 4,
    pitch: 30,
    bearing: 0,
  },
  {
    id: 'buenos-aires',
    title: 'Buenos Aires',
    subtitle: 'La París de Sudamérica',
    description:
      'La capital más grande de Argentina, hogar de 15 millones de personas en su área metropolitana. Centro económico, cultural y político del país. Desde Puerto Madero hasta La Boca, la ciudad vibra con tango, arquitectura europea y una gastronomía de clase mundial.',
    coordinates: { longitude: -58.38, latitude: -34.6 },
    zoom: 11,
    pitch: 45,
    bearing: -20,
  },
  {
    id: 'pampa',
    title: 'La Pampa Húmeda',
    subtitle: 'El granero del mundo',
    description:
      'La región agrícola más productiva de Argentina. Más de 30 millones de hectáreas dedicadas a soja, maíz, trigo y girasol. Esta llanura fértil es responsable del 60% de las exportaciones del país y alimenta a millones de personas en todo el mundo.',
    coordinates: { longitude: -61, latitude: -34 },
    zoom: 7,
    pitch: 20,
    bearing: 10,
  },
  {
    id: 'mendoza',
    title: 'Mendoza',
    subtitle: 'Tierra del Malbec',
    description:
      'Al pie de la Cordillera de los Andes, Mendoza es la capital del vino argentino. Sus viñedos a más de 1000 metros de altura producen el famoso Malbec. El Aconcagua, el pico más alto de América con 6.962m, domina el horizonte.',
    coordinates: { longitude: -68.84, latitude: -32.89 },
    zoom: 10,
    pitch: 60,
    bearing: -30,
  },
  {
    id: 'patagonia',
    title: 'Patagonia',
    subtitle: 'El fin del mundo',
    description:
      'Una de las regiones más remotas y espectaculares del planeta. El Glaciar Perito Moreno, los lagos de color turquesa, y las estepas interminables definen esta tierra de viento y aventura. Hogar de guanacos, cóndores y pingüinos.',
    coordinates: { longitude: -73.05, latitude: -50.5 },
    zoom: 9,
    pitch: 50,
    bearing: 20,
  },
  {
    id: 'noa',
    title: 'Noroeste Argentino',
    subtitle: 'Colores de la Quebrada',
    description:
      'La Quebrada de Humahuaca, Patrimonio de la Humanidad, despliega cerros de siete colores. El NOA es el corazón cultural prehispánico de Argentina, con salinas, puna y el creciente triángulo del litio que promete transformar la economía regional.',
    coordinates: { longitude: -65.5, latitude: -23.5 },
    zoom: 9,
    pitch: 40,
    bearing: -15,
  },
]
