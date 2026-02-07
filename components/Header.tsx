import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router, usePathname } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

function HeartIcon({ size = 40, color = '#f87171' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </Svg>
  );
}

function MenuBar({ pathname, navigateTo }: { pathname: string; navigateTo: (path: string) => void }) {
  return (
    <View style={styles.menuBar}>
      <View style={styles.menuBarContent}>
        {pathname !== '/' && (
          <Pressable onPress={() => navigateTo('/')} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        )}
        <View style={[styles.menuNav, pathname === '/' && styles.menuNavCentered]}>
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
    </View>
  );
}

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const navigateTo = (path: string) => {
    if (pathname !== path) {
      router.push(path as any);
    }
  };

  if (isHomePage) {
    return (
      <View>
        <MenuBar pathname={pathname} navigateTo={navigateTo} />
        <View style={styles.heroContainer}>
          <View style={styles.heartWrapper}>
            <HeartIcon size={44} color="#f87171" />
          </View>
          <Text style={styles.heroTitle}>Send A Boop!</Text>
          <Text style={styles.heroSubtitle}>Pick your favorite doggo to brighten someone's day</Text>
        </View>
      </View>
    );
  }

  return <MenuBar pathname={pathname} navigateTo={navigateTo} />;
}

const styles = StyleSheet.create({
  menuBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  menuBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  menuNavCentered: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroContainer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  heartWrapper: {
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: 'Quattrocento-Bold',
    fontSize: 28,
    color: '#1f2937',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontFamily: 'QuattrocentoSans-Regular',
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backText: {
    fontFamily: 'QuattrocentoSans-Bold',
    fontSize: 14,
    color: '#f87171',
  },
  navItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  navText: {
    fontFamily: 'QuattrocentoSans-Regular',
    fontSize: 14,
    color: '#6b7280',
  },
  navTextActive: {
    color: '#1f2937',
    fontFamily: 'QuattrocentoSans-Bold',
  },
});
