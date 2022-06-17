import { sendAxiosRequest as AXIOS } from "../api/index";

const PostService = {
  fetchPosts(opts: { skip?: number; search?: string; orderBy?: string } = {}) {
    if (!opts.orderBy) {
      opts.orderBy = "desc";
    }
    return AXIOS({
      url: "/api/posts",
      method: "GET",
      query: opts
    });
  },

  fetchPostComments(
    opts: {
      skip?: number;
      search?: string;
      orderBy?: string;
      post_id?: number;
    } = {}
  ) {
    if (!opts.orderBy) {
      opts.orderBy = "desc";
    }
    return AXIOS({
      url: "/api/comments",
      method: "GET",
      query: opts
    });
  },

  createPost(body: any) {
    function getRandomInt(min: number, max: number) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }
    const randomInt = getRandomInt(0, 1000);

    body.image = `https://source.unsplash.com/random/300x300?sig=${randomInt}`;
    return AXIOS({
      url: "/api/posts",
      method: "POST",
      body
    });
  },
  updatePost(postID: number, body: { title?: string; content?: string }) {
    return AXIOS({
      url: `/api/posts/${postID}`,
      method: "PATCH",
      body
    });
  },
  addPostComment(postID: number, content: string) {
    return AXIOS({
      url: "/api/comments",
      method: "POST",
      body: { postId: postID, content }
    });
  },
  deletePost(postID: number) {
    return AXIOS({
      url: `/api/posts/${postID}`,
      method: "DELETE"
    });
  }
};

export default PostService;
