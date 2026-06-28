import { Request, Response } from "express";
import Setting from "../models/setting";

export async function settingsHome(req: Request, res: Response) {
  try {
    const rows = await Setting.findAll();

    const settings: any = {
      whatsapp: "",
      email: "",
      instagram: "",
      address: "",
      alias: "",
      cbu: ""
    };

    rows.forEach(row => {
      settings[row.key] = row.value;
    });

    res.render("admin/adminSettings", { settings });
  } catch (error) {
    console.error("Error loading settings:", error);
    res.status(500).json({ message: "Error loading settings", error: error instanceof Error ? error.message : String(error) });
  }
}

export async function settingsHomeSavePost(req: Request, res: Response) {
  const { whatsapp, email, instagram, address, alias, cbu } = req.body;

  try {
    await saveSetting("whatsapp", whatsapp);
    await saveSetting("email", email);
    await saveSetting("instagram", instagram);
    await saveSetting("address", address);
    await saveSetting("alias", alias);
    await saveSetting("cbu", cbu);

    res.status(200).json({ message: "Settings saved successfully" });
  } catch (error) {
    console.error("Error saving settings:", error);
    res.status(500).json({ message: "Error saving settings", error: error instanceof Error ? error.message : String(error) });
  }
}

async function saveSetting(key: string, value: string) {
  const existing = await Setting.findOne({ where: { key } });

  if (existing) {
    existing.value = value;
    await existing.save();
  } else {
    await Setting.create({ key, value });
  }
}
