import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.activity.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.budgetLine.deleteMany();
  await prisma.projectWorker.deleteMany();
  await prisma.projectMaterial.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("admin123", 10);

  const owner = await prisma.user.create({
    data: {
      id: "user-1",
      name: "Jean-Paul Hakizimana",
      email: "jp@kalit.io",
      phone: "+250788123456",
      password,
      role: "owner",
      status: "active",
      company: "Kalit Construction",
    },
  });

  const kltPasswords: Record<string, string> = {};
  const teamMembersData = [
    { id: "user-2", name: "Alice Niyonzima", email: "alice@kalit.io", phone: "+250788234567", role: "project_manager" as const, klt: "KLT-1234" },
    { id: "user-3", name: "Patrick Mugabo", email: "patrick@kalit.io", phone: "+250788345678", role: "site_engineer" as const, klt: "KLT-5678" },
    { id: "user-4", name: "Claude Uwimana", email: "claude@kalit.io", phone: "+250788456789", role: "site_engineer" as const, klt: "KLT-ABCD" },
    { id: "user-5", name: "Diane Umutoni", email: "diane@kalit.io", phone: "+250788567890", role: "project_manager" as const, klt: "KLT-EFGH" },
    { id: "user-6", name: "Emmanuel Habimana", email: "emmanuel@kalit.io", phone: "+250788678901", role: "site_engineer" as const, klt: "KLT-IJKL" },
    { id: "user-7", name: "Grace Musabende", email: "grace@kalit.io", phone: "+250788789012", role: "storekeeper" as const, klt: "KLT-MNOP" },
    { id: "user-8", name: "Jean Mugiraneza", email: "jean@kalit.io", phone: "+250788890123", role: "site_engineer" as const, klt: "KLT-QRST" },
  ];

  const users = [owner];
  for (const member of teamMembersData) {
    kltPasswords[member.id] = member.klt;
    const u = await prisma.user.create({
      data: {
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        password: member.klt,
        role: member.role,
        status: "active",
        invitedBy: owner.id,
      },
    });
    users.push(u);
  }

  console.log("Created users");

  const projects = await Promise.all([
    prisma.project.create({
      data: {
        id: "proj-1",
        name: "Kigali Heights Extension",
        location: "Kigali, Rwanda",
        status: "on_track",
        progress: 68,
        budget: 2400000,
        spent: 1632000,
        startDate: new Date("2025-09-01"),
        endDate: new Date("2026-08-30"),
        description: "Modern office complex extension with 12 floors",
        materialsUsed: 342,
        tasksCompleted: 47,
        totalTasks: 69,
        createdBy: owner.id,
        managedBy: "user-2",
      },
    }),
    prisma.project.create({
      data: {
        id: "proj-2",
        name: "Lake View Residences",
        location: "Rubavu, Rwanda",
        status: "at_risk",
        progress: 42,
        budget: 1800000,
        spent: 820000,
        startDate: new Date("2025-11-15"),
        endDate: new Date("2026-11-15"),
        description: "Luxury residential complex overlooking Lake Kivu",
        materialsUsed: 189,
        tasksCompleted: 23,
        totalTasks: 55,
        createdBy: owner.id,
        managedBy: "user-3",
      },
    }),
    prisma.project.create({
      data: {
        id: "proj-3",
        name: "Nyamata Health Center",
        location: "Nyamata, Rwanda",
        status: "on_track",
        progress: 85,
        budget: 950000,
        spent: 807500,
        startDate: new Date("2025-06-01"),
        endDate: new Date("2026-04-30"),
        description: "Community health center with modern facilities",
        materialsUsed: 567,
        tasksCompleted: 58,
        totalTasks: 68,
        createdBy: owner.id,
        managedBy: "user-4",
      },
    }),
    prisma.project.create({
      data: {
        id: "proj-4",
        name: "Huye Tech Campus",
        location: "Huye, Rwanda",
        status: "delayed",
        progress: 28,
        budget: 3200000,
        spent: 1120000,
        startDate: new Date("2025-12-01"),
        endDate: new Date("2027-06-30"),
        description: "Technology innovation campus with co-working spaces",
        materialsUsed: 124,
        tasksCompleted: 14,
        totalTasks: 50,
        createdBy: owner.id,
        managedBy: "user-5",
      },
    }),
    prisma.project.create({
      data: {
        id: "proj-5",
        name: "Musanze Eco Resort",
        location: "Musanze, Rwanda",
        status: "on_track",
        progress: 55,
        budget: 1500000,
        spent: 825000,
        startDate: new Date("2025-10-01"),
        endDate: new Date("2026-12-31"),
        description: "Sustainable eco-tourism resort near Volcanoes National Park",
        materialsUsed: 278,
        tasksCompleted: 33,
        totalTasks: 60,
        createdBy: owner.id,
        managedBy: "user-6",
      },
    }),
    prisma.project.create({
      data: {
        id: "proj-6",
        name: "Kigali Convention Center Phase 2",
        location: "Kigali, Rwanda",
        status: "completed",
        progress: 100,
        budget: 4500000,
        spent: 4230000,
        startDate: new Date("2024-03-01"),
        endDate: new Date("2026-01-15"),
        description: "Expansion of the main convention center",
        materialsUsed: 891,
        tasksCompleted: 82,
        totalTasks: 82,
        createdBy: owner.id,
        managedBy: "user-2",
      },
    }),
  ]);

  console.log("Created projects");

  const inventoryItems = await Promise.all([
    prisma.inventoryItem.create({
      data: {
        id: "inv-item-1",
        name: "Portland Cement",
        category: "Structural",
        icon: "building",
        stock: 450,
        maxStock: 600,
        unit: "bags",
        value: 67500,
        supplier: "Simba Cement Co.",
        warehouse: "Warehouse A",
        status: "in_stock",
        lastRestocked: new Date("2026-07-01"),
      },
    }),
    prisma.inventoryItem.create({
      data: {
        id: "inv-item-2",
        name: "Steel Rebar (12mm)",
        category: "Structural",
        icon: "ruler",
        stock: 120,
        maxStock: 300,
        unit: "tons",
        value: 180000,
        supplier: "Rwanda Steel Works",
        warehouse: "Site Storage B",
        status: "low_stock",
        lastRestocked: new Date("2026-06-20"),
      },
    }),
    prisma.inventoryItem.create({
      data: {
        id: "inv-item-3",
        name: "Concrete Blocks",
        category: "Masonry",
        icon: "box",
        stock: 2800,
        maxStock: 3000,
        unit: "pcs",
        value: 28000,
        supplier: "BlockMaster Ltd.",
        warehouse: "Site Storage A",
        status: "in_stock",
        lastRestocked: new Date("2026-07-05"),
      },
    }),
    prisma.inventoryItem.create({
      data: {
        id: "inv-item-4",
        name: "Electrical Cable (6mm)",
        category: "Electrical",
        icon: "zap",
        stock: 800,
        maxStock: 1000,
        unit: "meters",
        value: 16000,
        supplier: "PowerLine Supply",
        warehouse: "Warehouse C",
        status: "in_stock",
        lastRestocked: new Date("2026-07-08"),
      },
    }),
    prisma.inventoryItem.create({
      data: {
        id: "inv-item-5",
        name: "PVC Pipes (4 inch)",
        category: "Plumbing",
        icon: "pipe",
        stock: 45,
        maxStock: 200,
        unit: "pcs",
        value: 4500,
        supplier: "AquaFlow Pipes",
        warehouse: "Warehouse B",
        status: "low_stock",
        lastRestocked: new Date("2026-06-15"),
      },
    }),
    prisma.inventoryItem.create({
      data: {
        id: "inv-item-6",
        name: "Ceramic Tiles",
        category: "Finishing",
        icon: "grid-3x3",
        stock: 1500,
        maxStock: 2000,
        unit: "sqft",
        value: 37500,
        supplier: "TileWorld Rwanda",
        warehouse: "Warehouse A",
        status: "in_stock",
        lastRestocked: new Date("2026-07-03"),
      },
    }),
    prisma.inventoryItem.create({
      data: {
        id: "inv-item-7",
        name: "Sand (Fine)",
        category: "Aggregate",
        icon: "mountain",
        stock: 15,
        maxStock: 50,
        unit: "tons",
        value: 1500,
        supplier: "Kigali Aggregates",
        warehouse: "Site Storage A",
        status: "low_stock",
        lastRestocked: new Date("2026-06-28"),
      },
    }),
    prisma.inventoryItem.create({
      data: {
        id: "inv-item-8",
        name: "Glass Panels",
        category: "Finishing",
        icon: "square",
        stock: 0,
        maxStock: 100,
        unit: "pcs",
        value: 0,
        supplier: "Crystal Glass Co.",
        warehouse: "Warehouse C",
        status: "out_of_stock",
        lastRestocked: new Date("2026-05-10"),
      },
    }),
  ]);

  console.log("Created inventory items");

  await Promise.all([
    prisma.invitation.create({
      data: {
        id: "inv-1",
        name: "Yves Nkurunziza",
        phone: "+250788901234",
        role: "site_engineer",
        message: "",
        code: "KLT-8F3A",
        status: "pending",
        invitedBy: owner.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.invitation.create({
      data: {
        id: "inv-2",
        name: "Marie Claire Uwimana",
        phone: "+250788012345",
        role: "storekeeper",
        message: "Welcome to the team!",
        code: "KLT-2B7D",
        status: "pending",
        invitedBy: owner.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log("Created invitations");

  await Promise.all([
    prisma.budgetLine.create({ data: { projectId: "proj-1", category: "Materials", allocated: 800000, spent: 544000 } }),
    prisma.budgetLine.create({ data: { projectId: "proj-1", category: "Labor", allocated: 600000, spent: 408000 } }),
    prisma.budgetLine.create({ data: { projectId: "proj-1", category: "Equipment", allocated: 400000, spent: 272000 } }),
    prisma.budgetLine.create({ data: { projectId: "proj-1", category: "Overhead", allocated: 300000, spent: 204000 } }),
    prisma.budgetLine.create({ data: { projectId: "proj-1", category: "Contingency", allocated: 300000, spent: 204000 } }),
  ]);

  await Promise.all([
    prisma.milestone.create({ data: { projectId: "proj-1", name: "Foundation Complete", date: new Date("2025-12-15"), status: "completed" } }),
    prisma.milestone.create({ data: { projectId: "proj-1", name: "Structural Frame", date: new Date("2026-03-01"), status: "completed" } }),
    prisma.milestone.create({ data: { projectId: "proj-1", name: "MEP Installation", date: new Date("2026-06-15"), status: "in_progress" } }),
    prisma.milestone.create({ data: { projectId: "proj-1", name: "Interior Finishing", date: new Date("2026-09-30"), status: "upcoming" } }),
    prisma.milestone.create({ data: { projectId: "proj-1", name: "Final Inspection", date: new Date("2026-12-01"), status: "upcoming" } }),
  ]);

  await Promise.all([
    prisma.task.create({ data: { projectId: "proj-1", title: "Foundation inspection", assigneeId: "user-4", done: true } }),
    prisma.task.create({ data: { projectId: "proj-1", title: "Structural frame review", assigneeId: "user-3", done: true } }),
    prisma.task.create({ data: { projectId: "proj-1", title: "MEP installation start", assigneeId: "user-6", done: false } }),
    prisma.task.create({ data: { projectId: "proj-1", title: "Plumbing rough-in", assigneeId: "user-4", done: false } }),
    prisma.task.create({ data: { projectId: "proj-1", title: "Electrical wiring", assigneeId: "user-8", done: false } }),
  ]);

  await Promise.all([
    prisma.activity.create({ data: { action: "Material delivery confirmed", type: "inventory", userId: "user-7" } }),
    prisma.activity.create({ data: { action: "Budget report generated", type: "project", userId: "user-2", projectId: "proj-1" } }),
    prisma.activity.create({ data: { action: "Task completed: Foundation inspection", type: "task", userId: "user-4", projectId: "proj-1" } }),
    prisma.activity.create({ data: { action: "Low stock alert: Steel Rebar", type: "inventory", userId: owner.id } }),
  ]);

  console.log("Seed completed successfully!");
  console.log("\nTest accounts:");
  console.log("  Owner: jp@kalit.io / admin123");
  console.log("  PM:    alice@kalit.io / KLT-1234");
  console.log("  Eng:   patrick@kalit.io / KLT-5678");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
