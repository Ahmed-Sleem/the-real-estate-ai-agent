/* Hardcoded demo tree — user's cleaned dataset will replace this file later.
   Egypt -> City -> District -> Compound -> UnitType (from Palm Hills factsheet sample) */
export interface UnitType { id: string; name: string; model: string; bua: number; land?: number; beds: number; price: number; finishing: string; delivery: string; }
export interface Compound { id: string; name: string; model: string; fromPrice: number; units: UnitType[]; }
export interface District { id: string; name: string; compounds: Compound[]; }
export interface City { id: string; name: string; nameAr: string; districts: District[]; }

const U = (id: string, name: string, model: string, bua: number, beds: number, price: number, finishing = "Fully Finished", delivery = "2029", land?: number): UnitType =>
  ({ id, name, model, bua, beds, price, finishing, delivery, land });

export const TREE: City[] = [
  { id: "cairo", name: "Cairo", nameAr: "القاهرة", districts: [
    { id: "new-cairo", name: "New Cairo", compounds: [
      { id: "97-hills", name: "97 Hills", model: "tower-a", fromPrice: 43500000, units: [
        U("97-a", "Villa Type A + Penthouse", "villa-a", 416, 7, 56600000, "Core & Shell", "2029", 566),
        U("97-b", "Villa Type B + Penthouse", "villa-b", 251, 5, 43500000, "Core & Shell", "2029", 385),
        U("97-c", "Villa Type C + Penthouse", "villa-c", 206, 4, 35900000, "Core & Shell", "2029", 288),
      ]},
      { id: "the-crown", name: "The Crown Ext.", model: "villa-b", fromPrice: 28053000, units: [
        U("cr-twin", "Twin House", "villa-d", 253, 5, 35000000, "Fully Finished", "2030", 281),
        U("cr-fg", "Family House Ground", "villa-a", 217, 4, 30483000, "Fully Finished", "2030"),
        U("cr-fu", "Family House Upper + PH", "villa-c", 223, 4, 28053000, "Fully Finished", "2030"),
      ]},
      { id: "bamboo", name: "Bamboo III", model: "villa-c", fromPrice: 24200000, units: [
        U("ba-mid", "Town House Middle", "villa-b", 248, 5, 30700000, "Fully Finished", "2029"),
        U("ba-cor", "Town House Corner", "villa-d", 248, 5, 31600000, "Fully Finished", "2029"),
        U("ba-fg", "Family House Ground", "villa-a", 182, 4, 24200000, "Fully Finished", "2029"),
        U("ba-fu", "Family House Upper + PH", "villa-c", 192, 4, 25400000, "Fully Finished", "2029"),
      ]},

      { id: "hyde-park", name: "Hyde Park", model: "comm-b", fromPrice: 5800000, units: [
        U("hp-2", "Apartment 2 Bed", "low-a", 110, 2, 5800000),
        U("hp-3", "Apartment 3 Bed", "comm-b", 165, 3, 7600000),
        U("hp-tw", "Town House", "villa-d", 235, 4, 11800000),
        U("hp-v", "Villa", "villa-a", 310, 5, 16900000),
      ]},
      { id: "mountain-view", name: "Mountain View iCity", model: "tower-b", fromPrice: 4950000, units: [
        U("mv-1", "Apartment 1 Bed", "low-a", 78, 1, 4950000),
        U("mv-2", "Apartment 2 Bed", "low-b", 125, 2, 6300000),
        U("mv-3", "Apartment 3 Bed", "comm-a", 175, 3, 8400000),
        U("mv-ph", "Penthouse", "tower-a", 260, 4, 13900000),
      ]},
      { id: "sodic-east", name: "SODIC East", model: "villa-a", fromPrice: 8900000, units: [
        U("se-tw", "Town House", "villa-b", 220, 4, 8900000),
        U("se-v", "Villa", "villa-c", 340, 5, 15400000),
      ]},
      { id: "palm-newcairo", name: "Palm Hills New Cairo", model: "comm-a", fromPrice: 6900000, units: [
        U("ph-apt3", "Apartment 3 Bed", "comm-a", 158, 3, 6900000),
        U("ph-apt4", "Apartment 4 Bed", "comm-b", 210, 4, 9800000),
        U("ph-ph", "Penthouse", "tower-a", 240, 4, 12500000),
      ]},
    ]},
    { id: "fifth-settlement", name: "Fifth Settlement", compounds: [
      { id: "galleria", name: "Galleria Moon Valley", model: "comm-a", fromPrice: 6100000, units: [
        U("gm-2", "Apartment 2 Bed", "low-b", 118, 2, 6100000),
        U("gm-3", "Apartment 3 Bed", "comm-a", 172, 3, 7950000),
      ]},
      { id: "mivida", name: "Mivida", model: "villa-b", fromPrice: 10200000, units: [
        U("mi-tw", "Town House", "villa-d", 228, 4, 10200000),
        U("mi-v", "Villa", "villa-a", 355, 5, 17800000),
      ]},
    ]},
    { id: "new-capital", name: "New Capital", compounds: [
      { id: "capital-gardens", name: "Capital Gardens", model: "tower-b", fromPrice: 5400000, units: [
        U("cg-2", "Apartment 2 Bed", "low-a", 115, 2, 5400000),
        U("cg-3", "Apartment 3 Bed", "comm-a", 165, 3, 7200000),
      ]},
    ]},
    { id: "maadi-zamalek", name: "Maadi & Zamalek", compounds: [
      { id: "nile-heights", name: "Nile Heights", model: "tower-b", fromPrice: 11200000, units: [
        U("nh-3", "Apartment 3 Bed", "comm-b", 180, 3, 11200000),
        U("nh-4", "Apartment 4 Bed", "tower-b", 240, 4, 14500000),
      ]},
    ]},
  ]},
  { id: "giza-west", name: "Giza / West Cairo", nameAr: "الجيزة وغرب القاهرة", districts: [
    { id: "sheikh-zayed", name: "Sheikh Zayed", compounds: [
      { id: "villa-jasmine-c", name: "Villa Jasmine Compound", model: "villa-a", fromPrice: 7900000, units: [
        U("vj-4", "Villa 4 Bed", "villa-a", 265, 4, 7900000),
        U("vj-5", "Villa 5 Bed", "villa-b", 320, 5, 9900000),
      ]},
      { id: "olive-c", name: "Villa Olive Compound", model: "villa-c", fromPrice: 9200000, units: [
        U("vo-4", "Villa 4 Bed", "villa-c", 290, 4, 9200000),
      ]},
    ]},
    { id: "october", name: "6th October", compounds: [
      { id: "lotus-c", name: "Villa Lotus Compound", model: "villa-d", fromPrice: 6600000, units: [
        U("vl-3", "Villa 3 Bed", "villa-d", 230, 3, 6600000),
        U("vl-4", "Villa 4 Bed", "villa-a", 275, 4, 8100000),
      ]},
    ]},
  ]},
  { id: "alexandria", name: "Alexandria", nameAr: "الإسكندرية", districts: [
    { id: "alex-centre", name: "Alexandria ntre", compounds: [
      { id: "smouha-heights", name: "Smouha Heights", model: "comm-a", fromPrice: 3900000, units: [
        U("sh-2", "Apartment 2 Bed", "low-a", 105, 2, 3900000),
        U("sh-3", "Apartment 3 Bed", "comm-a", 160, 3, 5400000),
      ]},
      { id: "alex-heights", name: "Alexandria ", model: "tower-a", fromPrice: 4800000, units: [
        U("ah-2", "Apartment 2 Bed", "low-a", 120, 2, 4800000),
        U("ah-3", "Apartment 3 Bed", "comm-a", 170, 3, 6500000),
      ]},
    ]},
  ]},
  { id: "north-coast", name: "North Coast", nameAr: "الساحل الشمالي", districts: [
    { id: "new-alamein", name: "New Alamein", compounds: [
      { id: "hacienda", name: "Hacienda Bay", model: "villa-b", fromPrice: 11700000, units: [
        U("hb-c", "Chalet 3 Bed", "low-b", 150, 3, 11700000),
        U("hb-v", "Beach Villa", "villa-a", 300, 5, 21500000),
      ]},
      { id: "marina-wide-c", name: "Marina Wide", model: "low-b", fromPrice: 8900000, units: [
        U("mw-3", "Chalet 3 Bed", "low-b", 165, 3, 8900000),
        U("mw-4", "Villa 4 Bed", "villa-b", 260, 4, 13900000),
      ]},
    ]},
  ]},
];

export const fmtPrice = (n: number) => (n / 1e6).toFixed(1).replace('.0','') + 'M EGP';
export const LEVELS = ["Country", "City", "District", "Compound"] as const;
export function cityById(id: string) { return TREE.find(c => c.id === id); }
export function findDistrict(cityId: string, dId: string) { return cityById(cityId)?.districts.find(d => d.id === dId); }
export function findCompound(cityId: string, dId: string, cId: string) { return findDistrict(cityId, dId)?.compounds.find(c => c.id === cId); }
