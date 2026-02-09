import { useState, useRef, useEffect } from 'react';
import { View, Image, Pressable, StyleSheet, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { dogs, Dog } from '@/lib/dogs';
import { colors, spacing, borderRadius, shadows } from '@/lib/theme';

// Get random dogs - only called on client side
function getRandomDogs(count: number): Dog[] {
  const shuffled = [...dogs].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Fixed initial dogs for SSR - always the first 12
const INITIAL_DOGS = dogs.slice(0, 12);

function AnimatedHeart({ isSelected }: { isSelected: boolean }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isSelected) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [isSelected, scaleAnim]);

  if (!isSelected) return null;

  return (
    <Animated.View
      style={[
        styles.heartBadge,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Svg width={18} height={18} viewBox="0 0 24 24" fill={colors.white}>
        <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </Svg>
    </Animated.View>
  );
}

interface DogSelectorProps {
  selectedDogId: string | null;
  onSelectDog: (dog: Dog) => void;
}

export function DogSelector({ selectedDogId, onSelectDog }: DogSelectorProps) {
  // Start with fixed dogs for SSR, then randomize on client
  const [displayedDogs, setDisplayedDogs] = useState<Dog[]>(INITIAL_DOGS);
  const [hasRandomized, setHasRandomized] = useState(false);

  useEffect(() => {
    // Only randomize once on client mount
    if (!hasRandomized) {
      setDisplayedDogs(getRandomDogs(12));
      setHasRandomized(true);
    }
  }, [hasRandomized]);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {displayedDogs.map((dog) => {
          const isSelected = selectedDogId === dog.id;
          return (
            <Pressable
              key={dog.id}
              style={[
                styles.imageContainer,
                isSelected && styles.selected,
              ]}
              onPress={() => onSelectDog(dog)}
              testID={`dog-${dog.id}`}
              accessibilityLabel={dog.alt}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Image
                source={dog.image}
                style={styles.image}
                accessibilityLabel={dog.alt}
              />
              <AnimatedHeart isSelected={isSelected} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing['3xl'],
    paddingTop: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  imageContainer: {
    width: '32%',
    aspectRatio: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: colors.transparent,
    position: 'relative',
    backgroundColor: '#f5f5f5',
  },
  selected: {
    borderColor: colors.primary,
    ...shadows.selection,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartBadge: {
    position: 'absolute',
    top: '15%',
    right: '5%',
    marginTop: -16,
    marginLeft: -16,
    backgroundColor: colors.primary,
    borderRadius: borderRadius['2xl'],
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
