const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
    barangay: 'Brgy. Lunzuran',
    city: 'Zamboanga City',
    province: 'Zamboanga del Sur',
    postalCode: '7000'
  },
  {
    barangay: 'Brgy. Bulakin',
    city: 'Tiaong',
    province: 'Quezon',
    postalCode: '4325'
  },
  {
    barangay: 'Silang',
    city: 'Silang',
    province: 'Cavite',
    postalCode: '4118'
  },
  {
    barangay: 'Brgy. Sta. Elena',
    city: 'San Pablo City',
    province: 'Laguna',
    postalCode: '4000'
  }
];

// Unsplash images used as placeholder — replace with actual project images
const parksProjects = [
  {
    name: 'Woodridge Garden Village',
    slug: 'woodridge-garden-village',
    category: 'Parks',
    propertyType: 'Residential',
    totalArea: { value: 24, unit: 'Hectares' },
    lotSizeRange: { min: 250, max: 300, unit: 'sqm' },
    status: 'Published',
    featured: true,
    shortDescription:
      'Spanning 24 hectares in Zamboanga City, this master-planned community brings Mediterranean-inspired elegance to life with resort-style pools, lush green corridors, and a grand ballroom for residents.','

    // Up to 4 images (admins can replace in the CMS)
    cardImage: 'https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=900&auto=format&fit=crop',
    hero: {
      title: 'Woodridge Garden Village',
      subtitle: 'Mediterranean Elegance Meets Nature Living',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&auto=format&fit=crop'
    },

    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&auto=format&fit=crop',
        caption: 'Resort-Style Infinity Pool',
        order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop',
        caption: "Grand Landscaped Gateway",
        order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1587582345426-bf07f98f9b67?w=1200&auto=format&fit=crop',
        caption: "Linear Park & Green Corridors",
        order: 3
      },
      {
        url: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1200&auto=format&fit=crop',
        caption: "Scenic Tree-Lined Walkways",
        order: 4
      }
    ],

    sections: [
      {
        order: 1,
        type: 'intro',
        label: 'ABOUT',
        title: 'Resort-Like Living in Zamboanga City',
        description:
          'Woodridge Garden Village is a 24-hectare master-planned community in Brgy. Lunzuran, Zamboanga City designed around the concept of "refined living" and nature. Inspired by Mediterranean elegance — warm tones, graceful lines, and sunlit spaces — the development blends resort-style living with a thriving residential community.',
        backgroundColor: '#ffffff',
        textColor: '#1a202c'
      },
      {
        order: 2,
        type: 'features',
        label: 'LEISURE & NATURE',
        title: 'Nature-Inspired Living',
        description:
          'Immerse yourself in lush surroundings with expansive linear parks, scenic tree-lined walkways, and grand landscaped gateways and boulevards.',
        features: [
          'Linear Park & Green Corridors',
          'Scenic Tree-Lined Walkways',
          'Grand Landscaped Gateways & Boulevards',
          'Picnic Area for family bonding'
        ],
        backgroundColor: '#f9fafb',
        textColor: '#1a202c'
      },
      {
        order: 3,
        type: 'features',
        label: 'RECREATION & SPORTS',
        title: 'Active & Leisure Facilities',
        description:
          'Enjoy resort-quality amenities including a free-form adult infinity pool, kiddie pool, and a range of outdoor sports facilities.',
        features: [
          "Resort-Style Adult Infinity Pool",
          "Dedicated Kiddie Pool",
          "Kid's Grove – Nature-Inspired Playground",
          "Basketball Court",
          "Pickleball Court",
          "Outdoor Gym"
        ],
        backgroundColor: '#ffffff',
        textColor: '#1a202c'
      },
      {
        order: 4,
        type: 'features',
        label: 'EVENTS & SECURITY',
        title: 'Community & Safety',
        description:
          'A Grand Ballroom for community celebrations, paired with 24-hour security and professional property management.',
        features: [
          'Grand Ballroom',
          '24-Hour Security',
          'Professional Property Management',
          'Hassle-Free Lifestyle'
        ],
        backgroundColor: '#f9fafb',
        textColor: '#1a202c'
      }
    ],

    features: [
      { icon: 'pool', title: 'Infinity Pool', description: 'Free-form adult infinity pool with resort ambiance' },
      { icon: 'park', title: 'Linear Park', description: 'Expansive green corridors for jogging and strolls' },
      { icon: 'basketball', title: 'Basketball Court', description: 'Outdoor court for active play' },
      { icon: 'pickleball', title: 'Pickleball Court', description: 'Modern recreational facility for a fast-growing sport' },
      { icon: 'gym', title: 'Outdoor Gym', description: 'Open-air fitness area' },
      { icon: 'ballroom', title: 'Grand Ballroom', description: 'Refined venue for celebrations and events' },
      { icon: 'security', title: '24/7 Security', description: 'Round-the-clock security and property management' },
      { icon: 'playground', title: "Kid's Grove", description: 'Safe, nature-inspired playground' }
    ]
  },

  {
    name: 'Hacienda Escudero',
    slug: 'hacienda-escudero',
    category: 'Parks',
    propertyType: 'Farm Lot',
    totalArea: { value: 50, unit: 'Hectares' },
    lotSizeRange: { min: 260, max: 980, unit: 'sqm' },
    status: 'Published',
    featured: true,
    shortDescription:
      'Set within the storied Escudero ancestral grounds in Tiaong, Quezon, this 50-hectare estate weaves Filipino heritage and traditional architecture into a modern residential experience.','

    cardImage: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=900&auto=format&fit=crop',
    hero: {
      title: 'Hacienda Escudero',
      subtitle: 'Where Heritage Meets Modern Living',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&auto=format&fit=crop'
    },

    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop',
        caption: 'Mt. Banahaw Backdrop',
        order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200&auto=format&fit=crop',
        caption: 'Farm & Lakeside Lots',
        order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop',
        caption: 'Swimming Pool',
        order: 3
      },
      {
        url: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=1200&auto=format&fit=crop',
        caption: 'Community Clubhouse',
        order: 4
      }
    ],

    sections: [
      {
        order: 1,
        type: 'intro',
        label: 'ABOUT',
        title: 'Living the Escudero Legacy',
        description:
          'Hacienda Escudero is a 50-hectare historic residential community in Brgy. Bulakin, Tiaong, Quezon. Nestled within ancestral Escudero lands and framed by views of Mt. Banahaw, Mt. Cristobal, and Mt. Makiling, this estate blends legendary Filipino architecture and traditional culture with modern comforts.',
        backgroundColor: '#ffffff',
        textColor: '#1a202c'
      },
      {
        order: 2,
        type: 'features',
        label: 'COMMUNITY',
        title: 'Exclusive Heritage Living',
        description:
          'Experience the prestige of living within an exclusive gated community surrounded by natural landscapes, heritage architecture, and the iconic Villa Escudero Resort.',
        features: [
          'Exclusive Gated Community',
          'Farm and Lakeside Lots',
          'Proximity to Villa Escudero Resort',
          'Natural Water Access (Bulakin & Labasin rivers)'
        ],
        backgroundColor: '#f9fafb',
        textColor: '#1a202c'
      },
      {
        order: 3,
        type: 'features',
        label: 'RECREATION',
        title: 'Outdoor Adventures',
        description:
          'Enjoy a range of recreational activities from nature walks to water sports, all within one of the Philippines most storied properties.',
        features: [
          'Nature Walks',
          'Kayaking',
          'Fishing',
          'Clubhouse & Multi-purpose Hall',
          'Swimming Pool',
          'Parks and Playground'
        ],
        backgroundColor: '#ffffff',
        textColor: '#1a202c'
      }
    ],

    features: [
      { icon: 'gate', title: 'Exclusive Gated', description: 'Secure and distinguished living experience' },
      { icon: 'farm', title: 'Farm Lots', description: 'Residential options integrated with natural landscape' },
      { icon: 'kayak', title: 'Kayaking', description: 'Access to natural waterways for adventure' },
      { icon: 'fishing', title: 'Fishing', description: 'Premier fishing spots on estate grounds' },
      { icon: 'pool', title: 'Swimming Pool', description: 'On-site leisure facility' },
      { icon: 'clubhouse', title: 'Clubhouse', description: 'Facilities for community gatherings and events' },
      { icon: 'park', title: 'Parks & Playground', description: 'Dedicated open spaces for family activities' },
      { icon: 'mountain', title: 'Mountain Views', description: 'Panoramic views of Mt. Banahaw, Cristobal, and Makiling' }
    ]
  },

  {
    name: 'Ponderosa Leisure Farms',
    slug: 'ponderosa-leisure-farms',
    category: 'Parks',
    propertyType: 'Farm Lot',
    totalArea: { value: 71.2, unit: 'Hectares' },
    lotSizeRange: { min: 900, max: 1110, unit: 'sqm' },
    status: 'Published',
    featured: false,
    shortDescription:
      'Nestled in the cool highlands of Silang, Cavite, this 71-hectare nature retreat showcases Spanish-Mexican architecture amid lush themed gardens, resort pools, and refreshing Tagaytay breezes.','

    cardImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&auto=format&fit=crop',
    hero: {
      title: 'Ponderosa Leisure Farms',
      subtitle: 'A 71-Hectare Floral Haven',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&auto=format&fit=crop'
    },

    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&fit=crop',
        caption: 'El Refugio Themed Garden',
        order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&auto=format&fit=crop',
        caption: 'Bougainvillea-Lined Pathways',
        order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&auto=format&fit=crop',
        caption: 'Resort-Style Pool',
        order: 3
      },
      {
        url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&auto=format&fit=crop',
        caption: 'Villa Ponderosa Clubhouse',
        order: 4
      }
    ],

    sections: [
      {
        order: 1,
        type: 'intro',
        label: 'ABOUT',
        title: 'Where Spanish Charm Meets Philippine Nature',
        description:
          'Ponderosa Leisure Farms is a 71.2-hectare residential nature community in Silang, Cavite that masterfully blends Spanish-Mexican architecture with lush gardens. Benefiting from the cool Tagaytay breezes, it offers a serene, nature-inspired lifestyle surrounded by floral landscapes and outdoor living.',
        backgroundColor: '#ffffff',
        textColor: '#1a202c'
      },
      {
        order: 2,
        type: 'features',
        label: 'GARDENS',
        title: 'Three Themed Gardens',
        description:
          'Wander through three beautifully curated themed gardens — El Refugio, El Sanctuario, and Campos Verdes — each offering a unique floral experience.',
        features: [
          'El Refugio Themed Garden',
          'El Sanctuario Garden',
          'Campos Verdes Garden',
          'Bougainvillea-Lined Pathways',
          'Fish Ponds',
          'Nature Trail',
          'Our Lady of Guadalupe Grotto',
          'Miniature Pine Forests'
        ],
        backgroundColor: '#f9fafb',
        textColor: '#1a202c'
      },
      {
        order: 3,
        type: 'features',
        label: 'RECREATION',
        title: 'Outdoor & Active Living',
        description:
          'From resort-style pools to basketball courts and campsites, every day at Ponderosa is an opportunity for recreation and relaxation.',
        features: [
          'Adult Swimming Pool',
          "Children's Pool",
          'Basketball Court',
          "Children's Playground",
          'Campsite',
          'Barbeque & Picnic Areas'
        ],
        backgroundColor: '#ffffff',
        textColor: '#1a202c'
      },
      {
        order: 4,
        type: 'features',
        label: 'VENUES',
        title: 'Community & Gathering Spaces',
        description:
          "Share life's moments at elegant venue spaces designed for intimate gatherings and grand celebrations alike.",
        features: [
          'Villa Ponderosa Clubhouse',
          'Plaza Maravilla',
          'Tienda del Flores',
          'Tea House',
          '24-Hour Security',
          'Hassle-Free Gardening Services'
        ],
        backgroundColor: '#f9fafb',
        textColor: '#1a202c'
      }
    ],

    features: [
      { icon: 'garden', title: 'Themed Gardens', description: 'El Refugio, El Sanctuario, and Campos Verdes' },
      { icon: 'pool', title: 'Resort Pools', description: 'Adult and children pools for leisure' },
      { icon: 'trail', title: 'Nature Trail', description: 'Scenic walking trail through the estate' },
      { icon: 'grotto', title: 'Grotto', description: 'Our Lady of Guadalupe Grotto for reflection' },
      { icon: 'basketball', title: 'Basketball Court', description: 'Outdoor sports facility' },
      { icon: 'clubhouse', title: 'Clubhouse', description: 'Villa Ponderosa Clubhouse for gatherings' },
      { icon: 'campsite', title: 'Campsite', description: 'Outdoor camping and barbeque areas' },
      { icon: 'security', title: '24/7 Security', description: 'Round-the-clock gated security' }
    ]
  },

  {
    name: 'Montelago Nature Estates',
    slug: 'montelago-nature-estates',
    category: 'Parks',
    propertyType: 'Residential',
    totalArea: { value: 102, unit: 'Hectares' },
    lotSizeRange: { min: 150, max: 330, unit: 'sqm' },
    status: 'Published',
    featured: false,
    shortDescription:
      'Inspired by Southern Californian design, this master-planned community in San Pablo City, Laguna offers serene living framed by the majestic peaks of Mt. Cristobal, Makiling, and Banahaw.','

    cardImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=900&auto=format&fit=crop',
    hero: {
      title: 'Montelago Nature Estates',
      subtitle: 'The Jewel of the Escudero Legacy',
      image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&auto=format&fit=crop'
    },

    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop',
        caption: 'Mt. Cristobal & Makiling Backdrop',
        order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop',
        caption: 'Sunken Deck Pool',
        order: 2
      },
      {
        url: 'https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?w=1200&auto=format&fit=crop',
        caption: 'Plaza Sacramento Park',
        order: 3
      },
      {
        url: 'https://images.unsplash.com/photo-1565768076836-05d16ef02a25?w=1200&auto=format&fit=crop',
        caption: 'Clubhouse & Pavilion',
        order: 4
      }
    ],

    sections: [
      {
        order: 1,
        type: 'intro',
        label: 'ABOUT',
        title: 'A Jewel of the Escudero Legacy',
        description:
          "Montelago Nature Estates is a master-planned enclave in Barangay Sta. Elena, San Pablo City, Laguna — a 'jewel of the Escudero legacy' that blends modern living with nature's tranquility. Inspired by Southern Californian architecture, it features a majestic backdrop of Mt. Cristobal, Mt. Makiling, and Mt. Banahaw.",
        backgroundColor: '#ffffff',
        textColor: '#1a202c'
      },
      {
        order: 2,
        type: 'features',
        label: 'COMMUNITY',
        title: 'Secure & Distinguished Living',
        description:
          'An exclusive gated community with two entrance gates and wide landscaped roads that create a grand sense of arrival.',
        features: [
          'Exclusive Gated Community',
          'Two Entrance Gates',
          'Wide Landscaped Roads',
          'Master-Planned Enclave'
        ],
        backgroundColor: '#f9fafb',
        textColor: '#1a202c'
      },
      {
        order: 3,
        type: 'features',
        label: 'AMENITIES',
        title: 'Leisure & Family Recreation',
        description:
          'Designed as a serene retreat for families, Montelago offers world-class amenities focused on relaxation and quality time.',
        features: [
          'Adult Pool with Sunken Deck',
          'Kiddie Pool',
          'Clubhouse',
          'Pavilion',
          'Plaza Sacramento Park',
          'Dedicated Kiddie Play Area'
        ],
        backgroundColor: '#ffffff',
        textColor: '#1a202c'
      }
    ],

    features: [
      { icon: 'gate', title: 'Two Entrance Gates', description: 'Secure dual entrance gated community' },
      { icon: 'pool', title: 'Sunken Deck Pool', description: 'Adult and kiddie pools with sunken deck feature' },
      { icon: 'clubhouse', title: 'Clubhouse', description: 'Beautifully designed clubhouse for gatherings' },
      { icon: 'pavilion', title: 'Pavilion', description: 'Open pavilion for events and celebrations' },
      { icon: 'park', title: 'Plaza Sacramento', description: 'Uniquely designed community park' },
      { icon: 'playground', title: 'Kiddie Play Area', description: 'Safe and dedicated play area for children' },
      { icon: 'mountain', title: 'Mountain Views', description: 'Panoramic Mt. Cristobal, Makiling & Banahaw views' },
      { icon: 'road', title: 'Landscaped Roads', description: 'Wide, tree-lined roads throughout the estate' }
    ]
  }
];

// ── Seeder Function ────────────────────────────────────────────────────────

const seedProjects = async () => {
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

    // Map city name → location doc
    const locationMap = {};
    locationDocs.forEach(l => { locationMap[l.city] = l._id; });

    // ── Step 3: Upsert Projects ───────────────────────────────────────────
    console.log('\n🏘️  Seeding Parks Projects...');
    const cityAssignment = [
      'Zamboanga City',
      'Tiaong',
      'Silang',
      'San Pablo City'
    ];

    for (let i = 0; i < parksProjects.length; i++) {
      const pd = parksProjects[i];
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
    console.log('✅ Parks project seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Contractor : Landco Pacific Corporation`);
    console.log(`   Locations  : ${locationDocs.length} seeded`);
    console.log(`   Projects   : ${parksProjects.length} Parks projects seeded`);
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

seedProjects();
