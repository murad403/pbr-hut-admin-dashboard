import React from "react";
import EditItemClient from "./EditItemClient";

export default function Page() {
  return (
    <React.Suspense fallback={<div />}>
      <EditItemClient />
    </React.Suspense>
  );
}