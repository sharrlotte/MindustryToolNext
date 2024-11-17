import { translate } from "@/action/action";
import { formatTitle } from "@/lib/utils";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = await translate('logic');

  return {
    title: formatTitle(title),
  };
}

export default function Page() {
  return undefined;
}
