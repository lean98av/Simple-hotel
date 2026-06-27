import { Request, Response, NextFunction } from "express";
import Setting from "../models/setting";

export default async function loadSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const rows = await Setting.findAll();

    const appSettings: any = {
      whatsapp: "",
      email: "",
      instagram: "",
      tiktok: "",
      address: "",
      alias: "",
      cbu: "",
      companyTechLink: "",
      companyTechName: ""
    };

    rows.forEach(row => {
      appSettings[row.key.toLowerCase()] = row.value;
    });

    res.locals.appSettings = appSettings;
  } catch (error) {
    console.error(error);
    res.locals.appSettings = {
      whatsapp: "",
      email: "",
      instagram: "",
      tiktok: "",
      address: "",
      alias: "",
      cbu: "",
      companyTechLink: "",
      companyTechName: ""
    };
  }
  next();
}
