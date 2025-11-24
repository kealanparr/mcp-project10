# Project info

I'm creating an MCP server using Node.js, Express and SQlite3. The data is the mission plan from the Cassini-Huygens mission.

The database is already created in `data/master_plan.db`. Use this for schema, models, etc.

## Considerations

I want to move very slowly, with one change being one single git commit, one iteration being a single push to Github dev branch.

Git commit messages should be very short. Offer to commit each task once it's done

## Guidelines

NEVER edit `package.json` directly when adding packages. ALWAYS use `npm install`

All model classes (representing data) go in the `lib/models` directory. All service and logic classes go in the `lib/services` directory. No generic `utility` code is allowed.

ALWAYS use decriptive emoji in my markdown docs.

Don't embellish or fill in gaps, ALWAYS use facts. Don't act effusive or overly positive. Just be direct.

Always add comments and documentation to generated code

## Closing iterations

Don't close an iteration until I tell you to

When closing, summarise the chat session with your instructions, my prompts and the result. Create a new `docs/logs` with the name `[day]-[month]-[year].md` with the summary