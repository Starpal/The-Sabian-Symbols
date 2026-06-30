import { Platform, StyleSheet, View } from "react-native";
import BackButton from "./back-button";

type Props = {
  right?: React.ReactNode;
  onBack?: () => void;
};

export default function ScreenHeader({ right, onBack }: Props) {
  return (
    <View style={styles.header}>
      <BackButton onPress={onBack} />
      {right && <View style={styles.right}>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingTop: Platform.OS === "android" ? 8 : 0,
    paddingBottom: 16,
  },
  right: {
    marginLeft: "auto",
  },
});
