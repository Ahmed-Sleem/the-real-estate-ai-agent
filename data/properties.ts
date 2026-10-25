/* Hardcoded demo dataset — real dataset (areas -> compounds -> units) replaces this file later. */
export type PropertyType = "tower" | "apt" | "villa";
export interface PropertyNode {
  id: string; name: string; type: PropertyType; model: string;
  district: string; price: number; rooms: number; area: number; match: number;
}
export const PROPERTIES: PropertyNode[] = [
  {id:"palm-tower",name:"Palm Tower",type:"tower",model:"tower-a",district:"New Cairo",price:7200000,rooms:3,area:165,match:96},
  {id:"nile-heights",name:"Nile Heights",type:"tower",model:"tower-b",district:"Zamalek",price:14500000,rooms:4,area:240,match:61},
  {id:"gardenia",name:"Gardenia Residence",type:"apt",model:"comm-a",district:"New Cairo",price:6900000,rooms:3,area:158,match:93},
  {id:"skyline",name:"Skyline Plaza",type:"apt",model:"comm-b",district:"Nasr City",price:9800000,rooms:3,area:180,match:58},
  {id:"cedar-court",name:"Cedar Court",type:"apt",model:"low-a",district:"Maadi",price:8400000,rooms:2,area:130,match:74},
  {id:"marina-wide",name:"Marina Wide",type:"apt",model:"low-b",district:"New Alamein",price:11200000,rooms:4,area:210,match:44},
  {id:"villa-palm",name:"Villa Palm",type:"villa",model:"villa-a",district:"Sheikh Zayed",price:15800000,rooms:5,area:380,match:39},
  {id:"villa-jasmine",name:"Villa Jasmine",type:"villa",model:"villa-b",district:"New Cairo",price:7900000,rooms:4,area:265,match:91},
  {id:"villa-olive",name:"Villa Olive",type:"villa",model:"villa-c",district:"Sheikh Zayed",price:9200000,rooms:4,area:290,match:68},
  {id:"villa-lotus",name:"Villa Lotus",type:"villa",model:"villa-d",district:"6th October",price:6600000,rooms:3,area:230,match:85},
  {id:"hyde-loft",name:"Hyde Loft",type:"apt",model:"low-a",district:"New Cairo",price:5400000,rooms:2,area:115,match:72},
  {id:"capital-tower",name:"Capital Tower",type:"tower",model:"tower-b",district:"New Capital",price:12900000,rooms:3,area:195,match:47},
];
export const SHORTLIST_IDS = ["palm-tower","gardenia","villa-jasmine","villa-lotus"];
export const fmtPrice = (n:number) => (n/1e6).toFixed(1).replace(".0","") + "M EGP";
export type VizPhase = "IDLE" | "THINKING" | "NARROWING" | "SHORTLIST" | "FOCUS";
