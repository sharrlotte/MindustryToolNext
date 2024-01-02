const serverEnv = {
  oauth: {
    discord: {
      client_id: process.env.DISCORD_CLIENT_ID as string,
      client_secret: process.env.DISCORD_CLIENT_SECRET as string,
    },
  },
  tokens: {
    api_provider: process.env.API_PROVIDER as string,
    api_provider_id: process.env.API_PROVIDER_ID as string,
  },
};

export default serverEnv;
