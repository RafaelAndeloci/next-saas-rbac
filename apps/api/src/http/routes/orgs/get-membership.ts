import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'

export async function getMemberShip(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/membership',
      {
        schema: {
          summary: 'Get user membership on organization',
          security: [{ bearerAuth: [] }],
          tags: ['organizations'],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              memberShip: z.object({
                id: z.string().uuid(),
                role: roleSchema,
                organizationId: z.string().uuid(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { memberShip } = await request.getUserMembership(slug)

        return {
          memberShip: {
            id: memberShip.id,
            role: memberShip.role,
            organizationId: memberShip.organizationId,
          },
        }
      },
    )
}
