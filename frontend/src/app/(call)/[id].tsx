import React, { useEffect, useState } from "react";
import {
  Call,
  CallContent,
  CallingState,
  StreamCall,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, TouchableOpacity, View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { copySlug, formatSlug } from "@/src/utils/slug";
import { generateSlug } from "random-word-slugs";
import Toast from "react-native-root-toast";

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
      slug = generateSlug(3, {
        categories: {
          adjective: ["color", "personality"],
          noun: ["animals", "food"],
        },
      });
      // TODO: Check if the slug is already in use
      const _call = client?.call("default", slug);
      _call?.join({ create: true }).then(() => {
        Toast.show(
          "Call created Successfully\nTap here to COPY the call ID to share!",
          {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
            shadow: true,
            onPress: () => copySlug(slug),
          }
        );
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
      <View className="flex-1">
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
      className="bg-[rgba(0,0,0,0.5)] p-[10px] border-[5px]"
    >
      <Text>Call ID: {formatSlug(slug)}</Text>
    </TouchableOpacity>
  );
};
