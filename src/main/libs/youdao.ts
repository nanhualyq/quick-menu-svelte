import { load } from 'cheerio'

export async function parseWord(text: string) {
  const Word = text.trim()
  if (!Word || Word.length > 200) {
    throw `skip: ${Word}`
  }
  const res = await fetch(`https://dict.youdao.com/result?word=${Word}&lang=en`).then((res) =>
    res.text()
  )

  const $ = load(res)

  const Exp = $('#catalogue_author .word-exp, #catalogue_author .trans-content')
    .map((_i, el) => $(el).text())
    .toArray()
    .filter((row) => !(row.startsWith('【名】') || row.includes('人名')))
    .join('<br>')

  return {
    Word,
    Exp,
    Phone: $('.phone_con').text()
  }
}

// code for menu
// ;(async () => {
//   const Url = context.execShell('copyq selection text/x-moz-url-priv')
//   const Title = context.execShell('copyq currentWindowTitle')
//   const text = context.execShell('copyq selection')
//   const lines = text.split('\n')
//   let success = 0
//   for (let i = 0; i < lines.length; i++) {
//     try {
//       const { Word, Exp, Phone } = await context.youdao.parseWord(lines[i])
//       context.anki.post({
//         action: 'addNote',
//         params: {
//           note: {
//             deckName: 'Default',
//             modelName: '@YouDao',
//             fields: {
//               Word,
//               Exp,
//               Phone,
//               Url,
//               Title
//             },
//             audio: [
//               {
//                 url: `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en_US&q=${Word}`,
//                 filename: `google-${Date.now()}.mp3`,
//                 fields: ['Audio']
//               }
//             ]
//           }
//         }
//       })
//       success++
//       if (i < lines.length - 1) {
//         await new Promise((resolve) => setTimeout(resolve, 4000))
//       }
//     } catch (error) {
//       context.logs.error(error)
//       continue
//     }
//   }
//   new context.Notification({
//     title: 'youdao batch finish',
//     body: `${success}/${lines.length}`
//   }).show()
// })()
