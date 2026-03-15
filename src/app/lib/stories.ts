import { StoryTemplate } from './types';

// Initial story templates - starting with 5 milestone stories
export const storyTemplates: StoryTemplate[] = [
  {
    id: 'crib-to-bed',
    title: {
      en: 'My Big Kid Bed',
      es: 'Mi cama de niño grande',
      pt: 'Minha cama de criança grande',
    },
    synopsis: {
      en: 'A cozy story about transitioning from crib to bed, turning a scary change into an exciting adventure.',
      es: 'Una historia sobre la transición de la cuna a la cama, convirtiendo un cambio difícil en una aventura emocionante.',
      pt: 'Uma história sobre a transição do berço para a cama, transformando uma mudança assustadora em uma aventura emocionante.',
    },
    previewImageUrl: '/previews/crib-to-bed.png',
    contextFields: [
      {
        key: 'bedName',
        label: { en: 'Name for the new bed (optional)', es: 'Nombre para la cama nueva (opcional)', pt: 'Nome para a cama nova (opcional)' },
        placeholder: { en: 'e.g., Rainbow Bed', es: 'ej., Cama Arcoíris', pt: 'ex., Cama Arco-íris' },
        required: false,
      },
    ],
    pages: [
      {
        pageNumber: 1,
        textTemplate: {
          en: '{{childName}} had always slept in a cozy little crib. But today, something exciting was about to happen!',
          es: '{{childName}} siempre había dormido en una cunita acogedora. Pero hoy, algo emocionante iba a pasar!',
          pt: '{{childName}} sempre dormiu num bercinho aconchegante. Mas hoje, algo emocionante ia acontecer!',
        },
        illustrationPromptTemplate: 'A warm, cozy children\'s bedroom. A {{traits}} toddler looking curiously at a small crib. Soft lighting, storybook illustration style, warm colors.',
      },
      {
        pageNumber: 2,
        textTemplate: {
          en: '"{{childName}}," said {{parent1Name}} with a big smile, "today you get your very own big kid bed!"',
          es: '"{{childName}}," dijo {{parent1Name}} con una gran sonrisa, "hoy vas a tener tu propia cama de niño grande!"',
          pt: '"{{childName}}," disse {{parent1Name}} com um grande sorriso, "hoje você vai ter sua própria cama de criança grande!"',
        },
        illustrationPromptTemplate: 'A {{parent1Traits}} parent kneeling beside a {{traits}} toddler, smiling warmly. Bedroom setting with a new bed visible in background. Storybook illustration, warm palette.',
      },
      {
        pageNumber: 3,
        textTemplate: {
          en: '{{childName}} looked at the new bed. It was big and beautiful{{bedNameText}}. "Is that really for me?" {{childName}} asked.',
          es: '{{childName}} miró la cama nueva. Era grande y hermosa{{bedNameText}}. "De verdad es para mí?" preguntó {{childName}}.',
          pt: '{{childName}} olhou para a cama nova. Era grande e linda{{bedNameText}}. "É mesmo pra mim?" perguntou {{childName}}.',
        },
        illustrationPromptTemplate: 'A {{traits}} toddler standing in front of a beautiful new children\'s bed, eyes wide with wonder. The bed has colorful bedding. Storybook illustration style.',
      },
      {
        pageNumber: 4,
        textTemplate: {
          en: 'That night, {{childName}} climbed into the big kid bed. {{parent1Name}} tucked the covers in tight and gave a kiss goodnight.',
          es: 'Esa noche, {{childName}} se subió a la cama de niño grande. {{parent1Name}} arropó bien las cobijas y le dio un beso de buenas noches.',
          pt: 'Nessa noite, {{childName}} subiu na cama de criança grande. {{parent1Name}} ajeitou as cobertas e deu um beijo de boa noite.',
        },
        illustrationPromptTemplate: 'A {{traits}} toddler being tucked into a cozy new bed by a {{parent1Traits}} parent. Nighttime, soft warm lamplight. Storybook illustration.',
      },
      {
        pageNumber: 5,
        textTemplate: {
          en: '{{childName}} snuggled in and smiled. The big kid bed was warm and cozy. "I love my new bed," {{childName}} whispered, and drifted off to sleep. The end.',
          es: '{{childName}} se acurrucó y sonrió. La cama de niño grande era caliente y acogedora. "Amo mi cama nueva," susurró {{childName}}, y se quedó dormido/a. Fin.',
          pt: '{{childName}} se aconchegou e sorriu. A cama de criança grande era quentinha e aconchegante. "Eu amo minha cama nova," sussurrou {{childName}}, e adormeceu. Fim.',
        },
        illustrationPromptTemplate: 'A {{traits}} toddler peacefully sleeping in a cozy bed, smiling softly. Moonlight through window, stuffed animals nearby. Dreamy storybook illustration, soft colors.',
      },
    ],
  },
  {
    id: 'new-sibling',
    title: {
      en: 'A New Baby in Our Family',
      es: 'Un nuevo bebé en nuestra familia',
      pt: 'Um novo bebê na nossa família',
    },
    synopsis: {
      en: 'A heartwarming story about welcoming a new sibling and discovering the joy of being a big brother or sister.',
      es: 'Una historia sobre dar la bienvenida a un nuevo hermanito y descubrir la alegría de ser hermano/a mayor.',
      pt: 'Uma história sobre dar as boas-vindas a um novo irmãozinho e descobrir a alegria de ser irmão/irmã mais velho/a.',
    },
    previewImageUrl: '/previews/new-sibling.png',
    contextFields: [
      {
        key: 'siblingName',
        label: { en: 'New baby\'s name', es: 'Nombre del nuevo bebé', pt: 'Nome do novo bebê' },
        required: true,
      },
    ],
    pages: [],
  },
  {
    id: 'first-day-school',
    title: {
      en: 'My First Day of School',
      es: 'Mi primer día de colegio',
      pt: 'Meu primeiro dia de escola',
    },
    synopsis: {
      en: 'An encouraging story about starting school, making new friends, and discovering that new adventures can be wonderful.',
      es: 'Una historia sobre empezar el colegio, hacer nuevos amigos y descubrir que las nuevas aventuras pueden ser maravillosas.',
      pt: 'Uma história sobre começar a escola, fazer novos amigos e descobrir que novas aventuras podem ser maravilhosas.',
    },
    previewImageUrl: '/previews/first-day-school.png',
    contextFields: [
      {
        key: 'schoolName',
        label: { en: 'School name (optional)', es: 'Nombre del colegio (opcional)', pt: 'Nome da escola (opcional)' },
        required: false,
      },
    ],
    pages: [],
  },
  {
    id: 'parent-travel',
    title: {
      en: 'When Mommy/Daddy Goes on a Trip',
      es: 'Cuando mamá/papá se va de viaje',
      pt: 'Quando mamãe/papai viaja',
    },
    synopsis: {
      en: 'A reassuring story about when a parent travels for work, reminding children that love stays close even when someone is far away.',
      es: 'Una historia reconfortante sobre cuando un padre viaja por trabajo, recordando que el amor sigue cerca aunque alguien esté lejos.',
      pt: 'Uma história reconfortante sobre quando um pai viaja a trabalho, lembrando que o amor fica perto mesmo quando alguém está longe.',
    },
    previewImageUrl: '/previews/parent-travel.png',
    contextFields: [
      {
        key: 'travelDuration',
        label: { en: 'How long is the trip?', es: 'Cuánto dura el viaje?', pt: 'Quanto tempo dura a viagem?' },
        placeholder: { en: 'e.g., 3 days', es: 'ej., 3 días', pt: 'ex., 3 dias' },
        required: false,
      },
      {
        key: 'travelingParent',
        label: { en: 'Who is traveling?', es: 'Quién viaja?', pt: 'Quem viaja?' },
        placeholder: { en: 'e.g., Mommy', es: 'ej., Mamá', pt: 'ex., Mamãe' },
        required: true,
      },
    ],
    pages: [],
  },
  {
    id: 'sleeping-through-night',
    title: {
      en: 'The Night I Slept All Night Long',
      es: 'La noche que dormí toda la noche',
      pt: 'A noite que dormi a noite inteira',
    },
    synopsis: {
      en: 'A gentle story about learning to sleep through the night, with comforting rituals and the courage to stay in bed until morning.',
      es: 'Una historia sobre aprender a dormir toda la noche, con rituales reconfortantes y el coraje de quedarse en la cama hasta la mañana.',
      pt: 'Uma história sobre aprender a dormir a noite inteira, com rituais reconfortantes e a coragem de ficar na cama até de manhã.',
    },
    previewImageUrl: '/previews/sleeping-through-night.png',
    contextFields: [],
    pages: [],
  },
];
