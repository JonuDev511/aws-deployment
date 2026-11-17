# Mehchana

A simple React JavaScript application built with Vite.

## Run locally

Use Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed in your terminal (usually http://localhost:5173).

Edit `src/App.jsx` to change the page and `src/index.css` to update its styles.

## Production build

```sh
npm run build
npm run preview
```

The production files are generated in `dist/`. This folder can be hosted on a static hosting service such as AWS Amplify or Amazon S3 with CloudFront.

## Vercel deployment

Import this repository into Vercel with the Vite framework preset. The checked-in `vercel.json` sets the build command to `npm run build` and the output directory to `dist`. Use Node.js 22.12 or newer. No environment variables are required for the current storefront.

The build generates HTML entry points for `/`, `/story`, and `/process`. Clean URLs and redirects without trailing slashes are configured in `vercel.json`. Cart data stays in the visitor's browser; checkout prepares a WhatsApp order request.

## Mehchana content and enquiries

The site uses the Mehchana brand throughout its copy, metadata, enquiries, and asset filenames. Jar artwork and the active process banner were edited with built-in imagegen to display `MEHCHANA`, retaining the existing packaging and illustration style.

The hero leads with “Rooted in tradition. Made for your everyday.” and introduces the expanded range through everyday cooking moments. The homepage includes Home, Our Products, Our Story, and Contact sections, product filters, expandable product details, FAQs, and a mobile menu. Content and product information live in `src/App.jsx`.

The `business` object at the top of `src/App.jsx` contains the supplied Mehchana email, phone, WhatsApp number, and Faridpur address. The enquiry form prepares a draft in the visitor's email app; the visitor sends it there. WhatsApp opens a prefilled conversation. Cart checkout prepares an order on WhatsApp; payment processing and online enquiry storage are not connected.

Four rounded product cards show cow ghee (₹2,700/kg), buffalo desi ghee (₹2,000/kg), cow-butter loni ghee (₹1,900/kg), and pure mustard oil (₹315/litre). Ghee pack buttons offer 250 g, 500 g, and 1 kg with calculated prices; mustard oil offers 1 litre (₹315), 5 litres (₹1,575), and 10 litres (₹3,150). Product data uses `rate`, `unit`, and `packs` in `src/App.jsx`. Filters show all products, desi ghee, butter, or mustard oil. The loni card has a BUTTER badge and appears under the separate Butter filter. The selected pack and price carry into the cart. The grid shows four cards on desktop, two on tablet, and one on small phones.

On mobile (up to 680px), Cow Ghee is the first card in a horizontal, snapping ghee row, with part of the Buffalo Desi Ghee card visible on the right to indicate more products. Swipe to view Buffalo Desi Ghee and Loni Ghee. A single filtered ghee card uses the full row width. Mustard Oil appears below the ghee row. Filters, pack selection, prices, and enquiries remain available, and desktop/tablet ordering is unchanged.

The design and wording are original to this project, with https://thaaro.in used as a structural reference. The existing Mehchana jar artwork is retained. New Indian thali photography is stored locally at `public/images/indian-table.jpg`, from https://images.unsplash.com/photo-1546833999-b9f581a1996d. Google Fonts supplies DM Sans and DM Serif Display, with local system font fallbacks.


## Product photographs

`public/images/mehchana-cow-ghee-front.png` and `public/images/mehchana-cow-ghee-back.png` are separate portrait edits of the user-supplied front/back packaging reference, prepared using the built-in image generation tool. The edit prompts request one panel per image, preserving the green/gold jar, sandstone backdrop, and label, with no divider, circular overlay, or circular framing. These are generated edits rather than pixel-exact crops.

The hero cycles every five seconds through front-facing cow ghee, buffalo desi ghee, mustard oil, and loni butter product images. Only the image changes; the hero text remains fixed. No back-label image is shown. The React effect clears its interval on unmount. Product cards use static product-specific artwork. Built-in imagegen created matching green-and-gold buffalo, loni, and mustard oil packaging mockups in `public/images/mehchana-{buffalo,loni,mustard}-product.png`, using the cow jar as a brand reference. These are presentation mockups, not photographs of final production packaging.

The active assets are `public/images/mehchana-cow-ghee-front-cutout.png` and `public/images/mehchana-cow-ghee-back-cutout.png`. Built-in imagegen background-extraction prompts requested: remove the palace, steps, stone plinth and all surroundings; retain only the complete front/back jar, its green/gold packaging and label, with a transparent alpha background and no new objects. Original scenic images are retained as source assets.


## Bilona process section

The homepage illustration has no caption row below it: step numbers, titles, and descriptions are removed on desktop and mobile.

The homepage Bilona Journey section spans the full page width, with a gently curved lower edge.

## Short videos and reels

The short-video section contains 10 compact portrait cards in a single horizontally scrolling row, with smaller headings, captions, badges, and section padding. Touch swiping, horizontal scrolling, and a keyboard-focusable track let visitors explore all 10 cards on desktop and mobile. Cards 1, 3, and 6 embed the user-supplied YouTube Shorts `FhM5m9TsZ9E`, `aw13WUfFbgU`, and `lcd3CcNeAZo`, respectively, with the privacy-enhanced YouTube player, inline playback, and fullscreen support. Each also links to its original Short. The original videos play unchanged; playback depends on YouTube availability and the owner's embedding settings. The previously generated illustrated animation remains at `public/videos/mehchana-village-mornings.mp4`, with its matching poster and renderer in `scripts/create-village-video.swift`. The remaining cards use image covers labeled “Video coming soon”. To publish another reel, add its MP4 under `public/videos/` and set that card's `videoSrc` in the `reels` array in `src/App.jsx`, or supply a YouTube `youtubeSrc` and `sourceUrl`.

The current banner uses `public/images/mehchana-bilona-process-compact.png`, edited with built-in imagegen to replace the patterned backdrop with plain dark green while retaining the five illustrations and Mehchana jar label. A responsive 4.5:1 frame removes excess green space above and below the illustrations while keeping the first cow and last jar visible. The section has less bottom padding on desktop and mobile.

The final packing illustration now matches the front product packaging: gold lid and seal, ornate green label, cow emblem, and gold Mehchana wordmark. Built-in imagegen replaced the earlier green-lidded jar using `mehchana-cow-ghee-front-cutout.png` as the packaging reference, retaining the spoon, background, and other four stages.

The meal-photo banner is replaced by a single full-width illustration displaying all five bilona stages together: milk to curd, wooden-bilona churning, slow heating, filtering, and packing. Mehchana confirmed this process. There are no process tabs or Previous / Next buttons; all five illustrations remain visible within the shorter frame. Product cards and their five-second image switching are unchanged.

The previous asset is `public/images/mehchana-bilona-process-spaced.png`, created with built-in imagegen from the original `public/images/mehchana-bilona-process.png`. Edit prompt: retain all five illustrated process stages in one continuous panoramic banner; replace cream panels and dividers with a deep forest-green background and subtle gold texture; no text, logos, arrows, or borders. The original illustration remains as a source asset.

The latest banner revision uses built-in imagegen to show a cow with milk, a mother preparing and churning, slow boiling, cloth filtering, and a finished Mehchana jar. Prompt: preserve the forest-green and gold illustration style; shrink and separate the five complete scenes with broad green gaps; retain one continuous image, with no panels or controls. Earlier banner versions are retained.


## Village story section

Our Story uses two clear AI-created landscape scenes with captions below the images, a concise village-based introduction, and three ghee process steps. The two-column scene gallery stacks on mobile; there are no overlapping photographs or text overlays.

The village banner appears only on `/story`, full width with a curved lower edge and “From our village to your kitchen” over the image. Mobile uses the closer, farmer-focused village milk image so the farmers and cattle remain visible in the taller frame; desktop uses the panoramic village scene. On the homepage, the Bilona Journey illustration is followed by five compact “Simple steps. Thoughtful care.” cards and the closing story message. Fresh milk, curd and churning, slow heating, filtering, and packing each show a smaller heading by default. Clicking or keyboard-activating a heading expands the full step details from the shared process data; activating it again collapses the card. The full-width card layout shows five columns on desktop, three on tablet, and one on mobile.

The closing green card contains both “Read our story” and “Explore our process” buttons. They sit together on desktop and stack within the card on mobile.

- `public/images/mehchana-village-milk-ai.png`: built-in imagegen prompt depicts imagined Haryana village farmers pouring milk into a steel can, a cow and calf, tidy brick houses, and natural morning light.
- `public/images/mehchana-mustard-fields-ai.png`: built-in imagegen prompt depicts an imagined farmer walking through flowering mustard fields beside a Haryana-style village.

Both generated images use a 1536 × 1024 landscape format, no embedded text, and natural photographic styling. The page identifies them as AI-created scenes inspired by Haryana village life. Earlier Pexels photographs remain as unused source assets.

## Story and process routes

`/story` opens from the header, announcement, homepage story link, and footer. It starts with the village banner and has an **Explore our process** link to `/process`. `/process` contains a plain green introduction, a glossary for khal, binola, and chana chhilka, and five alternating illustrated steps connected by a gold line. The mobile timeline uses one column and a connector down the left side. Feed copy explains ingredients without prescribing quantities; the page links to NDDB and TNAU references.

The app uses the browser History API for these three pages. Normal clicks navigate without a reload; browser Back/Forward, direct URLs, trailing slashes, and links back to `/#products` and `/#contact` are supported. The homepage catalogue and enquiry form remain on `/`. Page components, process copy, and route styling live in `src/pages/`.

`npm run build` also emits `dist/story/index.html` and `dist/process/index.html`, with page-specific titles and descriptions. Vite dev/preview serves the clean URLs. For S3 website hosting, upload the complete `dist` directory and use `index.html` as the index document. For CloudFront with an S3 REST origin, attach `deployment/cloudfront-routes.js` as a viewer-request CloudFront Function so `/story` and `/process` resolve to their emitted index files. Hosting configuration has not been changed by this local implementation.

## Mobile bottom navigation

On screens up to 680px, a fixed bottom bar provides Home, Shop, Search, Contact, and WhatsApp. It appears on all three pages and reserves space below the footer, including the device safe area. Contact and WhatsApp use the existing enquiry destinations.

The mobile header has a smaller Menu button and a shopping bag shortcut. The bag opens the cart on desktop and mobile, with a badge showing the total quantity of packs.

Search opens a native dialog with a focused search field, matches product names, Hindi names, descriptions, and category text, and displays pack prices. Selecting a result returns to that product on the homepage, clears catalogue filters, and opens its details. Escape, the close button, and the backdrop dismiss the dialog. The implementation lives in `src/components/MobileNavigation.jsx` and `mobile-navigation.css`.

## Frontend shopping cart

Each product has an **Add to cart** button for the selected pack. Adding the same product and pack increases its quantity; different pack sizes are separate lines. The cart opens immediately after adding an item and is also available from the header bag. Change quantities (1–99 per pack), remove items, and see line totals and the subtotal update immediately. Removing the last item shows an empty state without amounts or checkout controls. The design uses a sage header, individual product tiles, and a fixed checkout footer, without gift offers. Product cards use Add to cart; general enquiries remain available in Contact. Escape, the close button, and the backdrop close the cart.

Cart changes are saved automatically as JSON in `localStorage` under `mehchana-cart`, and restored after a refresh. The JSON includes schema version, INR currency, product IDs and names, pack indices and labels, quantities, unit prices, line totals, total quantity, subtotal, delivery fee, shipping charge, and final total. Delivery fee is free, and each nonempty order has a flat ₹49 shipping charge. The final total is the subtotal plus ₹49; empty carts have no shipping charge. Prices are recalculated from the current catalogue when restoring saved items. Invalid entries are ignored; unreadable data starts an empty cart with a message. If browser storage is unavailable or full, the cart still works for the current page session and shows a warning.

Cart JSON is saved automatically in browser storage; there is no cart download button. Browser storage is local to this browser and website origin; it does not write a JSON file into the deployed website or save orders on a server.

**Continue to checkout** opens delivery details (name, Indian mobile number, address, city, state, and PIN code) and an order review. Customers can edit their details or bag before choosing **Send order on WhatsApp**. The visitor sends the prepared message in WhatsApp; the draft includes the subtotal, free delivery fee, ₹49 shipping charge, and final total. Availability and payment are confirmed directly with Mehchana. Checkout does not claim an order has been placed or clear the cart. Customer details remain in page memory, and **Download order details** optionally exports a draft as `mehchana-order.json`. No payment gateway or server order storage is connected.

Cart logic lives in `src/cart.js` and `src/useCart.js`; the cart dialog and styling live in `src/components/Cart.jsx` and `cart.css`. Checkout validation and message creation live in `src/checkout.js`. Run `npm test` for cart data, persistence restoration, validation, quantity updates, removal totals, and checkout tests, and `npm run build` for the production build.
