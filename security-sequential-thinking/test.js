#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, 'index.js');

// Start the MCP server as a child process
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', process.stderr]
});

// Helper function to send a request to the server and get a response
async function sendRequest(request) {
  return new Promise((resolve, reject) => {
    const requestStr = JSON.stringify(request) + '\n';
    
    const responseChunks = [];
    
    const onData = (chunk) => {
      responseChunks.push(chunk);
      const data = Buffer.concat(responseChunks).toString();
      
      if (data.includes('\n')) {
        server.stdout.removeListener('data', onData);
        const response = data.split('\n')[0];
        try {
          resolve(JSON.parse(response));
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      }
    };
    
    server.stdout.on('data', onData);
    server.stdin.write(requestStr);
  });
}

async function runTests() {
  try {
    console.log('Testing Security Sequential Thinking MCP Server...');
    
    // Test 1: List tools
    console.log('\nTest 1: List tools');
    const listToolsResponse = await sendRequest({
      type: 'list_tools_request'
    });
    console.log('Response:', JSON.stringify(listToolsResponse, null, 2));
    
    // Test 2: Call tool with valid input
    console.log('\nTest 2: Call tool with valid input');
    const callToolResponse1 = await sendRequest({
      type: 'call_tool_request',
      params: {
        name: 'securitysequentialthinking',
        arguments: {
          thought: 'Analyzing the authentication system for potential security vulnerabilities.',
          thoughtNumber: 1,
          totalThoughts: 5,
          nextThoughtNeeded: true
        }
      }
    });
    console.log('Response:', JSON.stringify(callToolResponse1, null, 2));
    
    // Test 3: Call tool with security-specific parameters
    console.log('\nTest 3: Call tool with security-specific parameters');
    const callToolResponse2 = await sendRequest({
      type: 'call_tool_request',
      params: {
        name: 'securitysequentialthinking',
        arguments: {
          thought: 'The password storage mechanism is using MD5 hashing without salting, which is vulnerable to rainbow table attacks.',
          thoughtNumber: 2,
          totalThoughts: 5,
          nextThoughtNeeded: true,
          securityFramework: 'OWASP Top 10',
          severityLevel: 'HIGH',
          securityCategory: 'Cryptographic Failures',
          mitigationSuggested: false
        }
      }
    });
    console.log('Response:', JSON.stringify(callToolResponse2, null, 2));
    
    // Test 4: Call tool with mitigation suggestion
    console.log('\nTest 4: Call tool with mitigation suggestion');
    const callToolResponse3 = await sendRequest({
      type: 'call_tool_request',
      params: {
        name: 'securitysequentialthinking',
        arguments: {
          thought: 'Mitigation: Replace MD5 with a modern hashing algorithm like bcrypt, Argon2, or PBKDF2 with appropriate work factors and unique salts per password.',
          thoughtNumber: 3,
          totalThoughts: 5,
          nextThoughtNeeded: true,
          securityFramework: 'OWASP Top 10',
          severityLevel: 'HIGH',
          securityCategory: 'Cryptographic Failures',
          mitigationSuggested: true
        }
      }
    });
    console.log('Response:', JSON.stringify(callToolResponse3, null, 2));
    
    // Test 5: Call tool with final thought (no more thoughts needed)
    console.log('\nTest 5: Call tool with final thought');
    const callToolResponse4 = await sendRequest({
      type: 'call_tool_request',
      params: {
        name: 'securitysequentialthinking',
        arguments: {
          thought: 'Final security assessment: The authentication system has two significant vulnerabilities - weak password hashing and improper session management. Both issues require immediate attention, with the password hashing being the higher priority due to its severity.',
          thoughtNumber: 5,
          totalThoughts: 5,
          nextThoughtNeeded: false
        }
      }
    });
    console.log('Response:', JSON.stringify(callToolResponse4, null, 2));
    
    // Test 6: Call unknown tool
    console.log('\nTest 6: Call unknown tool');
    const callToolResponse5 = await sendRequest({
      type: 'call_tool_request',
      params: {
        name: 'unknowntool',
        arguments: {}
      }
    });
    console.log('Response:', JSON.stringify(callToolResponse5, null, 2));
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    server.kill();
    process.exit(0);
  }
}

runTests();
