#!/usr/bin/env node
/**
 * @fileoverview Official CLI helper for GMPSignal Remote MCP & REST API.
 */

const baseUrl = (process.env.GMPSIGNAL_BASE_URL || 'https://xpayr.com/gmpsignal').replace(/\/+$/, '');
const apiKey = process.env.GMPSIGNAL_API_KEY || process.argv[2] || '';

if (!apiKey) {
    console.log(JSON.stringify({
        ok: false,
        message: 'Provide your GMPSignal X-API-Key as an argument or GMPSIGNAL_API_KEY env var.',
        getInstantCryptoKeyUrl: `${baseUrl}/`
    }, null, 2));
    process.exit(0);
}

console.log(JSON.stringify({
    mcpServers: {
        gmpsignal: {
            transport: 'streamable-http',
            url: `${baseUrl}/mcp`,
            headers: {
                'X-API-Key': apiKey
            }
        }
    }
}, null, 2));
