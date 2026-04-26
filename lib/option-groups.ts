import type { OptionGroup } from './types'

const SAUS_ERIN: OptionGroup = {
  id: 'og-saus-in',
  name_nl: 'Saus erin?',
  name_en: 'Sauce inside?',
  name_tr: 'İçinde sos?',
  name_ar: 'الصوص داخل؟',
  is_multi_select: false,
  values: [
    { id: 'ov-knof-in',     name_nl: 'Knoflook', name_en: 'Garlic',   name_tr: 'Sarımsak', name_ar: 'ثوم',    price: 0 },
    { id: 'ov-sambal-in',   name_nl: 'Sambal',   name_en: 'Sambal',   name_tr: 'Sambal',   name_ar: 'صمبل',   price: 0 },
    { id: 'ov-cocktail-in', name_nl: 'Cocktail', name_en: 'Cocktail', name_tr: 'Kokteyl',  name_ar: 'كوكتيل', price: 0 },
  ],
}

const SAUS_ERBIJ: OptionGroup = {
  id: 'og-saus-bij',
  name_nl: 'Saus erbij?',
  name_en: 'Sauce on side?',
  name_tr: 'Yanında sos?',
  name_ar: 'صوص جانبي؟',
  is_multi_select: true,
  values: [
    { id: 'ov-knof-bij',     name_nl: 'Knoflook', name_en: 'Garlic',   name_tr: 'Sarımsak', name_ar: 'ثوم',    price: 0.25 },
    { id: 'ov-sambal-bij',   name_nl: 'Sambal',   name_en: 'Sambal',   name_tr: 'Sambal',   name_ar: 'صمبل',   price: 0.25 },
    { id: 'ov-cocktail-bij', name_nl: 'Cocktail', name_en: 'Cocktail', name_tr: 'Kokteyl',  name_ar: 'كوكتيل', price: 0.25 },
  ],
}

const INHOUD: OptionGroup = {
  id: 'og-inhoud',
  name_nl: 'INHOUD',
  name_en: 'CONTENTS',
  name_tr: 'İÇERİK',
  name_ar: 'المحتوى',
  is_multi_select: true,
  values: [
    { id: 'ov-z-groenten', name_nl: 'Zonder Groenten', name_en: 'No Vegetables', name_tr: 'Sebzesiz',   name_ar: 'بدون خضروات', price: 0 },
    { id: 'ov-z-ui',       name_nl: 'Zonder Ui',       name_en: 'No Onion',      name_tr: 'Soğansız',   name_ar: 'بدون بصل',    price: 0 },
    { id: 'ov-z-kool',     name_nl: 'Zonder Kool',     name_en: 'No Cabbage',    name_tr: 'Lahanasız',  name_ar: 'بدون ملفوف',  price: 0 },
  ],
}

const EXTRAS: OptionGroup = {
  id: 'og-extras',
  name_nl: "EXTRA'S",
  name_en: 'EXTRAS',
  name_tr: 'EKSTRALAR',
  name_ar: 'إضافات',
  is_multi_select: true,
  values: [
    { id: 'ov-kaas',    name_nl: 'Met Kaas',      name_en: 'With Cheese',    name_tr: 'Peynirli',        name_ar: 'مع الجبن',       price: 1.00 },
    { id: 'ov-feta',    name_nl: 'Met Fetakaas',  name_en: 'With Feta',      name_tr: 'Beyaz Peynirli',  name_ar: 'مع جبن الفيتا',  price: 1.00 },
    { id: 'ov-olijven', name_nl: 'Olijven',       name_en: 'Olives',         name_tr: 'Zeytin',          name_ar: 'زيتون',          price: 0.50 },
    { id: 'ov-vlees',   name_nl: 'Extra Vlees',   name_en: 'Extra Meat',     name_tr: 'Ekstra Et',       name_ar: 'لحم إضافي',      price: 1.50 },
  ],
}

// Lahmacun, Dürüm, Broodjes, Kapsalon
const INHOUD_EXTRAS_SAUS: OptionGroup[] = [INHOUD, EXTRAS, SAUS_ERIN, SAUS_ERBIJ]

// Schotels
const SCHOTEL_OPTIONS: OptionGroup[] = [
  {
    id: 'og-schotel',
    name_nl: 'Bijgerecht',
    name_en: 'Side dish',
    name_tr: 'Garnitür',
    name_ar: 'طبق جانبي',
    is_multi_select: false,
    values: [
      { id: 'ov-frites', name_nl: 'Met Frietjes', name_en: 'With Fries', name_tr: 'Patatesli', name_ar: 'مع البطاطا المقلية', price: 0 },
      { id: 'ov-rijst',  name_nl: 'Met Rijst',    name_en: 'With Rice',  name_tr: 'Pirinçli',  name_ar: 'مع الأرز',          price: 0 },
    ],
  },
  SAUS_ERBIJ,
]

// Pizza's en Calzone
const PIZZA_OPTIONS: OptionGroup[] = [
  SAUS_ERBIJ,
  {
    id: 'og-toppings',
    name_nl: 'Toppings',
    name_en: 'Toppings',
    name_tr: 'Malzemeler',
    name_ar: 'إضافات',
    is_multi_select: true,
    values: [
      { id: 'ov-t-doner',       name_nl: 'Doner',       name_en: 'Doner',       name_tr: 'Döner',      name_ar: 'دونر',         price: 1.50 },
      { id: 'ov-t-kipdoner',    name_nl: 'Kipdoner',    name_en: 'Chicken Döner', name_tr: 'Kipdöner', name_ar: 'دجاج دونر',    price: 1.50 },
      { id: 'ov-t-sucuk',       name_nl: 'Sucuk',       name_en: 'Sucuk',       name_tr: 'Sucuk',      name_ar: 'سجق',          price: 1.50 },
      { id: 'ov-t-salami',      name_nl: 'Salami',      name_en: 'Salami',      name_tr: 'Salam',      name_ar: 'سلامي',        price: 1.50 },
      { id: 'ov-t-ham',         name_nl: 'Ham',         name_en: 'Ham',         name_tr: 'Jambon',     name_ar: 'لحم',          price: 1.50 },
      { id: 'ov-t-tonijn',      name_nl: 'Tonijn',      name_en: 'Tuna',        name_tr: 'Ton balığı', name_ar: 'تونة',         price: 1.50 },
      { id: 'ov-t-anjovis',     name_nl: 'Anjovis',     name_en: 'Anchovies',   name_tr: 'Hamsi',      name_ar: 'أنشوجة',       price: 1.50 },
      { id: 'ov-t-bolognese',   name_nl: 'Bolognese',   name_en: 'Bolognese',   name_tr: 'Bolonez',    name_ar: 'بولونيز',      price: 1.50 },
      { id: 'ov-t-ei',          name_nl: 'Ei',          name_en: 'Egg',         name_tr: 'Yumurta',    name_ar: 'بيض',          price: 0.50 },
      { id: 'ov-t-ananas',      name_nl: 'Ananas',      name_en: 'Pineapple',   name_tr: 'Ananas',     name_ar: 'أناناس',       price: 0.50 },
      { id: 'ov-t-salade',      name_nl: 'Salade',      name_en: 'Salad',       name_tr: 'Salata',     name_ar: 'سلطة',         price: 0.50 },
      { id: 'ov-t-ui',          name_nl: 'Ui',          name_en: 'Onion',       name_tr: 'Soğan',      name_ar: 'بصل',          price: 0.50 },
      { id: 'ov-t-paprika',     name_nl: 'Paprika',     name_en: 'Bell pepper', name_tr: 'Biber',      name_ar: 'فلفل',         price: 0.50 },
      { id: 'ov-t-champignons', name_nl: 'Champignons', name_en: 'Mushrooms',   name_tr: 'Mantar',     name_ar: 'فطر',          price: 0.50 },
      { id: 'ov-t-olijven',     name_nl: 'Olijven',     name_en: 'Olives',      name_tr: 'Zeytin',     name_ar: 'زيتون',        price: 0.50 },
      { id: 'ov-t-artisjok',    name_nl: 'Artisjok',    name_en: 'Artichoke',   name_tr: 'Enginar',    name_ar: 'خرشوف',        price: 0.50 },
      { id: 'ov-t-peper',       name_nl: 'Peper',       name_en: 'Pepper',      name_tr: 'Peper',      name_ar: 'فلفل حار',     price: 0.50 },
      { id: 'ov-t-tomatensaus', name_nl: 'Tomatensaus', name_en: 'Tomato sauce', name_tr: 'Domates sosu', name_ar: 'صوص الطماطم', price: 0.50 },
      { id: 'ov-t-weinig-kaas', name_nl: 'Weinig Kaas', name_en: 'Less Cheese', name_tr: 'Az Peynir',  name_ar: 'جبن قليل',     price: 0 },
      { id: 'ov-t-gorgonzola',  name_nl: 'Gorgonzola',  name_en: 'Gorgonzola',  name_tr: 'Gorgonzola', name_ar: 'جورجونزولا',   price: 1.00 },
      { id: 'ov-t-feta',        name_nl: 'Feta',        name_en: 'Feta',        name_tr: 'Beyaz Peynir', name_ar: 'فيتا',       price: 1.00 },
      { id: 'ov-t-mozzarella',  name_nl: 'Mozzarella',  name_en: 'Mozzarella',  name_tr: 'Mozzarella', name_ar: 'موزاريلا',     price: 1.00 },
      { id: 'ov-t-kaas',        name_nl: 'Kaas',        name_en: 'Cheese',      name_tr: 'Peynir',     name_ar: 'جبن',          price: 1.00 },
    ],
  },
]

// Pasta's
const PASTA_OPTIONS: OptionGroup[] = [
  {
    id: 'og-pasta',
    name_nl: "Pasta's",
    name_en: 'Pasta type',
    name_tr: 'Makarna türü',
    name_ar: 'نوع المعكرونة',
    is_multi_select: false,
    values: [
      { id: 'ov-penne', name_nl: 'Penne', name_en: 'Penne', name_tr: 'Penne', name_ar: 'بيني', price: 0 },
    ],
  },
]

// Patat
const PATAT_OPTIONS: OptionGroup[] = [SAUS_ERBIJ]

export const OPTION_GROUPS_BY_CATEGORY: Record<string, OptionGroup[]> = {
  'cat-9':  INHOUD_EXTRAS_SAUS,  // Lahmacun
  'cat-10': INHOUD_EXTRAS_SAUS,  // Dürüm
  'cat-11': INHOUD_EXTRAS_SAUS,  // Broodjes
  'cat-12': SCHOTEL_OPTIONS,     // Schotels
  'cat-13': INHOUD_EXTRAS_SAUS,  // Kapsalon
  'cat-15': PIZZA_OPTIONS,       // Pizza's
  'cat-16': PIZZA_OPTIONS,       // Calzone
  'cat-17': PASTA_OPTIONS,       // Pasta's
  'cat-18': PATAT_OPTIONS,       // Patat
}

export function getOptionGroups(categoryId: string): OptionGroup[] {
  return OPTION_GROUPS_BY_CATEGORY[categoryId] ?? []
}
