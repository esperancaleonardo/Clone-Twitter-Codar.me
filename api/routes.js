import Router from '@koa/router'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const router = new Router()

//listar os tweets
router.get('/tweets', async ctx => {
  const [, token] = ctx.request.headers?.authorization?.split(' ') || []

  if (!token) {
    ctx.status = 401
    return
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET)

    const tweets = await prisma.tweet.findMany()

    ctx.body = tweets
  } catch (error) {
    ctx.status = 401
    return
  }
})

// receber e salvar o tweet
router.post('/tweet', async ctx => {
  const [, token] = ctx.request.headers?.authorization?.split(' ') || []

  if (!token) {
    ctx.status = 401
    return
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    const user = await prisma.user.findUnique({
      where: {
        id: payload.sub
      }
    })

    const tweet = await prisma.tweet.create({
      data: {
        userId: user.id,
        text: ctx.request.body.text,
        likes: 0
      }
    })

    ctx.body = tweet
  } catch (error) {
    ctx.status = 401
    return
  }
})

// deletar o tweet
router.delete('/tweet/:id', async ctx => {
  const [, token] = ctx.request.headers?.authorization?.split(' ') || []

  if (!token) {
    ctx.status = 401
    return
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET)
    const deleted = await prisma.tweet.delete({
      where: {
        id: ctx.params.id
      }
    })

    ctx.body = deleted
  } catch (error) {
    ctx.status = 401
    return
  }
})

//rota de cadastro
router.post('/signup', async ctx => {
  const saltRounds = 10
  const passwd = bcrypt.hashSync(ctx.request.body.password, saltRounds)

  try {
    const user = await prisma.user.create({
      data: {
        name: ctx.request.body.name,
        username: ctx.request.body.username,
        email: ctx.request.body.email,
        password: passwd
      }
    })

    delete user.password

    ctx.body = user
  } catch (error) {
    if (error.meta && !error.meta.target) {
      ctx.body = 'Email ou usuário já existe no site'
      ctx.status = 422
      return
    }

    ctx.body = 'Internal Error'
    ctx.status = 500
  }
})

//login
router.get('/login', async ctx => {
  const [, token] = ctx.request.headers.authorization.split(' ')
  const [email, plainPassword] = atob(token).split(':')

  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  })

  if (!user) {
    ctx.status = 404
    return
  }

  const passwordMatch = bcrypt.compareSync(plainPassword, user.password)

  if (passwordMatch) {
    const accessToken = jwt.sign(
      {
        sub: user.id
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    delete user.password
    ctx.body = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      accessToken
    }
    return
  }

  ctx.status = 404
})
