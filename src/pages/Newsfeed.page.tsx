import Button from "@mui/material/Button";
import { useState, useEffect } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PostService from "../services/post.service";
import { CircularProgress, Dialog } from "@mui/material";
import { CreatePostForm } from "../components/CreatePostForm.component";
import { Post } from "../models/post.model";
import { Header } from "../components/Header.component";
import AddIcon from "@mui/icons-material/Add";

import { PostComments } from "../components/PostComments.component";
import { User } from "../models/user.model";
import AuthService from "../services/auth.service";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { PostCard } from "../components/PostCard.component";

const MySwal = withReactContent(Swal);

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export function NewsFeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null | undefined>();
  const [loading, setLoading] = useState(0);
  const [fetchOpts, setFetchOpts] = useState<{ skip?: number }>({ skip: 0 });
  const [postsCount, setPostsCount] = useState(0);
  const [postModal, setPostModal] = useState(false);
  const [selectedPostID, setSelectedPostID] = useState<number | undefined>();
  const [editedPost, setEditedPost] = useState<Post | undefined>();

  const fetchPosts = (resetFlag = false) => {
    resetFlag && setPosts([]);
    setLoading(1);
    PostService.fetchPosts()
      .then((res: { data: { results: Post[]; count: number } }) => {
        resetFlag
          ? setPosts(res.data.results)
          : setPosts(posts.concat(res.data.results));
        setLoading(0);
        setPostsCount(res.data.count);
      })
      .catch((err) => {
        setLoading(0);
      });
  };

  useEffect(() => {
    fetchPosts();
    setCurrentUser(AuthService.getCurrentUser());
  }, []);

  const loadMorePosts = () => {
    if (posts && posts.length < postsCount) {
      setFetchOpts({ ...fetchOpts, skip: posts.length });
      fetchPosts();
    } else {
      toast("No more posts to load");
    }
  };
  const onPostCreated = (post: Post) => {
    setPosts([post].concat(posts));
    setPostModal(false);
  };

  const onPostEdited = (post: Post) => {
    fetchPosts(true);
    setEditedPost(undefined);
  };

  const handleClose = (res?: any) => {
    setPostModal(false);
    setSelectedPostID(undefined);
    setEditedPost(undefined);
  };

  const handleSelectedPost = (id: number) => {
    setSelectedPostID(id);
  };

  const handleDeletePost = (id: number) => {
    MySwal.fire({
      title: <p>Are you sure?</p>,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, delete post #${id}!`
    }).then(() => {
      return deletePost(id);
    });
  };

  const deletePost = (postID: number) => {
    PostService.deletePost(postID)
      .then((res) => {
        toast.success("Post deleted!", {
          position: toast.POSITION.TOP_RIGHT
        });

        fetchPosts(true);
      })
      .catch((err) => {
        toast.error("Error deleting post!");
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Create Post Form Modal */}
      <Dialog open={postModal} onClose={handleClose}>
        <CreatePostForm onSuccess={onPostCreated} />
      </Dialog>
      {/* end of Create Post Form Modal */}

      {/* Edit Post Form Modal */}
      <Dialog open={!!editedPost} onClose={handleClose}>
        <CreatePostForm post={editedPost} onSuccess={onPostEdited} />
      </Dialog>
      {/* end of Edit Post Form Modal */}

      {/* Selected Post Comments modal */}
      <Dialog open={!!selectedPostID} onClose={handleClose}>
        {selectedPostID && <PostComments postID={selectedPostID} />}
      </Dialog>
      {/* end of Selected Post Comments modal */}

      {/* Page Header */}
      <Header />
      {/* end of Page Header */}

      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Hi, {currentUser?.firstName} {currentUser?.id}!
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Typography
                variant="h5"
                align="center"
                sx={{ my: 0 }}
                color="text.secondary"
                paragraph
              >
                Tell us what's on your mind
              </Typography>
              <Button
                size="large"
                onClick={() => setPostModal(true)}
                variant="contained"
              >
                <AddIcon /> New Post
              </Button>
            </Stack>
          </Container>
        </Box>

        {/* Posts List container */}
        <Container sx={{ py: 8 }} maxWidth="md">
          <Typography variant="h6" sx={{ mb: 3 }}>
            Posts (showing {posts.length} out of {postsCount})
          </Typography>
          {/* End hero unit */}
          {loading > 0 && <CircularProgress />}
          <Grid container spacing={4}>
            {posts.map((post: Post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={() => handleDeletePost(post.id)}
                onSelect={() => handleSelectedPost(post.id)}
                onEdit={() => setEditedPost(post)}
              />
            ))}
          </Grid>
          <Button
            disabled={posts?.length == postsCount}
            sx={{ my: 4 }}
            onClick={() => loadMorePosts()}
            size="large"
          >
            <Typography variant="h5" align="center">
              Load more
            </Typography>
          </Button>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Inga Inc.
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Trusted by 2,000,000+ developers and designers using Inga.
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}
