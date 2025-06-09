#!/usr/bin/env node
import chalk from 'chalk';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import process from 'process';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const modeArg = args.find(arg => arg.startsWith('--mode='));
const mode = modeArg ? modeArg.split('=')[1] : process.env.SERVER_MODE || 'http';

// Security frameworks and methodologies
const SecurityFramework = {
  OWASP_TOP_10: "OWASP Top 10",
  STRIDE: "STRIDE",
  CWE: "CWE",
  NIST: "NIST SSDF"
};

// Severity levels for security issues
const SeverityLevel = {
  CRITICAL: "CRITICAL",
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
  INFO: "INFO"
};

class SecuritySequentialThinkingServer {
  constructor() {
    this.thoughtHistory = [];
    this.branches = {};
    this.securityIssues = [];
  }

  validateThoughtData(input) {
    const data = input;

    if (!data.thought || typeof data.thought !== 'string') {
      throw new Error('Invalid thought: must be a string');
    }
    if (!data.thoughtNumber || typeof data.thoughtNumber !== 'number') {
      throw new Error('Invalid thoughtNumber: must be a number');
    }
    if (!data.totalThoughts || typeof data.totalThoughts !== 'number') {
      throw new Error('Invalid totalThoughts: must be a number');
    }
    if (typeof data.nextThoughtNeeded !== 'boolean') {
      throw new Error('Invalid nextThoughtNeeded: must be a boolean');
    }

    // Validate security-specific fields if present
    if (data.severityLevel && !Object.values(SeverityLevel).includes(data.severityLevel)) {
      throw new Error('Invalid severityLevel: must be one of CRITICAL, HIGH, MEDIUM, LOW, or INFO');
    }

    if (data.securityFramework && !Object.values(SecurityFramework).includes(data.securityFramework)) {
      throw new Error('Invalid securityFramework: must be one of OWASP_TOP_10, STRIDE, CWE, or NIST');
    }

    return {
      thought: data.thought,
      thoughtNumber: data.thoughtNumber,
      totalThoughts: data.totalThoughts,
      nextThoughtNeeded: data.nextThoughtNeeded,
      isRevision: data.isRevision,
      revisesThought: data.revisesThought,
      branchFromThought: data.branchFromThought,
      branchId: data.branchId,
      needsMoreThoughts: data.needsMoreThoughts,
      // Security-specific fields
      securityFramework: data.securityFramework,
      severityLevel: data.severityLevel,
      securityCategory: data.securityCategory,
      mitigationSuggested: data.mitigationSuggested,
    };
  }

  getSeverityColor(severity) {
    switch (severity) {
      case SeverityLevel.CRITICAL:
        return chalk.bgRed.white;
      case SeverityLevel.HIGH:
        return chalk.red;
      case SeverityLevel.MEDIUM:
        return chalk.yellow;
      case SeverityLevel.LOW:
        return chalk.green;
      case SeverityLevel.INFO:
        return chalk.blue;
      default:
        return chalk.white;
    }
  }

  formatThought(thoughtData) {
    const { 
      thoughtNumber, 
      totalThoughts, 
      thought, 
      isRevision, 
      revisesThought, 
      branchFromThought, 
      branchId,
      severityLevel,
      securityFramework,
      securityCategory
    } = thoughtData;

    let prefix = '';
    let context = '';
    let securityInfo = '';

    if (isRevision) {
      prefix = chalk.yellow('🔄 Revision');
      context = ` (revising thought ${revisesThought})`;
    } else if (branchFromThought) {
      prefix = chalk.green('🌿 Branch');
      context = ` (from thought ${branchFromThought}, ID: ${branchId})`;
    } else {
      prefix = chalk.blue('💭 Security Thought');
      context = '';
    }

    // Add security-specific information if available
    if (severityLevel || securityFramework || securityCategory) {
      securityInfo = '\n│ ';
      
      if (securityFramework) {
        securityInfo += chalk.cyan(`Framework: ${securityFramework} `);
      }
      
      if (securityCategory) {
        securityInfo += chalk.magenta(`Category: ${securityCategory} `);
      }
      
      if (severityLevel) {
        const severityColor = this.getSeverityColor(severityLevel);
        securityInfo += severityColor(`Severity: ${severityLevel}`);
      }
      
      securityInfo += ' │';
    }

    const header = `${prefix} ${thoughtNumber}/${totalThoughts}${context}`;
    const borderLength = Math.max(
      header.length, 
      thought.length, 
      securityInfo.length ? securityInfo.length - 4 : 0
    ) + 4;
    const border = '─'.repeat(borderLength);

    return `
┌${border}┐
│ ${header.padEnd(borderLength - 2)} │
${securityInfo ? securityInfo + '\n' : ''}├${border}┤
│ ${thought.padEnd(borderLength - 2)} │
└${border}┘`;
  }

  trackSecurityIssue(thoughtData) {
    if (thoughtData.severityLevel && thoughtData.securityCategory) {
      // Extract potential mitigation from the thought
      const mitigation = thoughtData.mitigationSuggested 
        ? this.extractMitigation(thoughtData.thought)
        : undefined;

      this.securityIssues.push({
        issue: thoughtData.thought,
        severity: thoughtData.severityLevel,
        category: thoughtData.securityCategory,
        mitigation
      });
    }
  }

  extractMitigation(thought) {
    // Simple heuristic to extract mitigation - look for text after "Mitigation:" or similar phrases
    const mitigationPatterns = [
      /mitigation:\s*(.*)/i,
      /fix:\s*(.*)/i,
      /solution:\s*(.*)/i,
      /recommendation:\s*(.*)/i
    ];

    for (const pattern of mitigationPatterns) {
      const match = thought.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return undefined;
  }

  generateSecuritySummary() {
    // Group issues by severity
    const issuesBySeverity = {
      [SeverityLevel.CRITICAL]: [],
      [SeverityLevel.HIGH]: [],
      [SeverityLevel.MEDIUM]: [],
      [SeverityLevel.LOW]: [],
      [SeverityLevel.INFO]: []
    };

    this.securityIssues.forEach(issue => {
      issuesBySeverity[issue.severity].push({
        category: issue.category,
        description: issue.issue.substring(0, 100) + (issue.issue.length > 100 ? '...' : ''),
        mitigation: issue.mitigation
      });
    });

    return {
      criticalCount: issuesBySeverity[SeverityLevel.CRITICAL].length,
      highCount: issuesBySeverity[SeverityLevel.HIGH].length,
      mediumCount: issuesBySeverity[SeverityLevel.MEDIUM].length,
      lowCount: issuesBySeverity[SeverityLevel.LOW].length,
      infoCount: issuesBySeverity[SeverityLevel.INFO].length,
      issues: {
        critical: issuesBySeverity[SeverityLevel.CRITICAL],
        high: issuesBySeverity[SeverityLevel.HIGH],
        medium: issuesBySeverity[SeverityLevel.MEDIUM],
        low: issuesBySeverity[SeverityLevel.LOW],
        info: issuesBySeverity[SeverityLevel.INFO]
      }
    };
  }

  processThought(input) {
    try {
      const validatedInput = this.validateThoughtData(input);

      if (validatedInput.thoughtNumber > validatedInput.totalThoughts) {
        validatedInput.totalThoughts = validatedInput.thoughtNumber;
      }

      this.thoughtHistory.push(validatedInput);

      // Track security issues if severity and category are specified
      if (validatedInput.severityLevel && validatedInput.securityCategory) {
        this.trackSecurityIssue(validatedInput);
      }

      if (validatedInput.branchFromThought && validatedInput.branchId) {
        if (!this.branches[validatedInput.branchId]) {
          this.branches[validatedInput.branchId] = [];
        }
        this.branches[validatedInput.branchId].push(validatedInput);
      }

      const formattedThought = this.formatThought(validatedInput);
      console.error(formattedThought);

      // Prepare security summary if this is the final thought
      let securitySummary = undefined;
      if (!validatedInput.nextThoughtNeeded && this.securityIssues.length > 0) {
        securitySummary = this.generateSecuritySummary();
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              thoughtNumber: validatedInput.thoughtNumber,
              totalThoughts: validatedInput.totalThoughts,
              nextThoughtNeeded: validatedInput.nextThoughtNeeded,
              branches: Object.keys(this.branches),
              thoughtHistoryLength: this.thoughtHistory.length,
              securityIssuesCount: this.securityIssues.length,
              securitySummary
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
              status: 'failed'
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }
}

// MCP Protocol handling
class MCPServer {
  constructor() {
    this.securityThinkingServer = new SecuritySequentialThinkingServer();
    this.toolDefinition = {
      name: "securitysequentialthinking",
      description: `A detailed tool for security-focused problem-solving through sequential thoughts.
This tool helps analyze security concerns through a flexible thinking process that can adapt and evolve.
Each thought can build on, question, or revise previous insights as understanding deepens.

When to use this tool:
- Analyzing code for security vulnerabilities
- Conducting security threat modeling
- Designing secure systems and architectures
- Evaluating authentication and authorization mechanisms
- Assessing data protection measures
- Reviewing input validation and output encoding
- Identifying potential security risks in implementations

Security frameworks incorporated:
- OWASP Top 10 - Web application security risks
- STRIDE - Threat modeling (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege)
- CWE - Common Weakness Enumeration
- NIST SSDF - Secure Software Development Framework

Key features:
- You can adjust total_thoughts up or down as you progress
- You can question or revise previous security considerations
- You can add more thoughts even after reaching what seemed like the end
- You can express uncertainty and explore alternative security approaches
- Not every thought needs to build linearly - you can branch or backtrack
- Generates security vulnerability assessments
- Suggests mitigations for identified security issues
- Provides severity ratings for security concerns
- Summarizes security findings at the end of the process

Parameters explained:
- thought: Your current security thinking step
- next_thought_needed: True if you need more thinking, even if at what seemed like the end
- thought_number: Current number in sequence (can go beyond initial total if needed)
- total_thoughts: Current estimate of thoughts needed (can be adjusted up/down)
- is_revision: A boolean indicating if this thought revises previous thinking
- revises_thought: If is_revision is true, which thought number is being reconsidered
- branch_from_thought: If branching, which thought number is the branching point
- branch_id: Identifier for the current branch (if any)
- needs_more_thoughts: If reaching end but realizing more thoughts needed
- security_framework: The security framework being applied (OWASP_TOP_10, STRIDE, CWE, NIST)
- severity_level: Severity of the security issue (CRITICAL, HIGH, MEDIUM, LOW, INFO)
- security_category: Category of the security concern (e.g., "Injection", "Authentication", "Access Control")
- mitigation_suggested: Boolean indicating if a mitigation is suggested in the thought

You should:
1. Start with an initial estimate of needed security analysis steps
2. Feel free to question or revise previous security considerations
3. Don't hesitate to add more security thoughts if needed
4. Express uncertainty when present in security analysis
5. Mark thoughts that revise previous security thinking
6. Assign appropriate severity levels to identified security issues
7. Categorize security concerns appropriately
8. Suggest mitigations for identified security issues
9. Only set next_thought_needed to false when security analysis is complete
10. Provide a comprehensive security summary at the end`,
      inputSchema: {
        type: "object",
        properties: {
          thought: {
            type: "string",
            description: "Your current security thinking step"
          },
          nextThoughtNeeded: {
            type: "boolean",
            description: "Whether another security thought step is needed"
          },
          thoughtNumber: {
            type: "integer",
            description: "Current thought number",
            minimum: 1
          },
          totalThoughts: {
            type: "integer",
            description: "Estimated total thoughts needed",
            minimum: 1
          },
          isRevision: {
            type: "boolean",
            description: "Whether this revises previous security thinking"
          },
          revisesThought: {
            type: "integer",
            description: "Which thought is being reconsidered",
            minimum: 1
          },
          branchFromThought: {
            type: "integer",
            description: "Branching point thought number",
            minimum: 1
          },
          branchId: {
            type: "string",
            description: "Branch identifier"
          },
          needsMoreThoughts: {
            type: "boolean",
            description: "If more security thoughts are needed"
          },
          securityFramework: {
            type: "string",
            description: "Security framework being applied",
            enum: Object.values(SecurityFramework)
          },
          severityLevel: {
            type: "string",
            description: "Severity of the security issue",
            enum: Object.values(SeverityLevel)
          },
          securityCategory: {
            type: "string",
            description: "Category of the security concern"
          },
          mitigationSuggested: {
            type: "boolean",
            description: "Whether a mitigation is suggested in the thought"
          }
        },
        required: ["thought", "nextThoughtNeeded", "thoughtNumber", "totalThoughts"]
      }
    };
  }

  async handleRequest(request) {
    try {
      const parsedRequest = JSON.parse(request);
      
      if (parsedRequest.type === 'list_tools_request') {
        return this.handleListToolsRequest();
      } else if (parsedRequest.type === 'call_tool_request') {
        return this.handleCallToolRequest(parsedRequest);
      } else {
        return this.createErrorResponse(`Unknown request type: ${parsedRequest.type}`);
      }
    } catch (error) {
      return this.createErrorResponse(`Failed to parse request: ${error.message}`);
    }
  }

  handleListToolsRequest() {
    return JSON.stringify({
      type: 'list_tools_response',
      tools: [this.toolDefinition]
    });
  }

  async handleCallToolRequest(request) {
    try {
      // Handle both formats: direct name/input and tool_name/tool_input
      const toolName = request.tool_name || request.name;
      const toolInput = request.tool_input || request.input;
      
      if (toolName !== this.toolDefinition.name) {
        return this.createErrorResponse(`Unknown tool: ${toolName}`);
      }

      const validatedInput = this.securityThinkingServer.validateThoughtData(toolInput);
      const result = this.securityThinkingServer.processThought(validatedInput);

      return JSON.stringify({
        type: 'tool_call_response',
        content: [{
          type: 'text',
          text: result
        }]
      });
    } catch (error) {
      return this.createErrorResponse(`Error calling tool: ${error.message}`);
    }
  }

  createErrorResponse(message) {
    return JSON.stringify({
      type: 'error_response',
      content: [{
        type: 'text',
        text: message
      }],
      isError: true
    });
  }

  async startStdio() {
    console.error("Security Sequential Thinking MCP Server running on stdio");
    
    // Set up stdin/stdout handling
    process.stdin.setEncoding('utf8');
    
    let buffer = '';
    
    process.stdin.on('data', async (chunk) => {
      buffer += chunk;
      
      // Process complete messages (newline-delimited JSON)
      const messages = buffer.split('\n');
      buffer = messages.pop() || ''; // Keep the last incomplete message in the buffer
      
      for (const message of messages) {
        if (message.trim()) {
          try {
            const response = await this.handleRequest(message);
            process.stdout.write(response + '\n');
          } catch (error) {
            process.stdout.write(JSON.stringify({
              type: 'error_response',
              content: [{
                type: 'text',
                text: `Internal server error: ${error.message}`
              }],
              isError: true
            }) + '\n');
          }
        }
      }
    });
    
    process.stdin.on('end', () => {
      process.exit(0);
    });
  }
  
  async startHttp() {
    const app = express();
    const PORT = process.env.PORT || 3000;
    
    // Enable CORS for all routes with specific options for SSE
    app.use(cors({
      origin: '*',
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    
    // Parse JSON bodies
    app.use(express.json());
    
    // Health check endpoint
    app.get('/', (req, res) => {
      res.json({ status: 'ok', message: 'Security Sequential Thinking MCP Server is running' });
    });
    
    // MCP list_tools endpoint
    app.post('/mcp/list_tools', async (req, res) => {
      try {
        const response = await this.handleListToolsRequest();
        res.json(JSON.parse(response));
      } catch (error) {
        res.status(500).json(JSON.parse(this.createErrorResponse(`Error listing tools: ${error.message}`)));
      }
    });
    
    // MCP call_tool endpoint
    app.post('/mcp/call_tool', async (req, res) => {
      try {
        const response = await this.handleCallToolRequest(req.body);
        res.json(JSON.parse(response));
      } catch (error) {
        res.status(500).json(JSON.parse(this.createErrorResponse(`Error calling tool: ${error.message}`)));
      }
    });
    
    // Standard MCP protocol SSE implementation
    app.get('/sse', (req, res) => {
      console.error('MCP SSE connection established');
      
      // Set headers for SSE according to MCP protocol
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for nginx
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      // Send initial connection message in MCP format
      res.write('data: {"type":"connected"}\n\n');
      res.flush && res.flush();
      
      // Keep the connection alive with a heartbeat
      const heartbeat = setInterval(() => {
        try {
          res.write('data: {"type":"heartbeat"}\n\n');
          res.flush && res.flush();
        } catch (error) {
          console.error('Error sending heartbeat:', error);
          clearInterval(heartbeat);
        }
      }, 5000); // Send heartbeat every 5 seconds
      
      // Clean up on close
      req.on('close', () => {
        console.error('MCP SSE connection closed');
        clearInterval(heartbeat);
        res.end();
      });
      
      // Handle errors
      req.on('error', (error) => {
        console.error('MCP SSE connection error:', error);
        clearInterval(heartbeat);
        res.end();
      });
    });
    
    // Duplicate endpoint at /mcp/sse for compatibility
    app.get('/mcp/sse', (req, res) => {
      console.error('MCP SSE connection established on /mcp/sse');
      
      // Set headers for SSE according to MCP protocol
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for nginx
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      // Send initial connection message in MCP format
      res.write('data: {"type":"connected"}\n\n');
      res.flush && res.flush();
      
      // Keep the connection alive with a heartbeat
      const heartbeat = setInterval(() => {
        try {
          res.write('data: {"type":"heartbeat"}\n\n');
          res.flush && res.flush();
        } catch (error) {
          console.error('Error sending heartbeat:', error);
          clearInterval(heartbeat);
        }
      }, 5000); // Send heartbeat every 5 seconds
      
      // Clean up on close
      req.on('close', () => {
        console.error('MCP SSE connection closed on /mcp/sse');
        clearInterval(heartbeat);
        res.end();
      });
      
      // Handle errors
      req.on('error', (error) => {
        console.error('MCP SSE connection error on /mcp/sse:', error);
        clearInterval(heartbeat);
        res.end();
      });
    });
    
    // Add a debug endpoint to check SSE status
    app.get('/debug/sse-status', (req, res) => {
      res.json({
        status: 'ok',
        message: 'SSE endpoints are configured',
        endpoints: ['/mcp/sse', '/sse']
      });
    });
    
    // Start the server
    app.listen(PORT, () => {
      console.error(`Security Sequential Thinking MCP Server running on HTTP port ${PORT}`);
    });
  }
  
  async start() {
    if (mode === 'stdio') {
      await this.startStdio();
    } else {
      await this.startHttp();
    }
  }
}

// Start the server
const server = new MCPServer();
server.start().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error('Received SIGINT. Shutting down gracefully.');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('Received SIGTERM. Shutting down gracefully.');
  process.exit(0);
});
