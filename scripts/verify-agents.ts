import 'dotenv/config';
import { runAgent, getAgents } from '../services/agent.service';
import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verifyAgents() {
    console.log("--- Verifying Agents ---");
    const agents = await getAgents();
    console.log(`Found ${agents.length} agents.`);

    if (agents.length === 0) {
        console.error("❌ No agents found. Seed might have failed.");
        process.exit(1);
    }

    const activeAgent = agents.find(a => a.enabled);
    if (!activeAgent) {
        console.error("❌ No active agent found to run.");
        process.exit(1);
    }

    console.log(`Attempting to run agent: ${activeAgent.name} (${activeAgent.type})`);

    try {
        const updatedAgent = await runAgent(activeAgent.id);
        const logs = updatedAgent.logs as any[];
        const lastLog = logs[0];

        console.log("Agent Run Result:", lastLog);

        if (lastLog && lastLog.message) {
            console.log("✅ Agent Run Verified (Log entry created)");
        } else {
            console.error("❌ Agent Run Failed (No log entry)");
        }

    } catch (error) {
        console.error("❌ Agent Run Exception:", error);
    }

    process.exit(0);
}

verifyAgents().catch(console.error);
