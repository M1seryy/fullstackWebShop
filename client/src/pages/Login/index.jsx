import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, isAuthSelector } from "../../redux/slices/authSlice";
import { Navigate, useNavigate } from "react-router-dom";

export const Login = () => {
  const isAuth = useSelector(isAuthSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      
    },
  });
  const onSubmit = async (values) => {
    const data = await dispatch(getUserData(values));
    if (!data.payload) {
      alert("Неправильні дані користувача");
    }
    if ("token" in data.payload) {
      localStorage.setItem("token", data.payload.token);
      dispatch(getUserData(values))
    }
  };
  if (isAuth) {
    return <Navigate to={"/"} />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", { required: "Вкажіть пошту " })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", { required: "Вкажіть пароль " })}
          fullWidth
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};
