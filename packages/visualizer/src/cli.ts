#!/usr/bin/env node

/**
 * CLI tool for visualizing NeuraForm schemas
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { SchemaVisualizer } from './visualizer';
import type { FormSchema } from '@neuraform/core';

const args = process.argv.slice(2);

function printHelp() {
    console.log(`
🧠 NeuraForm Visualizer

Usage:
  neuraform-visualizer <schema-file> [options]

Options:
  -o, --output <file>    Output HTML file (default: schema-visualization.html)
  -h, --help            Show this help message

Examples:
  neuraform-visualizer schema.json
  neuraform-visualizer schema.json -o my-form.html
  `);
}

function main() {
    if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
        printHelp();
        process.exit(0);
    }

    const schemaFile = args[0];
    let outputFile = 'schema-visualization.html';

    // Parse output option
    const outputIndex = args.findIndex(arg => arg === '-o' || arg === '--output');
    if (outputIndex !== -1 && args[outputIndex + 1]) {
        outputFile = args[outputIndex + 1];
    }

    try {
        // Read and parse schema
        const schemaPath = resolve(process.cwd(), schemaFile);
        const schemaContent = readFileSync(schemaPath, 'utf-8');
        const schema: FormSchema = JSON.parse(schemaContent);

        // Generate HTML
        const html = SchemaVisualizer.toHTML(schema);
        const stats = SchemaVisualizer.getStats(schema);

        // Write output
        const outputPath = resolve(process.cwd(), outputFile);
        writeFileSync(outputPath, html, 'utf-8');

        // Print success message
        console.log(`\n✅ Visualization generated successfully!\n`);
        console.log(`📊 Schema Statistics:`);
        console.log(`   Total States: ${stats.totalStates}`);
        console.log(`   Total Transitions: ${stats.totalTransitions}`);
        console.log(`   Final States: ${stats.finalStates}`);
        console.log(`   Avg Branching Factor: ${stats.averageBranchingFactor}\n`);
        console.log(`📄 Output: ${outputPath}\n`);
        console.log(`💡 Open the file in your browser to view the visualization.\n`);

    } catch (error) {
        console.error(`\n❌ Error: ${(error as Error).message}\n`);
        process.exit(1);
    }
}

main();
