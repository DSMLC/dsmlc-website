import supabase from "../supabase_client";

// Update a single row by PK
export async function updateRow<T extends Record<string, any>>(
  table: string,
  pkField: string,
  pkValue: string | number,
  patch: Partial<T> | Record<string, any>
) {
  const { data, error } = await supabase
    .schema("admin")
    .from(table)
    .update(patch as any)
    .eq(pkField, pkValue)
    .select("*")
    .single();

  if (error) throw error;
  return data as T;
}

// Delete a single row by PK
export async function deleteRow(
  table: string,
  pkField: string,
  pkValue: string | number
) {
  const { error } = await supabase
    .schema("admin")
    .from(table)
    .delete()
    .eq(pkField, pkValue);

  if (error) throw error;
}
