import { PrismaClient, Role, AgentType } from '../app/generated/prisma/client';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      apiLimits: { LEAD_GEN: 1000, SEO: 500 },
      featureFlags: { chat_agent: true, export_reports: true }
    },
    create: {
      email: 'admin@example.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: Role.SUPERADMIN,
      apiLimits: { LEAD_GEN: 1000, SEO: 500 },
      featureFlags: { chat_agent: true, export_reports: true }
    },
  });

  console.log('Users seeded:', { admin: admin.id });

  // 2. Products
  const productsData = [
    { title: 'Quantum Laptop', slug: 'quantum-laptop', description: 'Fastest laptop.', specs: {} },
  ];

  for (const p of productsData) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  const products = await prisma.product.findMany();

  // 3. Inquiries
  if (products.length > 0) {
    for (let i = 0; i < 5; i++) {
      await prisma.inquiry.create({
        data: {
          productId: products[0].id,
          name: `Customer ${i}`,
          email: `customer${i}@test.com`,
          message: 'Interested in this product.',
          status: 'NEW',
        }
      });
    }
    console.log('Inquiries seeded: 5');
  }

  // 4. Agents - Email Responder
  const agentsData = [
    { name: 'Auto Responder', type: AgentType.EMAIL_RESPONDER, enabled: true, config: {} },
  ];

  for (const agent of agentsData) {
    await prisma.agent.create({
      data: {
        name: agent.name,
        type: agent.type,
        enabled: agent.enabled,
        config: agent.config,
        logs: [],
      }
    });
  }
  console.log(`Agents seeded: ${agentsData.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      apiLimits: { LEAD_GEN: 1000, SEO: 500 },
      featureFlags: { chat_agent: true, export_reports: true }
    },
    create: {
      email: 'admin@example.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: Role.SUPERADMIN,
      apiLimits: { LEAD_GEN: 1000, SEO: 500 },
      featureFlags: { chat_agent: true, export_reports: true }
    },
  });

  const sales = await prisma.user.upsert({
    where: { email: 'sales@example.com' },
    update: {},
    create: {
      email: 'sales@example.com',
      name: 'Sales Rep',
      password: hashedPassword,
      role: Role.SALES,
      apiLimits: { LEAD_GEN: 100 },
    },
  });

  console.log('Users seeded:', { admin: admin.id, sales: sales.id });

  // 2. Products
  const productsData = [
    { title: 'Quantum Laptop', slug: 'quantum-laptop', description: 'Fastest laptop.' },
    { title: 'Ergo Chair', slug: 'ergo-chair', description: 'Comfy chair.' },
    { title: 'OLED Monitor', slug: 'oled-monitor', description: 'Bright screen.' },
  ];

  for (const p of productsData) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        specs: { cpu: 'i9', ram: '32GB' },
      },
    });
  }

  const products = await prisma.product.findMany();
  console.log(`Products seeded: ${products.length}`);

  // 3. Inquiries
  if (products.length > 0) {
    for (let i = 0; i < 10; i++) {
      await prisma.inquiry.create({
        data: {
          productId: products[i % products.length].id,
          name: `Customer ${i}`,
          email: `customer${i}@test.com`,
          message: 'I am interested in this.',
          status: i % 2 === 0 ? 'NEW' : 'CONTACTED',
          createdAt: new Date(Date.now() - i * 86400000), // Previous days
        }
      });
    }
    console.log('Inquiries seeded: 10');
  }

  // 4. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: admin.id,
        action: 'LOGIN',
        entity: 'AUTH',
        details: { method: 'password' },
        ip: '127.0.0.1',
        createdAt: new Date(),
      },
      {
        userId: admin.id,
        action: 'PRODUCT_CREATE',
        entity: 'PRODUCT',
        entityId: products[0]?.id,
        details: { title: products[0]?.title },
        createdAt: new Date(Date.now() - 1000 * 60 * 5),
      },
      {
        userId: admin.id,
        action: 'SETTINGS_UPDATE',
        entity: 'FEATURE_TOGGLE',
        details: { key: 'chat_agent', isEnabled: true },
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
      }
    ]
  });
  console.log('Audit Logs seeded.');

  // 5. Agents
  const agentsData = [
    { name: 'Lead Generator Alpha', type: AgentType.LEAD_GEN, enabled: true, config: { target: 'linkedin' } },
    { name: 'SEO Optimizer Beta', type: AgentType.SEO, enabled: true, config: { keywords: ['nextjs', 'prisma'] } },
    { name: 'Support Bot Gamma', type: AgentType.CHAT_SUPPORT, enabled: false, config: { tone: 'friendly' } },
  ];

  for (const agent of agentsData) {
    await prisma.agent.create({
      data: {
        name: agent.name,
        type: agent.type,
        enabled: agent.enabled,
        config: agent.config,
        logs: [],
      }
    });
  }
  console.log(`Agents seeded: ${agentsData.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });