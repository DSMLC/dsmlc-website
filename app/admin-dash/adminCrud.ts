// app/admin-dash/adminCrud.ts
"use client";
import supabase from "../supabase_client";

function asErr(prefix: string, error: any) {
  // Network errors often come as TypeError without a message body.
  if (error?.name === "TypeError" && /fetch/i.test(error?.message ?? "")) {
    return new Error(`${prefix}: Network error (CORS/adblock/offline). Check DevTools > Network for the failing request.`);
  }
  return new Error(`${prefix}: ${error?.message ?? String(error)}`);
}

export async function updateRow<T extends Record<string, any>>(
  table: string,
  pkField: string,
  pkValue: string | number,
  patch: Partial<T>
) {
  try {
    const { data, error, status } = await supabase
      .schema("admin")
      .from(table)
      .update(patch as any)
      .eq(pkField, pkValue)
      .select("*")
      .single();

    if (error) throw new Error(`${error.message} (HTTP ${status})`);
    if (!data) throw new Error(`No data returned (HTTP ${status})`);
    return data as T;
  } catch (e) {
    console.error("updateRow failed:", e);
    throw asErr(`Update ${table}`, e);
  }
}

export async function insertRow<T extends Record<string, any>>(
  table: string,
  values: Partial<T>
) {
  try {
    const { data, error, status } = await supabase
      .schema("admin")
      .from(table)
      .insert(values as any)
      .select("*")
      .single();

    if (error) throw new Error(`${error.message} (HTTP ${status})`);
    if (!data) throw new Error(`No data returned (HTTP ${status})`);
    return data as T;
  } catch (e) {
    console.error("insertRow failed:", e);
    throw asErr(`Insert ${table}`, e);
  }
}

export async function deleteRow(
  table: string,
  pkField: string,
  pkValue: string | number
) {
  try {
    const { error, status } = await supabase
      .schema("admin")
      .from(table)
      .delete()
      .eq(pkField, pkValue);

    if (error) throw new Error(`${error.message} (HTTP ${status})`);
  } catch (e) {
    console.error("deleteRow failed:", e);
    throw asErr(`Delete ${table}`, e);
  }
}
