# GMPSignal Real-Time Intelligence MCP Server (59 Tools)

An MCP (Model Context Protocol) server implementation exposing **59 real-time B2B lead, startup dealflow, ecommerce, crypto arbitrage, and cybersecurity intelligence tools** over both `stdio` JSON-RPC 2.0 (via `bin/cli.js` / Docker) and Streamable HTTP (`https://xpayr.com/gmpsignal/mcp`).

## Features

- **Full MCP `stdio` Server (`bin/cli.js`)**: Implements `initialize`, `tools/list`, and `tools/call` over standard input/output for Claude Desktop, Cursor, Windsurf, and Glama Docker inspection.
- **59 Live Intelligence Tools**: Crypto orderbook arbitrage, DEX security audits, YC/GitHub startup dealflow, tech-stack & B2B contact enrichment, Shodan/CVE perimeter scans, trademark & procurement monitors.
- **Zero-Commission Crypto Checkout & x402**: Obtain an instant `GMPSIGNAL_API_KEY` via XPayr at https://xpayr.com/gmpsignal/ or pay-per-call via `x402` Base USDC (`$0.005/call`).

## Installation & Usage

### Run as a Local `stdio` MCP Server

```json
{
  "mcpServers": {
    "gmpsignal": {
      "command": "npx",
      "args": ["-y", "gmpsignal-mcp"],
      "env": {
        "GMPSIGNAL_API_KEY": "YOUR_X_API_KEY"
      }
    }
  }
}
```

### Run via Docker

```bash
docker build -t gmpsignal-mcp .
docker run -i --rm -e GMPSIGNAL_API_KEY=YOUR_X_API_KEY gmpsignal-mcp
```

### Remote Streamable HTTP Transport

- Endpoint: `https://xpayr.com/gmpsignal/mcp`
- Discovery Manifest: `https://xpayr.com/gmpsignal/server.json`
- OpenAPI 3.1 Spec: `https://xpayr.com/gmpsignal/openapi.json`

## License

MIT — see [LICENSE](./LICENSE).
