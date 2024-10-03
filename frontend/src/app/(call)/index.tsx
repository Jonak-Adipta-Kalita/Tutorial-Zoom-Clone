import { formatSlug } from "@/src/utils/slug";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Call, useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { Href, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

  const handleJoinRoom = (id: string) => {
    router.push(`/call/${id}` as Href);
  };

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
    <View className="py-[10px]">
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
      <View className="flex-row justify-center items-center p-[10px] gap-[10px]">
        <Text
          className={`text-${isMyCalls ? "black" : "#5F5DEC"}`}
          onPress={() => setIsMyCalls(false)}
        >
          All Calls
        </Text>
        <Switch
          trackColor={{ false: "#5F5DEC", true: "#5F5DEC" }}
          thumbColor={"white"}
          ios_backgroundColor={"#5F5DEC"}
          onValueChange={() => setIsMyCalls(!isMyCalls)}
          value={isMyCalls}
        />
        <Text
          onPress={() => setIsMyCalls(true)}
          className={`text-${!isMyCalls ? "black" : "#5F5DEC"}`}
        >
          My Calls
        </Text>
      </View>
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
            >
              {item.state.participantCount === 0 ? (
                <Feather name="phone-off" size={24} color="gray" />
              ) : (
                <Feather name="phone-call" size={24} color="gray" />
              )}
              <Image
                source={{ uri: item.state.createdBy?.image }}
                className="w-[50px] h-[50px] rounded-[25px]"
              />
              <View className="flex-1 justify-between">
                <View className="flex-row justify-between items-center">
                  <View className="items-end gap-[50px]">
                    <Text className="font-bold text-[16px] truncate">
                      {item.state.createdBy?.name ||
                        item.state.createdBy?.custom.email.split("@")[0]}
                    </Text>
                    <Text className="text-[12px] text-gray-600 truncate">
                      {item.state.createdBy?.custom.email}
                    </Text>
                  </View>
                  <View className="ml-5">
                    <Text className="text-[10px] text-right w-[100px]">
                      {formatSlug(item.id)}
                    </Text>
                    <View className="flex-row items-center">
                      {item.state.participantCount === 0 ? (
                        <Text className="text-[10px] font-bold text-[#5F5DEC]">
                          Call Ended
                        </Text>
                      ) : (
                        <View className="rounded-[5px] flex-row items-center text-[#f1f1f1] p-[10px]">
                          <Entypo
                            name="users"
                            size={14}
                            color={"#5F5DEC"}
                            style={{ marginRight: 5 }}
                          />
                          <Text className="text-[#5F5DEC] font-bold">
                            {item.state.participantCount}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};
