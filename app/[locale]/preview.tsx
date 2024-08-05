import MapPreviewCard from '@/components/map/map-preview-card';
import SchematicPreviewCard from '@/components/schematic/schematic-preview-card';
import getServerAPI from '@/query/config/get-server-api';
import getMaps from '@/query/map/get-maps';
import getSchematics from '@/query/schematic/get-schematics';
import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';

export async function SchematicRowView({
  queryParam,
}: {
  queryParam: PaginationSearchQuery;
}) {
  const axios = await getServerAPI();
  const items = await getSchematics(axios, queryParam);

  return (
    <ul className="flex w-full overflow-y-hidden overflow-x-auto list-none snap-x gap-2 pb-1 text-foreground">
      {items.map((schematic) => (
        <li key={schematic.id} className="snap-center p-0 m-0">
          <SchematicPreviewCard schematic={schematic} />
        </li>
      ))}
    </ul>
  );
}

export async function MapRowView({
  queryParam,
}: {
  queryParam: PaginationSearchQuery;
}) {
  const axios = await getServerAPI();
  const items = await getMaps(axios, queryParam);

  return (
    <ul className="flex w-full overflow-y-hidden overflow-x-auto list-none gap-2 snap-x pb-1 text-foreground">
      {items.map((map) => (
        <li
          key={map.id}
          className="snap-center p-0 m-0 w-[minmax(var(--preview-size),100%)]"
        >
          <MapPreviewCard map={map} />
        </li>
      ))}
    </ul>
  );
}
