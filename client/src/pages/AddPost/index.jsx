import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { isAuthSelector } from "../../redux/slices/authSlice";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../axios";

export const AddPost = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isAuth = useSelector(isAuthSelector);
  const [imageUrl, setImageUrl] = useState("");
  const [text, setText] = React.useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    if (id) {
      axios(`/post/${id}`)
        .then(({ data }) => {
          setTitle(data.db.title);
          setText(data.db.text);
          setImageUrl(data.db.imageUrl);
          setTags(data.db.tags.join(","));
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (error) {
      console.warn(error);
      alert("Помилка при загрузці файлу");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      const body = {
        title,
        text,
        tags: tags?.split(","),
        imageUrl,
      };
      const { data } = isEditing
        ? await axios.patch(`/post/${id}`, body)
        : await axios.post("/post", body);
      const _id = isEditing ? id : data._id;
      navigate(`/post/${_id}`);
    } catch (error) {
      console.log(error);
      alert("Помилка при створенні статті");
    }
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введіть текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );
  if (!localStorage.getItem("token") && !isAuth) {
    return <Navigate to={"/"} />;
  }
  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузити фото
      </Button>
      <input type="file" ref={inputRef} onChange={handleChangeFile} hidden />
      {imageUrl && (
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Видалити
        </Button>
      )}
      {imageUrl && (
        <img
          className={styles.image}
          src={`http://localhost:3000${imageUrl}`}
          alt="Uploaded"
        />
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статті..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Теги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Редагувати" : "Створити"}
        </Button>

        <a href="/">
          <Button size="large">Відміна</Button>
        </a>
      </div>
    </Paper>
  );
};
