import { View, Text, ScrollView, StyleSheet, Linking, Image, Pressable } from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows, commonStyles } from '@/lib/theme';

export default function AboutScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>About Send a Boop</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>What is Send a Boop</Text>
        <Text style={styles.paragraph}>
          This project was originally imagined while teaching a UX/UI class at Portland State.
          It was a demo project for an assignment using Figma to design an app concept. I liked
          the idea so much that I wanted to make it real. The Internet kinda sucks now. Everyone
          wants something from you. I just want to brighten people's day with an app that, for
          once, doesn't want anything in return. You'll find my privacy policy below.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Who Am I?</Text>
        <Image
          source={require('@/assets/images/general/bio-pic.jpeg')}
          style={styles.bioPhoto}
          resizeMode="cover"
        />
        <Text style={styles.paragraph}>
          Hi there! I'm Alanna Risse. I live in Portland, Oregon. I teach part-time in Portland
          State's Graphic Design program. I've been a web developer since 1997. I have a YouTube
          channel at{' '}
          <Text style={styles.link} onPress={() => openLink('https://youtube.com/@AlannaRisse')}>
            youtube.com/@AlannaRisse
          </Text>
          {' '}with lots of tutorials on HTML, CSS, JavaScript, Git, Figma, Video Editing, and more.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Hire Me</Text>
        <Text style={styles.paragraph}>
          I am actively looking for a full-time position in Portland, Oregon or remote. You can
          find me at{' '}
          <Text style={styles.link} onPress={() => openLink('https://alannarisse.com')}>
            alannarisse.com
          </Text>
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Privacy Policy</Text>
        <Text style={styles.paragraph}>
          I am not collecting your email addresses for anything other than making sure my service
          still works. The email service I use, Resend, stores my customers' data (you and/or your
          friend's email) for a short period of time to make sure the service is working correctly.
        </Text>
        <Text style={styles.paragraph}>
          I will never use your email for anything other than letting you send boops to your friends.
          You won't get any emails from me. No I am not an evil internet overlord pretending to offer
          you a free service and then taking your email for nefarious purposes. I'm just a gal who
          wishes there were more free, fun things on the internet just for the sake of being fun.
        </Text>
        <Text style={styles.paragraph}>
          You can view Resend's Security features and practices here:{' '}
          <Text style={styles.link} onPress={() => openLink('https://resend.com/docs/security')}>
            resend.com/docs/security
          </Text>
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Support This App</Text>
        <Text style={styles.paragraph}>
          Appreciate this app?{' '}
          <Text style={styles.link} onPress={() => openLink('https://ko-fi.com/alannarisse')}>
            Leave a tip at Ko-fi!
          </Text>
        </Text>
        <Pressable
          onPress={() => openLink('https://ko-fi.com/alannarisse')}
          style={({ pressed }) => [
            styles.kofiButton,
            pressed && styles.kofiButtonPressed,
          ]}
        >
          <Image
            source={require('@/assets/images/general/support_me_on_kofi_beige.png')}
            style={styles.kofiImage}
            accessibilityLabel="Support Alanna on Ko-fi"
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.transparent,
  },
  content: {
    padding: spacing['3xl'],
    paddingBottom: spacing['10xl'],
  },
  pageTitle: {
    fontFamily: fonts.family.serifBold,
    fontSize: fonts.size['3xl'],
    color: colors.text.dark,
    marginBottom: spacing['5xl'],
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius['2xl'],
    padding: spacing['4xl'],
    marginBottom: spacing['2xl'],
    ...shadows.card,
  },
  sectionTitle: {
    fontFamily: fonts.family.serifBold,
    fontSize: fonts.size['2xl'],
    color: colors.text.dark,
    marginBottom: spacing.lg,
  },
  bioPhoto: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.xl,
    marginBottom: spacing['2xl'],
  },
  paragraph: {
    fontFamily: fonts.family.sansRegular,
    fontSize: fonts.size.md,
    color: colors.text.medium,
    lineHeight: fonts.lineHeight.relaxed,
    marginBottom: spacing.lg,
  },
  link: {
    color: colors.primary,
    fontFamily: fonts.family.sansBold,
  },
  kofiButton: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  kofiButtonPressed: {
    opacity: 0.8,
  },
  kofiImage: {
    width: 180,
    height: 36,
  },
});
