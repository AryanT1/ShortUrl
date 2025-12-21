import type { Request, Response } from "express";
import z from "zod";
import prisma from "../db/prisma.js";
import { generateShortCode } from "../utils/shortCodeGenerator.js";
import { generateQRCode } from "../utils/qrCodeGenerater.js";
import type { AuthRequest } from "../middleware/GeneralAut.js";
import { tackClick } from "../utils/Clicktracker.js";

export const createShortUrl = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized - Please login first",
      });
    }

    const requestdata = z.object({
      originalUrl: z.string().url("Ínvalid URL format"),
      customAlias: z
        .string()
        .regex(
          /^[A-Za-z0-9-_]{4,20}$/,
          "Custom alias must be 4-20 alphanumeric characters"
        )
        .optional(),
      expiresAt: z.string().datetime().optional(),
    });

    const parsdata = requestdata.safeParse(req.body);
    if (!parsdata.success) {
      return res.status(400).json({ err: "validation error" });
    }

    const { originalUrl, customAlias, expiresAt } = parsdata.data;
    if (customAlias) {
      const existing = await prisma.url.findFirst({
        where: {
          customAlias,
        },
      });

      if (existing) {
        return res.status(409).json({ error: "Custom alias already taken" });
      }
    }

    const shortCode = customAlias || (await generateShortCode());

    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

    const qrCode = await generateQRCode(shortUrl);

    const defaultExpiryDays = 30;
    const expiryDate = expiresAt
      ? new Date(expiresAt)
      : new Date(Date.now() + defaultExpiryDays * 24 * 60 * 60 * 1000);

    const url = await prisma.url.create({
      data: {
        originalUrl,
        shortCode,
        customAlias: customAlias ?? null,
        expiresAt: expiryDate,
        userId: req.user?.id,
        qrCode: qrCode ?? null,
      },
    });

    res.status(201).json({
      message: "ÚRL shortened successfully",
      url,
      shortUrl,
    });
  } catch (error: any) {
    console.log("error in me createShortUrl");
    return res
      .status(500)
      .json({ error: "internal server error in createShortUrl" });
  }
};

export const redirect = async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;

    if (!shortCode) {
      return res.status(400).json({ message: "shortCode is required" });
    }

    const url = await prisma.url.findFirst({
      where: {
        shortCode,
      },
    });

    if (!url) {
      return res.status(400).json({ message: "Ïnvalid url" });
    }
    if (!url.isActive) {
      return res
        .status(400)
        .json({ message: "This link has been deactivated" });
    }
    if (!url.expiresAt && new Date() > url.expiresAt!) {
      return res.status(400).json({ message: "This link has expired" });
    }

    tackClick(req, url.id).catch((error) => {
      console.error("Click tracking failed:", error);
    });

    res.redirect(302, url?.originalUrl!);
  } catch (error: any) {
    console.log("error in me redirect");
    return res.status(500).json({ error: "internal server error in redirect" });
  }
};

export const getUserUrls = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized - Please login first",
      });
    }
    const userId = req.user.id;

    const urls = await prisma.url.findMany({
      where: {
        userId: userId,
      },
    });

    if (!urls) {
      res.status(400).json({ message: "USERNOT FOUND" });
    }

    res.status(200).json({
      urls,
    });
  } catch (error: any) {
    console.log("error in me getUserUrl");
    return res
      .status(500)
      .json({ error: "internal server error in getUserUrl" });
  }
};

export const getUrlDetails = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized - Please login first",
      });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "plese eneter url" });
    }
    const url = await prisma.url.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
      include: {
        _count: {
          select: {
            clicks: true,
          },
        },
      },
    });
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    res.json({
      url,
    });
  } catch (error: any) {
    console.log("error in me getUrlDetails");
    return res
      .status(500)
      .json({ error: "internal server error in getUrlDetails " });
  }
};

export const updateUrl = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized - Please login first",
      });
    }
    const { id } = req.params;
    const requestdata = z.object({
      isActive: z.boolean(),
      expiresAt: z.string().datetime().optional(),
    });

    const parsdata = requestdata.safeParse(req.body);
    if (!parsdata.success) {
      return res.status(400).json({ err: "validation error" });
    }

    const { isActive, expiresAt } = parsdata.data;
    if (!id) {
      return res.status(400).json({ message: "plese eneter url" });
    }

    const url = await prisma.url.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    const updated = await prisma.url.update({
      where: { id },
      data: {
        isActive,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
    res.json({
      message: "URL updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.log("error in me updateUrl");
    return res
      .status(500)
      .json({ error: "internal server error in updateUrl " });
  }
};

export const deleteUrl = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "plese eneter url" });
    }

    await prisma.url.delete({
      where: { id },
    });
    res.json({
      message: "URL deleted successfully",
    });
  } catch (error: any) {}
};
