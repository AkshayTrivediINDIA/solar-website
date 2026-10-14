-- Surya Solar — initial catalogue seed
-- Run AFTER supabase/schema.sql, in the Supabase SQL editor.
-- Safe to re-run: uses ON CONFLICT (slug) DO NOTHING.

begin;

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
insert into public.categories (name, slug, description, image_url, sort_order) values
  ('Solar Panels', 'solar-panels', 'BIS-certified mono PERC, TOPCon & bifacial solar modules for homes and industry.', 'https://picsum.photos/seed/solar-panel/800/800', 1),
  ('Solar Inverters', 'solar-inverters', 'On-grid, off-grid and hybrid solar inverters from 1 kVA to 100 kVA.', 'https://picsum.photos/seed/solar-inverter/800/800', 2),
  ('Solar Batteries', 'solar-batteries', 'Tubular and lithium solar batteries for reliable power backup.', 'https://picsum.photos/seed/solar-battery/800/800', 3),
  ('Rooftop Solar Systems', 'solar-systems', 'Complete on-grid & hybrid kits eligible for PM Surya Ghar subsidy.', 'https://picsum.photos/seed/solar-roof/800/800', 4),
  ('Charge Controllers', 'charge-controllers', 'MPPT & PWM solar charge controllers from 12V to 240V.', 'https://picsum.photos/seed/charge-controller/800/800', 5),
  ('Home Inverters', 'home-inverters', 'Pure sine wave home inverters for uninterrupted power backup.', 'https://picsum.photos/seed/home-inverter/800/800', 6)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
insert into public.products
  (name, slug, sku, category_id, short_description, description, price, mrp, unit, stock, wattage, capacity, featured, badge, images, specs, created_at)
values
  (
    '590 Watt N-Type TOPCon Bifacial Solar Module',
    '590-watt-topcon-bifacial-solar-panel',
    'SS-PNL-590-TC',
    (select id from public.categories where slug = 'solar-panels'),
    'High-efficiency dual glass bifacial module with 25-year performance warranty.',
    'The Surya Solar 590W N-Type TOPCon bifacial module delivers superior low-light performance and higher energy yield. Dual-glass construction ensures durability in harsh weather with a 30-year linear power warranty.',
    24500, 32000, 'per module', 48, 590, null, true, 'Bestseller',
    array['https://picsum.photos/seed/panel-590-1/800/800','https://picsum.photos/seed/panel-590-2/800/800','https://picsum.photos/seed/panel-590-3/800/800'],
    '[{"label":"Rated Power","value":"590 Wp"},{"label":"Module Type","value":"N-Type TOPCon Bifacial"},{"label":"Cells","value":"144 Half-Cut"},{"label":"Efficiency","value":"22.8%"},{"label":"Voltage","value":"24 V"},{"label":"Warranty","value":"12 yr product / 30 yr linear"}]'::jsonb,
    '2026-01-10T00:00:00.000Z'
  ),
  (
    '550 Watt 24V TOPCon Bi-Facial Dual Glass Panel',
    '550-watt-topcon-bifacial-solar-panel',
    'SS-PNL-550-TC',
    (select id from public.categories where slug = 'solar-panels'),
    'Reliable 550W dual-glass panel for residential and commercial rooftops.',
    'Built for Indian rooftops, this 550W bifacial TOPCon panel maximises generation per square foot and qualifies for subsidy-backed residential installations.',
    22020, 28626, 'per module', 60, 550, null, true, 'Sale',
    array['https://picsum.photos/seed/panel-550-1/800/800','https://picsum.photos/seed/panel-550-2/800/800'],
    '[{"label":"Rated Power","value":"550 Wp"},{"label":"Module Type","value":"TOPCon Bi-Facial"},{"label":"Efficiency","value":"21.6%"},{"label":"Voltage","value":"24 V"},{"label":"Warranty","value":"25 yr performance"}]'::jsonb,
    '2026-01-08T00:00:00.000Z'
  ),
  (
    '275 Watt N-Type TOPCon Solar Panel | 72 Cells',
    '275-watt-topcon-solar-panel',
    'SS-PNL-275-TC',
    (select id from public.categories where slug = 'solar-panels'),
    'Compact 275W module ideal for small rooftop and off-grid installations.',
    'A dependable 275W TOPCon module suited to limited roof space and small off-grid systems, with excellent temperature coefficient.',
    10380, 13494, 'per module', 90, 275, null, false, null,
    array['https://picsum.photos/seed/panel-275-1/800/800','https://picsum.photos/seed/panel-275-2/800/800'],
    '[{"label":"Rated Power","value":"275 Wp"},{"label":"Cells","value":"72"},{"label":"Voltage","value":"12 V"},{"label":"Warranty","value":"25 yr performance"}]'::jsonb,
    '2026-01-06T00:00:00.000Z'
  ),
  (
    '3kVA Transformer-less Hybrid Solar Inverter',
    '3kva-hybrid-solar-inverter',
    'SS-INV-3K-HYB',
    (select id from public.categories where slug = 'solar-inverters'),
    'Hybrid inverter with MPPT, grid export and battery management.',
    'The 3kVA transformer-less hybrid inverter combines solar MPPT charging, battery management and grid export in a single compact unit — perfect for modern homes.',
    78110, 132300, 'each', 15, null, '3 kVA', true, 'Bestseller',
    array['https://picsum.photos/seed/inv-3k-1/800/800','https://picsum.photos/seed/inv-3k-2/800/800'],
    '[{"label":"Capacity","value":"3 kVA"},{"label":"Type","value":"Hybrid"},{"label":"MPPT","value":"Dual MPPT"},{"label":"Efficiency","value":"97.6%"},{"label":"Display","value":"LCD + WiFi"}]'::jsonb,
    '2026-01-12T00:00:00.000Z'
  ),
  (
    '6 kW Single Phase Dual MPPT On-Grid Inverter',
    '6kw-on-grid-solar-inverter',
    'SS-INV-6K-OG',
    (select id from public.categories where slug = 'solar-inverters'),
    'Grid-tied inverter with dual MPPT and remote monitoring.',
    'A 6kW single phase on-grid inverter designed for net-metered rooftop systems with dual MPPT trackers for maximum yield.',
    35340, 51410, 'each', 22, null, '6 kW', true, 'Sale',
    array['https://picsum.photos/seed/inv-6k-1/800/800','https://picsum.photos/seed/inv-6k-2/800/800'],
    '[{"label":"Capacity","value":"6 kW"},{"label":"Type","value":"On-Grid"},{"label":"Phase","value":"Single Phase"},{"label":"MPPT","value":"Dual MPPT"},{"label":"Monitoring","value":"WiFi / App"}]'::jsonb,
    '2026-01-11T00:00:00.000Z'
  ),
  (
    'Gamma Plus MPPT Solar Inverter 1 kVA / 12V',
    'gamma-plus-1kva-solar-inverter',
    'SS-INV-1K-GP',
    (select id from public.categories where slug = 'solar-inverters'),
    'Entry-level rMPPT solar inverter for homes and small shops.',
    'Compact 1kVA rMPPT solar inverter with intelligent battery charging — an affordable entry into solar power backup.',
    11720, 16189, 'each', 40, null, '1 kVA', false, null,
    array['https://picsum.photos/seed/inv-1k-1/800/800'],
    '[{"label":"Capacity","value":"1 kVA"},{"label":"Battery Voltage","value":"12 V"},{"label":"Charging","value":"rMPPT"}]'::jsonb,
    '2026-01-05T00:00:00.000Z'
  ),
  (
    '150Ah Solar Tubular Battery',
    '150ah-solar-tubular-battery',
    'SS-BAT-150-TB',
    (select id from public.categories where slug = 'solar-batteries'),
    'Deep-cycle tubular battery designed for daily solar charging.',
    'Long-life 150Ah C10 tubular battery optimised for solar applications, delivering consistent backup through deep discharge cycles.',
    14500, 17900, 'each', 55, null, '150 Ah', true, null,
    array['https://picsum.photos/seed/batt-150-1/800/800','https://picsum.photos/seed/batt-150-2/800/800'],
    '[{"label":"Capacity","value":"150 Ah (C10)"},{"label":"Type","value":"Tubular"},{"label":"Warranty","value":"48 months"}]'::jsonb,
    '2026-01-07T00:00:00.000Z'
  ),
  (
    '5.1 kWh Lithium (LiFePO4) Solar Battery',
    '5kwh-lithium-solar-battery',
    'SS-BAT-LI-51',
    (select id from public.categories where slug = 'solar-batteries'),
    'Maintenance-free lithium battery with BMS and 6000+ cycles.',
    'A 5.1kWh LiFePO4 battery with integrated BMS, offering over 6000 charge cycles and a compact, maintenance-free footprint for modern solar systems.',
    149000, 175000, 'each', 10, null, '5.1 kWh', true, 'New',
    array['https://picsum.photos/seed/batt-li-1/800/800','https://picsum.photos/seed/batt-li-2/800/800'],
    '[{"label":"Energy","value":"5.1 kWh"},{"label":"Chemistry","value":"LiFePO4"},{"label":"Cycles","value":"6000+"},{"label":"BMS","value":"Integrated"}]'::jsonb,
    '2026-01-14T00:00:00.000Z'
  ),
  (
    'ShineX 5kW Single Phase Mono DCR On-Grid Solar Kit',
    '5kw-ongrid-solar-kit',
    'SS-KIT-5K-OG',
    (select id from public.categories where slug = 'solar-systems'),
    'Complete subsidy-eligible rooftop kit with DCR panels and on-grid inverter.',
    'Everything needed for a 5kW rooftop installation — Mono DCR solar panels, on-grid inverter, mounting structure, cabling and DISCOM documentation support. Eligible for PM Surya Ghar subsidy.',
    192900, 226200, 'per kit', 8, null, '5 kW', true, 'Subsidy',
    array['https://picsum.photos/seed/kit-5kw-1/800/800','https://picsum.photos/seed/kit-5kw-2/800/800','https://picsum.photos/seed/kit-5kw-3/800/800'],
    '[{"label":"System Size","value":"5 kW"},{"label":"Type","value":"On-Grid"},{"label":"Panels","value":"Mono PERC DCR"},{"label":"Subsidy","value":"PM Surya Ghar eligible"},{"label":"Structure","value":"GI mounting"}]'::jsonb,
    '2026-01-15T00:00:00.000Z'
  ),
  (
    'ShineX 3.2kW Rooftop On-Grid Solar Kit (DCR)',
    '3kw-ongrid-solar-kit',
    'SS-KIT-3K-OG',
    (select id from public.categories where slug = 'solar-systems'),
    'Ideal 3kW home kit with subsidy-eligible DCR modules.',
    'A 3.2kW rooftop kit suited to average Indian homes, cutting bills by up to 90% with net metering and full subsidy support.',
    119999, 177931, 'per kit', 12, null, '3.2 kW', true, 'Subsidy',
    array['https://picsum.photos/seed/kit-3kw-1/800/800','https://picsum.photos/seed/kit-3kw-2/800/800'],
    '[{"label":"System Size","value":"3.2 kW"},{"label":"Type","value":"On-Grid"},{"label":"Panels","value":"Mono PERC DCR"},{"label":"Subsidy","value":"Up to ₹78,000"}]'::jsonb,
    '2026-01-13T00:00:00.000Z'
  ),
  (
    '60A MPPT Solar Charge Controller (12/24/48V)',
    '60a-mppt-charge-controller',
    'SS-CC-60A',
    (select id from public.categories where slug = 'charge-controllers'),
    'Auto-detecting MPPT controller with LCD and load control.',
    '60A MPPT charge controller with auto system voltage detection, LCD display and USB charging — perfectly pairs with off-grid solar arrays.',
    8900, 11000, 'each', 35, null, '60 A', false, null,
    array['https://picsum.photos/seed/cc-60-1/800/800'],
    '[{"label":"Current","value":"60 A"},{"label":"Voltage","value":"12/24/48V auto"},{"label":"MPPT","value":"Yes"},{"label":"Display","value":"LCD"}]'::jsonb,
    '2026-01-04T00:00:00.000Z'
  ),
  (
    '30A PWM Solar Charge Controller',
    '30a-pwm-charge-controller',
    'SS-CC-30A',
    (select id from public.categories where slug = 'charge-controllers'),
    'Economical PWM controller for small solar setups.',
    'Reliable 30A PWM charge controller with protection against overcharge, deep discharge and short circuit.',
    1750, 2500, 'each', 80, null, '30 A', false, null,
    array['https://picsum.photos/seed/cc-30-1/800/800'],
    '[{"label":"Current","value":"30 A"},{"label":"Type","value":"PWM"},{"label":"Voltage","value":"12/24V"}]'::jsonb,
    '2026-01-03T00:00:00.000Z'
  ),
  (
    'Sun Plus 1860 Home Inverter (1475VA)',
    'sun-plus-1860-home-inverter',
    'SS-HINV-1860',
    (select id from public.categories where slug = 'home-inverters'),
    'Pure sine wave home inverter for silent, stable power backup.',
    'The Sun Plus 1860 home inverter supports running multiple appliances smoothly during power cuts, with intelligent charging and safe pure sine wave output.',
    6890, 11221, 'each', 25, null, '1475 VA', true, 'Sale',
    array['https://picsum.photos/seed/hinv-1860-1/800/800','https://picsum.photos/seed/hinv-1860-2/800/800'],
    '[{"label":"Capacity","value":"1475 VA"},{"label":"Waveform","value":"Pure Sine Wave"},{"label":"Application","value":"Home / Office"}]'::jsonb,
    '2026-01-09T00:00:00.000Z'
  ),
  (
    'Heliac 2200 VA Home Inverter | HL3000',
    'heliac-2200-home-inverter',
    'SS-HINV-2200',
    (select id from public.categories where slug = 'home-inverters'),
    'High-capacity sine wave inverter that can run heavy loads.',
    'Heliac 2200VA home inverter with advanced digital charging and MPPT support to power TVs, fridges, coolers and more.',
    13110, 29717, 'each', 18, null, '2200 VA', false, 'Sale',
    array['https://picsum.photos/seed/hinv-2200-1/800/800'],
    '[{"label":"Capacity","value":"2200 VA"},{"label":"Waveform","value":"Pure Sine Wave"},{"label":"Charging","value":"Digital + MPPT"}]'::jsonb,
    '2026-01-02T00:00:00.000Z'
  )
on conflict (slug) do nothing;

commit;
