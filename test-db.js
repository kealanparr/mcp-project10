/**
 * Database Connectivity Test
 * Tests the database connection and model operations
 */

const db = require('./lib/services/database');
const MasterPlan = require('./lib/models/MasterPlan');

async function testDatabase() {
  try {
    console.log('🔌 Testing database connection...');

    // Connect to database
    await db.connect();
    console.log('✅ Database connected successfully\n');

    // Test 1: Count total entries
    console.log('📊 Test 1: Count total entries');
    const totalCount = await MasterPlan.count();
    console.log(`Total entries: ${totalCount}\n`);

    // Test 2: Find entry by ID
    console.log('🔍 Test 2: Find entry by ID (id=2)');
    const entry = await MasterPlan.findById(2);
    console.log('Entry:', entry);
    console.log();

    // Test 3: Get all teams
    console.log('👥 Test 3: Get all unique teams');
    const teams = await MasterPlan.getTeams();
    console.log(`Found ${teams.length} teams:`, teams.slice(0, 10), '...\n');

    // Test 4: Get all targets
    console.log('🎯 Test 4: Get all unique targets');
    const targets = await MasterPlan.getTargets();
    console.log(`Found ${targets.length} targets:`, targets.slice(0, 10), '...\n');

    // Test 5: Filter by team
    console.log('🔎 Test 5: Filter by team (CAPS)');
    const capsEntries = await MasterPlan.findAll({ team: 'CAPS' }, 5);
    console.log(`Found ${capsEntries.length} CAPS entries:`, capsEntries[0]?.title || 'None');
    console.log();

    // Test 6: Search by text
    console.log('🔍 Test 6: Search for "Saturn"');
    const searchResults = await MasterPlan.search('Saturn', 5);
    console.log(`Found ${searchResults.length} results:`, searchResults[0]?.title || 'None');
    console.log();

    console.log('✅ All tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    // Close database connection
    await db.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run tests
testDatabase();
