const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');

// Blocked modules — prevent access to dangerous Node.js APIs
const BLOCKED_MODULES = [
  'fs', 'child_process', 'cluster', 'dgram', 'dns', 'http', 'https',
  'net', 'tls', 'os', 'path', 'readline', 'stream', 'worker_threads',
  'vm', 'crypto', 'zlib', 'process',
];

const EXECUTION_TIMEOUT = 5000; // 5 seconds
const MAX_OUTPUT_LENGTH = 10000; // 10KB output limit

/**
 * Execute JavaScript code in a sandboxed environment
 * @param {string} code - User's code to execute
 * @param {string} input - stdin input for the code
 * @returns {{ output: string, error: string|null, executionTime: number }}
 */
const executeCode = (code, input = '') => {
  const startTime = Date.now();

  // Validate code — block dangerous patterns
  for (const mod of BLOCKED_MODULES) {
    const patterns = [
      `require('${mod}')`,
      `require("${mod}")`,
      `require(\`${mod}\`)`,
      `import '${mod}'`,
      `import "${mod}"`,
    ];
    for (const pattern of patterns) {
      if (code.includes(pattern)) {
        return {
          output: '',
          error: `Security Error: Access to module '${mod}' is blocked.`,
          executionTime: Date.now() - startTime,
        };
      }
    }
  }

  // Block process.exit, eval with require, etc.
  const dangerousPatterns = [
    /process\s*\.\s*exit/,
    /process\s*\.\s*env/,
    /global\s*\./,
    /eval\s*\(/,
    /Function\s*\(/,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(code)) {
      return {
        output: '',
        error: 'Security Error: Restricted operation detected.',
        executionTime: Date.now() - startTime,
      };
    }
  }

  // Create a temporary file for execution
  const tempDir = os.tmpdir();
  const fileId = crypto.randomBytes(8).toString('hex');
  const tempFile = path.join(tempDir, `cwa_exec_${fileId}.js`);

  try {
    // Wrap user code in a sandbox that captures console.log output
    const wrappedCode = `
'use strict';

// Override require to block dangerous modules
const originalRequire = require;
const blockedModules = ${JSON.stringify(BLOCKED_MODULES)};
global.require = function(mod) {
  if (blockedModules.includes(mod)) {
    throw new Error(\`Security Error: Access to module '\${mod}' is blocked.\`);
  }
  return originalRequire(mod);
};

// Capture output
const __output = [];
const __originalLog = console.log;
console.log = function(...args) {
  __output.push(args.map(a => {
    if (typeof a === 'object') return JSON.stringify(a);
    return String(a);
  }).join(' '));
};

// Set input
const __input = ${JSON.stringify(input)};
const __inputLines = __input.split('\\n');
let __inputIndex = 0;
function readline() {
  return __inputLines[__inputIndex++] || '';
}

try {
  ${code}
} catch (e) {
  console.log = __originalLog;
  process.stderr.write('RuntimeError: ' + e.message);
  process.exit(1);
}

// Print captured output
console.log = __originalLog;
process.stdout.write(__output.join('\\n'));
`;

    fs.writeFileSync(tempFile, wrappedCode, 'utf8');

    // Execute with timeout and memory limit
    const output = execSync(`node --max-old-space-size=64 "${tempFile}"`, {
      timeout: EXECUTION_TIMEOUT,
      maxBuffer: MAX_OUTPUT_LENGTH,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const executionTime = Date.now() - startTime;

    return {
      output: output.trim(),
      error: null,
      executionTime,
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;

    if (error.killed || error.signal === 'SIGTERM') {
      return {
        output: '',
        error: 'Time Limit Exceeded: Code took too long to execute (max 5s).',
        executionTime,
      };
    }

    // Extract stderr for runtime errors
    const stderr = error.stderr?.toString().trim() || '';
    const errorMessage = stderr || error.message || 'Unknown execution error';

    return {
      output: error.stdout?.toString().trim() || '',
      error: errorMessage,
      executionTime,
    };
  } finally {
    // Cleanup temp file
    try {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    } catch (cleanupErr) {
      // Ignore cleanup errors
    }
  }
};

/**
 * Run code against test cases
 * @param {string} code - User's code
 * @param {Array} testCases - [{input, expectedOutput}]
 * @returns {{ status, results, passedCount, totalTests, executionTime }}
 */
const runTestCases = (code, testCases) => {
  const results = [];
  let passedCount = 0;
  let totalTime = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const { output, error, executionTime } = executeCode(code, tc.input);
    totalTime += executionTime;

    const expectedTrimmed = tc.expectedOutput.trim();
    const outputTrimmed = output.trim();
    const passed = !error && outputTrimmed === expectedTrimmed;

    if (passed) passedCount++;

    results.push({
      testCase: i + 1,
      passed,
      output: outputTrimmed,
      expected: expectedTrimmed,
      error: error || '',
    });
  }

  const status = passedCount === testCases.length ? 'passed' :
    results.some(r => r.error.includes('Time Limit')) ? 'timeout' :
      results.some(r => r.error) ? 'error' : 'failed';

  return {
    status,
    results,
    passedCount,
    totalTests: testCases.length,
    executionTime: totalTime,
  };
};

module.exports = { executeCode, runTestCases };
