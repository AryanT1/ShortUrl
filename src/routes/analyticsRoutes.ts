import { Router } from 'express';


import { GeneralAuth } from '../middleware/GeneralAut.js';
import { getDashboardStats, getUrlAnalytics } from '../controllers/analytics.controller.js';

export const analyticsRouter = Router();


analyticsRouter.get('/dashboard', GeneralAuth, getDashboardStats);


analyticsRouter.get('/:shortCode', GeneralAuth, getUrlAnalytics);

