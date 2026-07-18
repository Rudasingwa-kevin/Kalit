import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authenticate, type AuthRequest } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

function computeStatus(stock: number, maxStock: number): string {
  if (stock === 0) return "out_of_stock";
  if (stock < maxStock * 0.3) return "low_stock";
  return "in_stock";
}

router.get("/", async (req: AuthRequest, res) => {
  try {
    const { search, category } = req.query;

    const where: any = {};

    if (search && typeof search === "string") {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { supplier: { contains: search, mode: "insensitive" } },
        { warehouse: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category && typeof category === "string" && category !== "all") {
      where.category = category;
    }

    const items = await prisma.inventoryItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const result = items.map((item) => ({
      ...item,
      status: computeStatus(item.stock, item.maxStock),
      lastRestocked: item.lastRestocked.toISOString(),
    }));

    res.json({ items: result });
  } catch (error) {
    console.error("Get inventory error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.inventoryItem.findUnique({ where: { id } });
    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    res.json({
      item: { ...item, status: computeStatus(item.stock, item.maxStock) },
    });
  } catch (error) {
    console.error("Get inventory item error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req: AuthRequest, res) => {
  try {
    const { name, category, stock, maxStock, unit, value, supplier, warehouse, project } =
      req.body;

    if (!name || !category || stock === undefined || !unit || !supplier) {
      res.status(400).json({ error: "Name, category, stock, unit, and supplier are required" });
      return;
    }

    const item = await prisma.inventoryItem.create({
      data: {
        name,
        category,
        stock: Number(stock),
        maxStock: Number(maxStock) || 100,
        unit,
        value: Number(value) || 0,
        supplier,
        warehouse: warehouse || "Main Warehouse",
        status: computeStatus(Number(stock), Number(maxStock) || 100),
      },
    });

    await prisma.activity.create({
      data: {
        action: `Added "${name}" to inventory`,
        type: "inventory",
        userId: req.user!.userId,
      },
    });

    res.status(201).json({ item });
  } catch (error) {
    console.error("Create inventory error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.inventoryItem.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.category) updateData.category = data.category;
    if (data.stock !== undefined) updateData.stock = Number(data.stock);
    if (data.maxStock !== undefined) updateData.maxStock = Number(data.maxStock);
    if (data.unit) updateData.unit = data.unit;
    if (data.value !== undefined) updateData.value = Number(data.value);
    if (data.supplier) updateData.supplier = data.supplier;
    if (data.warehouse) updateData.warehouse = data.warehouse;

    const stock = updateData.stock ?? existing.stock;
    const maxStock = updateData.maxStock ?? existing.maxStock;
    updateData.status = computeStatus(stock, maxStock);

    const item = await prisma.inventoryItem.update({
      where: { id },
      data: updateData,
    });

    res.json({ item });
  } catch (error) {
    console.error("Update inventory error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.inventoryItem.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    await prisma.inventoryItem.delete({ where: { id } });

    res.json({ message: "Item deleted" });
  } catch (error) {
    console.error("Delete inventory error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
