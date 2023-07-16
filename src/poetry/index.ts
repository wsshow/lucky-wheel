export function getRandomPoetry() {
  let index = Math.floor(Math.random() * cn_poetry.length)
  return cn_poetry[index]
}

const cn_poetry = [
  {
    title: '南园十三首(其五)',
    author: '李贺',
    content: ['男儿何不带吴钩', '收取关山五十州'],
    type: '唐代',
  },
  {
    title: '老将行',
    author: '王维',
    content: ['一身转战三千里', '一剑曾当百万师'],
    type: '唐代',
  },
  {
    title: '献钱尚父',
    author: '贯休',
    content: ['满堂花醉三千客', '一剑霜寒十四州'],
    type: '唐代',
  },
  {
    title: '梅岭三章(其一)',
    author: '陈毅',
    content: ['此去泉台招旧部', '旌旗十万斩阎罗'],
    type: '近代',
  },
  {
    title: '戏为六绝句(其二)',
    author: '杜甫',
    content: ['尔曹身与名俱灭', '不废江河万古流'],
    type: '近代',
  },
]
