import Router from '@koa/router'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const router = new Router()

//listar os tweets
router.get('/tweets', async ctx => {
  const tweets = await prisma.tweet.findMany()

  ctx.body = tweets
})

// receber e salvar o tweet
router.post('/tweet', async ctx => {
  const userId = 'cl3xgs3yg0015axur550clzv2'

  const tweet = {
    userId: userId,
    text: ctx.request.body.text
  }

  const doc = await prisma.tweet.create({
    data: tweet
  })

  ctx.body = doc
})

// deletar o tweet
router.delete('/tweet/:id', async ctx => {
  const deleted = await prisma.tweet.delete({
    where: {
      id: ctx.params.id
    }
  })

  ctx.body = deleted
})
