import React from "react";
import Head from "next/head";
import { Box, Grid, Link, Paper, Typography } from "@mui/material";

import { AuthContext } from "../src/context/authContext";
import { useRouter } from "next/router";
import { useGetUserByIdQuery } from "../src/store/services/api";
import Loader from "../src/components/loader";
import { useSelector } from "react-redux";
import { RootState } from "../src/store/store";
import { UserRole } from "../src/types";

export default function Home() {
  const router = useRouter();
  const { currentUser } = React.useContext(AuthContext);
  const token = useSelector<RootState>((state) => state.auth.token);
  const {
    data: user,
    isError,
    isLoading,
  } = useGetUserByIdQuery({
    id: currentUser?.uid as string,
  });

  React.useEffect(() => {
    token
      ? user?.role === UserRole.Admin
        ? router.push("/admin")
        : router.push("/")
      : router.push("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, user]);

  if (isError || isLoading || !user) {
    return <Loader />;
  }

  const post = {
    title: `I am ${user.name}`,
    description: `My Email address is ${user.email} and my role is ${user.role}`,
    image:
      "https://static-cse.canva.com/blob/572026/removingbackgroundimages_Unsplash.jpeg",
    imageText: "main image description",
    linkText: "Continue reading…",
  };

  return (
    <>
      <Head>
        <title>CRM</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/vercel.svg" />
      </Head>
      <main>
        <Paper
          sx={{
            position: "relative",
            backgroundColor: "grey.800",
            color: "#fff",
            mb: 4,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundImage: `url(${post.image})`,
          }}
        >
          {/* Increase the priority of the hero background image */}
          {
            <img
              style={{ display: "none" }}
              src={post.image}
              alt={post.imageText}
            />
          }
          <Box
            sx={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              backgroundColor: "rgba(0,0,0,.3)",
            }}
          />
          <Grid container>
            <Grid item md={6}>
              <Box
                sx={{
                  position: "relative",
                  p: { xs: 3, md: 6 },
                  pr: { md: 0 },
                }}
              >
                <Typography
                  component="h1"
                  variant="h3"
                  color="inherit"
                  gutterBottom
                >
                  {post.title}
                </Typography>
                <Typography variant="h5" color="inherit" paragraph>
                  {post.description}
                </Typography>
                <Link variant="subtitle1" color="secondary" href="#">
                  {post.linkText}
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </main>
    </>
  );
}
