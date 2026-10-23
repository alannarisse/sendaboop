import { createContext, useCallback, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BoopFormData } from '@/components/BoopForm';

export const DRAFT_STORAGE_KEY = 'sendaboop:form-drafts:v1';
export const emptyBoopFields: BoopFormData = {
  senderName: '', senderEmail: '', recipientName: '', recipientEmail: '', message: '',
};
const emptyDrafts = {
  boop: { fields: emptyBoopFields, animalUid: null as number | null },
  contact: { name: '', email: '', comments: '' },
};
type Drafts = typeof emptyDrafts;
type DraftKind = keyof Drafts;
type DraftContextValue = {
  drafts: Drafts;
  ready: boolean;
  atRisk: boolean;
  warning: string | null;
  update: <K extends DraftKind>(kind: K, change: (draft: Drafts[K]) => Drafts[K]) => void;
  clear: <K extends DraftKind>(kind: K, sent: Drafts[K]) => Promise<void>;
  confirmLeave: () => Promise<boolean>;
};
const DraftContext = createContext<DraftContextValue | null>(null);

function hasContent(drafts: Drafts) {
  return drafts.boop.animalUid !== null || Object.values(drafts.boop.fields).some(Boolean)
    || Object.values(drafts.contact).some(Boolean);
}

function parseDrafts(raw: string): Drafts {
  const data = JSON.parse(raw);
  for (const [key, value] of Object.entries(emptyBoopFields)) {
    if (typeof data?.boop?.fields?.[key] !== typeof value) throw new Error('Invalid draft');
  }
  for (const key of Object.keys(emptyDrafts.contact)) {
    if (typeof data?.contact?.[key] !== 'string') throw new Error('Invalid draft');
  }
  if (data.boop.animalUid !== null && !Number.isInteger(data.boop.animalUid)) throw new Error('Invalid animal');
  return { boop: { fields: data.boop.fields, animalUid: data.boop.animalUid }, contact: data.contact };
}

export function DraftsProvider({ children }: PropsWithChildren) {
  const [drafts, setDrafts] = useState(emptyDrafts);
  const [ready, setReady] = useState(false);
  const [atRisk, setAtRisk] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const current = useRef(emptyDrafts);
  const revision = useRef(0);
  const saved = useRef(true);
  const queue = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(DRAFT_STORAGE_KEY).then((raw) => {
      if (!active) return;
      if (raw) {
        current.current = parseDrafts(raw);
        setDrafts(current.current);
      }
    }).catch(() => {
      if (active) setWarning('Your saved draft could not be restored. New entries will still be kept while this app is open.');
    }).finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);

  const persist = useCallback((next: Drafts, clearing = false) => {
    current.current = next;
    setDrafts(next);
    const version = ++revision.current;
    saved.current = false;
    setAtRisk(true);
    // Serialize writes so a slower, older save cannot overwrite the latest draft.
    queue.current = queue.current.then(async () => {
      try {
        if (hasContent(next)) await AsyncStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(next));
        else await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
        if (version === revision.current) {
          saved.current = true;
          setAtRisk(false);
          setWarning(null);
        }
      } catch {
        if (version === revision.current) {
          setWarning(clearing
            ? 'Your message was sent, but its saved draft could not be cleared from this device. It may reappear after restarting.'
            : 'Your draft could not be saved on this device. Keep this app open to avoid losing what you entered.');
        }
      }
    });
    return queue.current;
  }, []);

  const update = useCallback<DraftContextValue['update']>((kind, change) => {
    const next = change(current.current[kind]);
    if (JSON.stringify(next) === JSON.stringify(current.current[kind])) return;
    void persist({ ...current.current, [kind]: next });
  }, [persist]);
  const clear = useCallback<DraftContextValue['clear']>(async (kind, sent) => {
    // A request may finish after the user has started a newer draft.
    if (JSON.stringify(current.current[kind]) !== JSON.stringify(sent)) return;
    await persist({ ...current.current, [kind]: emptyDrafts[kind] }, true);
  }, [persist]);
  const confirmLeave = useCallback(async () => {
    await queue.current;
    if (saved.current || !hasContent(current.current)) return true;
    const message = 'Your draft could not be saved on this device. Leaving may cause you to lose what you entered. Leave anyway?';
    if (Platform.OS === 'web') return window.confirm(message);
    return new Promise<boolean>((resolve) => {
      Alert.alert('Unsaved form data', message, [
        { text: 'Stay', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Leave', style: 'destructive', onPress: () => resolve(true) },
      ], { cancelable: true, onDismiss: () => resolve(false) });
    });
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web' || !atRisk || !hasContent(drafts)) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [atRisk, drafts]);

  return <DraftContext.Provider value={{ drafts, ready, atRisk, warning, update, clear, confirmLeave }}>{children}</DraftContext.Provider>;
}

export function useDrafts() {
  const context = useContext(DraftContext);
  if (!context) throw new Error('useDrafts requires DraftsProvider');
  return context;
}
