import { ImageSourcePropType } from 'react-native';

export interface Dog {
  id: string;
  image: ImageSourcePropType;
  url: string; // Public URL for emails
  alt: string;
}

// Base URL for hosted images (update this to your Vercel domain)
const IMAGE_BASE_URL = 'https://sendaboop.app/images/dogs';

export const dogs: Dog[] = [
  {
    id: 'golden-retriever',
    image: require('@/assets/images/dogs/jairo-alzate-sssxyuZape8-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/jairo-alzate-sssxyuZape8-unsplash.jpg`,
    alt: 'photographer: Jairo Alzate - Happy golden retriever with tongue out',
  },
  {
    id: 'corgi',
    image: require('@/assets/images/dogs/alvan-nee-NeRrOJJs1J8-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/alvan-nee-NeRrOJJs1J8-unsplash.jpg`,
    alt: 'photographer: Alvan Nee - Adorable corgi looking at camera',
  },
  {
    id: 'pug',
    image: require('@/assets/images/dogs/charlesdeluvio-pOUA8Xay514-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/charlesdeluvio-pOUA8Xay514-unsplash.jpg`,
    alt: 'photographer: Charles Deluvio - Cute pug with head tilted',
  },
  {
    id: 'husky',
    image: require('@/assets/images/dogs/cristina-anne-costello-NR2eMg9zXxA-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/cristina-anne-costello-NR2eMg9zXxA-unsplash.jpg`,
    alt: 'photographer: Cristina Anna Costello - Majestic husky with blue eyes',
  },
  {
    id: 'beagle',
    image: require('@/assets/images/dogs/yury-orlov-J16gyd7WtyA-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/yury-orlov-J16gyd7WtyA-unsplash.jpg`,
    alt: 'photographer: Yury Orlov - Sweet beagle puppy face',
  },
  {
    id: 'labrador',
    image: require('@/assets/images/dogs/ben-iwara-A2vIKhoRBIM-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/ben-iwara-A2vIKhoRBIM-unsplash.jpg`,
    alt: 'photographer: Ben Iwara - Friendly black labrador',
  },
  {
    id: 'shiba',
    image: require('@/assets/images/dogs/road-ahead-u0H7dup14Bg-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/road-ahead-u0H7dup14Bg-unsplash.jpg`,
    alt: 'photographer: unknown - Smiling shiba inu',
  },
  {
    id: 'dachshund',
    image: require('@/assets/images/dogs/serjan-midili-6jxDHe_RVOA-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/serjan-midili-6jxDHe_RVOA-unsplash.jpg`,
    alt: 'photographer: Serjan Midili - Cute dachshund close-up',
  },
  {
    id: 'poodle',
    image: require('@/assets/images/dogs/alsu-vershinina-4gRgy5rjFLI-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/alsu-vershinina-4gRgy5rjFLI-unsplash.jpg`,
    alt: 'photographer: Alsu Vershinina - Fluffy white poodle',
  },
  {
    id: 'bulldog',
    image: require('@/assets/images/dogs/karsten-winegeart-NE0XGVKTmcA-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/karsten-winegeart-NE0XGVKTmcA-unsplash.jpg`,
    alt: 'photographer: Karsten Winegart - French bulldog looking adorable',
  },
  {
    id: 'samoyed',
    image: require('@/assets/images/dogs/sarah-b-riZjFy__tlg-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/sarah-b-riZjFy__tlg-unsplash.jpg`,
    alt: 'photographer: Sarah B - Fluffy white samoyed smiling',
  },
  {
    id: 'border-collie',
    image: require('@/assets/images/dogs/jamie-street-jOKje-UpK3k-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/jamie-street-jOKje-UpK3k-unsplash.jpg`,
    alt: 'photographer: Jamie Street - Attentive border collie',
  },
  {
    id: 'chihuahua',
    image: require('@/assets/images/dogs/david-vives-5j4bu68ltyk-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/david-vives-5j4bu68ltyk-unsplash.jpg`,
    alt: 'photographer: David Vives - Tiny chihuahua with big eyes',
  },
  {
    id: 'german-shepherd',
    image: require('@/assets/images/dogs/gursimrat-ganda-zTV6vME0ijk-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/gursimrat-ganda-zTV6vME0ijk-unsplash.jpg`,
    alt: 'photographer: Gursimrat Ganda - Noble german shepherd',
  },
  {
    id: 'maltese',
    image: require('@/assets/images/dogs/danique-veldhuis-brYiSKZ0I_k-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/danique-veldhuis-brYiSKZ0I_k-unsplash.jpg`,
    alt: 'photographer: Danique Veldhuis - Fluffy white maltese',
  },
  {
    id: 'terrier',
    image: require('@/assets/images/dogs/luis-olmos-XwaqPYvYimA-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/luis-olmos-XwaqPYvYimA-unsplash.jpg`,
    alt: 'photographer: Luis Olmos - Playful terrier',
  },
  {
    id: 'pitbull',
    image: require('@/assets/images/dogs/michal-mikulec-hr3ckRbpVQQ-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/michal-mikulec-hr3ckRbpVQQ-unsplash.jpg`,
    alt: 'photographer: Michal Mikulec - Sweet pitbull face',
  },
  {
    id: 'aussie',
    image: require('@/assets/images/dogs/michelle-tresemer-r2o_0cIm-GY-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/michelle-tresemer-r2o_0cIm-GY-unsplash.jpg`,
    alt: 'photographer: Michelle Tresemer - Australian shepherd',
  },
  {
    id: 'boxer',
    image: require('@/assets/images/dogs/octavian-horn-pdZmu7pFcNA-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/octavian-horn-pdZmu7pFcNA-unsplash.jpg`,
    alt: 'photographer: Octavian Horn - Friendly boxer',
  },
  {
    id: 'bichon',
    image: require('@/assets/images/dogs/rafael-ishkhanyan-sHeEBiExteM-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/rafael-ishkhanyan-sHeEBiExteM-unsplash.jpg`,
    alt: 'photographer: Rafael Ishkhanyan - Fluffy bichon frise',
  },
  {
    id: 'havanese',
    image: require('@/assets/images/dogs/sebin-lalu-cLvJgLR8qnA-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/sebin-lalu-cLvJgLR8qnA-unsplash.jpg`,
    alt: 'photographer: Sebin Lalu - Cute havanese',
  },
  {
    id: 'spaniel',
    image: require('@/assets/images/dogs/anthony-persegol-6AC9sde3n-E-unsplash.jpg'),
    url: `${IMAGE_BASE_URL}/anthony-persegol-6AC9sde3n-E-unsplash.jpg`,
    alt: 'photographer: Anthony Persegol - Cocker spaniel',
  },
];

export function getDogById(id: string): Dog | undefined {
  return dogs.find((dog) => dog.id === id);
}
