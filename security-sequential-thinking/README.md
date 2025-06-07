# Security Sequential Thinking MCP Server

A Model Context Protocol (MCP) server that enables AI models to perform security-focused sequential thinking. This server helps guide models through structured security analysis of code, systems, and processes using established security frameworks.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## Features

- **Security-Focused Sequential Thinking**: Guides models through methodical security analysis
- **Multiple Security Frameworks**: Incorporates OWASP Top 10, STRIDE, CWE, and NIST SSDF
- **Severity Ratings**: Assigns severity levels to identified security issues
- **Security Categorization**: Categorizes security concerns by type
- **Mitigation Suggestions**: Tracks and suggests mitigations for security issues
- **Security Summary**: Provides a comprehensive summary of security findings

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd security-sequential-thinking

# Install dependencies
npm install
```

## Usage

### Running the Server Locally

The server can run in two modes: HTTP mode (default) and stdio mode.

```bash
# Run in HTTP mode (default)
npm start

# Run in stdio mode (for local MCP clients)
npm run dev
```

### Deploying to Render.com

1. Fork or clone this repository to your GitHub account
2. Log in to your [Render.com](https://render.com) account
3. Click on "New" and select "Web Service"
4. Connect your GitHub repository
5. Configure the service with the following settings:
   - **Name**: Choose a name for your service
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose a paid plan for better performance)
6. Click "Create Web Service"

Once deployed, Render will provide you with a URL for your MCP server (e.g., `https://your-service-name.onrender.com`).

### Integrating with MCP Clients

This server exposes a single tool named `securitysequentialthinking` that can be used by MCP clients.

#### Connecting to Claude or other AI assistants

1. Open Claude or another AI assistant that supports MCP
2. Navigate to settings and add a new MCP server
3. Provide the URL of your deployed server (e.g., `https://your-service-name.onrender.com`)
4. The AI assistant should now have access to the `securitysequentialthinking` tool

### Tool Parameters

The tool accepts the following parameters:

- **thought**: Your current security thinking step (required)
- **nextThoughtNeeded**: Whether another security thought step is needed (required)
- **thoughtNumber**: Current thought number (required)
- **totalThoughts**: Estimated total thoughts needed (required)
- **isRevision**: Whether this revises previous security thinking
- **revisesThought**: Which thought is being reconsidered
- **branchFromThought**: Branching point thought number
- **branchId**: Branch identifier
- **needsMoreThoughts**: If more security thoughts are needed
- **securityFramework**: Security framework being applied (OWASP_TOP_10, STRIDE, CWE, NIST)
- **severityLevel**: Severity of the security issue (CRITICAL, HIGH, MEDIUM, LOW, INFO)
- **securityCategory**: Category of the security concern
- **mitigationSuggested**: Whether a mitigation is suggested in the thought

## Example Usage Flow

Here's an example of how a model might use this tool for security analysis:

1. **Initial Assessment**: The model starts with an initial security assessment of the code or system.
   ```json
   {
     "thought": "Analyzing the authentication system for potential security vulnerabilities.",
     "thoughtNumber": 1,
     "totalThoughts": 5,
     "nextThoughtNeeded": true
   }
   ```

2. **Vulnerability Identification**: The model identifies specific vulnerabilities.
   ```json
   {
     "thought": "The password storage mechanism is using MD5 hashing without salting, which is vulnerable to rainbow table attacks.",
     "thoughtNumber": 2,
     "totalThoughts": 5,
     "nextThoughtNeeded": true,
     "securityFramework": "OWASP Top 10",
     "severityLevel": "HIGH",
     "securityCategory": "Cryptographic Failures",
     "mitigationSuggested": false
   }
   ```

3. **Mitigation Suggestion**: The model suggests mitigations for the identified issues.
   ```json
   {
     "thought": "Mitigation: Replace MD5 with a modern hashing algorithm like bcrypt, Argon2, or PBKDF2 with appropriate work factors and unique salts per password.",
     "thoughtNumber": 3,
     "totalThoughts": 5,
     "nextThoughtNeeded": true,
     "securityFramework": "OWASP Top 10",
     "severityLevel": "HIGH",
     "securityCategory": "Cryptographic Failures",
     "mitigationSuggested": true
   }
   ```

4. **Additional Analysis**: The model continues analyzing other aspects.
   ```json
   {
     "thought": "The session management implementation does not invalidate sessions on logout or after a period of inactivity.",
     "thoughtNumber": 4,
     "totalThoughts": 5,
     "nextThoughtNeeded": true,
     "securityFramework": "OWASP Top 10",
     "severityLevel": "MEDIUM",
     "securityCategory": "Session Management",
     "mitigationSuggested": false
   }
   ```

5. **Final Summary**: The model provides a final security assessment.
   ```json
   {
     "thought": "Final security assessment: The authentication system has two significant vulnerabilities - weak password hashing and improper session management. Both issues require immediate attention, with the password hashing being the higher priority due to its severity.",
     "thoughtNumber": 5,
     "totalThoughts": 5,
     "nextThoughtNeeded": false
   }
   ```

## License

[MIT](LICENSE)
