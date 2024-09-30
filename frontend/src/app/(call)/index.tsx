import { useAuth, useUser } from "@clerk/clerk-expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Call, useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import Dialog from "react-native-dialog";

export default () => {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMyCalls, setIsMyCalls] = useState(false);
  const [calls, setCalls] = useState<Call[]>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleJoinRoom = (id: string) => {};

  const fetchCalls = async () => {
    if (!client || !user) return;

    const { calls } = await client.queryCalls({
      filter_conditions: isMyCalls
        ? {
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],
          }
        : {},
      sort: [{ field: "created_at", direction: -1 }],
      watch: true,
    });

    const sortedCalls = calls.sort((a, b) => {
      return b.state.participantCount - a.state.participantCount;
    });

    setCalls(sortedCalls);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCalls();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchCalls();
  }, [isMyCalls]);

  return (
    <View>
      <TouchableOpacity
        className="absolute top-[20px] right-[20px] z-[100]"
        onPress={() => setDialogOpen(true)}
      >
        <MaterialCommunityIcons name="logout" size={24} color={"#5F5DEC"} />
      </TouchableOpacity>
      <Dialog.Container visible={dialogOpen}>
        <Dialog.Title>Sign Out</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to sign out?
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={() => setDialogOpen(false)} />
        <Dialog.Button
          label="Sign Out"
          onPress={async () => {
            await signOut();
            setDialogOpen(false);
          }}
        />
      </Dialog.Container>
      <FlatList
        data={calls}
        keyExtractor={(item) => item.id}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        contentContainerClassName="pb-[100px]"
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleJoinRoom(item.id)}
              disabled={item.state.participantCount === 0}
              className={`p-[20px] text-[${
                item.state.participantCount === 0 ? "#f1f1f1" : "#fff"
              }] opacity-[${
                item.state.participantCount === 0 ? 0.5 : 1
              }] border-b-[1px] border-b-[${
                item.state.participantCount === 0 ? "#f1f1f1" : "#fff"
              }] flex-row items-center gap-[10px]`}
            ></TouchableOpacity>
          );
        }}
      />
    </View>
  );
};
