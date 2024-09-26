import React, { useEffect, useState } from "react";
import {
  Call,
  CallContent,
  CallingState,
  StreamCall,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default () => {
  const { id } = useLocalSearchParams();
  const [call, setCall] = useState<Call | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const client = useStreamVideoClient();
  const router = useRouter();

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

  return (
    <StreamCall call={call}>
      <View>
        <View className="absolute top-[10px] left-[10px] z-[100]">
          <RoomId slug={slug} />
        </View>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <CallContent onHangupCallHandler={() => router.back()} />
        </GestureHandlerRootView>
      </View>
    </StreamCall>
  );
};

const RoomId = ({ slug }: { slug: string }) => {
  return (
    <TouchableOpacity
      onPress={() => copySlug(slug)}
      className="bg-[rgba(0,0,0,0.5)] p-10 border-[5px]"
    >
      {/* <Text>Call ID: {formatSlug(slug)}</Text> */}
    </TouchableOpacity>
  );
};
