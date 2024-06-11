import { VideoScreen } from ".";
import { render, screen } from "@testing-library/react-native";
import { useNavigationState } from "@react-navigation/native";

jest.mock("../../api/queries", () => ({
  useGetVideoQuery: jest.fn(() => ({
    data: {
      uuid: "123",
      files: [
        { resolution: { id: 2160 } },
        { resolution: { id: 1080 }, fileUrl: "http://abc.xyz/static/web-videos/123-1080.mp4" },
        { resolution: { id: 240 } },
      ],
    },
  })),
}));
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigationState: jest.fn(),
}));

describe("VideoScreen", () => {
  it("should form a correct video uri and choose highest available quality no more than 1080", () => {
    (useNavigationState as jest.Mock).mockReturnValueOnce("123");
    render(<VideoScreen />);
    expect(screen.getByTestId("123-video-view-video-playback").props.source.uri).toBe(
      "http://abc.xyz/static/web-videos/123-1080.mp4",
    );
  });

  it("should not render video if there is no id", () => {
    (useNavigationState as jest.Mock).mockReturnValueOnce(null);
    render(<VideoScreen />);
    expect(screen.queryByTestId("123-video-view-video-playback")).toBeNull();
  });
});
