import type React from "react";
import { StyleSheet, View, type ViewProps, type ViewStyle } from "react-native";

// TypeScript definition
interface BlockProps extends ViewProps {
  flex?: ViewStyle["flex"];
  row?: boolean;
  justify?: ViewStyle["justifyContent"];
  justifyContent?: ViewStyle["justifyContent"];
  align?: ViewStyle["alignItems"];
  alignItems?: ViewStyle["alignItems"];
  content?: ViewStyle["alignContent"];
  alignContent?: ViewStyle["alignContent"];
  wrap?: ViewStyle["flexWrap"];
  width?: ViewStyle["width"];
  height?: ViewStyle["height"];
  position?: ViewStyle["position"];
  top?: ViewStyle["top"];
  right?: ViewStyle["right"];
  bottom?: ViewStyle["bottom"];
  left?: ViewStyle["left"];
  gap?: ViewStyle["gap"];
  rowGap?: ViewStyle["rowGap"];
  columnGap?: ViewStyle["columnGap"];
  children?: React.ReactNode;
}

const Block = ({
  children,
  style,
  flex = 1,
  row,
  justify,
  justifyContent,
  align,
  alignItems,
  content,
  alignContent,
  wrap,
  width,
  height,
  position,
  top,
  right,
  bottom,
  left,
  gap,
  rowGap,
  columnGap,
  ...props
}: BlockProps) => {
  const blockStyle = StyleSheet.flatten([
    flex !== undefined && { flex },
    row && { flexDirection: "row" },
    justify !== undefined && { justifyContent: justify },
    justifyContent !== undefined && { justifyContent },
    align !== undefined && { alignItems: align },
    alignItems !== undefined && { alignItems },
    content !== undefined && { alignContent: content },
    alignContent !== undefined && { alignContent },
    wrap !== undefined && { flexWrap: wrap },
    width !== undefined && { width },
    height !== undefined && { height },
    position !== undefined && { position },
    top !== undefined && { top },
    right !== undefined && { right },
    bottom !== undefined && { bottom },
    left !== undefined && { left },
    gap !== undefined && { gap },
    rowGap !== undefined && { rowGap },
    columnGap !== undefined && { columnGap },
    style,
  ]) as ViewStyle; // <-- add here the support for StyleSheet

  return (
    <View style={blockStyle} {...props}>
      {children}
    </View>
  );
};

export { Block };
