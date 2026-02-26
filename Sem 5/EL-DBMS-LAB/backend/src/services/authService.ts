import jwt, { type SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import User from "../models/User";
import type { IUser } from "../models/User";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN: StringValue = (process.env.JWT_EXPIRES_IN ||
  "7d") as StringValue;

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

function generateToken(user: IUser): string {
  const payload: AuthPayload = {
    userId: user._id.toString(),
    email: user.email,
  };

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

function formatUserResponse(user: IUser): UserResponse {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  };
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Create new user
  const user = new User({
    email,
    password,
    name,
  });

  await user.save();

  const token = generateToken(user);

  return {
    token,
    user: formatUserResponse(user),
  };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);

  return {
    token,
    user: formatUserResponse(user),
  };
}

export async function getUserById(
  userId: string,
): Promise<UserResponse | null> {
  const user = await User.findById(userId);
  if (!user) {
    return null;
  }

  return formatUserResponse(user);
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}
