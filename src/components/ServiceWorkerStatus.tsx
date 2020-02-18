import React, { useState, useEffect } from "react";
import { Status, currentStatus, statusUpdated } from "../registerServiceWorker";

export default function ServiceWorkerStatus(props: {}) {
  const [state, setState] = useState(Status.Ready);

  useEffect(() => {
    setState(currentStatus);

    const handler = () => {
      setState(currentStatus);
    };

    statusUpdated.addEventListener("StatusUpdated", handler);
    return () => {
      statusUpdated.removeEventListener("StatusUpdated", handler);
    };
  }, [setState]);

  let states = {
    [Status.Ready]: "",
    [Status.Registered]: "Available for offline use",
    [Status.Installing]: "Installing service worker",
    [Status.AvailableOffline]: "Cached for offline use",
    [Status.UpdateReady]: "Update available, please refresh",
    [Status.Error]: ""
  };

  const tooltip =
    "This application is a progressive web app, which can be cached for use offline.";

  return (
    <div className="App-status" title={tooltip}>
      {states[state]}
    </div>
  );
}
