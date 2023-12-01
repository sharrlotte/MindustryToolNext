import { defaultSortTag } from "@/constant/env";
import { sortTag } from "@/types/response/SortTag";
import { z } from "zod";

export const sortSchema = z.enum(sortTag).default(defaultSortTag);
