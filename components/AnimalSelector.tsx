import { useState, useRef, useEffect } from 'react';
import { View, Image, Pressable, StyleSheet, Animated, Text } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { animals, Animal, getAnimalTypes } from '@/lib/animals';
import { colors, spacing, borderRadius, shadows, fonts } from '@/lib/theme';

// Get random animals from a filtered list
function getRandomAnimals(animalList: Animal[], count: number): Animal[] {
  const shuffled = [...animalList].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Fixed initial animals for SSR - always the first 12
const INITIAL_ANIMALS = animals.slice(0, 12);

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

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function RadioButton({ label, selected, onPress }: RadioButtonProps) {
  return (
    <Pressable style={styles.radioButton} onPress={onPress}>
      <Svg width={20} height={20} viewBox="0 0 24 24">
        <Circle
          cx={12}
          cy={12}
          r={10}
          stroke={selected ? colors.primary : colors.text.light}
          strokeWidth={2}
          fill="none"
        />
        {selected && (
          <Circle cx={12} cy={12} r={6} fill={colors.primary} />
        )}
      </Svg>
      <Text style={[styles.radioLabel, selected && styles.radioLabelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

interface AnimalSelectorProps {
  selectedAnimalUid: number | null;
  onSelectAnimal: (animal: Animal) => void;
}

export function AnimalSelector({ selectedAnimalUid, onSelectAnimal }: AnimalSelectorProps) {
  const animalTypes = getAnimalTypes();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  // Start with fixed animals for SSR, then randomize on client
  const [displayedAnimals, setDisplayedAnimals] = useState<Animal[]>(INITIAL_ANIMALS);
  const [hasRandomized, setHasRandomized] = useState(false);

  useEffect(() => {
    // Only randomize once on client mount
    if (!hasRandomized) {
      setDisplayedAnimals(getRandomAnimals(animals, 12));
      setHasRandomized(true);
    }
  }, [hasRandomized]);

  // Handle animal type filter change
  const handleTypeChange = (type: string | null) => {
    setSelectedType(type);

    if (type === null) {
      // Show all animals
      setDisplayedAnimals(getRandomAnimals(animals, 12));
    } else {
      // Filter by animal type
      const filteredAnimals = animals.filter((animal) => animal.animal === type);
      setDisplayedAnimals(getRandomAnimals(filteredAnimals, Math.min(12, filteredAnimals.length)));
    }
  };

  return (
    <View style={styles.container}>
      {/* Animal type filter radio buttons */}
      <View style={styles.filterContainer}>
        <RadioButton
          label="All"
          selected={selectedType === null}
          onPress={() => handleTypeChange(null)}
        />
        {animalTypes.map((type) => (
          <RadioButton
            key={type}
            label={type.charAt(0).toUpperCase() + type.slice(1)}
            selected={selectedType === type}
            onPress={() => handleTypeChange(type)}
          />
        ))}
      </View>

      {/* Animal grid */}
      <View style={styles.grid}>
        {displayedAnimals.map((animal) => {
          const isSelected = selectedAnimalUid === animal.uid;
          return (
            <Pressable
              key={animal.uid}
              style={[
                styles.imageContainer,
                isSelected && styles.selected,
              ]}
              onPress={() => onSelectAnimal(animal)}
              testID={`animal-${animal.uid}`}
              accessibilityLabel={animal.alt}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Image
                source={animal.image}
                style={styles.image}
                accessibilityLabel={animal.alt}
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
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xl,
    paddingVertical: spacing.md,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  radioLabel: {
    fontFamily: fonts.family.sansRegular,
    fontSize: fonts.size.base,
    color: colors.text.medium,
  },
  radioLabelSelected: {
    fontFamily: fonts.family.sansBold,
    color: colors.primary,
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
