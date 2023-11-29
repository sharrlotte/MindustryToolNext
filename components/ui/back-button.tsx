import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button title="back" variant="outline" onClick={() => router.back()}>
      Back
    </Button>
  );
}
