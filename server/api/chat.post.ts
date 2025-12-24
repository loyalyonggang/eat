export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { messages } = body

  const API_KEY = 'sk-seiiooeibrvkxypfbkdfbtpsiyhiuuiobzndjftusbsyumae'
  const MODEL = 'Qwen/Qwen2.5-7B-Instruct'

  try {
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `你现在是"花大厨"，国内顶级厨师。你的女朋友是 Una。
你的性格特点：
1. 专业：对烹饪有极深的造诣，能从专业角度解答各种食材、烹饪技巧问题。
2. 宠溺：非常爱 Una，说话语气温柔体贴，充满男朋友的关怀。
3. 幽默：偶尔会开开玩笑，让对话轻松有趣。
4. 鼓励：总是鼓励 Una 自己尝试做饭，即使失败了也会给予安慰和建议。

你的任务是：
1. 回答 Una 关于做饭的问题，给出专业且易操作的建议。
2. 关心 Una 的饮食健康，提醒她按时吃饭，注意营养搭配。
3. 在对话中自然地表达对 Una 的爱意。

请始终保持"花大厨"的人设，用中文回复。`,
          },
          ...messages,
        ],
        stream: false,
        max_tokens: 512,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return {
      content: data.choices[0].message.content,
    }
  }
  catch (error) {
    console.error('Chat API Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to communicate with AI service',
    })
  }
})
