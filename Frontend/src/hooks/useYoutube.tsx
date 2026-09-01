import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import instance from "../settings/api";

export interface YoutubeVideoStream {
    itag: string | number;
    resolution?: string;
    fps?: number;
    mimeType?: string;
    subtype?: string;
}

export interface YoutubeAudioStream {
    itag: string | number;
    abr?: string | number;
    mimeType?: string;
    subtype?: string;
    audioCodec?: string;
}

export interface YoutubeStreamInfo {
    success: boolean;
    provider?: string;
    video: YoutubeVideoStream[];
    audio: YoutubeAudioStream[];
}

export interface YoutubeVideoInfo {
    thumbnail: string;
    title?: string;
    description?: string;
    duration?: number;
    resolutions: YoutubeStreamInfo;
}

export function useYoutube() {
    const [videoInfo, setVideoInfo] = useState<YoutubeVideoInfo | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [downloadingResolution, setDownloadingResolution] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getErrorMessage = (error: unknown) => {
        if (axios.isAxiosError(error)) {
            return error.response?.data?.detail ?? "Error fetching video info";
        }

        return "Error fetching video info";
    }

    const fetchData = useMutation({
        mutationFn: async (url: string) => {
            setLoading(true);
            setError(null);
            setVideoInfo(null);
            const [thumbnailResponse, streamsResponse] = await Promise.all([
                instance.post("/thumbnail/", {
                    url,
                }),
                instance.post("/streams/", {
                    url,
                }),
            ]);

            return {
                thumbnail: thumbnailResponse.data.thumbnail,
                title: thumbnailResponse.data.title,
                description: thumbnailResponse.data.description,
                duration: thumbnailResponse.data.duration,
                resolutions: streamsResponse.data.resolution,
            };
        },

        onSuccess: (data) => {
            setVideoInfo(data);
            setLoading(false);
        },
        onError: (error) => {
            setLoading(false);
            setError(getErrorMessage(error));
        }
    });

    const downloadVideo = useMutation({
        mutationFn: async ({ url, resolution }: { url: string; resolution: string }) => {
            setError(null);
            setDownloadingResolution(resolution);
            const response = await instance.post("/download/", {
                url,
                resolution,
            });

            return response.data;
        },
        onSuccess: () => {
            setDownloadingResolution(null);
        },
        onError: (error) => {
            setDownloadingResolution(null);
            setError(getErrorMessage(error));
        },
    });

    return {
        downloadingResolution,
        downloadVideo,
        error,
        loading,
        videoInfo,
        fetchData,
    };
}
