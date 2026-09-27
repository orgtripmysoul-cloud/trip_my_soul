export interface BlogArticleSection {
  /** Omitted on the opening block, which runs straight into prose under the title. */
  heading?: string;
  paragraphs: string[];
}

export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  standfirst?: string;
  readMinutes?: number;
  sections: BlogArticleSection[];
  signoff?: string;
}

export const blogArticles: BlogArticle[] = [
  {
    slug: "kedarkantha-winter-trek-preparation-guide",
    title: "Kedarkantha Winter Trek – Complete Preparation Guide",
    excerpt:
      "Everything you need to know before your snow trek — layering, footwear, fitness, AMS awareness and the full winter packing checklist.",
    category: "Preparation Guide",
    date: "July 15, 2026",
    image: "/Trips_gallery/Kedarkantha/IMG_4130.JPG.jpeg",
    standfirst: "Everything You Need to Know Before Your Snow Trek",
    readMinutes: 12,
    sections: [
      {
        paragraphs: [
          "Kedarkantha is one of Uttarakhand's most popular winter treks, famous for snow-covered pine forests, frozen lakes, open mountain meadows and the spectacular summit experience.",
          "But a winter trek is very different from a regular mountain hike.",
          "Cold temperatures, snow-covered trails, early-morning summit climbs and changing mountain weather mean that proper preparation is essential.",
          "This guide by Trip My Soul will help you prepare physically, mentally and practically for your Kedarkantha winter trek.",
        ],
      },
      {
        heading: "1. Know What to Expect",
        paragraphs: [
          "Trek Region: Uttarkashi, Uttarakhand",
          "Base Village: Sankri",
          "Maximum Altitude: Approximately 3,800 m / 12,500 ft",
          "Trek Difficulty: Easy to Moderate, but winter snow can make the trail considerably more demanding.",
          "Best Winter Period: Generally December to February for the core winter experience, with snow conditions varying from season to season.",
          "Typical Winter Conditions:",
          "• Snow-covered trails",
          "• Frozen or partially frozen water sources",
          "• Cold winds",
          "• Sub-zero temperatures at night",
          "• Hard, frozen snow in the early morning",
          "• Fresh snow after snowfall",
          "• Reduced walking speed on steep sections",
          "Kedarkantha's winter landscape can be spectacular, but snow and weather conditions are not identical every year.",
        ],
      },
      {
        heading: "2. How Cold Does Kedarkantha Get?",
        paragraphs: [
          "Winter temperatures can vary significantly depending on altitude, wind, cloud cover and snowfall.",
          "At higher camps, nighttime temperatures can fall below freezing, and winter nights may reach around -10°C or lower in particularly cold conditions.",
          "The important rule is: Don't dress for the temperature. Dress for the conditions.",
          "Wind, snow, early-morning darkness and inactivity around camp can make you feel much colder than the thermometer suggests.",
        ],
      },
      {
        heading: "3. The Golden Rule: Layer Your Clothing",
        paragraphs: [
          "Do not depend on one extremely thick jacket.",
          "Instead, use multiple layers that you can add or remove according to the conditions.",
          "Layer 1 – Base Layer: Thermal top, thermal bottom, moisture-wicking fabric.",
          "Layer 2 – Warm Layer: Fleece jacket or warm sweater.",
          "Layer 3 – Insulation: Down/fleece jacket.",
          "Layer 4 – Wind & Snow Protection: Waterproof/windproof outer jacket, waterproof trekking trousers if required.",
          "Important: Avoid cotton as your main base layer. Cotton can retain moisture and make you colder.",
          "For winter trekking, carrying several warm layers is recommended. Uttarakhand's trekking guidance specifically lists woollen clothing, snow gloves, snow boots, gaiters, feather/down jackets and wind trousers among high-altitude trekking equipment.",
        ],
      },
      {
        heading: "4. Footwear – One of the Most Important Things",
        paragraphs: [
          "Your footwear can make or break a winter trek.",
          "Carry: high-ankle trekking shoes, good grip, waterproof or water-resistant construction, woollen/synthetic trekking socks, spare socks, gaiters for snow, microspikes/crampons when required by trail conditions.",
          "Avoid: sports shoes, running shoes, sneakers, smooth-soled shoes, brand-new shoes that have never been used.",
          "Your shoes should be broken in before the trek.",
          "During winter, snow can freeze overnight and become hard and slippery, particularly during the early-morning summit climb.",
        ],
      },
      {
        heading: "5. Gloves, Socks & Head Protection",
        paragraphs: [
          "Your hands, feet and head lose heat quickly.",
          "Carry: 2 pairs of warm socks, 1 pair of thermal socks if required, warm inner gloves, waterproof/windproof outer gloves, woollen cap, balaclava or warm beanie, neck warmer/buff.",
          "Keep a dry pair of socks reserved for sleeping.",
          "Never sleep wearing wet socks.",
        ],
      },
      {
        heading: "6. Backpack Preparation",
        paragraphs: [
          "Keep your backpack as light as possible.",
          "Recommended essentials: trekking backpack, rain cover, water bottle, headlamp, sunglasses, sunscreen, lip balm, personal medicines, basic toiletries, power bank, ID proof, small first-aid kit, dry bags/zip-lock bags, personal snacks.",
          "Pack clothes inside waterproof bags.",
          "Snow and moisture can quickly make clothes and sleeping equipment uncomfortable.",
        ],
      },
      {
        heading: "7. Sunglasses Are Essential",
        paragraphs: [
          "Snow reflects sunlight strongly.",
          "This can cause intense glare and discomfort and can contribute to snow blindness.",
          "Carry UV-protected sunglasses, preferably with good side coverage.",
          "Never underestimate the intensity of sunlight on snow.",
        ],
      },
      {
        heading: "8. Sunscreen & Lip Balm",
        paragraphs: [
          "Even in winter, UV exposure at high altitude can be strong.",
          "Carry SPF 30–50 sunscreen, SPF lip balm and moisturiser.",
          "Apply sunscreen to exposed areas such as face, nose, ears, neck and hands. Reapply when required.",
        ],
      },
      {
        heading: "9. Water & Hydration",
        paragraphs: [
          "Cold weather often reduces the feeling of thirst.",
          "That does not mean your body needs less water. Drink regularly throughout the trek.",
          "Recommended: insulated water bottle, thermos if required, ORS/electrolytes, hydration salts.",
          "In very cold conditions, water bottles can freeze. Keep the bottle insulated and avoid leaving it exposed outside your tent overnight.",
        ],
      },
      {
        heading: "10. Fitness Preparation",
        paragraphs: [
          "You don't need to be an athlete to complete Kedarkantha, but you should arrive with a reasonable level of cardiovascular fitness and leg strength.",
          "Start preparing 4–6 weeks before the trek.",
          "Cardio: choose one of brisk walking, jogging, cycling or stair climbing. Aim for approximately 30–45 minutes, 4–5 days per week.",
          "Strength: focus on squats, lunges, step-ups, calf raises and planks.",
          "The summit day involves sustained climbing and descent, so strong legs and good endurance are particularly useful. The summit section can take several hours and becomes more challenging when covered with winter snow.",
        ],
      },
      {
        heading: "11. Practice Walking With Your Backpack",
        paragraphs: [
          "Don't wait until Kedarkantha to carry a loaded backpack.",
          "At least once or twice before the trek: load your backpack with approximately the weight you expect to carry, walk for 1–2 hours, practice climbing stairs, check whether your shoes cause blisters and adjust your backpack straps.",
          "This helps your body adapt before the trek.",
        ],
      },
      {
        heading: "12. Prepare for the Summit Day",
        paragraphs: [
          "The summit day is usually the most demanding part of Kedarkantha.",
          "Expect an early morning start, cold temperatures, a snow-covered trail, steeper sections, slow walking, strong winds at exposed points and a long descent after reaching the summit.",
          "The summit is around 3,800 m / 12,500 ft, and the winter climb can involve hard, frozen snow.",
          "Don't rush. Maintain a steady pace. Slow and steady is safer than fast and exhausted.",
        ],
      },
      {
        heading: "13. Acute Mountain Sickness – AMS",
        paragraphs: [
          "Kedarkantha reaches an altitude where altitude-related illness can occur.",
          "Know the common symptoms: headache, nausea, dizziness, unusual fatigue, loss of appetite, shortness of breath, difficulty sleeping.",
          "What should you do? Immediately inform your trek leader or guide if you experience symptoms.",
          "Do not hide symptoms because you want to reach the summit.",
          "Important Rule: Your health is more important than the summit.",
          "If the trek leader decides that conditions are unsafe for a participant, the decision should be respected.",
          "Altitude gain to around 12,500 ft makes proper acclimatisation, pacing and monitoring important.",
        ],
      },
      {
        heading: "14. Never Ignore Weather",
        paragraphs: [
          "Mountain weather can change rapidly.",
          "Snowfall or prolonged rainfall can alter trail conditions and may make previously established routes difficult to follow.",
          "Before and during the trek, the TMS team monitors weather forecast, snowfall, trail conditions, road conditions, visibility, temperature and local advisories.",
          "If conditions become unsafe, the trek itinerary may need to be modified or the summit attempt may be cancelled.",
          "The mountain will always be there. Safety comes first.",
        ],
      },
      {
        heading: "15. Winter Snow Safety",
        paragraphs: [
          "When walking on snow: walk carefully, place your foot firmly before transferring your full body weight, avoid running on steep snow and use trekking poles where appropriate.",
          "On hard or icy sections, use appropriate traction equipment such as microspikes when advised by the trek team.",
          "Never walk away from the designated trail without your trek leader.",
        ],
      },
      {
        heading: "16. Keep Your Electronics Warm",
        paragraphs: [
          "Cold temperatures can reduce battery performance.",
          "Carry a power bank, phone, camera batteries and charging cable.",
          "Keep your phone and power bank inside an inner jacket pocket or insulated pouch when possible.",
          "Avoid leaving batteries outside your sleeping bag overnight.",
        ],
      },
      {
        heading: "17. Food Preparation",
        paragraphs: [
          "Winter trekking increases energy requirements.",
          "Carry small, high-energy snacks such as dry fruits, chocolate, energy bars, peanut butter, nuts and glucose/electrolyte sachets.",
          "Eat regularly rather than waiting until you feel completely exhausted.",
          "TMS provides meals according to the trek package, but personal snacks are useful during the trail.",
        ],
      },
      {
        heading: "18. Personal Medical Kit",
        paragraphs: [
          "Carry your regular prescription medicines.",
          "Also consider carrying basic first-aid supplies, blister protection, ORS, personal medication and prescription copies if necessary.",
          "Do not self-medicate for altitude illness without appropriate medical guidance.",
          "Always inform the TMS team about relevant medical requirements before departure.",
        ],
      },
      {
        heading: "19. Things You Should NOT Carry",
        paragraphs: [
          "Avoid unnecessary weight.",
          "Do not overload your backpack with excess clothes, heavy cosmetics, large bottles, unnecessary electronics, multiple pairs of shoes, heavy food items or unnecessary luggage.",
          "Remember: every extra kilogram becomes heavier on a mountain.",
        ],
      },
      {
        heading: "20. Essential Winter Packing Checklist",
        paragraphs: [
          "Clothing: thermal top, thermal bottom, fleece jacket, down/insulated jacket, windproof/waterproof jacket, trekking trousers, warm socks, extra socks, warm gloves, waterproof outer gloves, woollen cap, balaclava/neck warmer.",
          "Footwear: high-ankle trekking shoes, gaiters, microspikes/traction equipment if advised.",
          "Personal Gear: backpack, backpack rain cover, headlamp, sunglasses, sunscreen, lip balm, water bottles, ORS/electrolytes, power bank, personal medicines, ID proof, personal toiletries.",
          "Optional but Useful: trekking poles, thermos, hand warmers, dry bags, small snacks.",
        ],
      },
      {
        heading: "21. What TMS Trekkers Should Remember",
        paragraphs: [
          "Before Leaving Home: check your fitness, break in your trekking shoes, check your winter clothing, keep your ID ready, pack light, inform TMS about relevant medical requirements and check the latest departure instructions.",
          "At Sankri: attend the trek briefing, check your equipment, ask your trek leader about the latest weather and trail conditions, and don't start the trek without proper equipment.",
          "During the Trek: stay with the group, follow the trek leader, maintain hydration, walk at a comfortable pace, don't take shortcuts, don't litter and report any health problem immediately.",
        ],
      },
      {
        heading: "22. Respect the Himalayas",
        paragraphs: [
          "Kedarkantha is part of a fragile Himalayan ecosystem.",
          "Every trekker has a responsibility to protect it.",
          "Follow the TMS Leave No Trace principles: carry your waste back, avoid single-use plastic, do not damage vegetation, do not disturb wildlife, do not play loud music in the forest, and respect local communities and mountain culture.",
          "Leave the trail as beautiful as you found it.",
        ],
      },
      {
        heading: "Final Word From Trip My Soul",
        paragraphs: [
          "Kedarkantha is often called a beginner-friendly winter trek, but beginner-friendly does not mean preparation-free.",
          "The snow, cold, altitude and summit climb demand respect.",
          "Come prepared, listen to your trek team, walk at your own pace and respect the mountain.",
          "And when you finally stand on the Kedarkantha summit surrounded by the snow-covered Himalayas, you'll understand why the preparation was worth it.",
        ],
      },
    ],
    signoff: "Prepare well. Trek responsibly. Experience the Himalayas with Trip My Soul.",
  },
  {
    slug: "why-kuari-pass-trek-should-be-on-your-bucket-list",
    title: "Why Kuari Pass Trek Should Be on Your Bucket List",
    excerpt:
      "Forests, alpine meadows, high ridges and views of Nanda Devi, Dronagiri and Kamet — the Curzon Trail is a true Himalayan expedition.",
    category: "Trek Stories",
    date: "June 28, 2026",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    standfirst: "Walk Through the Heart of the Himalayas",
    readMinutes: 6,
    sections: [
      {
        paragraphs: [
          "If you're looking for a Himalayan trek that combines beautiful forests, dramatic mountain views, high-altitude meadows and an unforgettable summit experience, Kuari Pass deserves a place on your bucket list.",
          "Known as the \"Curzon Trail,\" Kuari Pass takes you through some of the most scenic landscapes of the Garhwal Himalayas, with magnificent views of peaks such as Nanda Devi, Dronagiri, Kamet, Chaukhamba and Neelkanth on clear days.",
          "Here are a few reasons to experience it with Trip My Soul.",
        ],
      },
      {
        heading: "🏔️ Unforgettable Himalayan Views",
        paragraphs: [
          "Kuari Pass is famous for its panoramic mountain scenery.",
          "As you climb higher, the landscape opens up to spectacular views of some of the most impressive peaks of the Garhwal Himalayas.",
          "On clear days, the mountains feel incredibly close — creating moments you'll remember long after the trek is over.",
        ],
      },
      {
        heading: "🌲 Walk Through Ancient Himalayan Forests",
        paragraphs: [
          "The trail passes through beautiful forests of oak, rhododendron, birch and conifers.",
          "Walking beneath tall Himalayan trees, surrounded by fresh mountain air and birdsong, gives the trek a completely different character from a typical high-altitude hike.",
        ],
      },
      {
        heading: "🌿 Beautiful Alpine Meadows",
        paragraphs: [
          "Kuari Pass isn't only about climbing.",
          "The trail takes you across wide Himalayan meadows where the landscape suddenly opens into enormous views of the surrounding mountains.",
          "These open ridgelines and bugyals are among the most memorable sections of the trek.",
        ],
      },
      {
        heading: "🥾 A Trek That Feels Like a True Himalayan Expedition",
        paragraphs: [
          "Kuari Pass offers a wonderful combination of: Forests → Meadows → Ridges → Snow → High Mountain Pass.",
          "Every day brings a different landscape, making the journey itself as rewarding as reaching the pass.",
        ],
      },
      {
        heading: "❄️ A Completely Different Experience in Winter",
        paragraphs: [
          "During winter, snowfall transforms Kuari Pass.",
          "Forests become covered in snow, meadows turn white and the Himalayan peaks stand against a dramatic winter landscape.",
          "For trekkers looking for a genuine Himalayan snow experience, winter can make Kuari Pass especially memorable.",
        ],
      },
      {
        heading: "📸 Incredible Photography Opportunities",
        paragraphs: [
          "Almost every section of the trek offers a frame worth capturing.",
          "From misty forests and mountain villages to golden meadows and enormous Himalayan peaks, Kuari Pass is ideal for travellers who love landscape photography.",
          "But don't spend the entire trek behind your phone. Some views are better experienced than photographed.",
        ],
      },
      {
        heading: "🏕️ Experience the Magic of Himalayan Camps",
        paragraphs: [
          "Imagine waking up in a quiet Himalayan campsite, stepping outside your tent and seeing enormous mountain peaks in the distance.",
          "Camping is an important part of the Kuari Pass experience — giving you the opportunity to experience the mountains beyond the usual sightseeing trip.",
        ],
      },
      {
        heading: "🌄 The Journey Is as Beautiful as the Destination",
        paragraphs: [
          "Kuari Pass isn't simply about reaching a particular altitude.",
          "It's about the entire journey: the mountain roads, the forests, the villages, the meadows, the changing weather, the camps and the friendships.",
          "And finally, the mountains opening up before you.",
          "That's what makes trekking different from simply visiting the Himalayas.",
        ],
      },
      {
        heading: "❤️ A Trek That Stays With You",
        paragraphs: [
          "Some journeys give you photographs. Some give you stories.",
          "A Himalayan trek can give you both — and something more.",
          "The feeling of walking farther than you thought you could, waking up above the clouds and standing among the great peaks is an experience that stays with you.",
        ],
      },
      {
        heading: "Your Himalayan Story Starts Here",
        paragraphs: [
          "Kuari Pass is more than a trek on a map.",
          "It's a journey through the forests, meadows and high mountains of the Garhwal Himalayas — and an opportunity to experience the Himalayas on foot.",
          "Pack your backpack. Leave the ordinary behind.",
        ],
      },
    ],
    signoff: "Your Kuari Pass adventure awaits with Trip My Soul.",
  },
  {
    slug: "sustainable-trekking-leave-no-trace-in-the-himalayas",
    title: "Sustainable Trekking: Leave No Trace in the Himalayas",
    excerpt:
      "How Trip My Soul and its trekkers protect Himalayan trails, wildlife, water sources and mountain communities on every expedition.",
    category: "Sustainability",
    date: "May 10, 2026",
    image: "/Trips_gallery/Brahmatal/IMG_4310.JPG.jpeg",
    standfirst: "The Mountains Give Us Memories. Let's Leave Them Their Beauty.",
    readMinutes: 8,
    sections: [
      {
        paragraphs: [
          "The Himalayas are more than a destination.",
          "They are home to forests, wildlife, rivers, villages and communities that have existed here for generations.",
          "When we trek through these landscapes, we are visitors.",
          "At Trip My Soul, we believe that every trekker has a responsibility to protect the mountains they came to experience.",
          "Our goal is simple: Take only memories. Leave only footprints.",
        ],
      },
      {
        heading: "🌿 What Does Leave No Trace Mean?",
        paragraphs: [
          "Leave No Trace is a simple approach to travelling responsibly in nature.",
          "It means enjoying the mountains without damaging the environment, disturbing wildlife or creating unnecessary waste.",
          "Small actions from every trekker can make a meaningful difference.",
        ],
      },
      {
        heading: "1. Carry Your Waste Back",
        paragraphs: [
          "A beautiful trail can quickly become polluted when trekkers leave behind plastic wrappers, bottles and food packaging.",
          "Our rule is simple: if you carry it into the mountains, carry it back out.",
          "Please keep your waste in your backpack until it can be disposed of responsibly.",
          "Never throw wrappers, tissues or bottles along the trail.",
        ],
      },
      {
        heading: "2. Say No to Single-Use Plastic",
        paragraphs: [
          "Avoid unnecessary plastic wherever possible.",
          "Carry reusable water bottles, reusable bags, personal refillable containers and reusable cutlery where practical.",
          "Every plastic item avoided is one less piece of waste that could remain in the mountains.",
        ],
      },
      {
        heading: "3. Stay on the Designated Trail",
        paragraphs: [
          "The trail exists for a reason.",
          "Walking outside established paths can damage fragile vegetation and widen erosion-prone areas.",
          "Stay on the marked route. Don't create shortcuts just to save a few minutes.",
          "A shortcut for one trekker can become a damaged trail for thousands.",
        ],
      },
      {
        heading: "4. Respect Himalayan Wildlife",
        paragraphs: [
          "The Himalayas are home to incredible wildlife.",
          "You may encounter birds, insects or other animals during your trek.",
          "Observe them from a safe distance.",
          "Never chase wildlife, feed animals, disturb nests, remove plants or flowers, or try to touch wild animals.",
          "The best wildlife encounter is one where the animal barely notices you were there.",
        ],
      },
      {
        heading: "5. Protect the Forests",
        paragraphs: [
          "Himalayan forests are fragile ecosystems.",
          "Do not break branches, carve names into trees, pick flowers unnecessarily, damage vegetation, or light fires where they are not permitted.",
          "Leave plants exactly where they belong.",
        ],
      },
      {
        heading: "6. Respect Local Communities",
        paragraphs: [
          "Mountain villages are not tourist attractions. They are people's homes.",
          "Respect local customs, traditions and privacy.",
          "Be a responsible guest: ask before photographing people, respect local religious places, dress appropriately where required, avoid unnecessary noise and support local businesses and services.",
          "A respectful traveller leaves behind goodwill, not just footprints.",
        ],
      },
      {
        heading: "7. Keep the Mountains Quiet",
        paragraphs: [
          "The sound of the Himalayas is part of the experience.",
          "Wind through the trees. Birdsong. Flowing streams. Silence.",
          "Avoid loud music and unnecessary noise, especially near campsites, villages and wildlife habitats.",
          "Let the mountains be heard.",
        ],
      },
      {
        heading: "8. Be Careful With Water",
        paragraphs: [
          "Mountain streams and springs are precious resources.",
          "Do not throw plastic, food waste, soap, shampoo or chemicals into natural water sources.",
          "Use water responsibly and follow your trek team's instructions regarding drinking-water sources.",
        ],
      },
      {
        heading: "9. Camp Responsibly",
        paragraphs: [
          "Your campsite should look almost exactly the same after you leave as it did when you arrived.",
          "Before leaving: check your tent area, check around your sleeping space, check the cooking area, and check for small pieces of plastic or packaging.",
          "If you find waste left behind by someone else and it is safe to collect, consider carrying it out too.",
        ],
      },
      {
        heading: "10. Toilets & Human Waste",
        paragraphs: [
          "Always follow the campsite and trek team's instructions for toilet facilities.",
          "Never defecate close to streams, lakes, water sources, campsites or trails.",
          "Human waste can contaminate fragile mountain environments and water sources.",
          "Use designated facilities wherever available.",
        ],
      },
      {
        heading: "Our Responsibility as Trekkers",
        paragraphs: [
          "Sustainable trekking isn't about doing one big thing.",
          "It's about making better choices throughout the journey.",
          "One bottle less. One wrapper carried back. One flower left untouched. One trail kept intact. One mountain community treated with respect.",
          "Together, these small choices create a much bigger impact.",
        ],
      },
      {
        heading: "Our Commitment at Trip My Soul",
        paragraphs: [
          "At Trip My Soul, we want our guests to experience the Himalayas while helping protect the landscapes that make these journeys possible.",
          "We encourage every trekker to respect the trail, respect the wildlife, respect local communities, reduce waste, protect water sources and Leave No Trace.",
          "Because the mountains don't belong only to us.",
          "We are borrowing them from the generations that come after us.",
        ],
      },
    ],
    signoff: "Trek More. Leave Less. Trip My Soul — Travel with purpose. Trek with responsibility.",
  },
  {
    slug: "how-to-choose-between-har-ki-dun-and-kedarkantha",
    title: "How to Choose Between Har Ki Dun and Kedarkantha?",
    excerpt:
      "Two treks from the same base village, two very different Himalayan experiences — a side-by-side guide to help you pick the right one.",
    category: "Preparation Guide",
    date: "April 05, 2026",
    image: "/Trips_gallery/Har_Ki_Dun/HKD_river_pines.jpeg",
    standfirst: "Two Treks. Two Completely Different Himalayan Experiences.",
    readMinutes: 9,
    sections: [
      {
        paragraphs: [
          "Both Har Ki Dun and Kedarkantha begin around Sankri, but the experience you get on each trek is very different.",
          "So instead of asking, \"Which trek is better?\" ask yourself: \"What kind of Himalayan experience am I looking for?\"",
          "If you dream of snow, a summit and a spectacular mountain sunrise, Kedarkantha may suit you.",
          "If you want valleys, forests, rivers, traditional Himalayan villages and a longer journey into the mountains, Har Ki Dun may be the better match for your interests.",
        ],
      },
      {
        heading: "Kedarkantha vs Har Ki Dun — At a Glance",
        paragraphs: [
          "Kedarkantha: summit trek, approx. 3,800 m, 4–6 days, built around a snow summit push.",
          "Har Ki Dun: valley trek, approx. 3,566 m, 6–8 days, built around longer walking through villages and nature.",
        ],
      },
      {
        heading: "Choose Kedarkantha If You Want…",
        paragraphs: [
          "❄️ Snow-Covered Himalayan Trails — if walking through snow-covered pine forests is high on your bucket list, Kedarkantha is particularly suited to a winter itinerary. The landscape changes dramatically with snowfall, creating a classic Himalayan winter trekking experience.",
          "🏔️ A Real Summit Experience — Kedarkantha is a summit trek. The journey builds towards a final summit climb, where clear weather can open up wide views of surrounding Himalayan peaks. For someone who wants the satisfaction of saying \"I reached a Himalayan summit,\" Kedarkantha offers that experience.",
          "🌅 A Summit Sunrise — one of the defining moments of the trek is the summit push and the possibility of watching the Himalayan landscape light up around sunrise. The early start, cold air and snow-covered trail make the experience feel like a genuine mountain adventure.",
          "🎒 A Shorter Himalayan Adventure — if you have limited time, Kedarkantha can be easier to fit into a schedule because typical itineraries are shorter than Har Ki Dun. That makes it attractive for people who want a Himalayan trek without committing to a longer valley expedition.",
        ],
      },
      {
        heading: "Choose Har Ki Dun If You Want…",
        paragraphs: [
          "🌿 A Journey Through a Himalayan Valley — Har Ki Dun is a valley trek, where the valley itself is the destination. Instead of one major summit push, the journey takes you deeper into the landscape through forests, rivers, meadows and mountain settlements.",
          "🏡 Traditional Himalayan Villages — one of Har Ki Dun's defining features is its connection with traditional Himalayan settlements, including the villages around Osla and Seema. You get to experience more than just the landscape — you encounter the culture and way of life of mountain communities.",
          "🌲 Forests, Rivers & Meadows — Har Ki Dun offers a constantly changing landscape: dense forests → mountain streams → wooden bridges → villages → open meadows → high Himalayan valley. The experience develops gradually over several days.",
          "🥾 A Longer Trekking Journey — Har Ki Dun generally involves substantially more cumulative walking than Kedarkantha. That means the challenge is less about one steep summit push and more about endurance over multiple days.",
        ],
      },
      {
        heading: "What Kind of Trekker Are You?",
        paragraphs: [
          "\"I want snow and a summit.\" → Consider Kedarkantha.",
          "\"I want villages and Himalayan culture.\" → Consider Har Ki Dun.",
          "\"I have only a few days.\" → Kedarkantha may fit more easily.",
          "\"I want a longer journey into the mountains.\" → Consider Har Ki Dun.",
          "\"This is my first Himalayan trek and I want a summit experience.\" → Kedarkantha is worth considering.",
          "\"I enjoy walking through valleys more than climbing to a summit.\" → Har Ki Dun may be more suitable.",
        ],
      },
      {
        heading: "What About Fitness?",
        paragraphs: [
          "Don't assume that the lower altitude of Har Ki Dun automatically makes it easier.",
          "The two treks test different kinds of fitness.",
          "Kedarkantha: the biggest challenge is generally the summit day, particularly when snow or hard-packed winter conditions are present.",
          "Har Ki Dun: the challenge is more about sustained endurance, because the trek covers a longer distance over several days.",
          "So ask yourself: do you prefer a shorter trek with a demanding summit day, or a longer trek with sustained walking?",
        ],
      },
      {
        heading: "Which One Should You Choose by Season?",
        paragraphs: [
          "Season matters enormously.",
          "Winter: Kedarkantha is particularly associated with the winter snow experience, while Har Ki Dun's ideal conditions and landscape are generally associated with other seasons.",
          "Spring & Autumn: Har Ki Dun can be especially appealing if your priority is the valley landscape, villages, forests and changing colours.",
          "Always check current weather, trail and permit conditions before departure.",
        ],
      },
      {
        heading: "The Simple Decision",
        paragraphs: [
          "Choose Kedarkantha if your dream is: ❄️ Snow, 🏔️ Summit, 🌅 Sunrise, 🌲 Snow-covered forests, 🎒 Shorter adventure.",
          "Choose Har Ki Dun if your dream is: 🌿 Himalayan valley, 🏡 Traditional villages, 🌊 Rivers & streams, 🌲 Forests & meadows, 🥾 Longer wilderness journey.",
        ],
      },
      {
        heading: "Still Confused?",
        paragraphs: [
          "Don't choose based only on photographs.",
          "Think about the experience you want to take home.",
          "If your dream is to stand on a snowy Himalayan summit — Kedarkantha.",
          "If your dream is to walk deep into a Himalayan valley and experience its landscapes and villages — Har Ki Dun.",
          "There is no single \"better\" trek. There is simply the trek that matches your idea of adventure.",
        ],
      },
    ],
    signoff:
      "Kedarkantha or Har Ki Dun — whichever path you choose, we'll help you prepare for the mountains. Trip My Soul — Your Journey. Your Mountains. Your Story.",
  },
  {
    slug: "mountain-sickness-prevention-and-ams-protocol",
    title: "Mountain Sickness: Prevention & AMS Protocol",
    excerpt:
      "Know the symptoms, understand acclimatisation and follow the TMS AMS protocol — because the summit is optional, your safety is not.",
    category: "Preparation Guide",
    date: "Feb 18, 2026",
    image: "/Trips_gallery/Kuari%20Pass%20trek/IMG_4240.JPG.jpeg",
    standfirst: "Know the Symptoms. Respect the Altitude. Stay Safe.",
    readMinutes: 10,
    sections: [
      {
        paragraphs: [
          "The Himalayas offer extraordinary experiences, but altitude demands respect.",
          "As you climb higher, the amount of oxygen available to your body decreases. Some trekkers may develop Acute Mountain Sickness (AMS) as their body adjusts to the altitude.",
          "AMS can affect anyone, regardless of age, fitness level or previous trekking experience.",
          "At Trip My Soul, we believe that reaching the summit is never more important than your safety.",
        ],
      },
      {
        heading: "What Is Acute Mountain Sickness?",
        paragraphs: [
          "Acute Mountain Sickness is an altitude-related illness that can develop after ascending to higher elevations before the body has fully acclimatised.",
          "Symptoms commonly include headache, nausea, dizziness, fatigue, loss of appetite, vomiting and difficulty sleeping.",
          "Symptoms commonly begin within several hours after reaching a higher altitude and often become noticeable during or after the first night.",
          "Remember: AMS is not a test of fitness. Even very fit trekkers can experience altitude sickness.",
        ],
      },
      {
        heading: "Why Does AMS Happen?",
        paragraphs: [
          "At higher altitude, atmospheric pressure decreases and less oxygen is available with each breath.",
          "Your body needs time to adapt. The most important protection is therefore gradual acclimatisation.",
          "Going too high too quickly increases the risk of altitude illness.",
        ],
      },
      {
        heading: "How to Prevent AMS",
        paragraphs: [
          "1. Ascend Gradually — avoid unnecessary rapid altitude gain. Once above approximately 3,000 metres, established medical guidance recommends limiting increases in sleeping altitude to around 500 metres per day, with additional acclimatisation time as needed. Trek itineraries should be designed with sensible altitude gain and opportunities for acclimatisation.",
          "2. Don't Push Through Symptoms — this is one of the most important rules on a high-altitude trek. If you develop symptoms of AMS, stop ascending and tell your trek leader. Do not continue climbing simply because the group is moving ahead. Worsening symptoms despite rest or treatment are a reason to descend.",
          "3. Stay Hydrated — But Don't Overhydrate — drink regularly according to thirst and activity. Avoid the idea that drinking excessive amounts of water will prevent AMS. The Wilderness Medical Society specifically does not recommend forced or excessive hydration as an AMS-prevention strategy.",
          "4. Avoid Alcohol — alcohol can interfere with acclimatisation and can worsen sleep-related problems at altitude. The CDC recommends avoiding alcohol during the first 48 hours at high altitude.",
          "5. Pace Yourself — at altitude, your normal walking pace may feel much harder. Follow a comfortable rhythm: slow, steady, consistent. Don't race other trekkers. A slower pace allows you to conserve energy and makes it easier to recognise changes in how you feel.",
        ],
      },
      {
        heading: "Know the Early Warning Signs",
        paragraphs: [
          "Mild AMS may include headache plus one or more of: nausea, dizziness, fatigue, poor appetite, difficulty sleeping.",
          "These symptoms should never be ignored. Tell your trek leader immediately.",
          "Early reporting allows the team to monitor you and decide whether you should rest, stop ascending or descend.",
        ],
      },
      {
        heading: "TMS AMS Protocol",
        paragraphs: [
          "Step 1 — Identify: the trek leader or guide checks the trekker's symptoms and recent altitude gain. Other possible causes of similar symptoms — such as dehydration, exhaustion, infection or other medical problems — may also need to be considered.",
          "Step 2 — Stop Ascent: if AMS is suspected, no further ascent until symptoms have resolved. The trekker should rest and remain under observation.",
          "Step 3 — Monitor: the TMS team monitors symptoms, level of alertness, walking ability, breathing, general condition and response to rest/treatment. A pulse oximeter may be used as an additional monitoring tool, but oxygen saturation alone should not be used to diagnose or rule out AMS.",
          "Step 4 — Reassess: if symptoms improve and the trekker is otherwise well, the medical/trek team determines whether continuing is appropriate. If symptoms remain or worsen, do not ascend — descent should be considered, and worsening symptoms despite treatment require descent.",
        ],
      },
      {
        heading: "When Descent Becomes Mandatory",
        paragraphs: [
          "Descent is particularly important when symptoms are worsening, symptoms do not improve at the same altitude, there are signs of severe altitude illness, the trekker develops neurological symptoms, or the trekker develops significant breathing difficulty.",
          "A descent of approximately 300 metres or more can produce rapid improvement in AMS symptoms in many cases.",
        ],
      },
      {
        heading: "🚨 Emergency Altitude Illness",
        paragraphs: [
          "AMS can progress to much more serious conditions.",
          "HACE — High-Altitude Cerebral Edema: warning signs include confusion, altered behaviour, severe drowsiness, difficulty walking normally, loss of coordination and reduced consciousness.",
          "HAPE — High-Altitude Pulmonary Edema: warning signs include breathlessness at rest, increasing difficulty breathing, persistent cough, marked weakness, chest congestion or tightness, and blue/grey lips or skin.",
          "These are medical emergencies.",
        ],
      },
      {
        heading: "Emergency Protocol",
        paragraphs: [
          "If HACE or HAPE is suspected: stop ascending, inform the trek leader immediately, begin descent as soon as practically possible, minimise exertion, use supplemental oxygen if available and appropriate, and arrange urgent medical evacuation / medical care.",
          "For suspected HACE, urgent descent is recommended. For suspected HAPE, descent and oxygen are also central treatments where available.",
          "Never wait for symptoms to become severe before acting.",
        ],
      },
      {
        heading: "What About Acetazolamide?",
        paragraphs: [
          "Acetazolamide is a recognised medication for prevention of AMS and can also be used for treatment in appropriate circumstances. The Wilderness Medical Society and CDC provide specific dosing recommendations.",
          "However, medication should be used only after appropriate medical advice.",
          "Trip My Soul does not recommend that trekkers start prescription medicines on their own simply because they are going on a trek.",
          "Discuss your individual risk, medical history, allergies and medication options with a qualified healthcare professional before the trek.",
        ],
      },
      {
        heading: "Important: Don't Use Oxygen as a Shortcut",
        paragraphs: [
          "Portable oxygen canisters marketed for trekking are not a substitute for proper acclimatisation or emergency treatment.",
          "Similarly, \"oxygen bars,\" supplements and forced hydration have not been shown to reliably prevent AMS.",
          "The best protection remains: proper acclimatisation + sensible pacing + early recognition + prompt action.",
        ],
      },
      {
        heading: "Before Your Trek",
        paragraphs: [
          "Every trekker should: understand AMS symptoms, tell the trek team if feeling unwell, avoid alcohol during initial acclimatisation, maintain normal hydration, follow the planned itinerary, avoid unnecessary rapid ascent, carry prescribed medicines, inform TMS about relevant medical requirements, and never hide symptoms to reach the summit.",
        ],
      },
      {
        heading: "The Golden Rules of Altitude",
        paragraphs: [
          "Rule 1 — Never ascend while experiencing altitude-illness symptoms.",
          "Rule 2 — Never hide symptoms from your trek leader.",
          "Rule 3 — If symptoms worsen, descend.",
          "Rule 4 — Confusion, loss of coordination or severe breathing difficulty is an emergency.",
          "Rule 5 — The summit is optional. Your safety is not.",
        ],
      },
      {
        heading: "Our TMS Safety Philosophy",
        paragraphs: [
          "At Trip My Soul, a successful trek isn't simply about reaching the highest point.",
          "It's about returning safely with memories you'll want to keep forever.",
          "Our trek leaders and guides are responsible for monitoring participants and responding to changing conditions, but every trekker also has a responsibility to speak up when something doesn't feel right.",
          "Don't hide the headache. Don't ignore the nausea. Don't push through worsening symptoms. Speak to your trek leader.",
          "Because in the Himalayas: knowing when to turn around is also a mark of a great trekker.",
        ],
      },
      {
        heading: "Medical Disclaimer",
        paragraphs: [
          "This guide is for general trekking education and does not replace professional medical advice, diagnosis or treatment.",
          "Altitude illness can become life-threatening. Trekkers with significant medical conditions, previous serious altitude illness, or concerns about their ability to trek at altitude should consult a qualified healthcare professional before undertaking a high-altitude trek.",
          "In an emergency, seek professional medical assistance and evacuation as soon as possible.",
        ],
      },
    ],
  },
  {
    slug: "crossing-hampta-pass",
    title: "Crossing Hampta Pass",
    excerpt:
      "From the lush Kullu Valley to the rugged high desert of Lahaul in a single crossing — the trek that shows two completely different Himalayas.",
    category: "Trek Stories",
    date: "March 22, 2026",
    image: "/Trips_gallery/Dyara_Bugyal/IMG_4438.JPG.jpeg",
    standfirst: "A Journey from Green Valleys to the High Desert",
    readMinutes: 6,
    sections: [
      {
        paragraphs: [
          "There are treks where the destination is the story.",
          "And then there are treks where the journey itself keeps changing the story with every step.",
          "Hampta Pass is one of them.",
          "The trail begins near Jobra, above Manali, surrounded by the lush landscapes of the Kullu Valley. Forests, streams, open meadows and towering mountains accompany you as you walk deeper into the valley.",
          "But the real transformation begins as you approach the pass.",
        ],
      },
      {
        heading: "The Climb Begins",
        paragraphs: [
          "From Balu Ka Ghera, the mountains begin to feel different.",
          "The trail climbs steadily toward Hampta Pass. The air gets thinner, the terrain becomes rougher, and every step demands a little more patience.",
          "You look back and realise how far you've come.",
          "Ahead is the pass. Behind you is the green valley.",
          "And somewhere between the two is a moment when you stop thinking about how many kilometres are left and simply keep walking.",
        ],
      },
      {
        heading: "Standing at Hampta Pass",
        paragraphs: [
          "At around 4,270 metres (14,000+ ft), Hampta Pass is the highest point of the crossing.",
          "Reaching the top doesn't always feel like a dramatic movie moment.",
          "Sometimes it is quieter. A deep breath. A tired smile. A few seconds of silence.",
          "And the realisation: \"I actually made it.\"",
          "The mountains stretch around you, and the trail you followed suddenly looks incredibly small.",
        ],
      },
      {
        heading: "And Then… Everything Changes",
        paragraphs: [
          "Perhaps the most remarkable part of Hampta Pass is what happens after crossing it.",
          "You descend towards Shea Goru, and the landscape changes dramatically.",
          "The lush greens of Kullu give way to the dry, rugged terrain of Lahaul. Within a few hours, it can feel as though you have walked into an entirely different world.",
          "The colours change. The vegetation changes. The mountains change. Even the silence feels different.",
          "That sudden transition is what makes Hampta Pass a true Himalayan crossover trek.",
        ],
      },
      {
        heading: "The Descent to Shea Goru",
        paragraphs: [
          "The descent is demanding in its own way.",
          "Loose rocks, steep sections and changing terrain require careful steps. But with every turn, the landscape opens wider.",
          "Eventually, Shea Goru appears below.",
          "You are tired. Your legs know you've had a long day. But there is also a strange sense of satisfaction.",
          "Because today wasn't just another day on a trail. Today, you crossed a mountain pass.",
        ],
      },
      {
        heading: "From Shea Goru to Chatru",
        paragraphs: [
          "The following trail takes you deeper into the Lahaul landscape before reaching Chatru, where the main trekking section generally ends.",
          "For many trekkers, the physical journey may be coming to an end. But the story isn't.",
          "The photographs remain. The muddy shoes remain. The tired legs remain. The jokes from the trail remain.",
          "And somewhere in your memory, there is that one moment when you stood on Hampta Pass and looked at two completely different Himalayan worlds.",
        ],
      },
      {
        heading: "Why Hampta Pass Stays With You",
        paragraphs: [
          "Hampta Pass isn't memorable simply because of its altitude.",
          "It is memorable because of change.",
          "Forest to meadow. Meadow to snow and rock. Green Kullu to rugged Lahaul. Nervous first steps to confident mountain walking.",
          "And strangers on Day 1 becoming trekking companions by the time you reach Chatru.",
          "That's the magic of a crossover trek.",
          "You don't simply travel across a mountain. You experience a completely different side of the Himalayas in the same journey.",
        ],
      },
      {
        heading: "Your Hampta Pass Story Awaits",
        paragraphs: [
          "One day, you'll look back at the photographs.",
          "You'll remember the cold streams. The long climbs. The laughter around camp. The silence at the pass.",
          "And that feeling of standing somewhere above the clouds, knowing that you crossed it on your own two feet.",
          "The Himalayas aren't just meant to be seen. They're meant to be experienced.",
        ],
      },
    ],
    signoff: "Trip My Soul — Walk Beyond the Ordinary.",
  },
];

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return blogArticles.find((a) => a.slug === slug);
}
