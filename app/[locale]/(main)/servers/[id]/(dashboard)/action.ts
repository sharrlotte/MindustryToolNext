import { serverApi } from "@/action/common";
import { getServer } from "@/query/server";
import { cache } from "react";

export const getCachedServer = cache((id: string) => serverApi(async (axios) => await getServer(axios, { id })));
