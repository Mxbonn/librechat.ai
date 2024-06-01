import Image from 'next/image'
import { type Page } from 'nextra'
import dynamic from 'next/dynamic'
import { getPagesUnderRoute } from 'nextra/context'
import * as Accordion from '@radix-ui/react-accordion'
import { Video } from '../Video'
import React from 'react'

export const ChangelogIndex = ({ maxItems }: { maxItems?: number }) => {
  return (
    <Accordion.Root asChild type="multiple">
      <div className="max-w-6xl mx-auto divide-y divide-primary/10">
        {(getPagesUnderRoute('/changelog') as Array<Page & { frontMatter: any }>)
          .filter((page) => !page.route.includes('content'))
          .slice(0, maxItems)
          .sort(
            (a, b) =>
              new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime(),
          )
          .map((page, i) => {
            const pageName = page.route.replace('/changelog/', '')
            const MarkdownContent = dynamic(
              import(`../../pages/changelog/content/config_v1.0.0.mdx`),
              {
                ssr: false,
              },
            )
            return (
              <div
                className="md:grid md:grid-cols-4 md:gap-5 py-16 transition-all"
                id={pageName}
                key={pageName}
              >
                <div className="hidden md:block opacity-80 text-lg group-hover:opacity-100 sticky top-24 self-start">
                  {page.frontMatter?.date
                    ? new Date(page.frontMatter.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        timeZone: 'UTC',
                      })
                    : null}
                </div>
                <div className="md:col-span-3">
                  <Accordion.Item value={page.meta?.title || page.frontMatter?.title || page.name}>
                    <Accordion.Trigger key={page.route} className="block group">
                      {page.frontMatter?.ogVideo ? (
                        <Video
                          src={page.frontMatter.ogVideo}
                          gifStyle
                          className="mb-14 rounded relative overflow-hidden shadow-md group-hover:shadow-lg ring-0 border-0 transform scale-100 transition-transform hover:scale-105 cursor-pointer"
                        />
                      ) : page.frontMatter?.ogImage ? (
                        <div className="mb-14 rounded relative aspect-video overflow-hidden shadow-md transform scale-100 transition-transform hover:scale-105 cursor-pointer">
                          <Image
                            style={{ borderRadius: '20px' }}
                            src={page.frontMatter.gif ?? page.frontMatter.ogImage}
                            className="object-cover"
                            alt={page.frontMatter?.title ?? 'Changelog post image'}
                            fill={true}
                            sizes="(min-width: 1024px) 1000px, 100vw"
                            priority={i < 3}
                            unoptimized={
                              page.frontMatter.gif !== undefined ||
                              page.frontMatter.ogImage?.endsWith('.gif')
                            }
                          />
                        </div>
                      ) : null}
                      <div className="md:hidden opacity-80 text-sm mb-4 group-hover:opacity-100">
                        {page.frontMatter?.date
                          ? new Date(page.frontMatter.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              timeZone: 'UTC',
                            })
                          : null}
                      </div>
                      <h2 className="block font-mono text-3xl opacity-90 group-hover:opacity-100">
                        {page.meta?.title || page.frontMatter?.title || page.name}
                      </h2>
                      <div className="opacity-80 mt-4 text-lg group-hover:opacity-100">
                        {page.frontMatter?.description}
                      </div>
                    </Accordion.Trigger>
                    <Accordion.Content className="mt-8">
                      <div className="prose dark:prose-dark max-w-none">
                        {/* Dynamic import of the MDX content */}
                        <MarkdownContent />
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                </div>
              </div>
            )
          })}
      </div>
    </Accordion.Root>
  )
}
