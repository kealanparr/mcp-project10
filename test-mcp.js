/**
 * MCP Server Test Client
 * Tests the Cassini-Huygens MCP server capabilities
 */

const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');

async function testMCPServer() {
  console.log('🧪 Testing Cassini-Huygens MCP Server\n');

  try {
    // Create MCP client
    const transport = new StdioClientTransport({
      command: 'node',
      args: ['mcp-server.js'],
    });

    const client = new Client(
      {
        name: 'cassini-mcp-test-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      }
    );

    await client.connect(transport);
    console.log('✅ Connected to MCP server\n');

    // Test 1: List resources
    console.log('📋 Test 1: List Resources');
    const resources = await client.listResources();
    console.log(`Found ${resources.resources.length} resources:`);
    resources.resources.forEach(r => {
      console.log(`  - ${r.name}: ${r.uri}`);
    });
    console.log();

    // Test 2: Read a resource
    console.log('📖 Test 2: Read Resource (metadata/stats)');
    const statsResource = await client.readResource({ uri: 'cassini://metadata/stats' });
    const stats = JSON.parse(statsResource.contents[0].text);
    console.log('Statistics:', stats);
    console.log();

    // Test 3: List prompts
    console.log('💬 Test 3: List Prompts');
    const prompts = await client.listPrompts();
    console.log(`Found ${prompts.prompts.length} prompts:`);
    prompts.prompts.forEach(p => {
      console.log(`  - ${p.name}: ${p.description}`);
    });
    console.log();

    // Test 4: Get a prompt
    console.log('🔍 Test 4: Get Prompt (mission-summary for CAPS)');
    const prompt = await client.getPrompt({
      name: 'mission-summary',
      arguments: { team: 'CAPS' },
    });
    console.log('Prompt description:', prompt.description);
    console.log('Message preview:', prompt.messages[0].content.text.substring(0, 200) + '...');
    console.log();

    // Test 5: List tools
    console.log('🛠️  Test 5: List Tools');
    const tools = await client.listTools();
    console.log(`Found ${tools.tools?.length || 0} tools`);
    console.log();

    console.log('✅ All MCP tests passed!');

    await client.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testMCPServer();
