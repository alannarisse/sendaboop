export interface Dog {
  id: string;
  url: string;
  alt: string;
}

export const dogs: Dog[] = [
  {
    id: 'golden-retriever',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
    alt: 'Happy golden retriever with tongue out',
  },
  {
    id: 'corgi',
    url: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=400&h=400&fit=crop',
    alt: 'Adorable corgi looking at camera',
  },
  {
    id: 'pug',
    url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=400&fit=crop',
    alt: 'Cute pug with head tilted',
  },
  {
    id: 'husky',
    url: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=400&fit=crop',
    alt: 'Majestic husky with blue eyes',
  },
  {
    id: 'beagle',
    url: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&h=400&fit=crop',
    alt: 'Sweet beagle puppy face',
  },
  {
    id: 'labrador',
    url: 'https://images.unsplash.com/photo-1579213838058-1cf0a5f12cd9?w=400&h=400&fit=crop',
    alt: 'Friendly black labrador',
  },
  {
    id: 'shiba',
    url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop',
    alt: 'Smiling shiba inu',
  },
  {
    id: 'dachshund',
    url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&h=400&fit=crop',
    alt: 'Cute dachshund close-up',
  },
  {
    id: 'poodle',
    url: 'https://images.unsplash.com/photo-1616149411108-e3c2f578f4bc?w=400&h=400&fit=crop',
    alt: 'Fluffy white poodle',
  },
  {
    id: 'bulldog',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop',
    alt: 'French bulldog looking adorable',
  },
  {
    id: 'samoyed',
    url: 'https://images.unsplash.com/photo-1529429617124-95b109e86bb8?w=400&h=400&fit=crop',
    alt: 'Fluffy white samoyed smiling',
  },
  {
    id: 'border-collie',
    url: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=400&h=400&fit=crop',
    alt: 'Attentive border collie',
  },
];

export function getDogById(id: string): Dog | undefined {
  return dogs.find((dog) => dog.id === id);
}
