import React from 'react'
import { Markdown as GrommetMarkdown, Paragraph, ParagraphProps } from 'grommet'
import { MarginType } from 'grommet/utils'

const ListItem: React.FC = ({ children, ...styleProps }) => {
  return (
    <li>
      <Paragraph fill={true} color="black" margin="none" {...styleProps}>
        {children}
      </Paragraph>
    </li>
  )
}

interface Props {
  size?: ParagraphProps['size']
  margin?: MarginType
}

function merge(...sources: Record<string, any>[]) {
  const result: Record<string, any> = {}
  for (const source of sources) {
    for (const key of Object.keys(source)) {
      if (source[key]) {
        result[key] = source[key]
      }
    }
  }

  console.log(result, sources, result)

  return result
}

export const Markdown: React.FC<Props> = ({ margin, size, children }) => {
  // Grommet allows you to override what React component is used for various
  // HTML elements. It handles a few components by default, but there are a few
  // extra cases we want to handle (or customize).

  const paragraphStyles = {
    // style: { whiteSpace: 'pre-wrap' },
  }

  return (
    <GrommetMarkdown
      components={{
        li: {
          component: ListItem,
          props: merge({ margin, size }),
        },
        p: {
          component: Paragraph,
          props: merge(paragraphStyles, { fill: true, color: 'black' }, { margin, size }),
        },
        span: {
          component: Paragraph,
          props: merge(paragraphStyles, { fill: true, color: 'black', size: 'small' }, { margin, size }),
        },
      }}
    >
      {children}
    </GrommetMarkdown>
  )
}