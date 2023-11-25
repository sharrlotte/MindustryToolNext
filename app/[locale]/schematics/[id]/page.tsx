import PreviewCard from "@/components/preview/preview";
import React from "react";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div className="grid w-full grid-cols-[repeat(auto-fill,var(--preview-size))] justify-center gap-4 p-4">
      <PreviewCard className="flex items-center justify-center">
        {id}
      </PreviewCard>
    </div>
  );
}
