const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Project = require('../models/Project');
const Contractor = require('../models/Contractor');
const PropertyLocation = require('../models/PropertyLocation');

// ── Seed Data ──────────────────────────────────────────────────────────────

const contractorsData = [
  {
    name: 'Landco Pacific Corporation',
    slug: 'landco-pacific',
    description:
      'Landco Pacific Corporation is a premier real estate developer known for creating distinctive lifestyle communities across the Philippines, partnering with Metro Pacific Investments Corporation.',
    website: 'https://www.landco.ph',
    logo: '',
    isActive: true
  }
];

const locationsData = [
  {
    barangay: 'Brgy. Sta Ana',
    city: 'Calatagan',
    province: 'Batangas',
    postalCode: '4215'
  },
  {
    barangay: 'Brgy. Natipunan',
    city: 'Nasugbu',
    province: 'Batangas',
    postalCode: '4231'
  },
  {
    barangay: 'Brgy. Aplaya Laiya',
    city: 'San Juan',
    province: 'Batangas',
    postalCode: '4226'
  }
];

// ── Beach Towns Projects ───────────────────────────────────────────────────

const beachTownsProjects = [
  // ─── 1. The Nautilus at CaSoBē ─────────────────────────────────────────
  {
    name: 'The Nautilus at CaSoBē',
    slug: 'the-nautilus-at-casobe',
    category: 'BeachTowns',
    propertyType: 'Residential',
    totalArea: { value: 0.46, unit: 'Hectares' },
    lotSizeRange: { min: 36.1, max: 182.7, unit: 'sqm' },
    status: 'Published',
    featured: true,
    shortDescription:
      'A coastal sanctuary inspired by Captain Nemo\'s maritime discoveries, situated within the world-class resort of CaSoBē. Features luxurious private units with modern designs, private balconies, and an infinity pool—both a visionary home and a smart investment.',

    cardImage: 'https://images.unsplash.com/photo-1582271342647-7a9e22c76b6b?w=900&auto=format&fit=crop',
    hero: {
      title: 'The Nautilus at CaSoBē',
      subtitle: 'A Coastal Sanctuary Inspired by the Sea',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop'
    },

    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&auto=format&fit=crop',
        caption: 'Infinity Pool Deck',
        order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&auto=format&fit=crop',
        caption: 'Beachfront Seaview',
        order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop',
        caption: 'Spa & Wellness Area',
        order: 3
      },
      {
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop',
        caption: 'Fitness Gym',
        order: 4
      }
    ],

    sections: [
      {
        order: 1,
        type: 'intro',
        label: 'ABOUT',
        title: 'Captain Nemo\'s Maritime Vision',
        description:
          'The Nautilus at CaSoBē is a coastal sanctuary inspired by Captain Nemo\'s legendary maritime discoveries. Situated within the world-class resort of CaSoBē in Calatagan, Batangas, this 0.46-hectare development features luxurious private units with modern designs and private balconies—functioning as both a visionary home and a unique, smart investment opportunity.',
        backgroundColor: '#ffffff',
        textColor: '#1a202c'
      },
      {
        order: 2,
        type: 'features',
        label: 'COASTAL LIVING',
        title: 'Beachfront Life & Wellness',
        description:
          'Every unit offers a seaview in this true beachfront property. Unwind at the infinity pool deck, rejuvenate at the spa and sauna, or stay fit at the yoga room and fitness gym.',
        features: [
          'Beachfront Property — All Units with Seaview',
          'Pool Deck with Infinity Pool',
          'Spa and Sauna',
          'Fitness Gym',
          'Yoga Room'
        ],
        backgroundColor: '#f9fafb',
        textColor: '#1a202c'
      },
      {
        order: 3,
        type: 'features',
        label: 'SOCIAL & ENTERTAINMENT',
        title: 'Dining, Nightlife & Recreation',
        description:
          'Enjoy resort-style social spaces including a Restobar, Speak Easy, and Gameroom, along with full building amenities for a comprehensive lifestyle experience.',
        features: [
          'Restobar',
          'Speak Easy',
          'Gameroom',
          'Reception and Lobby Lounge',
          'Retail Area',
          'Conference Room'
        ],
        backgroundColor: '#ffffff',
        textColor: '#1a202c'
      },
      {
        order: 4,
        type: 'features',
        label: 'INVESTMENT',
        title: 'Rental & Investment Perks',
        description:
          'Generate income by renting out your unit with an Optional Leaseback Program under Landco Lifestyle Ventures (LLV), plus benefits under the Landco Privilege Program.',
        features: [
          'Option to Rent Out Units',
          'Optional Leaseback Program (Landco Lifestyle Ventures)',
          'Landco Privilege Program Benefits',
          'Private Balconies on All Units'
        ],
        backgroundColor: '#f9fafb',
        textColor: '#1a202c'
      }
    ],

    features: [
      { icon: 'beach', title: 'Beachfront', description: 'All units with panoramic seaview' },
      { icon: 'pool', title: 'Infinity Pool', description: 'Pool deck with infinity pool overlooking the sea' },
      { icon: 'spa', title: 'Spa & Sauna', description: 'Full-service spa and sauna facilities' },
      { icon: 'gym', title: 'Fitness Gym', description: 'Fully equipped gym and yoga room' },
      { icon: 'bar', title: 'Restobar & Speak Easy', description: 'Dining and nightlife on-site' },
      { icon: 'game', title: 'Gameroom', description: 'Dedicated entertainment and recreation space' },
      { icon: 'investment', title: 'Leaseback Program', description: 'Optional rental income through LLV' },
      { icon: 'privilege', title: 'Landco Privilege', description: 'Exclusive ownership benefits and perks' }
    ]
  },

  // ─── 2. The Residences at Terrazas de Punta Fuego ──────────────────────
  {
    name: 'The Residences at Terrazas de Punta Fuego',
    slug: 'the-residences-at-terrazas-de-punta-fuego',
    category: 'BeachTowns',
    propertyType: 'Residential',
    totalArea: { value: 1.26, unit: 'Hectares' },
    lotSizeRange: { min: 59.92, max: 143.83, unit: 'sqm' },
    status: 'Published',
    featured: true,
    shortDescription:
      'The final opportunity to join the illustrious Punta Fuego society—an exclusive destination-ready beachfront community two hours from Metro Manila. Sitting directly across 800 meters of pristine white sand, combining modern comforts with prestigious club membership.',

    cardImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&auto=format&fit=crop',
    hero: {
      title: 'The Residences at Terrazas de Punta Fuego',
      subtitle: 'Exclusive Beachfront Living in Nasugbu, Batangas',
      image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=1600&auto=format&fit=crop'
    },

    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?w=1200&auto=format&fit=crop',
        caption: 'Pristine White Sand Beach',
        order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&auto=format&fit=crop',
        caption: 'Infinity Pool with Seaview',
        order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1614267157481-ca2b81ac6fcc?w=1200&auto=format&fit=crop',
        caption: 'Garden Courtyards',
        order: 3
      },
      {
        url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1200&auto=format&fit=crop',
        caption: 'Golf Course Access',
        order: 4
      }
    ],

    sections: [
      {
        order: 1,
        type: 'intro',
        label: 'ABOUT',
        title: 'The Final Chapter of Punta Fuego',
        description:
          'The Residences at Terrazas de Punta Fuego is billed as the final opportunity to join the illustrious Punta Fuego society. This exclusive, destination-ready community in Brgy. Natipunan, Nasugbu, Batangas is just a two-hour drive from Metro Manila. The property sits directly across an 800-meter stretch of pristine white sand, blending modern comforts with prestigious leisure.',
        backgroundColor: '#ffffff',
        textColor: '#1a202c'
      },
      {
        order: 2,
        type: 'features',
        label: 'CLUB ACCESS',
        title: 'Exclusive Club Privileges',
        description:
          'Ownership grants access to the Terrazas de Punta Fuego Beach Club and an Associate Membership at Club Punta Fuego, including world-class amenities like a nine-hole golf course, tennis courts, marina facilities, and private beaches.',
        features: [
          'Exclusive Gated Beachfront Community',
          'All Units with Seaview',
          'Terrazas de Punta Fuego Beach Club Access',
          'Associate Membership at Club Punta Fuego',
          'Nine-Hole Golf Course Access',
          'Tennis Courts',
          'Marina Facilities',
          'Private Beaches',
          'One Inclusive Parking Slot Per Unit'
        ],
        backgroundColor: '#f9fafb',
        textColor: '#1a202c'
      },
      {
        order: 3,
        type: 'features',
        label: 'RECREATION',
        title: 'On-Site Wellness & Social Spaces',
        description:
          'Enjoy world-class on-site facilities including an infinity pool, spa, garden courtyards, indoor play area, and full conference amenities.',
        features: [
          'Pool Deck with Infinity Pool',
          'Pool Function Room',
          'Spa and Sauna',
          'Garden Courtyards',
          'Indoor Play Area',
          'Reception and Lobby Lounge',
          'Conference Room'
        ],
        backgroundColor: '#ffffff',
        textColor: '#1a202c'
      },
      {
        order: 4,
        type: 'features',
        label: 'SUSTAINABILITY',
        title: 'EDGE-Registered & Eco-Friendly',
        description:
          'Built with sustainability at its core, the development is EDGE-registered and features green building systems throughout.',
        features: [
          'EDGE-Registered Property',
          'Rainwater Harvesting System',
          'Double-Piped Waterline System',
          'Tree Preservation in Masterplan',
          'Landco Privilege Program Benefits'
        ],
        backgroundColor: '#f9fafb',
        textColor: '#1a202c'
      }
    ],

    features: [
      { icon: 'beach', title: 'Beachfront', description: '800m of pristine white sand directly across' },
      { icon: 'golf', title: 'Golf Course', description: 'Nine-hole golf course via Club Punta Fuego' },
      { icon: 'pool', title: 'Infinity Pool', description: 'Pool deck with infinity pool and function room' },
      { icon: 'spa', title: 'Spa & Sauna', description: 'On-site wellness and relaxation facilities' },
      { icon: 'marina', title: 'Marina Access', description: 'Marina facilities through club membership' },
      { icon: 'garden', title: 'Garden Courtyards', description: 'Landscaped garden spaces for residents' },
      { icon: 'eco', title: 'EDGE-Certified', description: 'Eco-friendly design with rainwater harvesting' },
      { icon: 'privilege', title: 'Landco Privilege', description: 'Exclusive ownership benefits and perks' }
    ]
  },

  // ─── 3. The Spinnaker at Club Laiya ────────────────────────────────────
  {
    name: 'The Spinnaker at Club Laiya',
    slug: 'the-spinnaker-at-club-laiya',
    category: 'BeachTowns',
    propertyType: 'Residential',
    totalArea: { value: 0.315, unit: 'Hectares' },
    lotSizeRange: { min: 36.6, max: 130, unit: 'sqm' },
    status: 'Published',
    featured: true,
    shortDescription:
      'Named after a graceful sail, this sleek beachfront condominium in Club Laiya offers panoramic sea views on one side and verdant mountains on the other. A luxury coastal sanctuary with a sky bar, ballroom, and infinity lap pool.',

    cardImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&auto=format&fit=crop',
    hero: {
      title: 'The Spinnaker at Club Laiya',
      subtitle: 'Where the Sea Meets the Sky',
      image: 'https://images.unsplash.com/photo-1478827387698-1527781a4887?w=1600&auto=format&fit=crop'
    },

    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop',
        caption: 'Infinity Lap Pool',
        order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200&auto=format&fit=crop',
        caption: 'Sky Bar with Panoramic View',
        order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1445991842772-097fea258e7b?w=1200&auto=format&fit=crop',
        caption: 'Beachfront Setting',
        order: 3
      },
      {
        url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop',
        caption: 'Spa & Fitness Center',
        order: 4
      }
    ],

    sections: [
      {
        order: 1,
        type: 'intro',
        label: 'ABOUT',
        title: 'Elegance and Freedom by the Sea',
        description:
          'The Spinnaker at Club Laiya is named after a graceful sail, its sleek and glimmering form designed to evoke elegance and freedom. Located in Club Laiya, Brgy. Aplaya Laiya, San Juan, Batangas, it is a striking beachfront condominium offering panoramic views of the sea on one side and verdant mountains on the other.',
        backgroundColor: '#ffffff',
        textColor: '#1a202c'
      },
      {
        order: 2,
        type: 'features',
        label: 'COASTAL LUXURY',
        title: 'Beachfront Recreation',
        description:
          'An exclusive gated beachfront community situated directly on the beach. All units provide seaview. Swim in the infinity lap pool, train at the fitness center, or unwind at the spa.',
        features: [
          'Exclusive Gated Beachfront Community',
          'All Units with Seaview',
          'Infinity Lap Pool',
          'Fitness Center',
          'Spa'
        ],
        backgroundColor: '#f9fafb',
        textColor: '#1a202c'
      },
      {
        order: 3,
        type: 'features',
        label: 'SOCIAL',
        title: 'Signature Social Spaces',
        description:
          'Entertain at the Sky Bar and Ballroom, lounge in dedicated social areas, let kids enjoy the Playzone, and conduct business in fully equipped meeting rooms.',
        features: [
          'Sky Bar',
          'Ballroom',
          'Lounge',
          'Playzone',
          'Meeting and Conference Rooms'
        ],
        backgroundColor: '#ffffff',
        textColor: '#1a202c'
      }
    ],

    features: [
      { icon: 'beach', title: 'Beachfront', description: 'Directly on the beach with panoramic seaview' },
      { icon: 'pool', title: 'Infinity Lap Pool', description: 'Olympic-style lap pool overlooking the sea' },
      { icon: 'spa', title: 'Spa', description: 'Wellness and relaxation facilities' },
      { icon: 'gym', title: 'Fitness Center', description: 'Fully equipped gym for residents' },
      { icon: 'bar', title: 'Sky Bar', description: 'Rooftop bar with panoramic views' },
      { icon: 'ballroom', title: 'Ballroom', description: 'Grand venue for celebrations and events' },
      { icon: 'mountain', title: 'Mountain Views', description: 'Verdant mountain backdrop from inland-facing units' },
      { icon: 'conference', title: 'Conference Rooms', description: 'Professional meeting facilities' }
    ]
  },

  // ─── 4. CaSoBē (Calatagan South Beach) ────────────────────────────────
  {
    name: 'CaSoBē (Calatagan South Beach)',
    slug: 'casobe-calatagan-south-beach',
    category: 'BeachTowns',
    propertyType: 'Residential',
    totalArea: { value: 15, unit: 'Hectares' },
    lotSizeRange: { min: 356, max: 890, unit: 'sqm' },
    status: 'Published',
    featured: true,
    shortDescription:
      'A premier 15-hectare tourism and business hub in Calatagan, Batangas, combining stunning coastal landscapes with 4-star Filipino hospitality. A place where residents can live, work, and collaborate in a resort environment featuring the Aquaria Waterpark and iconic beachfront boardwalk.',

    cardImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop',
    hero: {
      title: 'CaSoBē (Calatagan South Beach)',
      subtitle: 'Premier Beachside Living, Working & Resort Life',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&auto=format&fit=crop'
    },

    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1488747279002-2c0f22a39d36?w=1200&auto=format&fit=crop',
        caption: 'Aquaria Waterpark',
        order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop',
        caption: 'Beachfront Boardwalk',
        order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&auto=format&fit=crop',
        caption: 'The Sands Restaurant',
        order: 3
      },
      {
        url: 'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=1200&auto=format&fit=crop',
        caption: 'Majestic Lighthouse',
        order: 4
      }
    ],

    sections: [
      {
        order: 1,
        type: 'intro',
        label: 'ABOUT',
        title: 'Live, Work & Collaborate by the Beach',
        description:
          'CaSoBē (Calatagan South Beach) is a premier 15-hectare tourism and business hub in Brgy. Sta Ana, Calatagan, Batangas. Designed to transform beachside resort-living aspirations into reality, it combines stunning coastal landscapes with 4-star Filipino hospitality—offering a place where residents can live, work, and collaborate in a resort environment.',
        backgroundColor: '#ffffff',
        textColor: '#1a202c'
      },
      {
        order: 2,
        type: 'features',
        label: 'LEISURE & ATTRACTIONS',
        title: 'World-Class Beachfront Facilities',
        description:
          'From the Aquaria Waterpark to an iconic boardwalk, majestic lighthouse, and direct beach access, CaSoBē is a complete coastal lifestyle destination.',
        features: [
          'Aquaria Waterpark',
          'Direct Beach Front',
          'Iconic Boardwalk',
          'Majestic Lighthouse',
          'Main Rotonda'
        ],
        backgroundColor: '#f9fafb',
        textColor: '#1a202c'
      },
      {
        order: 3,
        type: 'features',
        label: 'DINING & SOCIAL',
        title: 'Restaurants, Bars & Future Dining',
        description:
          'Enjoy a vibrant dining and social scene with signature venues and upcoming establishments bringing new flavors to the estate.',
        features: [
          'The Sands Restaurant',
          'The Swing Bar',
          'Captain Barbozza',
          'Apollo (Upcoming)',
          'Gourmet Garage (Upcoming)'
        ],
        backgroundColor: '#ffffff',
        textColor: '#1a202c'
      },
      {
        order: 4,
        type: 'features',
        label: 'RESORT STAYS',
        title: 'Unique Resort Accommodations',
        description:
          'Managed by Landco\'s hospitality arm, Millennial Resorts offers distinctive stays from Crusoe Cabins to Cocoons, Canopy, Cupola, and the upcoming The Chairman\'s Cabin.',
        features: [
          'Crusoe Cabins',
          'Cocoons',
          'Canopy',
          'Cupola',
          "The Chairman's Cabin (Upcoming)"
        ],
        backgroundColor: '#f9fafb',
        textColor: '#1a202c'
      },
      {
        order: 5,
        type: 'features',
        label: 'ACTIVE LIFESTYLE',
        title: 'Sports, Parks & Community',
        description:
          'Stay active and engaged with a basketball court, outdoor gym, parks, and walkways—all within a secure gated community.',
        features: [
          'Hoops Basketball Court',
          'Outdoor Playground & Gym',
          'Harbor Park, Walk & Estates',
          'Main Entrance & Guard House'
        ],
        backgroundColor: '#ffffff',
        textColor: '#1a202c'
      }
    ],

    features: [
      { icon: 'waterpark', title: 'Aquaria Waterpark', description: 'Major recreational waterpark within the estate' },
      { icon: 'beach', title: 'Beachfront', description: 'Direct beach access and iconic boardwalk' },
      { icon: 'lighthouse', title: 'Lighthouse', description: 'Iconic majestic lighthouse landmark' },
      { icon: 'restaurant', title: 'Restaurants & Bars', description: 'The Sands, Swing Bar, Captain Barbozza & more' },
      { icon: 'cabin', title: 'Resort Stays', description: 'Crusoe Cabins, Cocoons, Canopy & unique overnight options' },
      { icon: 'basketball', title: 'Basketball Court', description: 'Hoops court for active residents' },
      { icon: 'park', title: 'Harbor Parks', description: 'Harbor Park, Walk and Estates for strolls' },
      { icon: 'security', title: 'Gated & Secure', description: 'Main entrance with 24/7 guard house' }
    ]
  }
];

// ── City → Location mapping ────────────────────────────────────────────────
// Index matches beachTownsProjects order
const cityAssignment = [
  'Calatagan',   // The Nautilus at CaSoBē
  'Nasugbu',     // The Residences at Terrazas de Punta Fuego
  'San Juan',    // The Spinnaker at Club Laiya
  'Calatagan'    // CaSoBē (Calatagan South Beach)
];

// ── Seeder Function ────────────────────────────────────────────────────────

const seedBeachTowns = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB:', process.env.MONGODB_URI.includes('steamrock_db') ? 'steamrock_db' : 'default');

    // ── Step 1: Upsert Contractor ─────────────────────────────────────────
    console.log('\n📦 Seeding Contractors...');
    let contractor;
    for (const cd of contractorsData) {
      contractor = await Contractor.findOneAndUpdate(
        { slug: cd.slug },
        cd,
        { upsert: true, new: true }
      );
      console.log(`  ✔ ${contractor.name}`);
    }

    // ── Step 2: Upsert Locations ──────────────────────────────────────────
    console.log('\n📍 Seeding Locations...');
    const locationDocs = [];
    for (const ld of locationsData) {
      const loc = await PropertyLocation.findOneAndUpdate(
        { barangay: ld.barangay, city: ld.city },
        ld,
        { upsert: true, new: true }
      );
      locationDocs.push(loc);
      console.log(`  ✔ ${loc.barangay}, ${loc.city}`);
    }

    // Map city name → location doc id
    const locationMap = {};
    locationDocs.forEach(l => { locationMap[l.city] = l._id; });

    // ── Step 3: Upsert Beach Town Projects ───────────────────────────────
    console.log('\n🏖️  Seeding Beach Towns Projects...');

    for (let i = 0; i < beachTownsProjects.length; i++) {
      const pd = beachTownsProjects[i];
      const locationId = locationMap[cityAssignment[i]];

      if (!locationId) {
        console.warn(`  ⚠️  No location found for ${cityAssignment[i]}, skipping ${pd.name}`);
        continue;
      }

      const projectPayload = {
        ...pd,
        contractor: contractor._id,
        location: locationId
      };

      const project = await Project.findOneAndUpdate(
        { slug: pd.slug },
        projectPayload,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`  ✔ ${project.name} (${project.status})`);
    }

    console.log('\n' + '━'.repeat(60));
    console.log('✅ Beach Towns project seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Contractor : Landco Pacific Corporation`);
    console.log(`   Locations  : ${locationDocs.length} seeded`);
    console.log(`   Projects   : ${beachTownsProjects.length} Beach Towns projects seeded`);
    console.log('\n⚠️  Note: Images are using Unsplash placeholders.');
    console.log('   Replace them via Admin → Media & Admin → Projects.');
    console.log('━'.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

seedBeachTowns();
