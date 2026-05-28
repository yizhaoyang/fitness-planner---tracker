import { Exercise, WorkoutPlan } from '../types';

export const presetExercises: Exercise[] = [
  // Chest
  {
    id: 'barbell-bench-press',
    name: '杠铃卧推',
    englishName: 'Barbell Bench Press',
    category: '胸部',
    difficulty: '进阶',
    equipment: '杠铃',
    description: '最经典的胸肌、肱三头肌和三角肌前束训练动作，能有效提升上肢综合推力。',
    steps: [
      '仰卧在平凳上, 双脚平放于地面，双肩收紧，保持上背部、臀部接触凳面。',
      '两手握距略宽于肩，正握杠铃，将其从架上移出。',
      '缓慢将杠铃下降至胸骨或下胸部位置，肘部约与身体呈45度至75度角。',
      '垂直向上推起杠铃，直至双臂伸直，但不要把肘关节锁死。'
    ],
    tips: [
      '切忌在杠铃下落时猛烈撞击胸部借力。',
      '推起时吐气，下落时吸气，全程保持核心紧绷。',
      '始终保持手腕呈中立位，不要向后过度弯折。'
    ],
    primaryMuscles: ['胸大肌', '三角肌前束', '肱三头肌']
  },
  {
    id: 'dumbbell-chest-flye',
    name: '哑铃飞鸟',
    englishName: 'Dumbbell Flye',
    category: '胸部',
    difficulty: '进阶',
    equipment: '哑铃',
    description: '孤立的胸肌外侧和线条训练动作，拉伸感强烈，有助于塑造完美的胸肌轮廓。',
    steps: [
      '双手各握一哑铃，仰卧在平凳上。双臂向上伸直，掌心相对。',
      '微微弯曲肘关节，并将其锁定。',
      '平稳且缓慢地向身体两侧降下哑铃，呈宽弧线，直至胸部感到适度的拉伸。',
      '使用胸大肌发力将哑铃收回起始位置，想象拥抱一棵大树。'
    ],
    tips: [
      '肘关节夹角在下放和抬起过程中应保持常态微曲，不要变成卧推。',
      '动作顶端不要撞击哑铃，保持肌肉持续张力。'
    ],
    primaryMuscles: ['胸大肌', '三角肌前束']
  },
  {
    id: 'push-up',
    name: '标准俯卧撑',
    englishName: 'Push Up',
    category: '胸部',
    difficulty: '入门',
    equipment: '自重',
    description: '无需器材的经典上肢力量训练动作，全面锻炼胸部、肩部、手臂和核心稳定。',
    steps: [
      '双脚并拢，双手撑地，宽度略宽于肩。身体从头到脚呈一条直线。',
      '核心收紧，臀部不要下塌或高耸，头部保持自然中立。',
      '屈肘向下，身体平稳下降，直至胸部几乎贴近地面。肘部斜向后下方（与躯干呈45度）。',
      '依靠胸部和手臂力量，将身体推回起始位置。'
    ],
    tips: [
      '注意保持骨盆中立和腹部收紧，整个身体像一块平板。',
      '如果标准动作困难，可先尝试跪姿俯卧撑或垫高上肢的退阶动作。'
    ],
    primaryMuscles: ['胸大肌', '肱三头肌', '三角肌前束', '腹直肌']
  },

  // Back
  {
    id: 'pull-up',
    name: '引体向上',
    englishName: 'Pull Up',
    category: '背部',
    difficulty: '高阶',
    equipment: '自重',
    description: '打造V字倒三角身材的终极背部训练动作，对背阔肌及双手握力有极高考验。',
    steps: [
      '双手以略宽于肩的握距正握单杠，身体自然悬垂，核心和臀部微紧。',
      '沉肩收脚，呼气同时用背阔肌的力量将身体往上拉。',
      '拉至下巴超过单杠，或者锁骨几乎碰触单杠的位置，顶峰收缩1秒。',
      '吸气并缓慢控制着身体下放回到起始悬垂状态。'
    ],
    tips: [
      '避免双腿大幅度晃动或利用身体惯性摆动（Kipping）。',
      '拉起时想象把手肘往裤兜里塞，感受背部夹紧。'
    ],
    primaryMuscles: ['背阔肌', '大圆肌', '肱二头肌', '斜方肌中下束']
  },
  {
    id: 'dumbbell-row',
    name: '单臂哑铃划船',
    englishName: 'Single Arm Dumbbell Row',
    category: '背部',
    difficulty: '进阶',
    equipment: '哑铃',
    description: '单侧孤立背部训练，能极好地纠正背部两侧力量不平衡，并加强脊柱抗旋转能力。',
    steps: [
      '将单侧膝盖和同侧手掌支撑在平凳上，另一脚站立平稳，上身与地面平行。',
      '另一手自然下垂握持哑铃，保持背部平直，双肩平衡。',
      '手肘向后上方提起，将哑铃拉向腰际/大腿根部，收紧半侧背肌。',
      '控制速度，将哑铃沿原路径降到初始位置。'
    ],
    tips: [
      '不要用手拼命拉，而要专心用手肘往后带。',
      '动作进行时不要转动躯干，保持背部水平。'
    ],
    primaryMuscles: ['背阔肌', '大圆肌', '斜方肌', '肱二头肌']
  },
  {
    id: 'barbell-deadlift',
    name: '杠铃硬拉',
    englishName: 'Barbell Deadlift',
    category: '背部',
    difficulty: '高阶',
    equipment: '杠铃',
    description: '三大项之一，全身多关节复合训练，对于整个后侧链（下背、臀部、大腿后侧）有无可替代的效果。',
    steps: [
      '双脚打开与胯同宽，脚尖微外展。小腿距离杠铃杆2-3厘米。',
      '屈胯盖下，保持腰背绝对挺直，双手略比肩宽握住杠铃杆。',
      '臀部下沉至大腿约高于膝盖，小腿前倾接触杠铃杆，肩膀略微超前于器械。',
      '双脚蹬地拉起杠铃，保持手肘锁死，大腿和胯部同时锁死，杠铃全程贴着身体滑动。',
      '直立并锁死臀部，随后平稳将杠铃退回地面。'
    ],
    tips: [
      '全程绝对不能弯腰、弓背，否则极易遭受严重的腰部损伤！',
      '起身时脑子里想象是用脚掌向下把地球踩开，而不是用腰把重量拎起来。'
    ],
    primaryMuscles: ['竖脊肌', '臀大肌', '腘绳肌', '股四头肌', '斜方肌']
  },

  // Legs
  {
    id: 'barbell-squat',
    name: '杠铃深蹲',
    englishName: 'Barbell Squat',
    category: '腿部',
    difficulty: '高阶',
    equipment: '杠铃',
    description: '力量之源，下肢王牌训练。能极大促进荷尔蒙分泌，强化股四头肌、臀大肌和核心力量。',
    steps: [
      '将杠铃架调整在胸部高度。钻到杠铃下，将杠铃杆平稳担在斜方肌上束（高位）或后束（低位）。',
      '起担，后退一两步，双脚较肩稍宽，脚尖微向外指15-30度。',
      '吸气，收紧核心。像坐椅子一样，屈胯屈膝同时向下，重心保持在足底中部。',
      '蹲至大腿上表面低于膝关节（或根据身体灵活性尽力蹲深），保持背部中立。',
      '呼气，脚底发力对称推起，骨盆和肩膀同时抬升，回到直立，臀部锁死。'
    ],
    tips: [
      '确保膝盖朝向始终与脚尖方向一致，切忌膝关节内扣（X腿）。',
      '背部始终挺直，挺胸，眼睛平视前方。'
    ],
    primaryMuscles: ['股四头肌', '臀大肌', '内收肌', '腹核心']
  },
  {
    id: 'dumbbell-lunge',
    name: '哑铃箭步蹲',
    englishName: 'Dumbbell Lunge',
    category: '腿部',
    difficulty: '进阶',
    equipment: '哑铃',
    description: '极佳的单腿不平衡性训练，针对大腿股四、臀肌均有深度刺激，并提升身体协调性和平衡力。',
    steps: [
      '双手垂直握持哑铃于身体两侧，挺胸收腹，双脚与肩同宽站立。',
      '一脚向前跨出一大步（约1.5倍步幅），同时身体垂直下蹲。',
      '前大腿平行于地面，后膝微悬离地面，前膝关节不过度超过脚尖。',
      '前脚后跟用力蹬地踩回，身体重回并拢站立位。两腿交替进行。'
    ],
    tips: [
      '下蹲时保持上身笔直挺拔，切忌弓背或过度前倾。',
      '重心放在前脚脚掌中后部，感觉臀大肌和股四头肌强烈拉伸。'
    ],
    primaryMuscles: ['股四头肌', '臀大肌', '腘绳肌']
  },

  // Shoulder
  {
    id: 'overhead-press',
    name: '杠铃立姿推举',
    englishName: 'Overhead Press',
    category: '肩部',
    difficulty: '高阶',
    equipment: '杠铃',
    description: '构建宽广肩膀和强健上肢推力的黄金动作，极大挑战肩袖肌群与核心稳定。',
    steps: [
      '双脚与肩同宽站立，杠铃置于胸骨上端，双手略宽于肩，前臂与地面保持垂直。',
      '深吸气，核心、臀部、大腿全部收紧。',
      '向上推起杠铃，当杠铃过额头时，身体微向前移，使杠铃路线呈垂直向上。',
      '在顶端双臂自然伸直锁死，随后控制速度缓慢将杠铃降回锁骨。'
    ],
    tips: [
      '注意不要在推起时过度后仰腰椎借力，核心必须锁死。',
      '全程前臂保持垂直地面。'
    ],
    primaryMuscles: ['三角肌前中束', '斜方肌', '肱三头肌', '核心肌群']
  },
  {
    id: 'lateral-raise',
    name: '哑铃侧平举',
    englishName: 'Dumbbell Lateral Raise',
    category: '肩部',
    difficulty: '入门',
    equipment: '哑铃',
    description: '针对三角肌中束的绝对王牌孤立动作，是打造肩部宽度和“南瓜肩”的必练姿势。',
    steps: [
      '双脚直立同肩宽，两手持哑铃垂于体侧，手掌相对，上体微前倾。',
      '手肘微曲并锁定。使用三角肌中束发力将哑铃向两侧举起。',
      '举至手臂与地面平行，手肘和手掌处于同一水平高度，感受肩外侧酸胀。',
      '吸气，缓慢顺应重力下放，在哑铃碰触大腿前即可再次抬起，保持张力。'
    ],
    tips: [
      '抬起时小拇指微微向上倾旋，效果更佳；切勿耸肩，否则斜方肌会超额代偿。',
      '尽量使用较轻甚至极轻的重量，追求精确的手脑连接与发力感。'
    ],
    primaryMuscles: ['三角肌中束', '三角肌后束']
  },

  // Arms
  {
    id: 'dumbbell-bicep-curl',
    name: '哑铃弯举',
    englishName: 'Dumbbell Bicep Curl',
    category: '手臂',
    difficulty: '入门',
    equipment: '哑铃',
    description: '非常经典的双头肌增量以及轮廓训练，简单易行且成效显著。',
    steps: [
      '站立，双手各持哑铃，手臂垂着，掌心向内侧。',
      '大臂紧贴身体两侧，收紧腹部，屈肘将哑铃向上转动弯举。',
      '向上行进中徐徐旋转手腕，使掌心朝上，最终弯折到位，用力收缩肱二头肌。',
      '顺着原先的路线慢慢将重量下放，回转手腕，还原至重力悬垂状态。'
    ],
    tips: [
      '大臂不可以前后大幅度摆动、晃动，肘部位置要牢牢固定。',
      '下放时一定要控制不要甩，利用二头拉伸张力对抗重力。'
    ],
    primaryMuscles: ['肱二头肌', '肱肌']
  },
  {
    id: 'tricep-pushdown',
    name: '绳索肱三头肌下压',
    englishName: 'Triceps Rope Pushdown',
    category: '手臂',
    difficulty: '入门',
    equipment: '器械',
    description: '肱三头肌最有效的孤立训练之一，有助于勾勒手臂后侧结实的线条。',
    steps: [
      '面对高位滑轮拉力器站立，双手握住绳索的两端，大臂紧靠体侧。',
      '屈肘使前臂微抬起，大臂下方稍微外张。',
      '收缩肱三头肌，将绳索向下拉下直至双臂完全伸直。',
      '在下压底端，手腕向外扭转，大拇指指向外侧，顶收缩一秒，再缓慢受控回收。'
    ],
    tips: [
      '动作中肩部不要移动，胸部保持平直、不要弓腰耸肩。',
      '整个下压过程主要由肘关节参与，其余大臂需焊死在躯干侧边。'
    ],
    primaryMuscles: ['肱三头肌']
  },

  // Core
  {
    id: 'crunch',
    name: '经典卷腹',
    englishName: 'Abdominal Crunch',
    category: '核心',
    difficulty: '入门',
    equipment: '自重',
    description: '比仰卧起坐更安全、更专注的腹肌训练动作，避免髋屈肌和下背部代偿。',
    steps: [
      '仰卧在垫子上，膝盖弯曲约90度，双脚并拢平踩于地面。',
      '双手轻轻抱头（切忌拼命抓拽脖子）或交叉置于胸前。',
      '收缩腹肌，呼气，将肩膀慢慢抬离地面约30度（差不多让肩胛骨刚离开地面）。',
      '在最高点挤压腹部1秒，然后吸气，慢慢有控制地退回。'
    ],
    tips: [
      '头部不要用力向前扣，下巴和胸部保留一个网球的空隙。',
      '背部下半部分（腰椎）要全程紧贴地面，不要悬空或翘起。'
    ],
    primaryMuscles: ['腹直肌']
  },
  {
    id: 'plank',
    name: '平板支撑',
    englishName: 'Plank',
    category: '核心',
    difficulty: '入门',
    equipment: '自重',
    description: '全身静态抗延展训练动作，极佳的核心稳定与深层核心肌群建构工具。',
    steps: [
      '俯卧在瑜伽垫上，肘关节弯曲支撑在地面，肩膀和肘关节呈一条垂直线。',
      '双脚直板踩地，将身体整个抬起。从头、肩、臀至脚踝保持在同一水平面上。',
      '眼睛平视前方地垫，深呼吸，全程腹部、臀部大腿紧紧绷牢绷直。'
    ],
    tips: [
      '如果腰部感到严重酸痛，可能是腹肌疲劳导致塌腰，请立刻结束或改为抬高身体退阶。',
      '严禁撅屁股或低头含肩。'
    ],
    primaryMuscles: ['腹横肌', '腹斜肌', '臀肌', '肩带肌群']
  },

  // Cardio
  {
    id: 'burpee',
    name: '波比跳',
    englishName: 'Burpee',
    category: '有氧',
    difficulty: '高阶',
    equipment: '自重',
    description: '高强度的脂肪杀手、心肺粉碎机动作。将深蹲、俯卧撑、起跳和爆发完美融合。',
    steps: [
      '自然站立。随后俯身下蹲，双手在双脚稍前方平撑地。',
      '用力往后双脚一齐跳，身体顺势变为支撑撑腿俯卧撑起始姿势。',
      '做一个标准俯卧撑至胸部碰到地板（简易版可省去俯卧撑）。',
      '双腿快速收回至腹部下方成深蹲位置。',
      '脚掌踩地全力向上起跳，双手高举在头顶击掌，随后轻盈落地衔接。'
    ],
    tips: [
      '对体能消耗极大，练习需由慢至快，心率拉满是正常现象，如有不适及头晕应立刻终止。',
      '落地时大腿屈漆缓冲，切忌膝盖僵硬笔直顿下。'
    ],
    primaryMuscles: ['全身肌肉群', '心肺']
  }
];

export const presetPlans: WorkoutPlan[] = [
  {
    id: 'plan-chest-back',
    name: '经典胸背黄金超级组',
    description: '针对上半身上肢肌群的黄金组合，对抗肌交替运动，充血感极强，适合中高级及想增肌的人群。',
    isPreset: true,
    createdAt: new Date().toISOString(),
    exercises: [
      { exerciseId: 'barbell-bench-press', name: '杠铃卧推', sets: 4, reps: '8-12次', weight: '30kg' },
      { exerciseId: 'pull-up', name: '引体向上', sets: 4, reps: '8-10次', weight: '自重' },
      { exerciseId: 'dumbbell-chest-flye', name: '哑铃飞鸟', sets: 3, reps: '12次', weight: '10kg' },
      { exerciseId: 'dumbbell-row', name: '单臂哑铃划船', sets: 3, reps: '12次', weight: '15kg' }
    ]
  },
  {
    id: 'plan-legs-core',
    name: '硬核下肢与腹部轰炸',
    description: '深蹲与核心激活训练，燃脂效率极佳，既能稳固下肢力量，又能紧致核心马甲线。',
    isPreset: true,
    createdAt: new Date().toISOString(),
    exercises: [
      { exerciseId: 'barbell-squat', name: '杠铃深蹲', sets: 4, reps: '10次', weight: '40kg' },
      { exerciseId: 'dumbbell-lunge', name: '哑铃箭步蹲', sets: 3, reps: '单侧12次', weight: '8kg' },
      { exerciseId: 'crunch', name: '经典卷腹', sets: 4, reps: '15次', weight: '自重' },
      { exerciseId: 'plank', name: '平板支撑', sets: 3, reps: '60秒', weight: '自重' }
    ]
  },
  {
    id: 'plan-beginners-fullbody',
    name: '零基础全身唤醒计划',
    description: '适合刚走进健身房的新手，以自重和易操作的基底动作为主，全方位唤醒全身关节与心肺。',
    isPreset: true,
    createdAt: new Date().toISOString(),
    exercises: [
      { exerciseId: 'push-up', name: '标准俯卧撑', sets: 3, reps: '10-15次', weight: '自重' },
      { exerciseId: 'dumbbell-bicep-curl', name: '哑铃弯举', sets: 3, reps: '12次', weight: '5kg' },
      { exerciseId: 'plank', name: '平板支撑', sets: 3, reps: '40秒', weight: '自重' },
      { exerciseId: 'burpee', name: '波比跳', sets: 2, reps: '8-10次', weight: '自重' }
    ]
  }
];
