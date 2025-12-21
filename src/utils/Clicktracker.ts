import { UAParser } from "ua-parser-js";
import type { Request } from "express";
import prisma from "../db/prisma.js";

export const tackClick = async (req: Request, urlId: string) => {
  const parser = new UAParser(req.headers["user-agent"]) 

  const device = parser?.getDevice();
  const browser = parser?.getBrowser();
  const os = parser?.getOS();

  await prisma.click.create({
    data: {
      urlId,
      ipAddress: req.ip ?? null,
      userAgent: req.headers["user-agent"] ?? null,
      device: device.type || "desktop",
      browser: browser.name ?? null,
      os: os.name ?? null ,
      referrer: req.headers.referer ?? null,
    },
  });
};
