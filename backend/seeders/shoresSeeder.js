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
    barangay: 'Brgy. Papaya',
    city: 'Nasugbu',
    province: 'Batangas',
    postalCode: '4231'
  },
  {
    barangay: 'Brgy. Natipuan',
    city: 'Nasugbu',
    province: 'Batangas',
    postalCode: '4231'
  }
];

// ── Shores Projects ────────────────────────────────────────────────────────

const shoresProjects = [
  // ─── 1. Peninsula de Punta Fuego ───────────────────────────────────────
  {
    name: 'Peninsula de Punta Fuego',
    slug: 'peninsula-de-punta-fuego',
    category: 'Shores',
    propertyType: 'Residential',
    status: 'Published',

    cardImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
    shortDescription:
      'A flame-shaped peninsula offering 88 hectares of Spanish-Mediterranean luxury with 12 pristine white-sand beaches, a 9-hole golf course, and South Marina in the heart of Nasugbu, Batangas.',

    hero: {
      image:  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop',
      title:  'Peninsula de Punta Fuego',
      subtitle: 'A Flame-Shaped Paradise on the Shores of Nasugbu'
    },

    totalArea: { value: 88, unit: 'Hectares' },
    lotSizeRange: { min: 300, max: 1200, unit: 'sqm' },
    priceRange: { min: 8_000_000, max: 80_000_000, currency: 'PHP' },

    features: [
      { title: 'Club Punta Fuego', description: 'Exclusive beach and leisure club with world-class amenities', icon: 'club' },
      { title: '12 White-Sand Beaches', description: 'Private and semi-private beaches along the coastline', icon: 'beach' },
      { title: '9-Hole Golf Course', description: 'Scenic seaside golf course with panoramic Batangas Bay views', icon: 'golf' },
      { title: 'South Marina', description: 'Yacht berthing and marina facilities for sea enthusiasts', icon: 'marina' },
      { title: 'Spanish-Mediterranean Architecture', description: 'Inspired design language evoking European coastal villages', icon: 'architecture' },
      { title: 'Flame-Shaped Peninsula', description: 'Unique geography surrounded by three sides of pristine sea', icon: 'map' }
    ],

    sections: [
      {
        order: 1,
        type: 'intro',
        label: 'ABOUT',
        title: 'Where Land Meets the Sea',
        description:
          'Peninsula de Punta Fuego is Landco's flagship masterpiece — an 88-hectare flame-shaped peninsula set against the azure waters of Nasugbu, Batangas. With a Spanish-Mediterranean inspired design, the community blends natural beauty with refined living. Twelve white-sand beaches, a Club Punta Fuego, a 9-hole golf course, and the South Marina define life on the peninsula.',
        backgroundColor: '#ffffff',
        textColor: '#000000'
      },
      {
        order: 2,
        type: 'features',
        label: 'LIFESTYLE',
        title: 'Life on the Peninsula',
        description:
          'Whether you sail, golf, swim, or simply unwind on the shore, Peninsula de Punta Fuego delivers the lifestyle you deserve. The community's exclusive club, pristine beaches, and marina make every day feel like a resort escape.',
        backgroundColor: '#f9f9f9',
        textColor: '#000000',
        features: [
          'Club Punta Fuego membership privileges',
          '12 white-sand beaches',
          '9-hole golf course',
          'South Marina with yacht berths',
          'Seaside restaurants and lounges',
          'Water sports and diving facilities',
          'Gated 24/7 security',
          'Spanish-Mediterranean village design'
        ]
      }
    ],

    gallery: [],
    tags: ['peninsula', 'beach', 'golf', 'marina', 'batangas', 'landco', 'luxury'],
    metaTitle: 'Peninsula de Punta Fuego | Shores | Steamrock',
    metaDescription:
      'Discover Peninsula de Punta Fuego — an 88-hectare Spanish-Mediterranean community in Nasugbu, Batangas with 12 beaches, a golf course, and South Marina.'
  },

  // ─── 2. Terrazas de Punta Fuego ────────────────────────────────────────
  {
    name: 'Terrazas de Punta Fuego',
    slug: 'terrazas-de-punta-fuego',
    category: 'Shores',
    propertyType: 'Residential',
    status: 'Published',

    cardImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop',
    shortDescription:
      'A 61–92 hectare hillside coastal estate in Brgy. Natipuan, Nasugbu featuring 800m of white-sand beach, terrace homes, a 9-hole golf course, Peak Linear Park, and a yacht club.',

    hero: {
      image:  'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&auto=format&fit=crop',
      title:  'Terrazas de Punta Fuego',
      subtitle: 'Hillside Terraces Cascading to the Shore'
    },

    totalArea: { value: 92, unit: 'Hectares' },
    lotSizeRange: { min: 300, max: 1250, unit: 'sqm' },
    priceRange: { min: 6_000_000, max: 60_000_000, currency: 'PHP' },

    features: [
      { title: '800m White-Sand Beach', description: 'Sweeping beachfront stretching 800 meters along the coast', icon: 'beach' },
      { title: '9-Hole Golf Course', description: 'Panoramic seaside golf course with ocean backdrop', icon: 'golf' },
      { title: 'Peak Linear Park', description: 'Elevated park atop the terraces with breathtaking sea views', icon: 'park' },
      { title: 'Yacht Club', description: 'Full-service yacht club for water sports and social events', icon: 'marina' },
      { title: 'Terrace Architecture', description: 'Spanish-Mediterranean and Asian-tropical inspired terrace designs', icon: 'architecture' },
      { title: 'Hillside Location', description: 'Elevated lots offering sea views from multiple vantage points', icon: 'hill' }
    ],

    sections: [
      {
        order: 1,
        type: 'intro',
        label: 'ABOUT',
        title: 'Terraces Above the Sea',
        description:
          'Terrazas de Punta Fuego is a stunning hillside coastal community spanning 61 to 92 hectares in Brgy. Natipuan, Nasugbu, Batangas. Drawing from Spanish-Mediterranean and Asian-tropical architectural influences, the development cascades from hilltop terraces down to an 800-meter white-sand beach. Lot sizes range from 300 to 1,250 sqm, offering a variety of options from cozy coastal retreats to grand estate lots.',
        backgroundColor: '#ffffff',
        textColor: '#000000'
      },
      {
        order: 2,
        type: 'features',
        label: 'AMENITIES',
        title: 'A Life of Coastal Elegance',
        description:
          'Terrazas de Punta Fuego is designed for those who seek the balance of nature and luxury. From morning golf to sunset sailing, every day offers a new adventure with world-class amenities at your doorstep.',
        backgroundColor: '#f9f9f9',
        textColor: '#000000',
        features: [
          '800m white-sand beachfront',
          '9-hole seaside golf course',
          'Peak Linear Park & nature trails',
          'Yacht club and marina',
          'Beach club and restaurant',
          'Terrace garden lounges',
          '24/7 security and gated entry',
          'Asian-tropical and Mediterranean design'
        ]
      }
    ],

    gallery: [],
    tags: ['terraces', 'beach', 'golf', 'yacht', 'batangas', 'landco', 'hillside', 'coastal'],
    metaTitle: 'Terrazas de Punta Fuego | Shores | Steamrock',
    metaDescription:
      'Explore Terrazas de Punta Fuego — a hillside coastal community in Nasugbu, Batangas with 800m beach, golf, Peak Linear Park, and yacht club.'
  }
];

// ── Location to project mapping ─────────────────────────────────────────────
const barangayAssignment = [
  'Brgy. Papaya',    // Peninsula de Punta Fuego
  'Brgy. Natipuan'   // Terrazas de Punta Fuego
];

// ── Seeder Function ────────────────────────────────────────────────────────

const seedShores = async () => {
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

    // Map barangay → location doc id
    const locationMap = {};
    locationDocs.forEach(l => { locationMap[l.barangay] = l._id; });

    // ── Step 3: Upsert Shores Projects ────────────────────────────────────
    console.log('\n🌊 Seeding Shores Projects...');

    for (let i = 0; i < shoresProjects.length; i++) {
      const pd = shoresProjects[i];
      const locationId = locationMap[barangayAssignment[i]];

      if (!locationId) {
        console.warn(`  ⚠️  No location found for ${barangayAssignment[i]}, skipping ${pd.name}`);
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
    console.log('✅ Shores project seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Contractor : Landco Pacific Corporation`);
    console.log(`   Locations  : ${locationDocs.length} seeded`);
    console.log(`   Projects   : ${shoresProjects.length} Shores projects seeded`);
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

seedShores();
