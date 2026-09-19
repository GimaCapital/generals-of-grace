// backend/src/scripts/seedBadges.js
// Run once: `node src/scripts/seedBadges.js`
const Badge = require('../models/Badge');

const DEFAULT_BADGES = [
  {
    id: 'first-fruit',
    name: 'First Fruit',
    description: 'Won your first soul',
    emoji: '🌱',
    category: 'milestone',
    requirement: { soulsWon: 1 },
    order: 1,
  },
  {
    id: 'soul-winner',
    name: 'Soul Winner',
    description: 'Won 5 souls',
    emoji: '🌿',
    category: 'milestone',
    requirement: { soulsWon: 5 },
    order: 2,
  },
  {
    id: 'harvester',
    name: 'Harvester',
    description: 'Won 10 souls',
    emoji: '🌾',
    category: 'milestone',
    requirement: { soulsWon: 10 },
    order: 3,
  },
  {
    id: 'fruitful-branch',
    name: 'Fruitful Branch',
    description: 'Won 25 souls',
    emoji: '🌳',
    category: 'milestone',
    requirement: { soulsWon: 25 },
    order: 4,
  },
  {
    id: 'soul-circle',
    name: "Soul Winner's Circle",
    description: 'Won 50 souls',
    emoji: '🏆',
    category: 'milestone',
    requirement: { soulsWon: 50 },
    order: 5,
  },
  {
    id: 'soul-legacy',
    name: "Soul Winner's Legacy",
    description: 'Won 100 souls',
    emoji: '👑',
    category: 'milestone',
    requirement: { soulsWon: 100 },
    order: 6,
  },
  {
    id: 'family-builder',
    name: 'Family Builder',
    description: 'Brought a family member to Christ',
    emoji: '👨‍👩‍👧',
    category: 'special',
    requirement: { specific: 'family' },
    order: 10,
  },
  {
    id: 'youth-reacher',
    name: 'Youth Reacher',
    description: 'Reached 5 young people',
    emoji: '🎓',
    category: 'special',
    requirement: { specific: 'youth' },
    order: 11,
  },
  {
    id: 'discipler',
    name: 'Discipler',
    description: 'Helped 3 new believers grow',
    emoji: '📖',
    category: 'special',
    requirement: { specific: 'discipleship' },
    order: 12,
  },
  {
    id: 'multiplier',
    name: 'Multiplier',
    description: 'Someone you led to Christ led someone else',
    emoji: '🔄',
    category: 'special',
    requirement: { specific: 'multiplication' },
    order: 13,
  },
];

async function seed() {
  console.log('Seeding badges...');
  for (const badge of DEFAULT_BADGES) {
    try {
      const existing = await Badge.getById(badge.id);
      if (existing) {
        console.log(`⏭  ${badge.name} already exists`);
      } else {
        await Badge.create(badge);
        console.log(`✅ Created ${badge.name}`);
      }
    } catch (err) {
      console.error(`❌ Failed to create ${badge.name}:`, err.message);
    }
  }
  console.log('Done.');
  process.exit(0);
}

seed();