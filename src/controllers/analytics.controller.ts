import type { Response } from "express";
import type { AuthRequest } from "../middleware/GeneralAut.js";
import prisma from "../db/prisma.js";
import { getDateFromPeriod } from "../utils/getDateFromPeriod.js";

export const getUrlAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(500)
        .json({ error: "Unauthorized - Please login first" });
    }

    const { shortCode } = req.params;
    const { period = "7d" } = req.query;
    if (!shortCode) {
      return res.status(400).json({ message: "shortCode is required" });
    }
    const url = await prisma.url.findFirst({
      where: {
        shortCode,
        userId: req.user.id,
      },
    });
    if (!url) {
      return res.status(400).json({ message: "Url not found" });
    }

    const dateFrom = getDateFromPeriod(period as string);

    const clicks = await prisma.click.findMany({
      where: {
        urlId: url.id,
        ...(dateFrom && { timestamp: { gte: dateFrom } }),
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    const totalClicks = clicks.length;

    const deviceStats = clicks.reduce((acc, click) => {
      const device = click.device || "unknown";
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const browserStats = clicks.reduce((acc, click) => {
      const browser = click.browser || "unknown";
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const osStats = clicks.reduce((acc, click) => {
      const os = click.os || "unknown";
      acc[os] = (acc[os] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const clicksByDate = clicks.reduce((acc, click) => {
      const date = click.timestamp.toISOString().split("T")[0]!;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const referrers = clicks
      .filter((c) => c.referrer)
      .reduce((acc, click) => {
        const referrer = click.referrer!;
        acc[referrer] = (acc[referrer] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topReferrers = Object.entries(referrers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count }));

    const recentClicks = clicks.slice(0, 10).map((click) => ({
      device: click.device,
      browser: click.browser,
      os: click.os,
      country: click.country,
      timestamp: click.timestamp,
    }));

    res.json({
      data: {
        shortCode,
        originalUrl: url.originalUrl,
        totalClicks,
        deviceStats,
        browserStats,
        osStats,
        clicksByDate,
        topReferrers,
        recentClicks,
        createdAt: url.createdAt,
      },
    });
  } catch (error: any) {
    console.log("error in me getUrlAnalytics ");
    return res
      .status(500)
      .json({ error: "internal server error in getUrlAnalytics " });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized - Please login first",
      });
    }

    const totalUrls = await prisma.url.count({
      where: { userId: req.user.id },
    });

    const urls = await prisma.url.findMany({
      where: { userId: req.user.id },
      include: {
        _count: {
          select: { clicks: true },
        },
      },
    });

   
    const totalClicks = urls.reduce((sum, url) => sum + url._count.clicks, 0);

   
    const topUrls = urls
      .sort((a, b) => b._count.clicks - a._count.clicks)
      .slice(0, 5)
      .map((url) => ({
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        // title: url.title, // Remove - doesn't exist in your schema
        clicks: url._count.clicks,
        shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      }));

    // Get clicks from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentClicks = await prisma.click.findMany({
      where: {
        url: {
          userId: req.user!.id,
        },
        timestamp: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Clicks by day (last 30 days)
    const clicksByDay = recentClicks.reduce((acc, click) => {
      const date = click.timestamp.toISOString().split("T")[0]!;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      data: {
        totalUrls,
        totalClicks,
        topUrls,
        clicksByDay,
        recentClicksCount: recentClicks.length,
      },
    });
  } catch (error:any) {
   
    console.log("error in me getDashboardStats ");
    return res
      .status(500)
      .json({ error: "internal server error in getDashboardStats " });
  }
};
