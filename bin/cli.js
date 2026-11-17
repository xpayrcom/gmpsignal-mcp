#!/usr/bin/env node
/**
 * @fileoverview GMPSignal MCP Server (stdio JSON-RPC 2.0 transport) with optional --print-config flag.
 */

import readline from 'node:readline';

const GATEWAY_BASE = (process.env.GMPSIGNAL_BASE_URL || 'https://xpayr.com/gmpsignal').replace(/\/+$/, '');
const API_KEY = process.env.GMPSIGNAL_API_KEY || '';

(() => {
    let u;
    try { u = new URL(GATEWAY_BASE); } catch { console.error('GMPSIGNAL_BASE_URL is not a valid URL'); process.exit(1); }
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(u.hostname);
    if (u.protocol !== 'https:' && !(local && u.protocol === 'http:')) {
        console.error('GMPSIGNAL_BASE_URL must use https://');
        process.exit(1);
    }
})();

if (process.argv.includes('--print-config')) {
    console.log(JSON.stringify({
        mcpServers: {
            gmpsignal: {
                command: 'npx',
                args: ['-y', 'gmpsignal-mcp'],
                env: {
                    // Never echo the real key to stdout (shell history, CI logs, screen shares).
                    GMPSIGNAL_API_KEY: 'YOUR_X_API_KEY'
                }
            }
        }
    }, null, 2));
    process.exit(0);
}

/**
 * Forwards an MCP JSON-RPC 2.0 request to the GMPSignal MCP endpoint.
 *
 * @param {object} rpcRequest Parsed JSON-RPC request object.
 * @returns {Promise<object|null>} JSON-RPC response or null for notifications.
 */
async function forwardToGateway(rpcRequest) {
    if (rpcRequest.method === 'initialize') {
        return {
            jsonrpc: '2.0',
            id: rpcRequest.id ?? null,
            result: {
                protocolVersion: '2024-11-05',
                capabilities: { tools: {} },
                serverInfo: {
                    name: 'gmpsignal-mcp',
                    version: '1.5.0'
                }
            }
        };
    }

    if (rpcRequest.method === 'notifications/initialized') {
        return null;
    }

    const headers = { 'Content-Type': 'application/json' };
    if (API_KEY) {
        headers['X-API-Key'] = API_KEY;
    }

    const res = await fetch(`${GATEWAY_BASE}/mcp`, {
        method: 'POST',
        headers,
        body: JSON.stringify(rpcRequest)
    });

    if (res.status === 202) {
        return null;
    }

    const body = await res.json().catch(() => ({
        jsonrpc: '2.0',
        id: rpcRequest.id ?? null,
        error: { code: -32603, message: `Upstream HTTP ${res.status}` }
    }));

    if (res.status === 402 && !body.jsonrpc) {
        return {
            jsonrpc: '2.0',
            id: rpcRequest.id ?? null,
            error: {
                code: -32001,
                message: `Payment or GMPSIGNAL_API_KEY required. Get an instant key at ${GATEWAY_BASE}/`
            }
        };
    }

    return body;
}

const rl = readline.createInterface({
    input: process.stdin,
    crlfDelay: Infinity
});

rl.on('line', async (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    let req;
    try {
        req = JSON.parse(trimmed);
    } catch {
        process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } })}\n`);
        return;
    }

    try {
        const resp = await forwardToGateway(req);
        if (resp !== null) {
            process.stdout.write(`${JSON.stringify(resp)}\n`);
        }
    } catch (err) {
        if (req.id !== undefined) {
            process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id: req.id, error: { code: -32603, message: err.message } })}\n`);
        }
    }
});
