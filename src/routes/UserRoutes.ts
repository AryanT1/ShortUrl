import { Router } from "express";
export const userRoute = Router()

import { GeneralAuth } from "../middleware/GeneralAut.js";
import { login, me, signup } from "../controllers/user.controller.js";

/**
 * @swagger
 * /api/v1/Register/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with email, name, and password. Returns a JWT token in an HTTP-only cookie.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: user@example.com
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: User's full name (2-50 characters)
 *                 example: John Doe
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 100
 *                 format: password
 *                 description: Password (8-100 characters, will be hashed)
 *                 example: MySecurePassword123
 *     responses:
 *       200:
 *         description: User registered successfully
 *         headers:
 *           Set-Cookie:
 *             description: JWT token stored in HTTP-only cookie (expires in 24 hours)
 *             schema:
 *               type: string
 *               example: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; Max-Age=86400
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: User's unique ID
 *                   example: 507f1f77bcf86cd799439011
 *                 username:
 *                   type: string
 *                   description: User's name
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: User's email
 *                   example: user@example.com
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: validation error
 *                 error:
 *                   type: string
 *                   example: user already exist
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: internal server error in signup
 */  
userRoute.post("/signup",signup)


/**
 * @swagger
 * /api/v1/Register/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user with email and password. Returns user details and sets a JWT token in an HTTP-only cookie.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's registered email address
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 format: password
 *                 description: User's password (minimum 6 characters)
 *                 example: MySecurePassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: JWT token stored in HTTP-only cookie (expires in 24 hours)
 *             schema:
 *               type: string
 *               example: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; Max-Age=86400
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: User's unique ID
 *                   example: 507f1f77bcf86cd799439011
 *                 username:
 *                   type: string
 *                   description: User's name
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: User's email
 *                   example: user@example.com
 *       400:
 *         description: Validation error or invalid password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: validation error
 *                 error:
 *                   type: string
 *                   example: invalid password
 *       401:
 *         description: User does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: user does not exist
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: internal server error in login
 */

  
userRoute.post("/login",login)

/**
 * @swagger
 * /api/v1/Register/me:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the authenticated user's profile information. Requires a valid JWT token in cookies.
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: User's unique ID
 *                   example: 507f1f77bcf86cd799439011
 *                 name:
 *                   type: string
 *                   description: User's name
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: User's email address
 *                   example: user@example.com
 *       401:
 *         description: Unauthorized - No valid token or user not found in request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized - user not found on request
 *       404:
 *         description: User not found in database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: internal server error in me
 */

  
userRoute.get("/me",GeneralAuth,me)