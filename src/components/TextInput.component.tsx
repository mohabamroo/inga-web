import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
export const TextInput = React.forwardRef((props: any, ref) => {
  return (
    <>
      <TextField
        margin={props.margin}
        {...props}
        onChange={props.onChange}
        error={props.error != null}
        id={props.name}
        label={props.label}
        name={props.name}
      />

      <Typography
        color="palette.error"
        variant="caption"
        display="block"
        gutterBottom
      >
        {props.error}
      </Typography>
    </>
  );
});
