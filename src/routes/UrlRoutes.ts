import { Router } from "express";
import { GeneralAuth } from "../middleware/GeneralAut.js";
import {
  createShortUrl,
  redirect,
  getUserUrls,
  getUrlDetails,
  updateUrl,
  deleteUrl,
} from "../controllers/url.controller.js";

export const urlRoute = Router();


urlRoute.post("/ShortUrlCreation", GeneralAuth, createShortUrl);


urlRoute.get("/UserUrls", GeneralAuth, getUserUrls);


urlRoute.get("/UrlDetails/:id", GeneralAuth, getUrlDetails);


urlRoute.put("/update/:id", GeneralAuth, updateUrl);


urlRoute.delete("/deleteUrl/:id", GeneralAuth, deleteUrl);
