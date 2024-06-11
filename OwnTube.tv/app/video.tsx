import { VideoScreen } from "../screens";
import Head from "expo-router/head";
import { useGetVideosQuery } from "../api";
import { useNavigationState } from "@react-navigation/native";
import { RootStackParams } from "./_layout";

export default function video() {
  const id = useNavigationState<RootStackParams, string | undefined>((state) => state.routes.at(-1)?.params?.id);
  const { data: videoTitle } = useGetVideosQuery({
    enabled: false,
    select: (data) => data.find(({ uuid }) => uuid === id)?.name || "Video",
  });

  return (
    <>
      <Head>
        <title>{videoTitle}</title>
        <meta name="description" content="View video" />
      </Head>
      <VideoScreen />
    </>
  );
}
