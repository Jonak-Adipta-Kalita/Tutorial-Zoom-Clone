import React, { useEffect, useState } from "react";
import {
  Call,
  CallingState,
  StreamCall,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default () => {
  const { id } = useLocalSearchParams();
  const [call, setCall] = useState<Call | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const client = useStreamVideoClient();

  useEffect(() => {
    let slug: string;

    if (id !== "call" && id) {
      slug = id.toString();
      const _call = client?.call("default", slug);
      _call?.join({ create: false }).then(() => {
        setCall(_call);
      });
    } else {
      slug = "demo_room";
      const _call = client?.call("default", slug);
      _call?.join({ create: true }).then(() => {
        setCall(_call);
      });
    }

    setSlug(slug);
  }, [id, client]);

  useEffect(() => {
    if (call?.state.callingState !== CallingState.LEFT) {
      call?.leave();
    }
  }, [call]);

  if (!call || !slug) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <StreamCall call={call}></StreamCall>;
};
