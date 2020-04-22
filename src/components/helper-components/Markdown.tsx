/**
 * Hi there! You're probably wondering, what is all this?
 *
 * Well, it's the Markdown component from Grommet: https://github.com/grommet/grommet/blob/master/src/js/components/Markdown/Markdown.js
 *
 * It turns out that component doesn't support <li> components well :(
 *
 * We should ship a fix to the upstream soon, but in the meantime we'll fork it locally.
 *
 * In the nearer-future we could move this fix into a usdr/grommet repo and out of this project.
 *
 * But for now it lives here.
 */

import React from 'react'
import Markdown from 'markdown-to-jsx'

import {
  Heading,
  Paragraph,
  Anchor,
  Image,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from 'grommet'

const isObject = (item: any) => item && typeof item === 'object' && !Array.isArray(item)

const deepMerge = (target: any, ...sources: any) => {
  if (!sources.length) {
    return target
  }
  // making sure to not change target (immutable)
  const output = { ...target }
  sources.forEach((source: any) => {
    if (isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (isObject(source[key])) {
          if (!output[key]) {
            output[key] = { ...source[key] }
          } else {
            output[key] = deepMerge(output[key], source[key])
          }
        } else {
          output[key] = source[key]
        }
      })
    }
  })
  return output
}

const ListItem: React.FC = (props) => {
  return (
    <li>
      <Paragraph fill={true} color="black" margin="none">
        {props.children}
      </Paragraph>
    </li>
  )
}

const GrommetMarkdown = ({ components, options, theme, ...rest }: any) => {
  const heading = [1, 2, 3, 4].reduce((obj, level) => {
    const result = { ...obj } as any
    result[`h${level}`] = {
      component: Heading,
      props: { level },
    }
    return result
  }, {})

  const overrides = deepMerge(
    {
      a: { component: Anchor },
      img: { component: Image },
      p: { component: Paragraph },
      table: { component: Table },
      td: { component: TableCell },
      tbody: { component: TableBody },
      tfoot: { component: TableFooter },
      th: { component: TableCell },
      thead: { component: TableHeader },
      tr: { component: TableRow },
      li: { component: ListItem },
    },
    heading,
    components,
    options && options.overrides
  )

  return <Markdown options={{ ...options, overrides }} {...rest} />
}

export { GrommetMarkdown as Markdown }
