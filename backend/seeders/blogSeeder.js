const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Blog = require('../models/Blog');
const Admin = require('../models/Admin');

// ── Blog Seed Data ─────────────────────────────────────────────────────────

const blogsData = [
  {
    title: 'Why Batangas is the Philippines\' Next Great Coastal Investment Destination',
    excerpt:
      'With pristine beaches, improved road access, and rising property values, Batangas has emerged as the top choice for coastal real estate investors and lifestyle seekers alike.',
    content: `
<h2>Batangas: Rising Star of Philippine Real Estate</h2>
<p>Batangas province has long been known for its clear waters and diving spots, but in recent years it has quietly transformed into one of the Philippines' most sought-after real estate corridors. From the shores of Nasugbu to the coves of San Juan, developers and investors alike are taking notice.</p>

<h3>Accessibility: SLEX to STAR Tollway</h3>
<p>The South Luzon Expressway (SLEX) and the STAR Tollway have dramatically cut travel times from Metro Manila to coastal Batangas. What was once a 3-hour ordeal is now a comfortable 90-minute drive on a weekend morning — making Batangas an attractive option for second-home buyers and retirees seeking an escape from the urban rush.</p>

<h3>Rising Property Values</h3>
<p>Land values in prime areas of Nasugbu, Calatagan, and San Juan have appreciated significantly over the last decade. Lot prices in masterplanned communities by developers like Landco Pacific Corporation have risen by 30–50% in some zones, making early investors very happy.</p>

<h3>Lifestyle Communities to Watch</h3>
<ul>
  <li><strong>Peninsula de Punta Fuego</strong> – Landco's flagship 88-hectare flame-shaped peninsula with 12 beaches and South Marina.</li>
  <li><strong>Terrazas de Punta Fuego</strong> – A hillside enclave cascading to 800m of white-sand shoreline with a yacht club.</li>
  <li><strong>CaSoBē (Calatagan South Beach)</strong> – A modern beach town development in Calatagan designed around community and coastline living.</li>
</ul>

<h3>Conclusion</h3>
<p>Whether you're looking for a weekend retreat, a retirement home, or a long-term real estate investment, Batangas offers a compelling combination of natural beauty, accessibility, and investment fundamentals that few provinces can match.</p>
    `.trim(),
    category: 'Investment Guide',
    tags: ['batangas', 'investment', 'real estate', 'coastal', 'nasugbu'],
    featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop',
    status: 'Published',
    metaTitle: 'Why Batangas is the Philippines\' Next Great Coastal Investment Destination',
    metaDescription: 'Explore why Batangas is attracting real estate investors with pristine beaches, improved access, and rising property values in masterplanned communities.'
  },
  {
    title: 'Landco Pacific Corporation: Building Lifestyle Communities Since 1987',
    excerpt:
      'A closer look at Landco Pacific Corporation, the developer behind some of the Philippines\' most iconic coastal and mountain communities, from Punta Fuego to Eagle Ridge.',
    content: `
<h2>Landco Pacific Corporation</h2>
<p>Since 1987, Landco Pacific Corporation has been crafting distinctive lifestyle communities across the Philippines. As a subsidiary of Metro Pacific Investments Corporation, Landco brings together the financial strength of one of the country's largest conglomerates with a deep passion for creating places where people truly want to live.</p>

<h3>A Legacy of Landmark Developments</h3>
<p>Landco's portfolio reads like a map of the Philippines' most beautiful natural settings. From the flame-shaped Peninsula de Punta Fuego in Nasugbu to the mountain retreats of Tagaytay Highlands, each project carries Landco's signature commitment to masterplanning, architecture, and community design.</p>

<h3>Philosophy: Community by Design</h3>
<p>What sets Landco apart is the belief that a subdivision is more than just lots — it's a community. Every Landco project is designed around a central lifestyle concept. Peninsula de Punta Fuego is built around the sea. Terrazas de Punta Fuego cascades down hillside terraces toward the beach. CaSoBē is centered on the idyllic beach town lifestyle of Calatagan.</p>

<h3>Sustainability and Green Living</h3>
<p>Landco incorporates sustainable design principles across all its communities — from water recycling systems to native tree planting programs. Peak Linear Parks, nature trails, and open green spaces are integral components that enhance both quality of life and environmental stewardship.</p>

<h3>The Steamrock Partnership</h3>
<p>Steamrock Realty is proud to partner with Landco Pacific Corporation in bringing these extraordinary communities to serious buyers and investors. Our team provides personalized guidance, site tour arrangements, and investment consultation for all Landco properties in our portfolio.</p>
    `.trim(),
    category: 'Property Showcase',
    tags: ['landco', 'developer', 'punta fuego', 'philippines', 'coastal living'],
    featuredImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&auto=format&fit=crop',
    status: 'Published',
    metaTitle: 'Landco Pacific Corporation: Building Lifestyle Communities Since 1987',
    metaDescription: 'Learn about Landco Pacific Corporation — the developer behind Peninsula de Punta Fuego, Terrazas de Punta Fuego, and other iconic Philippine lifestyle communities.'
  },
  {
    title: '5 Things to Look for When Buying a Beach Lot in the Philippines',
    excerpt:
      'Not all beachfront lots are created equal. Here are five critical factors every smart buyer must evaluate before signing on the dotted line.',
    content: `
<h2>5 Things to Look for When Buying a Beach Lot in the Philippines</h2>
<p>Beach lots are among the most coveted — and most misunderstood — real estate investments in the Philippines. Before you fall in love with a sea view, make sure you've checked these five essentials.</p>

<h3>1. Title and Ownership Verification</h3>
<p>Always verify the Transfer Certificate of Title (TCT) at the Registry of Deeds. Watch out for lots described as "foreshore land" — these are typically owned by the state and cannot be privately titled. Legitimate beach lots in masterplanned communities come with clean, individual titles.</p>

<h3>2. Distance from the High-Water Mark</h3>
<p>Under Philippine law, a mandatory easement applies within 3 meters from the high-water mark, which cannot be enclosed or built upon. Masterplanned developments account for this in their planning, but independently-listed lots may not.</p>

<h3>3. Developer Track Record</h3>
<p>Research the developer's history of delivery, community maintenance, and homeowner association governance. Established developers like Landco Pacific Corporation have decades of track record and active HOA management in their communities.</p>

<h3>4. Road Access and Infrastructure</h3>
<p>A beautiful lot means nothing if you can't reach it reliably. Confirm the status of internal roads, power supply, water utilities, and telecommunications connectivity. Look for communities along improved highway corridors.</p>

<h3>5. Appreciation Potential</h3>
<p>Check comparable lot sales in the area over the last 5 years. Communities with full amenities (beach clubs, golf courses, marinas) tend to appreciate faster than raw subdivisions. Location within a masterplanned community adds a premium that isolated lots cannot match.</p>

<h3>Final Thought</h3>
<p>Buying a beach lot is one of the most rewarding real estate decisions you can make — provided you do your due diligence. At Steamrock Realty, we guide buyers through every step of the evaluation, from title verification to site visit coordination.</p>
    `.trim(),
    category: 'Real Estate Tips',
    tags: ['buying tips', 'beach lot', 'philippines', 'real estate', 'due diligence'],
    featuredImage: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&auto=format&fit=crop',
    status: 'Published',
    metaTitle: '5 Things to Look for When Buying a Beach Lot in the Philippines',
    metaDescription: 'Smart tips for buying beach lots in the Philippines — from title verification to evaluating developer track records and appreciation potential.'
  }
];

// ── Seeder Function ────────────────────────────────────────────────────────

const seedBlogs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB:', process.env.MONGODB_URI.includes('steamrock_db') ? 'steamrock_db' : 'default');

    // Find the first admin to use as author
    const admin = await Admin.findOne();
    if (!admin) {
      console.error('❌ No admin found. Please create an admin account first via /api/auth/register or the admin setup route.');
      process.exit(1);
    }
    console.log(`\n👤 Using admin: ${admin.email} as blog author`);

    console.log('\n📝 Seeding Blog Posts...');
    for (const blogData of blogsData) {
      const slug = blogData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const blog = await Blog.findOneAndUpdate(
        { slug },
        { ...blogData, author: admin._id, slug },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`  ✔ ${blog.title} (${blog.status})`);
    }

    console.log('\n' + '━'.repeat(60));
    console.log('✅ Blog seeding completed successfully!');
    console.log(`\n📋 Summary: ${blogsData.length} blog posts seeded`);
    console.log('━'.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

seedBlogs();
