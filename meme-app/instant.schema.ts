import { i } from "@instantdb/react";

const schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().optional(),
    }),
    profiles: i.entity({
      nickname: i.string(),
      createdAt: i.number(),
    }),
    memes: i.entity({
      createdAt: i.number(),
      imageUrl: i.string().optional(),
    }),
    comments: i.entity({
      body: i.string(),
      createdAt: i.number(),
    }),
    votes: i.entity({
      value: i.number(), // 1 or -1
    }),
    $files: i.entity({
      name: i.string().optional(),
      size: i.number().optional(),
    }),
  },
  links: {
    profileUser: {
      forward: { on: "profiles", has: "one", label: "user" },
      reverse: { on: "$users", has: "one", label: "userProfile" },
    },
    memeAuthor: {
      forward: { on: "memes", has: "one", label: "author" },
      reverse: { on: "profiles", has: "many", label: "authoredMemes" },
    },
    memeImage: {
      forward: { on: "memes", has: "one", label: "image" },
      reverse: { on: "$files", has: "one", label: "meme" },
    },
    commentMeme: {
      forward: { on: "comments", has: "one", label: "meme" },
      reverse: { on: "memes", has: "many", label: "comments" },
    },
    commentAuthor: {
      forward: { on: "comments", has: "one", label: "author" },
      reverse: { on: "profiles", has: "many", label: "authoredComments" },
    },
    voteMeme: {
      forward: { on: "votes", has: "one", label: "meme" },
      reverse: { on: "memes", has: "many", label: "votes" },
    },
    voteAuthor: {
      forward: { on: "votes", has: "one", label: "author" },
      reverse: { on: "profiles", has: "many", label: "votes" },
    },
  },
});

export default schema;
