import { inverseFormatSlug } from "@/src/utils/slug";
import { useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";

export default () => {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  const client = useStreamVideoClient();

  const handleJoinRoom = async () => {
    if (!roomId) return;

    const slug = inverseFormatSlug(roomId);
    const call = client?.call("default", slug);

    call
      ?.get()
      .then((callResponse) => {
        router.push(`/call/${slug}` as Href);
      })
      .catch(() => {
        Toast.show(
          "Whoops!\nLooks like the room you're tring to join doesnt't exist.",
          {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
            shadow: true,
          }
        );
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text className="p-20 font-bold">Enter the Room Name</Text>
      <TextInput
        placeholder="e.g Black Purple Tiger"
        value={roomId}
        onChangeText={setRoomId}
        className="p-20 w-full bg-white"
      />
      <TouchableOpacity
        className="p-20 bg-[#5F5DEC] w-full items-center justify-center"
        onPress={handleJoinRoom}
      >
        <Text className="text-white font-bold">Join Room</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
