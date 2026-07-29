import { getPayload } from 'payload'
import config from '@payload-config'

async function seed() {
  const payload = await getPayload({ config })

  const existingUsers = await payload.find({ collection: 'users', limit: 1 })
  if (existingUsers.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: { email: 'admin@yourcompany.com', password: 'admin123' },
    })
  }

  const projects = [
    {
      title: 'Oak & Steel Kitchen',
      slug: 'oak-steel-kitchen',
      category: 'kitchen-renovation',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'A complete kitchen transformation in a 1930s villa. We removed three walls to create an open-plan space, installed bespoke oak cabinetry with matte black steel frames, and laid herringbone parquet flooring throughout.',
                  format: 0,
                },
              ],
            },
          ],
        },
      },
      details: [
        { label: 'Duration', value: '6 weeks', id: '1' },
        { label: 'Location', value: 'Warsaw, Mokotów', id: '2' },
        { label: 'Materials', value: 'European oak, powder-coated steel, quartz countertop', id: '3' },
      ],
      featured: true,
      completedAt: '2025-11-01',
      images: [],
    },
    {
      title: 'Herringbone Deck',
      slug: 'herringbone-deck',
      category: 'decking-outdoor',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'A 45 m² outdoor deck laid in a herringbone pattern using thermally modified ash. Integrated bench seating, planter boxes, and subtle LED step lighting complete the space.',
                  format: 0,
                },
              ],
            },
          ],
        },
      },
      details: [
        { label: 'Duration', value: '3 weeks', id: '1' },
        { label: 'Location', value: 'Warsaw, Wilanów', id: '2' },
        { label: 'Materials', value: 'Thermo-ash decking, stainless steel fixings', id: '3' },
      ],
      featured: true,
      completedAt: '2025-08-15',
      images: [],
    },
    {
      title: 'Floor-to-Ceiling Library',
      slug: 'library-wall',
      category: 'custom-furniture',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'A full-wall fitted library spanning 5 metres wide and 2.8 metres tall. Solid walnut shelving with integrated LED strip lighting, a rolling ladder, and a hidden cabinet for AV equipment.',
                  format: 0,
                },
              ],
            },
          ],
        },
      },
      details: [
        { label: 'Duration', value: '4 weeks', id: '1' },
        { label: 'Location', value: 'Warsaw, Żoliborz', id: '2' },
        { label: 'Materials', value: 'American black walnut, brass hardware', id: '3' },
      ],
      featured: true,
      completedAt: '2025-06-01',
      images: [],
    },
  ]

  for (const project of projects) {
    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: project.slug } },
    })
    if (existing.docs.length === 0) {
      await payload.create({ collection: 'projects', data: project as any })
    }
  }

  console.log('Seed complete')
}

seed()
