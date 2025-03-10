import arcjet, {
  detectBot,
  protectSignup,
  shield,
  slidingWindow,
  tokenBucket,
  validateEmail,
} from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    // protect sign up form
    protectSignup({
      email: {
        mode: "DRY_RUN",
        block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
      },
      bots: {
        mode: "DRY_RUN",
        allow: [],
      },
      rateLimit: {
        mode: "DRY_RUN",
        interval: "1m",
        max: 20,
      },
    }),
  ],
});

export const loginRules = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    validateEmail({
      mode: "DRY_RUN",
      block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    }),
    shield({ mode: "DRY_RUN" }),
    detectBot({
      mode: "DRY_RUN",
      allow: [],
    }),
    slidingWindow({
      mode: "DRY_RUN",
      interval: "1m",
      max: 3,
    }),
  ],
});

export const blogPostRules = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    detectBot({
      mode: "DRY_RUN",
      allow: [],
    }),
    shield({ mode: "DRY_RUN" }),
    tokenBucket({
      mode: "DRY_RUN",
      refillRate: 20,
      interval: "1m",
      capacity: 2,
    }),
  ],
});

export const commentRules = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    detectBot({
      mode: "DRY_RUN",
      allow: [],
    }),
    shield({ mode: "DRY_RUN" }),
    tokenBucket({
      mode: "DRY_RUN",
      refillRate: 20,
      interval: "1m",
      capacity: 2,
    }),
  ],
});

export const searchRules = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    detectBot({
      mode: "DRY_RUN",
      allow: [],
    }),
    shield({ mode: "DRY_RUN" }),
    tokenBucket({
      mode: "DRY_RUN",
      refillRate: 20,
      interval: "1m",
      capacity: 2,
    }),
  ],
});

export default aj;
