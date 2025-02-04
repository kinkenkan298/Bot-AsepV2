import "dotenv/config";

const config = {
  token: process.env.TOKEN_DISCORD!,
  mongodbURI: process.env.MONGODB_URI!,
};

export default config;
