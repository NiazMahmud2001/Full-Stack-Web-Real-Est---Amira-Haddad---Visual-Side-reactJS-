import { supabase } from "../../lib/supabase";

// Every read and write the admin dashboard makes. The database only allows the
// listing and enquiry changes for a verified admin session (see
// src/admin/admin-setup.sql), so "nothing was deleted" usually means the
// session has ended.

// Must match the property_type check on the inquiries table, so the property
// page's enquiry form keeps working for listings added here.
export const PROPERTY_TYPES = ["apartment", "villa", "townhouse", "penthouse", "studio", "office"];

export class SessionExpiredError extends Error {
  constructor() {
    super("Your admin session has ended. Please sign in again.");
    this.name = "SessionExpiredError";
  }
}

const failed = (action, error) => new Error(`Could not ${action}: ${error.message}`);

export async function fetchInquiries() {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw failed("load the enquiries", error);
  return data;
}

export async function deleteInquiry(id) {
  // `.select()` returns the rows that were really deleted; an empty list means
  // the database refused, which happens once the admin session has ended.
  const { data, error } = await supabase.from("inquiries").delete().eq("id", id).select("id");
  if (error) throw failed("remove the enquiry", error);
  if (data.length === 0) throw new SessionExpiredError();
}

export async function fetchListings() {
  const { data, error } = await supabase
    .from("listings")
    .select("id, title, area, price_aed, listing_type, property_type, bedrooms, image_url, is_demo, sort_order")
    .order("sort_order");
  if (error) throw failed("load the listings", error);
  return data;
}

export async function addListing(row) {
  const { error } = await supabase.from("listings").insert(row);
  if (!error) return;
  if (error.code === "42501") throw new SessionExpiredError(); // refused by row level security
  if (error.code === "23505") throw new Error("A listing with that id already exists. Please try again.");
  throw failed("add the listing", error);
}

export async function deleteListing(id) {
  const { data, error } = await supabase.from("listings").delete().eq("id", id).select("id");
  if (error) throw failed("remove the listing", error);
  if (data.length === 0) throw new SessionExpiredError();
}

export async function fetchAreas() {
  const { data, error } = await supabase
    .from("uae_areas")
    .select("name, emirate, lat, lng")
    .order("sort_order");
  if (error) throw failed("load the areas", error);
  return data;
}
