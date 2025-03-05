import { createMiddleware } from "@arcjet/next"
import aj from "./lib/arcjet"


export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|healthz).*)"]
};

export default createMiddleware(aj)