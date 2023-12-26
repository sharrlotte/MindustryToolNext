const serverEnv = {
  oauth: {
    discord: {
      client_id: process.env.DISCORD_CLIENT_ID as string,
      client_secret: process.env.DISCORD_CLIENT_SECRET as string,
    },
  },
};

export default serverEnv;
