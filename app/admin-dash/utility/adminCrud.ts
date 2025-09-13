"use client";
import supabase from "../../supabase_client";

/** Error Fetching */
function asErr(prefix: string, error: any) {
  if (error?.name === "TypeError" && /fetch/i.test(error?.message ?? "")) {
    return new Error(`${prefix}: Network error (CORS/adblock/offline). Check DevTools > Network for the failing request.`);
  }
  return new Error(`${prefix}: ${error?.message ?? String(error)}`);
}

/** Edit row */
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

/** Add row */
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

/** delete row */
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

/** delete by  where-clause (composite PKs) */
export async function deleteWhere(
  table: string,
  where: Record<string, string | number | boolean | null>
) {
  try {
    let q = supabase.schema("admin").from(table).delete();
    for (const [k, v] of Object.entries(where)) q = q.eq(k, v as any);
    const { error, status } = await q;
    if (error) throw new Error(`${error.message} (HTTP ${status})`);
  } catch (e) {
    console.error("deleteWhere failed:", e);
    throw asErr(`Delete ${table}`, e);
  }
}

/** upsert with conflict columns (composite PKs) */
export async function upsertRow<T extends Record<string, any>>(
  table: string,
  values: Partial<T>,
  conflictTarget: string[] // e.g. ["event_id","member_id"]
) {
  try {
    const { data, error, status } = await supabase
      .schema("admin")
      .from(table)
      .upsert(values as any, { onConflict: conflictTarget.join(",") })
      .select("*")
      .single();

    if (error) throw new Error(`${error.message} (HTTP ${status})`);
    if (!data) throw new Error(`No data returned (HTTP ${status})`);
    return data as T;
  } catch (e) {
    console.error("upsertRow failed:", e);
    throw asErr(`Upsert ${table}`, e);
  }
}
