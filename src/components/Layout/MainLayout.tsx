import * as React from "react";
import { useRouter } from "next/router";
import Layout from "./Layout";

interface LayoutProps {
  children: React.ReactNode;
}
export default function MainLayout(props: LayoutProps) {
  const router = useRouter();

  const showLayout =
    router.pathname.includes("/login") || router.pathname.includes("/register")
      ? false
      : true;

  return showLayout ? (
    <Layout children={props.children} />
  ) : (
    <React.Fragment>{props.children}</React.Fragment>
  );
}
