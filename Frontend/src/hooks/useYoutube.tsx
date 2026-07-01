import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import instance from "../settings/api";

export function useYoutube() {
    const [videoInfo, setVideoInfo] = useState<{
        thumbnail: string;
        resolutions: string[];
    } | null>(null);

    const [loading, setLoading] = useState<Boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useMutation({
        mutationFn: async (url: string) => {
            setLoading(true);
            const thumbnailResponse = await instance.post("/thumbnail/", {
                url,
                resolution: "",
            });

            const streamsResponse = await instance.post("/streams/", {
                url,
                resolution: "",
            });

            return {
                thumbnail: thumbnailResponse.data.thumbnail,
                resolutions: streamsResponse.data.resolution,
            };
        },

        onSuccess: (data) => {
            setVideoInfo(data);
            setLoading(false);
        },
        onError: (error) => {
            setLoading(false);
            setError("Error fetching video info");
        }
    });

    return {
        error,
        loading,
        videoInfo,
        fetchData,
    };
}