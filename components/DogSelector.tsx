import { useState } from 'react';
import { View, Image, Pressable, StyleSheet, Text } from 'react-native';
import { dogs, Dog } from '@/lib/dogs';

function getRandomDogs(count: number): Dog[] {
  const shuffled = [...dogs].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

interface DogSelectorProps {
  selectedDogId: string | null;
  onSelectDog: (dog: Dog) => void;
}

export function DogSelector({ selectedDogId, onSelectDog }: DogSelectorProps) {
  const [displayedDogs] = useState(() => getRandomDogs(12));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick a pup to send:</Text>
      <View style={styles.grid}>
        {displayedDogs.map((dog) => (
          <Pressable
            key={dog.id}
            style={[
              styles.imageContainer,
              selectedDogId === dog.id && styles.selected,
            ]}
            onPress={() => onSelectDog(dog)}
            testID={`dog-${dog.id}`}
            accessibilityLabel={dog.alt}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedDogId === dog.id }}
          >
            <Image
              source={dog.image}
              style={styles.image}
              accessibilityLabel={dog.alt}
            />
            {selectedDogId === dog.id && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Quattrocento-Bold',
    marginBottom: 12,
    color: '#1f2937',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  imageContainer: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
    position: 'relative',
  },
  selected: {
    borderColor: '#f472b6',
    shadowColor: '#f472b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    //backgroundColor: 'linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)',
    backgroundColor: '#f472b6',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontFamily: 'QuattrocentoSans-Bold',
    fontSize: 14,
  },
});
