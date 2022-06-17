import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import DeleteIcon from "@mui/icons-material/Delete";
import { Post } from "../models/post.model";
import moment from "moment";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";

import AuthService from "../services/auth.service";
import { User } from "../models/user.model";

export function PostCard(props: {
  post: Post;
  onDelete: () => void;
  onEdit: () => void;
  onSelect: () => void;
}) {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>();
  const { post, onSelect, onDelete, onEdit } = props;

  useEffect(() => {
    setCurrentUser(AuthService.getCurrentUser());
  }, []);

  return (
    <Grid item key={post.id} xs={12} sm={12} md={12}>
      <Card
        sx={{
          maxHeight: "500px",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <CardMedia
          component="img"
          sx={{
            maxHeight: "200px"
          }}
          image={
            post.image || `https://source.unsplash.com/random?sig=${post.id}`
          }
          alt="random"
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="h2">
            {post.title}
          </Typography>
          <Typography>{post.content}</Typography>
          <Typography align="left">
            {post.author?.firstName} {post.author?.lastName}
          </Typography>
          <Typography align="right">
            {moment(post.createdAt).fromNow()}
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={() => onSelect()} size="small">
            View Comments
          </Button>
          {currentUser?.id == post.authorId && (
            <>
              <Button onClick={() => onEdit()} size="small">
                <EditIcon />
                Edit
              </Button>
              <Button onClick={() => onDelete()} color="error" size="small">
                <DeleteIcon />
                Delete
              </Button>
            </>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
}
