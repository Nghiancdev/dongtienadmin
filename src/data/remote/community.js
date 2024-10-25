import callApi from "../../ultis/apiCaller";

export const fetchAllPosts = (store_code, params = "") => {
  return callApi(`/store/${store_code}/community_posts${params}`, "get", null);
};

export const updatePostById = (store_code, postId, dataUpdate) => {
  return callApi(
    `/store/${store_code}/community_posts/${postId}`,
    "put",
    dataUpdate
  );
};

export const deletePostById = (store_code, postId) => {
  return callApi(
    `/store/${store_code}/community_posts/${postId}`,
    "delete",
    null
  );
};

export const pinPost = (store_code, postId, data) => {
  return callApi(`/store/${store_code}/community_post_ghim`, "post", data);
};

export const reupPost = (store_code, postId, data) => {
  return callApi(
    `/store/${store_code}/community_posts/${postId}/reup`,
    "put",
    data
  );
};
