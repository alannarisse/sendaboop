import { useState, ReactNode } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

interface TooltipProps {
  text: string;
  visible: boolean;
  children: ReactNode;
}

export function Tooltip({ text, visible, children }: TooltipProps) {
  const [isHovered, setIsHovered] = useState(false);

  const showTooltip = visible && isHovered;

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View
      style={styles.container}
      // @ts-ignore - web-specific props
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {showTooltip && (
        <View style={styles.tooltipContainer}>
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>{text}</Text>
          </View>
          <View style={styles.tooltipArrow} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    alignItems: 'center',
    marginBottom: 8,
    zIndex: 1000,
  },
  tooltip: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    maxWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  tooltipText: {
    fontFamily: 'QuattrocentoSans-Regular',
    fontSize: 13,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 18,
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1f2937',
    marginTop: -1,
  },
});
