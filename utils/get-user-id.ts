import { supabase } from "./supabase";

export const getUserID = async () => {
  try {
    const id = await supabase.auth.getUser().then((res) => res.data.user?.id);
    if (id) {
      return id;
    }
  } catch (error) {
    console.log("Error getting User ID:", error);
  }
};
