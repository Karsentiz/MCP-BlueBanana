#!/usr/bin/env node
import fetch from 'node-fetch';

// Test the HTTP server
async function testHttpServer() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    // Test health check endpoint
    console.log('Testing health check endpoint...');
    const healthResponse = await fetch(baseUrl);
    const healthData = await healthResponse.json();
    console.log('Health check response:', healthData);
    
    // Test list_tools endpoint
    console.log('\nTesting list_tools endpoint...');
    const listToolsResponse = await fetch(`${baseUrl}/mcp/list_tools`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    const listToolsData = await listToolsResponse.json();
    console.log('List tools response:', JSON.stringify(listToolsData, null, 2));
    
    // Test call_tool endpoint with a simple thought
    console.log('\nTesting call_tool endpoint...');
    const callToolResponse = await fetch(`${baseUrl}/mcp/call_tool`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tool_name: 'securitysequentialthinking',
        tool_input: {
          thought: 'Testing the security sequential thinking MCP server over HTTP.',
          thoughtNumber: 1,
          totalThoughts: 1,
          nextThoughtNeeded: false
        }
      })
    });
    const callToolData = await callToolResponse.json();
    console.log('Call tool response:', JSON.stringify(callToolData, null, 2));
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Error testing HTTP server:', error);
  }
}

testHttpServer();
