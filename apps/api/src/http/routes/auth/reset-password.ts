import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function resetPassword(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/password/reset',
      {
        schema: {
          tags: ['auth'],
          summary: 'Reset user password',
          body: z.object({
            code: z.string(),
            password: z.string().min(6),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { code, password } = request.body

        const tokenFromCode = await prisma.token.findUnique({
          where: { id: code },
        })

        if (!tokenFromCode) {
          // We don't want people to know if user really exists
          throw new UnauthorizedError()
        }

        const passwordHash = await hash(password, 6)

        await prisma.user.update({
          where: {
            id: tokenFromCode.userId,
          },
          data: {
            passwordHash,
          },
        })
        return reply.status(204).send()
      },
    )
}
