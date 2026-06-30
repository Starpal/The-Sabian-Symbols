import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native";
import { colors } from "@/constants/theme";

type BackButtonProps = {
  onPress?: () => void;
};

export default function BackButton({ onPress }: BackButtonProps) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const previousScreen = (params.from as string) || "Home";
  return (
    <TouchableOpacity
      onPress={onPress ?? (() => router.back())}
      hitSlop={12}
      accessibilityLabel={"Go back"}
      accessibilityRole="button"
      accessibilityHint={`Navigate back to ${previousScreen} screen`}
    >
      <Ionicons
        name="arrow-back"
        size={20}
        color={colors.accent}
        aria-hidden={true}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
    </TouchableOpacity>
  );
}
