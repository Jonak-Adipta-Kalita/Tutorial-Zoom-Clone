import React from "react";
import { Text, TouchableOpacity } from "react-native";

const Button = ({
  title,
  onPress,
  styleClass,
}: {
  title: string;
  onPress: () => void;
  styleClass?: string;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white p-[12px] rounded-[5px] w-full ${styleClass}`}
    >
      <Text className="text-[#5F5DEC] text-[16px] text-center font-bold">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
