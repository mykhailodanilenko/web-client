import VideoView from "../../components/VideoView";
import { RootStackParams } from "../../app/_layout";
import { useGetVideoQuery } from "../../api";
import { useMemo } from "react";
import { Loader } from "../../components";
import { useNavigationState } from "@react-navigation/native";

export const VideoScreen = () => {
  const id = useNavigationState<RootStackParams, string | undefined>((state) => state.routes.at(-1)?.params?.id);

  const { data, isFetching } = useGetVideoQuery(id);

  const uri = useMemo(() => {
    if (!id || !data) {
      return;
    }

    if (data?.streamingPlaylists?.length) {
      const hlsStream = data.streamingPlaylists[0];

      return hlsStream.playlistUrl;
    }

    const files = data.files?.filter(({ resolution }) => resolution.id <= 1080);

    // temporarily choose the highest quality
    return files?.[0].fileUrl;
  }, [id, data]);

  if (isFetching) {
    return <Loader />;
  }

  if (!uri) {
    return null;
  }

  return <VideoView testID={`${id}-video-view`} uri={uri} />;
};
