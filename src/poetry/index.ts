export function getRandomPoetry() {
  let index = Math.floor(Math.random() * cn_poetry.length)
  return cn_poetry[index]
}

const cn_poetry = [
  {
    title: '南园十三首(其五)',
    author: '李贺',
    content: ['男儿何不带吴钩', '收取关山五十州'],
    type: '唐诗',
  },
]
