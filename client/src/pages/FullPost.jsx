import React, { useEffect, useState } from "react";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import axios from "../axios";
import Markdown from "react-markdown";

export const FullPost = () => {
  const { id } = useParams();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/post/${id}`)
      .then((res) => {
        setData(res.data.db);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("Помилка при полученні статті");
      });
  }, []);

  if (loading) {
    return <Post isLoading={loading} isFullPost />;
  }
  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? data.imageUrl : ""}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <Markdown children={data.text} />
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкін",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
          },
          {
            user: {
              fullName: "Ваня Мішко",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
