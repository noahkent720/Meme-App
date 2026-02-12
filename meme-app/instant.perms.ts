import type { InstantRules } from "@instantdb/react";

const rules = {
  profiles: {
    allow: {
      view: "true",
      create: "true", // Allow anyone to create profiles (for development)
      update: "auth.id != null",
      delete: "auth.id != null",
    },
  },
  memes: {
    allow: {
      view: "true",
      create: "true", // Allow anyone to create memes (for development)
      update: "auth.id != null",
      delete: "auth.id != null",
    },
  },
  comments: {
    allow: {
      view: "true",
      create: "true", // Allow anyone to comment (for development)
      update: "auth.id != null",
      delete: "auth.id != null",
    },
  },
  votes: {
    allow: {
      view: "true",
      create: "true", // Allow anyone to vote (for development)
      update: "auth.id != null",
      delete: "auth.id != null",
    },
  },
  $files: {
    allow: {
      view: "true",
      create: "true",
      delete: "auth.id != null",
    },
  },
} satisfies InstantRules;

export default rules;
