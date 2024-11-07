const avatars = [
  'Alexander',
  'Adrian',
  'Aidan',
  'Aiden',
  'Andrea',
  'Amaya',
  'Avery',
  'Brian',
  'Brooklyn',
  'Christian',
  'Chase',
  'Caleb',
  'Christopher',
  'Destiny',
  'Eden',
  'Easton',
  'Jade',
  'Jack',
  'Kimberly',
  'George'
]

export function getRandomAvatar(): string {
  return avatars[Math.floor(Math.random() * avatars.length)]
}
