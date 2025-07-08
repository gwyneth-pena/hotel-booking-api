import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const deleteSupabaseImages = async (imageUrls = []) => {
  const bucketName = "photos";

  const filePaths = imageUrls
    .map((url) => {
      const splitKey = `/object/${bucketName}/`;
      const parts = url.split(splitKey);
      return parts[1];
    })
    .filter(Boolean);

  if (filePaths.length > 0) {
    const { error } = await supabase.storage.from(bucketName).remove(filePaths);

    if (error) {
      console.error("Supabase delete error:", error);
    }
  }
};
