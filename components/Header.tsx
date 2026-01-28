import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { router, usePathname } from 'expo-router';

export function Header() {
  const pathname = usePathname();

  const navigateTo = (path: string) => {
    if (pathname !== path) {
      router.push(path as any);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigateTo('/')} style={styles.logoContainer}>
        <Image
          source={require('@/assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>Send a Boop</Text>
      </Pressable>
      <View style={styles.nav}>
        <Pressable onPress={() => navigateTo('/about')} style={styles.navItem}>
          <Text style={[styles.navText, pathname === '/about' && styles.navTextActive]}>
            About
          </Text>
        </Pressable>
        <Pressable onPress={() => navigateTo('/contact')} style={styles.navItem}>
          <Text style={[styles.navText, pathname === '/contact' && styles.navTextActive]}>
            Contact
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8b4d9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9a8d4',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  logoText: {
    fontFamily: 'Quattrocento-Bold',
    fontSize: 18,
    color: '#1f2937',
    marginLeft: 10,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  navItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  navText: {
    fontFamily: 'QuattrocentoSans-Regular',
    fontSize: 16,
    color: '#4b5563',
  },
  navTextActive: {
    color: '#1f2937',
    fontFamily: 'QuattrocentoSans-Bold',
  },
});
