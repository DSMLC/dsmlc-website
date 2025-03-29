import { useState, useEffect } from "react";
import supabase from "./supabase_client";
import { fetchLinks } from "./Backend";
import { Link } from "./components/NetworkGraph";

export const useConnectionLinks = (): Link[] => {
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    const loadLinks = async () => {
      const fetchedLinks = await fetchLinks();
      setLinks(fetchedLinks);
    };

    loadLinks();

    const subscription = supabase
      .channel("realtime:NetworkGraphGameConnections-Global")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "NetworkGraphGameConnections",
        },
        (payload) => {
          console.log("Global connection event:", payload.new);
          loadLinks();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "NetworkGraphGameNames",
        },
        (payload) => {
          console.log("Global connection UPDATE event:", payload.new);
          loadLinks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return links;
};
