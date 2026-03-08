import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { MenuItem } from "@/lib/data";

const DATA_FILE = path.join(process.cwd(), "src/lib/menu.json");

interface MenuData {
  items: MenuItem[];
  settings: {
    phoneNumber: string;
  };
}

async function readMenuData(): Promise<MenuData> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading menu file:", error);
    return { items: [], settings: { phoneNumber: "380934843757" } };
  }
}

async function writeMenuData(data: MenuData) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const data = await readMenuData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await readMenuData();

    // Handle settings update
    if (body.settings) {
      data.settings = { ...data.settings, ...body.settings };
      await writeMenuData(data);
      return NextResponse.json(data.settings);
    }

    // Handle new item
    const newItem = body;
    if (!newItem.id) {
      newItem.id = Date.now().toString();
    }

    data.items.push(newItem);
    await writeMenuData(data);

    return NextResponse.json(newItem, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedItem = await request.json();
    const data = await readMenuData();

    const index = data.items.findIndex((item) => item.id === updatedItem.id);
    if (index === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    data.items[index] = updatedItem;
    await writeMenuData(data);

    return NextResponse.json(updatedItem);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const data = await readMenuData();

    const filteredItems = data.items.filter((item) => item.id !== id);
    if (filteredItems.length === data.items.length) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    data.items = filteredItems;
    await writeMenuData(data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
