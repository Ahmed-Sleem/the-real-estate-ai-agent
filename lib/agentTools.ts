/**
 * Deterministic catalogue engine for the Real Estate Agent.
 * The model DECIDES (via function calling); this code SEARCHES.
 * Every search scans the ENTIRE flattened unit table, so a unit can only be
 * excluded by a filter the user actually stated — never by model attention.
 * Each tool returns a `viz` directive so the 3D planet / list animation is a
 * direct, real reflection of the tool the model just called.
 */
import { TREE, type UnitType, type Compound, fmtPrice } from "../data/hierarchy";

export interface FlatUnit extends UnitType {
  cityId: string; city: string; districtId: string; district: string;
  compoundId: string; compound: string; path: string[];
}
export const ALL_UNITS: FlatUnit[] = TREE.flatMap(c => c.districts.flatMap(d => d.compounds.flatMap(co => co.units.map(u => ({
  ...u, cityId: c.id, city: c.name, districtId: d.id, district: d.name, compoundId: co.id, compound: co.name, path: [c.id, d.id, co.id],
})))));

export interface SearchFilters {
  city?: string; district?: string; compound?: string;
  minBeds?: number; maxPrice?: number; minPrice?: number;
  minBua?: number; minLand?: number; typeKeyword?: string;
  finishing?: string; deliveryBefore?: string; sort?: "price_asc" | "price_desc" | "bua_desc" | "beds_desc";
}
export interface VizDirective { drillPath?: string[]; inspectIds?: string[]; shortlistIds?: string[]; rejectedIds?: string[]; focusId?: string; }
export interface ToolOutcome { result: unknown; viz?: VizDirective; status: string; }

const norm = (s: string) => s.toLowerCase().trim();
function matchesText(hay: string, needle?: string) { return !needle || norm(hay).includes(norm(needle)) || norm(needle).includes(norm(hay)); }

export function applyFilters(f: SearchFilters): FlatUnit[] {
  return ALL_UNITS.filter(u =>
    matchesText(u.city, f.city) && matchesText(u.district, f.district) && matchesText(u.compound, f.compound) &&
    (f.minBeds == null || u.beds >= f.minBeds) &&
    (f.maxPrice == null || u.price <= f.maxPrice) &&
    (f.minPrice == null || u.price >= f.minPrice) &&
    (f.minBua == null || u.bua >= f.minBua) &&
    (f.minLand == null || (u.land ?? 0) >= f.minLand) &&
    matchesText(u.name, f.typeKeyword) &&
    matchesText(u.finishing, f.finishing) &&
    (!f.deliveryBefore || u.delivery <= f.deliveryBefore));
}
function sortUnits(units: FlatUnit[], sort?: SearchFilters["sort"]): FlatUnit[] {
  const arr = [...units];
  switch (sort) {
    case "price_desc": return arr.sort((a, b) => b.price - a.price);
    case "bua_desc": return arr.sort((a, b) => b.bua - a.bua);
    case "beds_desc": return arr.sort((a, b) => b.beds - a.beds || a.price - b.price);
    default: return arr.sort((a, b) => a.price - b.price);
  }
}
const unitCard = (u: FlatUnit) => ({ id: u.id, name: u.name, compound: u.compound, district: u.district, city: u.city, price: fmtPrice(u.price), priceEGP: u.price, beds: u.beds, bua: u.bua, land: u.land ?? null, finishing: u.finishing, delivery: u.delivery, path: u.path });

/** One hierarchy stage at a time: Egypt -> cities -> districts -> compounds -> units. */
export function toolListLevel(path: string[] = []): ToolOutcome {
  if (path.length === 0) {
    const items = TREE.map(c => ({ id: c.id, name: c.name, districts: c.districts.length, compounds: c.districts.reduce((a, d) => a + d.compounds.length, 0), units: ALL_UNITS.filter(u => u.cityId === c.id).length, fromPrice: fmtPrice(Math.min(...ALL_UNITS.filter(u => u.cityId === c.id).map(u => u.price))) }));
    return { status: `Browsing Egypt — ${items.length} cities`, viz: { drillPath: [], inspectIds: items.map(i => i.id) }, result: { stage: "cities", items } };
  }
  const city = TREE.find(c => c.id === path[0]); if (!city) return { status: "Unknown city", result: { error: "city not found", validCityIds: TREE.map(c => c.id) } };
  if (path.length === 1) {
    const items = city.districts.map(d => ({ id: d.id, name: d.name, compounds: d.compounds.length, units: ALL_UNITS.filter(u => u.districtId === d.id).length, fromPrice: fmtPrice(Math.min(...ALL_UNITS.filter(u => u.districtId === d.id).map(u => u.price))) }));
    return { status: `Browsing ${city.name} — ${items.length} districts`, viz: { drillPath: [city.id], inspectIds: items.map(i => i.id) }, result: { stage: "districts", city: city.name, items } };
  }
  const dist = city.districts.find(d => d.id === path[1]); if (!dist) return { status: "Unknown district", result: { error: "district not found", validDistrictIds: city.districts.map(d => d.id) } };
  if (path.length === 2) {
    const items = dist.compounds.map((co: Compound) => ({ id: co.id, name: co.name, units: co.units.length, fromPrice: fmtPrice(co.fromPrice) }));
    return { status: `Browsing ${dist.name} — ${items.length} compounds`, viz: { drillPath: [city.id, dist.id], inspectIds: items.map(i => i.id) }, result: { stage: "compounds", district: dist.name, items } };
  }
  const comp = dist.compounds.find(c => c.id === path[2]); if (!comp) return { status: "Unknown compound", result: { error: "compound not found", validCompoundIds: dist.compounds.map(c => c.id) } };
  const items = comp.units.map(u => unitCard(ALL_UNITS.find(x => x.id === u.id)!));
  return { status: `Browsing ${comp.name} — ${items.length} unit types`, viz: { drillPath: [city.id, dist.id, comp.id], inspectIds: items.map(i => i.id) }, result: { stage: "units", compound: comp.name, items } };
}

/** Global exhaustive search across ALL branches. Optional stepwise relaxation (disclosed). */
export function toolSearchUnits(f: SearchFilters, relax = false): ToolOutcome {
  const scanned = ALL_UNITS.length;
  let matched = applyFilters(f);
  const relaxations: string[] = [];
  if (relax && matched.length === 0) {
    const steps: Array<[string, (g: SearchFilters) => SearchFilters]> = [
      ["budget +15%", g => ({ ...g, maxPrice: g.maxPrice ? Math.round(g.maxPrice * 1.15) : g.maxPrice })],
      ["budget +30%", g => ({ ...g, maxPrice: g.maxPrice ? Math.round(g.maxPrice * 1.3) : g.maxPrice })],
      ["bedrooms -1", g => ({ ...g, minBeds: g.minBeds && g.minBeds > 1 ? g.minBeds - 1 : g.minBeds })],
      ["minimum area -15%", g => ({ ...g, minBua: g.minBua ? Math.round(g.minBua * 0.85) : g.minBua })],
      ["location widened (district dropped)", g => ({ ...g, district: undefined })],
      ["location widened (city dropped)", g => ({ ...g, city: undefined, district: undefined })],
    ];
    let cur = { ...f };
    for (const [label, step] of steps) {
      cur = step(cur); matched = applyFilters(cur);
      if (matched.length) { relaxations.push(label); break; }
      relaxations.push(label);
    }
    if (!matched.length) relaxations.length = 0;
  }
  const sorted = sortUnits(matched, f.sort);
  const top = sorted.slice(0, 8);
  // Viz: if all top matches share one compound, drill there and shortlist units;
  // otherwise shortlist the compounds that contain matches at compound level.
  let viz: VizDirective;
  const compounds = [...new Set(top.map(u => u.compoundId))];
  if (top.length && compounds.length === 1) {
    viz = { drillPath: top[0].path, shortlistIds: top.map(u => u.id), focusId: top[0].id };
  } else if (top.length) {
    const first = top[0];
    viz = { drillPath: first.path.slice(0, 2), shortlistIds: compounds, inspectIds: compounds };
  } else viz = {};
  return {
    status: matched.length ? `Searched all ${scanned} units — ${matched.length} match${relaxations.length ? ` (relaxed: ${relaxations.join(", ")})` : ""}` : `Searched all ${scanned} units — no matches`,
    viz,
    result: { scannedTotal: scanned, matchedCount: matched.length, relaxationsApplied: relaxations, filtersUsed: f, results: top.map(unitCard) },
  };
}

export function toolGetUnit(id: string): ToolOutcome {
  const u = ALL_UNITS.find(x => x.id === id);
  if (!u) return { status: "Unit not found", result: { error: "unknown unit id", id } };
  return { status: `Opening ${u.name} — ${u.compound}`, viz: { drillPath: u.path, focusId: u.id, shortlistIds: [u.id] }, result: unitCard(u) };
}

export function toolCompare(ids: string[]): ToolOutcome {
  const units = ids.map(id => ALL_UNITS.find(u => u.id === id)).filter(Boolean) as FlatUnit[];
  return { status: `Comparing ${units.length} units`, viz: { shortlistIds: units.map(u => u.id), focusId: units[0]?.id }, result: { units: units.map(unitCard) } };
}

export const TOOL_DEFS = [
  { type: "function", function: { name: "list_level", description: "Browse ONE hierarchy stage: [] = cities of Egypt, [cityId] = its districts, [cityId, districtId] = its compounds, [cityId, districtId, compoundId] = its unit types. Returns every child with counts and starting prices. Use to walk the map step by step.", parameters: { type: "object", properties: { path: { type: "array", items: { type: "string" }, description: "IDs from previous list_level results, e.g. [\"cairo\",\"new-cairo\"]" } }, required: ["path"] } } },
  { type: "function", function: { name: "search_units", description: "EXHAUSTIVE search over the whole catalogue (scans every unit, all cities). Hard filters apply exactly. Use for any budget/beds/area/location requirement, in parallel with or instead of browsing. Set relax=true to stepwise-relax soft constraints (budget +15/+30%, beds-1, area-15%, widen location) and disclose what changed.", parameters: { type: "object", properties: { city: { type: "string" }, district: { type: "string" }, compound: { type: "string" }, minBeds: { type: "number" }, maxPrice: { type: "number", description: "EGP, e.g. 26000000" }, minPrice: { type: "number" }, minBua: { type: "number", description: "m²" }, minLand: { type: "number" }, typeKeyword: { type: "string", description: "e.g. Villa, Town House, Penthouse, Apartment" }, finishing: { type: "string" }, deliveryBefore: { type: "string", description: "e.g. \"2029\"" }, sort: { type: "string", enum: ["price_asc", "price_desc", "bua_desc", "beds_desc"] }, relax: { type: "boolean" } }, required: [] } } },
  { type: "function", function: { name: "get_unit", description: "Full details of one unit by ID (from search/list results). Also focuses it on the map.", parameters: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } } },
  { type: "function", function: { name: "compare_units", description: "Compare 2-4 units side by side by ID.", parameters: { type: "object", properties: { ids: { type: "array", items: { type: "string" } } }, required: ["ids"] } } },
] as const;

export function executeTool(name: string, args: any): ToolOutcome {
  try {
    switch (name) {
      case "list_level": return toolListLevel(Array.isArray(args?.path) ? args.path : []);
      case "search_units": return toolSearchUnits(args || {}, !!args?.relax);
      case "get_unit": return toolGetUnit(String(args?.id || ""));
      case "compare_units": return toolCompare(Array.isArray(args?.ids) ? args.ids : []);
      default: return { status: `Unknown tool ${name}`, result: { error: "unknown tool" } };
    }
  } catch (e: any) { return { status: `Tool ${name} failed`, result: { error: String(e?.message || e) } }; }
}
