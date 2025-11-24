/**
 * MCP Server Implementation
 * Implements Model Context Protocol for Cassini-Huygens mission data
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const MasterPlan = require('../models/MasterPlan');
const db = require('./database');

/**
 * MCP Server class for Cassini-Huygens mission data
 */
class CassiniMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'cassini-huygens-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
          prompts: {},
        },
      }
    );

    this.setupHandlers();
  }

  /**
   * Set up MCP request handlers
   */
  setupHandlers() {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: 'cassini://mission-plan/all',
          name: 'All Mission Plan Entries',
          description: 'Complete Cassini-Huygens mission plan database',
          mimeType: 'application/json',
        },
        {
          uri: 'cassini://metadata/teams',
          name: 'Mission Teams',
          description: 'List of all teams involved in the mission',
          mimeType: 'application/json',
        },
        {
          uri: 'cassini://metadata/targets',
          name: 'Mission Targets',
          description: 'List of all observation targets',
          mimeType: 'application/json',
        },
        {
          uri: 'cassini://metadata/stats',
          name: 'Mission Statistics',
          description: 'Statistical overview of the mission data',
          mimeType: 'application/json',
        },
      ],
    }));

    // Read a specific resource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      switch (uri) {
        case 'cassini://mission-plan/all': {
          const entries = await MasterPlan.findAll({}, 100, 0);
          const total = await MasterPlan.count();
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({ entries, total, limit: 100 }, null, 2),
              },
            ],
          };
        }

        case 'cassini://metadata/teams': {
          const teams = await MasterPlan.getTeams();
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({ teams, count: teams.length }, null, 2),
              },
            ],
          };
        }

        case 'cassini://metadata/targets': {
          const targets = await MasterPlan.getTargets();
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({ targets, count: targets.length }, null, 2),
              },
            ],
          };
        }

        case 'cassini://metadata/stats': {
          const [total, teams, targets, spassTypes] = await Promise.all([
            MasterPlan.count(),
            MasterPlan.getTeams(),
            MasterPlan.getTargets(),
            MasterPlan.getSpassTypes(),
          ]);
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({
                  totalEntries: total,
                  uniqueTeams: teams.length,
                  uniqueTargets: targets.length,
                  uniqueSpassTypes: spassTypes.length,
                }, null, 2),
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown resource: ${uri}`);
      }
    });

    // List available prompts
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => ({
      prompts: [
        {
          name: 'mission-summary',
          description: 'Get a summary of mission activities for a specific team or target',
          arguments: [
            {
              name: 'team',
              description: 'Team name (e.g., CAPS, ISS, RADAR)',
              required: false,
            },
            {
              name: 'target',
              description: 'Target name (e.g., Saturn, Titan, Enceladus)',
              required: false,
            },
          ],
        },
        {
          name: 'activity-details',
          description: 'Get detailed information about a specific mission activity',
          arguments: [
            {
              name: 'id',
              description: 'Mission plan entry ID',
              required: true,
            },
          ],
        },
        {
          name: 'search-activities',
          description: 'Search mission activities by keyword',
          arguments: [
            {
              name: 'query',
              description: 'Search query',
              required: true,
            },
          ],
        },
      ],
    }));

    // Get a specific prompt
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'mission-summary': {
          const filters = {};
          if (args?.team) filters.team = args.team;
          if (args?.target) filters.target = args.target;

          const entries = await MasterPlan.findAll(filters, 50, 0);
          const total = await MasterPlan.count(filters);

          const filterDesc = Object.keys(filters).length > 0
            ? ` for ${Object.entries(filters).map(([k, v]) => `${k}="${v}"`).join(', ')}`
            : '';

          return {
            description: `Mission summary${filterDesc}`,
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Analyze the Cassini-Huygens mission activities${filterDesc}. Here are the first ${entries.length} of ${total} total entries:\n\n${JSON.stringify(entries, null, 2)}`,
                },
              },
            ],
          };
        }

        case 'activity-details': {
          if (!args?.id) {
            throw new Error('ID argument is required');
          }

          const entry = await MasterPlan.findById(parseInt(args.id));
          if (!entry) {
            throw new Error(`Mission plan entry with id ${args.id} not found`);
          }

          return {
            description: `Details for mission activity ${args.id}`,
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Explain this Cassini-Huygens mission activity:\n\n${JSON.stringify(entry, null, 2)}`,
                },
              },
            ],
          };
        }

        case 'search-activities': {
          if (!args?.query) {
            throw new Error('Query argument is required');
          }

          const results = await MasterPlan.search(args.query, 20);

          return {
            description: `Search results for "${args.query}"`,
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Analyze these Cassini-Huygens mission activities matching "${args.query}":\n\n${JSON.stringify(results, null, 2)}`,
                },
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown prompt: ${name}`);
      }
    });

    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get-mission-plan',
          description: 'Get mission plan entries with optional filters and pagination',
          inputSchema: {
            type: 'object',
            properties: {
              team: { type: 'string', description: 'Filter by team name' },
              target: { type: 'string', description: 'Filter by target' },
              date: { type: 'string', description: 'Filter by date' },
              spass_type: { type: 'string', description: 'Filter by SPASS type' },
              limit: { type: 'number', description: 'Maximum results (default: 100, max: 1000)' },
              offset: { type: 'number', description: 'Pagination offset (default: 0)' },
            },
          },
        },
        {
          name: 'get-activity-by-id',
          description: 'Get a single mission plan entry by ID',
          inputSchema: {
            type: 'object',
            properties: {
              id: { type: 'number', description: 'Mission plan entry ID' },
            },
            required: ['id'],
          },
        },
        {
          name: 'search-activities',
          description: 'Search mission activities by keyword in title or description',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Search query' },
              limit: { type: 'number', description: 'Maximum results (default: 100, max: 1000)' },
            },
            required: ['query'],
          },
        },
        {
          name: 'get-metadata',
          description: 'Get mission metadata (teams, targets, spass-types, or stats)',
          inputSchema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['teams', 'targets', 'spass-types', 'stats'],
                description: 'Type of metadata to retrieve (default: stats)',
              },
            },
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'get-mission-plan': {
          const filters = {};
          if (args?.team) filters.team = args.team;
          if (args?.target) filters.target = args.target;
          if (args?.date) filters.date = args.date;
          if (args?.spass_type) filters.spass_type = args.spass_type;

          const limit = Math.min(parseInt(args?.limit) || 100, 1000);
          const offset = parseInt(args?.offset) || 0;

          const [entries, total] = await Promise.all([
            MasterPlan.findAll(filters, limit, offset),
            MasterPlan.count(filters),
          ]);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  data: entries,
                  pagination: { total, limit, offset, count: entries.length },
                  filters: Object.keys(filters).length > 0 ? filters : null,
                }, null, 2),
              },
            ],
          };
        }

        case 'get-activity-by-id': {
          if (!args?.id) {
            throw new Error('ID argument is required');
          }

          const entry = await MasterPlan.findById(parseInt(args.id));
          if (!entry) {
            throw new Error(`Mission plan entry with id ${args.id} not found`);
          }

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ data: entry }, null, 2),
              },
            ],
          };
        }

        case 'search-activities': {
          if (!args?.query) {
            throw new Error('Query argument is required');
          }

          const limit = Math.min(parseInt(args?.limit) || 100, 1000);
          const results = await MasterPlan.search(args.query, limit);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  data: results,
                  query: args.query,
                  count: results.length,
                }, null, 2),
              },
            ],
          };
        }

        case 'get-metadata': {
          const type = args?.type || 'stats';

          switch (type) {
            case 'teams': {
              const teams = await MasterPlan.getTeams();
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({ data: teams, count: teams.length }, null, 2),
                  },
                ],
              };
            }

            case 'targets': {
              const targets = await MasterPlan.getTargets();
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({ data: targets, count: targets.length }, null, 2),
                  },
                ],
              };
            }

            case 'spass-types': {
              const spassTypes = await MasterPlan.getSpassTypes();
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({ data: spassTypes, count: spassTypes.length }, null, 2),
                  },
                ],
              };
            }

            case 'stats':
            default: {
              const [total, teams, targets, spassTypes] = await Promise.all([
                MasterPlan.count(),
                MasterPlan.getTeams(),
                MasterPlan.getTargets(),
                MasterPlan.getSpassTypes(),
              ]);
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({
                      data: {
                        totalEntries: total,
                        uniqueTeams: teams.length,
                        uniqueTargets: targets.length,
                        uniqueSpassTypes: spassTypes.length,
                      },
                    }, null, 2),
                  },
                ],
              };
            }
          }
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  /**
   * Start the MCP server
   */
  async start() {
    // Connect to database
    await db.connect();
    console.log('Database connected for MCP server');

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('Cassini-Huygens MCP Server running on stdio');
  }
}

module.exports = CassiniMCPServer;
