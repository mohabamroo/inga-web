import { useState, useEffect } from "react";
import PostService from "../services/post.service";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";

import { Container } from "@mui/system";
import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { PostComment } from "../models/comment.model";
import moment from "moment";
import { toast } from "react-toastify";

export function PostComments(props: { postID: number }) {
  const [loading, setLoading] = useState(0);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState<string | undefined>("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const fetchComments = () => {
    setLoading(1);
    PostService.fetchPostComments({
      post_id: props.postID
    })
      .then((res) => {
        setComments(comments.concat(res.data));
        setLoading(0);
      })
      .catch((err) => {
        toast.error("failed to fetch post comments");
        setLoading(0);
      });
  };

  const submitNewComment = () => {
    if (!newComment) return;
    setLoading(1);
    PostService.addPostComment(props.postID, newComment)
      .then((res) => {
        setComments([res.data].concat(comments));
        setNewComment("");
      })
      .catch((err) => {
        setErrorMessage(err.response.data.message || "Failed to add comment");
      })
      .finally(() => {
        setLoading(0);
      });
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <Container sx={{ minHeight: 300, minWidth: 500 }} maxWidth="md">
      <Typography variant="h6" sx={{ my: 2, mx: 0 }} margin="normal">
        Post Comments ({comments.length})
      </Typography>
      {!!loading && <CircularProgress />}
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {!comments.length && (
          <Typography variant="body2" sx={{ my: 2, mx: 0 }} margin="normal">
            No comments
          </Typography>
        )}
        {comments.map((x) => (
          <ListItem key={x.id}>
            <ListItemAvatar sx={{ mr: 2 }}>
              <Avatar sx={{ width: 56, height: 56 }}>
                {/* TODO: user image */}
                <ImageIcon />
              </Avatar>
              <Tooltip
                title={x?.author?.firstName + " " + (x?.author?.lastName || "")}
              >
                <Typography variant="subtitle1">
                  {x?.author?.firstName}
                </Typography>
              </Tooltip>
            </ListItemAvatar>
            <ListItemText
              primary={x?.content}
              secondary={moment(x?.createdAt).fromNow()}
            />
          </ListItem>
        ))}
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </Grid>

        <Grid item xs={8}>
          <TextField
            margin="normal"
            required
            value={newComment}
            placeholder="I like this post"
            fullWidth
            id="newComment"
            onChange={(e) => {
              setNewComment(e.target.value);
            }}
            autoFocus
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            onClick={submitNewComment}
            disabled={loading > 0}
            sx={{ my: 2, height: 50 }}
            variant="contained"
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
