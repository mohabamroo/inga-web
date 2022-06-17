import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";

import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";

import { useForm } from "react-hook-form";
import * as yup from "yup";

import PostService from "../services/post.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert } from "@mui/material";

const schema = yup
  .object({
    title: yup.string().required(),
    content: yup.string().required()
  })
  .required();

export function CreatePostForm(props: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(schema)
  });
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const [loading, setLoading] = useState(0);
  useEffect(() => {
    if (props.post) {
      setValue("title", props.post.title);
      setValue("content", props.post.content);
    }
  }, [props.post]);

  const onSubmit = (data: { title?: string; content?: string }) => {
    setLoading(loading + 1);
    let promise = props.post
      ? PostService.updatePost(props.post.id, data)
      : PostService.createPost(data);

    promise
      .then((res) => {
        props?.onSuccess && props.onSuccess(res.data);
      })
      .catch((err) => {
        setErrorMessage(err.response.data.message || "Failed to create post");
      })
      .finally(() => {
        setLoading(loading - 1);
      });
  };

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
      <Typography component="h1" variant="h5">
        New Post
      </Typography>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 1, width: 500 }}
      >
        <TextField
          margin="normal"
          required
          error={!!errors["title"]}
          fullWidth
          id="title"
          placeholder="Title"
          {...register("title")}
          autoFocus
        />
        <Typography color="error" variant="caption" display="block">
          {errors["title"]?.message}
        </Typography>
        <hr />

        <TextField
          margin="normal"
          error={!!errors["content"]}
          required
          multiline
          minRows={3}
          fullWidth
          {...register("content")}
          placeholder="Content"
          id="content"
        />

        <Typography color="error" variant="caption" display="block">
          {errors["content"]?.message}
        </Typography>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}
