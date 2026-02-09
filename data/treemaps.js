// ============================================================
// TREEMAP DATA & CONFIGS (extracted from index.html)
// Source: BEA Fixed Assets Tables, BEA NIPA Table 2.5.5
// ============================================================

// Depreciation breakdown data (BEA Fixed Assets Tables 2.4 & 7.3, 2024)
const DEPRECIATION_TREE = {"name":"Depreciation (CCA)","value":4810,"children":[{"name":"Private","value":3993,"children":[{"name":"Structures","value":1382,"children":[{"name":"Residential Structures","value":782,"children":[{"name":"Housing Units","value":313,"children":[{"name":"Permanent Site","value":295},{"name":"Manufactured Homes","value":18}]},{"name":"Ownership Transfer Costs","value":255},{"name":"Improvements","value":211},{"name":"Other Residential","value":3}]},{"name":"Nonresidential Structures","value":600,"children":[{"name":"Commercial & Health Care","value":210,"children":[{"name":"Office","value":85},{"name":"Health Care","value":35},{"name":"Multimerchandise Shopping","value":29},{"name":"Warehouses","value":24},{"name":"Food & Beverage","value":14},{"name":"Other Commercial","value":23}]},{"name":"Other Structures","value":105,"children":[{"name":"Lodging","value":28},{"name":"Amusement & Recreation","value":18},{"name":"Educational & Vocational","value":17},{"name":"Transportation","value":15},{"name":"Farm","value":13},{"name":"Religious","value":9},{"name":"Other","value":5}]},{"name":"Mining Exploration","value":101,"children":[{"name":"Petroleum & Natural Gas","value":91},{"name":"Mining","value":10}]},{"name":"Power & Communication","value":93,"children":[{"name":"Power","value":70},{"name":"Communication","value":23}]},{"name":"Manufacturing","value":91}]}]},{"name":"Intellectual Property","value":1325,"children":[{"name":"Research & Development","value":618,"children":[{"name":"Business R&D","value":584,"children":[{"name":"Manufacturing R&D","value":340,"children":[{"name":"Pharmaceutical","value":101},{"name":"Other Manufacturing","value":71},{"name":"Other Computer & Electronic","value":55},{"name":"Semiconductor","value":50},{"name":"Motor Vehicles","value":34},{"name":"Aerospace","value":16},{"name":"Chemical (ex Pharma)","value":13}]},{"name":"Nonmanufacturing R&D","value":244}]},{"name":"Nonprofit R&D","value":34}]},{"name":"Software","value":601,"children":[{"name":"Prepackaged","value":299},{"name":"Custom","value":220},{"name":"Own Account","value":82}]},{"name":"Entertainment Originals","value":106,"children":[{"name":"Long-lived TV","value":56},{"name":"Theatrical Movies","value":22},{"name":"Books","value":12},{"name":"Music","value":11},{"name":"Other","value":5}]}]},{"name":"Equipment","value":1286,"children":[{"name":"Nonresidential Equipment","value":1270,"children":[{"name":"Information Processing","value":403,"children":[{"name":"Computers & Peripherals","value":143},{"name":"Medical Equipment","value":109},{"name":"Communication Equipment","value":96},{"name":"Nonmedical Instruments","value":41},{"name":"Photocopy & Related","value":8},{"name":"Office & Accounting","value":6}]},{"name":"Other Equipment","value":318,"children":[{"name":"Other Nonresidential","value":84},{"name":"Furniture & Fixtures","value":55},{"name":"Construction Machinery","value":54},{"name":"Service Industry Machinery","value":43},{"name":"Agricultural Machinery","value":40},{"name":"Mining & Oilfield","value":31},{"name":"Electrical Equipment","value":11}]},{"name":"Transportation Equipment","value":282,"children":[{"name":"Trucks, Buses & Trailers","value":194},{"name":"Aircraft","value":45},{"name":"Autos","value":25},{"name":"Railroad Equipment","value":11},{"name":"Ships & Boats","value":7}]},{"name":"Industrial Equipment","value":267,"children":[{"name":"General Industrial","value":104},{"name":"Special Industry Machinery","value":46},{"name":"Electrical Transmission","value":43},{"name":"Metalworking Machinery","value":37},{"name":"Fabricated Metal Products","value":25},{"name":"Engines & Turbines","value":12}]}]},{"name":"Residential Equipment","value":16}]}]},{"name":"Government","value":817,"children":[{"name":"State & Local","value":424,"children":[{"name":"Structures","value":288,"children":[{"name":"Highways & Streets","value":99},{"name":"Educational","value":72},{"name":"Office","value":23},{"name":"Transportation","value":22},{"name":"Sewer Systems","value":19},{"name":"Water Systems","value":14},{"name":"Power","value":10},{"name":"Amusement & Recreation","value":7},{"name":"Health Care","value":7},{"name":"Residential","value":6},{"name":"Public Safety","value":5},{"name":"Other","value":4}]},{"name":"Equipment","value":71},{"name":"Intellectual Property","value":65,"children":[{"name":"Software","value":40},{"name":"R&D","value":25}]}]},{"name":"Federal","value":393,"children":[{"name":"Defense","value":209,"children":[{"name":"Equipment","value":95,"children":[{"name":"Other Equipment","value":39},{"name":"Aircraft","value":19},{"name":"Ships","value":17},{"name":"Electronics","value":9},{"name":"Missiles","value":6},{"name":"Vehicles","value":5}]},{"name":"Intellectual Property","value":94,"children":[{"name":"R&D","value":71},{"name":"Software","value":23}]},{"name":"Structures","value":20,"children":[{"name":"Military Facilities","value":15},{"name":"Buildings","value":5}]}]},{"name":"Nondefense","value":184,"children":[{"name":"Intellectual Property","value":141,"children":[{"name":"R&D","value":96},{"name":"Software","value":45}]},{"name":"Equipment","value":24},{"name":"Structures","value":19,"children":[{"name":"Conservation & Development","value":6},{"name":"Office","value":3},{"name":"Public Safety","value":2},{"name":"Health Care","value":2},{"name":"Other","value":6}]}]}]}]}]};

// PCE breakdown trees (BEA NIPA Table 2.5.5, 2024)
const HOUSING_TREE = {"name":"Housing, Utilities & Fuels","value":3630,"children":[{"name":"Housing","value":3147,"children":[{"name":"Owner-Occupied Imputed Rent","value":2374},{"name":"Tenant-Occupied Rent","value":740},{"name":"Farm Dwellings","value":30},{"name":"Group Housing","value":3}]},{"name":"Utilities & Fuels","value":483,"children":[{"name":"Electricity","value":253},{"name":"Water Supply & Sanitation","value":140},{"name":"Natural Gas","value":64},{"name":"Fuel Oil & Other Fuels","value":26}]}]};

const HEALTH_TREE = {"name":"Health","value":4088,"children":[{"name":"Hospital & Nursing Home Services","value":1742,"children":[{"name":"Hospitals","value":1493},{"name":"Nursing Homes","value":249}]},{"name":"Outpatient Services","value":1573,"children":[{"name":"Physician Services","value":793},{"name":"Paramedical Services","value":594,"children":[{"name":"Other Professional Medical","value":359},{"name":"Home Health Care","value":184},{"name":"Medical Laboratories","value":51}]},{"name":"Dental Services","value":186}]},{"name":"Medical Products & Equipment","value":773,"children":[{"name":"Pharmaceuticals","value":677,"children":[{"name":"Pharmaceutical Products","value":669},{"name":"Other Medical Products","value":8}]},{"name":"Therapeutic Appliances & Equipment","value":96}]}]};

const FOOD_TREE = {"name":"Food & Beverages","value":2710,"children":[{"name":"Food Services","value":1231,"children":[{"name":"Purchased Meals & Beverages","value":1196},{"name":"Food Furnished to Employees","value":35}]},{"name":"Food & Beverages (Off-Premises)","value":1479,"children":[{"name":"Food & Nonalcoholic Beverages","value":1250},{"name":"Alcoholic Beverages","value":228},{"name":"Farm-Produced Food","value":1}]}]};

const TRANSPORT_TREE = {"name":"Transportation","value":1808,"children":[{"name":"Motor Vehicle Operation","value":910,"children":[{"name":"Fuels, Lubricants & Fluids","value":414},{"name":"Maintenance & Repair","value":258},{"name":"Parts & Accessories","value":126},{"name":"Other Motor Vehicle Services","value":112}]},{"name":"Motor Vehicles","value":606,"children":[{"name":"New Motor Vehicles","value":395},{"name":"Used Motor Vehicles (Net)","value":211}]},{"name":"Public Transportation","value":292,"children":[{"name":"Air Transportation","value":189},{"name":"Ground Transportation","value":96},{"name":"Water Transportation","value":7}]}]};

const RECREATION_TREE = {"name":"Recreation","value":1873,"children":[{"name":"Video, Audio & Computers","value":556,"children":[{"name":"Information Processing Equipment","value":308},{"name":"Services Related to Equipment","value":159},{"name":"Video & Audio Equipment","value":89}]},{"name":"Sports & Recreational Goods","value":439,"children":[{"name":"Other Sporting Goods","value":332},{"name":"Sports & Recreational Vehicles","value":99},{"name":"Maintenance & Repair","value":8}]},{"name":"Clubs, Parks, Theaters & Museums","value":291,"children":[{"name":"Admissions to Spectator Amusements","value":106,"children":[{"name":"Live Entertainment","value":53},{"name":"Spectator Sports","value":41},{"name":"Motion Picture Theaters","value":12}]},{"name":"Amusement Parks & Campgrounds","value":87},{"name":"Membership Clubs & Sports Centers","value":82},{"name":"Museums & Libraries","value":16}]},{"name":"Gambling","value":207},{"name":"Pets & Pet Products","value":189},{"name":"Magazines, Newspapers & Books","value":150},{"name":"Package Tours","value":22},{"name":"Photographic Goods & Services","value":19}]};

const FINANCIAL_TREE = {"name":"Financial Services & Insurance","value":1560,"children":[{"name":"Financial Services","value":1041,"children":[{"name":"Services Furnished Without Payment","value":565},{"name":"Charges, Fees & Commissions","value":476}]},{"name":"Insurance","value":519,"children":[{"name":"Net Health Insurance","value":270,"children":[{"name":"Medical Care & Hospitalization","value":229},{"name":"Workers' Compensation","value":36},{"name":"Income Loss","value":5}]},{"name":"Life Insurance","value":128},{"name":"Motor Vehicle & Transport Insurance","value":103},{"name":"Net Household Insurance","value":18}]}]};

const OTHER_TREE = {"name":"Other Goods & Services","value":3613,"children":[{"name":"Other Goods & Services","value":1293,"children":[{"name":"Personal Care","value":413},{"name":"Social Services & Religious Activities","value":335},{"name":"Professional & Other Services","value":278,"children":[{"name":"Legal Services","value":141},{"name":"Accounting & Business Services","value":76},{"name":"Funeral & Burial Services","value":30},{"name":"Labor Organization Dues","value":18},{"name":"Professional Association Dues","value":13}]},{"name":"Personal Items","value":152},{"name":"Tobacco","value":115}]},{"name":"Furnishings & Household Maintenance","value":797,"children":[{"name":"Furniture, Furnishings & Floor Coverings","value":252},{"name":"Other Household Goods & Services","value":225},{"name":"Household Textiles","value":100},{"name":"Household Appliances","value":100},{"name":"Tools & Equipment for House & Garden","value":61},{"name":"Glassware, Tableware & Utensils","value":59}]},{"name":"Clothing, Footwear & Related","value":554,"children":[{"name":"Clothing","value":438,"children":[{"name":"Garments","value":411,"children":[{"name":"Women's & Girls'","value":241},{"name":"Men's & Boys'","value":144},{"name":"Children's & Infants'","value":26}]},{"name":"Cleaning, Repair & Rental","value":23},{"name":"Other Clothing Materials","value":4}]},{"name":"Footwear","value":116}]},{"name":"Education","value":361,"children":[{"name":"Higher Education","value":206},{"name":"Commercial & Vocational Schools","value":83},{"name":"Nursery, Elementary & Secondary","value":63},{"name":"Educational Books","value":9}]},{"name":"Communication","value":344,"children":[{"name":"Telecommunication Services","value":181},{"name":"Internet Access","value":111},{"name":"Telephone Equipment","value":35},{"name":"Postal & Delivery Services","value":17}]},{"name":"Accommodations","value":198},{"name":"Net Foreign Travel","value":66}]};

// Shared color helper for PCE treemaps
function makeTreeColorFn(hueMap, defaultHue) {
  return function(d) {
    let ancestor = d; while (ancestor.depth > 1) ancestor = ancestor.parent;
    const hueBase = hueMap[ancestor.data.name] || defaultHue;
    const depth = Math.min(d.depth, 5);
    const sat = 70 - (depth - 1) * 8;
    const lit = 35 + (depth - 1) * 9;
    const siblings = d.parent ? d.parent.children : [d];
    const idx = siblings.indexOf(d);
    const hueShift = siblings.length > 1 ? (idx / (siblings.length - 1) - 0.5) * 20 : 0;
    return `hsl(${hueBase + hueShift}, ${sat}%, ${lit}%)`;
  };
}

// Treemap drill-down configurations keyed by Sankey node ID
const TREE_CONFIGS = {
  7: {
    tree: DEPRECIATION_TREE,
    title: "Depreciation (CCA): Where $4.8 Trillion in Capital Wears Out",
    subtitle: "BEA Fixed Assets Tables 2.4 & 7.3 — Consumption of fixed capital, 2024 (billions USD)",
    ariaLabel: "Treemap showing breakdown of $4.8 trillion in US depreciation",
    pctLabel: "total depreciation",
    colorFn: function(d) {
      let ancestor = d; while (ancestor.depth > 1) ancestor = ancestor.parent;
      const isPrivate = ancestor.data.name === "Private";
      const hueBase = isPrivate ? 25 : 210;
      const hueRange = isPrivate ? 25 : 30;
      const depth = Math.min(d.depth, 5);
      const sat = 80 - (depth - 1) * 10;
      const lit = 38 + (depth - 1) * 9;
      const siblings = d.parent ? d.parent.children : [d];
      const idx = siblings.indexOf(d);
      const hueShift = siblings.length > 1 ? (idx / (siblings.length - 1) - 0.5) * hueRange : 0;
      return `hsl(${hueBase + hueShift}, ${sat}%, ${lit}%)`;
    }
  },
  20: {
    tree: HOUSING_TREE,
    title: "Housing, Utilities & Fuels: $3.63 Trillion",
    subtitle: "BEA NIPA Table 2.5.5 — Personal consumption expenditures, 2024 (billions USD)",
    ariaLabel: "Treemap: $3.63T in housing and utilities spending",
    pctLabel: "housing spending",
    colorFn: makeTreeColorFn({"Housing": 145, "Utilities & Fuels": 35}, 145)
  },
  21: {
    tree: HEALTH_TREE,
    title: "Health: $4.09 Trillion",
    subtitle: "BEA NIPA Table 2.5.5 — Personal consumption expenditures, 2024 (billions USD)",
    ariaLabel: "Treemap: $4.09T in healthcare spending",
    pctLabel: "health spending",
    colorFn: makeTreeColorFn({"Hospital & Nursing Home Services": 350, "Outpatient Services": 320, "Medical Products & Equipment": 280}, 340)
  },
  22: {
    tree: FOOD_TREE,
    title: "Food & Beverages: $2.71 Trillion",
    subtitle: "BEA NIPA Table 2.5.5 — Personal consumption expenditures, 2024 (billions USD)",
    ariaLabel: "Treemap: $2.71T in food and beverage spending",
    pctLabel: "food spending",
    colorFn: makeTreeColorFn({"Food Services": 25, "Food & Beverages (Off-Premises)": 80}, 50)
  },
  23: {
    tree: TRANSPORT_TREE,
    title: "Transportation: $1.81 Trillion",
    subtitle: "BEA NIPA Table 2.5.5 — Personal consumption expenditures, 2024 (billions USD)",
    ariaLabel: "Treemap: $1.81T in transportation spending",
    pctLabel: "transport spending",
    colorFn: makeTreeColorFn({"Motor Vehicle Operation": 210, "Motor Vehicles": 240, "Public Transportation": 270}, 230)
  },
  24: {
    tree: RECREATION_TREE,
    title: "Recreation: $1.87 Trillion",
    subtitle: "BEA NIPA Table 2.5.5 — Personal consumption expenditures, 2024 (billions USD)",
    ariaLabel: "Treemap: $1.87T in recreation spending",
    pctLabel: "recreation spending",
    colorFn: makeTreeColorFn({"Video, Audio & Computers": 270, "Sports & Recreational Goods": 300, "Clubs, Parks, Theaters & Museums": 330, "Gambling": 15, "Pets & Pet Products": 45, "Magazines, Newspapers & Books": 190, "Package Tours": 170, "Photographic Goods & Services": 220}, 280)
  },
  25: {
    tree: FINANCIAL_TREE,
    title: "Financial Services & Insurance: $1.56 Trillion",
    subtitle: "BEA NIPA Table 2.5.5 — Personal consumption expenditures, 2024 (billions USD)",
    ariaLabel: "Treemap: $1.56T in financial services and insurance spending",
    pctLabel: "financial spending",
    colorFn: makeTreeColorFn({"Financial Services": 190, "Insurance": 250}, 220)
  },
  26: {
    tree: OTHER_TREE,
    title: "Other Goods & Services: $3.61 Trillion",
    subtitle: "BEA NIPA Table 2.5.5 — Personal consumption expenditures, 2024 (billions USD)",
    ariaLabel: "Treemap: $3.61T in other goods and services spending",
    pctLabel: "other spending",
    colorFn: makeTreeColorFn({"Other Goods & Services": 0, "Furnishings & Household Maintenance": 30, "Clothing, Footwear & Related": 280, "Education": 210, "Communication": 180, "Accommodations": 45, "Net Foreign Travel": 150}, 200)
  }
};

// Abbreviation map for small treemap cells
const ABBREV = {
  "Structures": "Struc.", "Equipment": "Equip.", "Intellectual Property": "IP",
  "Nonresidential": "Non-Res.", "Information Processing": "Info Proc.",
  "Transportation Equipment": "Transport", "Industrial Equipment": "Industrial",
  "Entertainment Originals": "Entertain.", "Research & Development": "R&D",
  "Commercial & Health Care": "Comm/Health", "Power & Communication": "Power/Comm",
  "Mining Exploration": "Mining", "Manufacturing": "Mfg.",
  "Residential Structures": "Residential", "Nonresidential Structures": "Non-Res.",
  "Nonresidential Equipment": "Non-Res.", "Residential Equipment": "Res. Equip.",
  "Ownership Transfer Costs": "Transfer Costs", "Manufactured Homes": "Manuf. Homes",
  "Multimerchandise Shopping": "Shopping", "Educational & Vocational": "Educ/Vocat.",
  "Petroleum & Natural Gas": "Petro & Gas", "Mining & Oilfield": "Mining/Oil",
  "Trucks, Buses & Trailers": "Trucks/Buses", "Railroad Equipment": "Railroad",
  "Fabricated Metal Products": "Fab. Metal", "Electrical Transmission": "Elec. Trans.",
  "Special Industry Machinery": "Special Mach.", "Construction Machinery": "Const. Mach.",
  "Service Industry Machinery": "Service Mach.", "Agricultural Machinery": "Ag. Mach.",
  "Nonmedical Instruments": "Instruments", "Photocopy & Related": "Photocopy",
  "Office & Accounting": "Office", "Other Nonresidential": "Other Non-Res.",
  "General Industrial": "General Ind.", "Metalworking Machinery": "Metalwork",
  "Engines & Turbines": "Engines", "Chemical (ex Pharma)": "Chemical",
  "Other Computer & Electronic": "Other Comp.", "Nonmanufacturing R&D": "Non-Mfg. R&D",
  "Manufacturing R&D": "Mfg. R&D", "Theatrical Movies": "Movies",
  "Military Facilities": "Military", "Conservation & Development": "Conserv/Dev",
  "Highways & Streets": "Highways", "Construction & Maintenance": "Const/Maint",
  "Household Operations": "Household Ops", "Household Supplies": "Supplies",
  "Maintenance & Repair": "Maint/Repair", "Homeowners Insurance": "Insurance",
  "Contractor Services": "Contractors", "Cleaning Services": "Cleaning",
  "Cleaning Products": "Cleaning", "Paper & Disposables": "Paper/Disp.",
  "Plumbing & Electrical": "Plumb/Elec", "Roofing & Exteriors": "Roofing",
  "Painting & Finishing": "Painting", "Building Materials": "Materials",
  "Cooking & Water Heating": "Cook/Heat", "Water, Sewer & Trash": "Water/Sewer",
  "Fuel Oil & Other Energy": "Fuel/Other", "Fuel Oil & Propane": "Fuel/Propane",
  "Bundled Community Utilities": "Community", "Septic & Well Services": "Septic/Well",
  "Other Utility Services": "Other Util.", "Subsidized & Public Housing": "Subsidized",
  "Townhomes & Duplexes": "Town/Duplex", "Large Complexes (50+ units)": "Large (50+)",
  "Small Buildings (2–4 units)": "Small (2–4)", "Mid-Size (5–49 units)": "Mid (5–49)",
  "Single-Family Rentals": "SF Rentals", "Single-Family Homes": "Single-Family",
  "Mobile & Manufactured": "Mobile", "Appliances & Lighting": "Appl/Light",
  "Heating & Cooling": "Heat/Cool", "Detached Houses": "Detached",
  "Security Systems": "Security", "Lawn Care Services": "Lawn Care",
  "Plants & Supplies": "Plants", "Other Operations": "Other Ops",
  "Other Owner Costs": "Other Costs"
};
