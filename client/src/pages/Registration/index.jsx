import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { isAuthSelector, regUser } from "../../redux/slices/authSlice";

export const Registration = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(isAuthSelector);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
    },
  });
  console.log(isValid)
  const onSubmit = async (values) => {
    const data = await dispatch(regUser(values));
    if (!data.payload) {
      alert("Невдалося зареєструватися");
    }
    if ("token" in data.payload) {
      localStorage.setItem("token", data.payload.token);
      // dispatch(regUser(values));
    }
  };

  if (isAuth) {
   return <Navigate to={"/"} />;
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Створення аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Полное имя"
          fullWidth
          {...register("fullName", { required: "Вкажіть повне ім'я " })}
        />
        <TextField
          className={styles.field}
          label="E-Mail"
          fullWidth
          {...register("email", { required: "Вкажіть пошту " })}
        />
        <TextField
          className={styles.field}
          label="Пароль"
          fullWidth
          {...register("password", { required: "Вкажіть пароль " })}
        />
        <Button
          // disabled={isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Зареєструватись
        </Button>
      </form>
    </Paper>
  );
};
