import jwt from "jsonwebtoken";
import User from "@/models/userModel";

export default async function getUserFromRequest(req: Request) {
  try {
    const cookieHeader = req.headers?.get?.("cookie") || "";
    const match = cookieHeader.match(/(?:^|; )token=([^;]+)/);
    const token = match?.[1];
    if (!token) return null;
    const decoded = jwt.verify(decodeURIComponent(token), process.env.TOKEN_SECRET!) as { id: string };
    if (!decoded?.id) return null;
    const user = await User.findById(decoded.id);
    return user;
  } catch (err) {
    return null;
  }
}
