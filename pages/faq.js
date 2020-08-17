import React from 'react';
import styles from '../src/components/markdown/markdown.module.css';

const FaqPage = ({ blog }) => {
  return (
    <div className={styles['markdown-body']}>
      <h6>Created on {blog.createdOn}</h6>
      {blog.updatedOn ? <h6>Updated on {blog.updatedOn}</h6> : null}
      <section dangerouslySetInnerHTML={{ __html: blog.content }}></section>
    </div>
  );
};

export async function getStaticProps(context) {
  const fs = require('fs');
  const html = require('remark-html');
  const highlight = require('remark-highlight.js');
  const unified = require('unified');
  const markdown = require('remark-parse');
  const matter = require('gray-matter');

  const path = `${process.cwd()}/contents/faq/faq.md`;

  // read file content and store into rawContent variable
  const rawContent = fs.readFileSync(path, {
    encoding: 'utf-8',
  });

  const { data, content } = matter(rawContent); // pass rawContent to gray-matter to get data and content

  const result = await unified()
    .use(markdown)
    .use(highlight) // highlight code block
    .use(html)
    .process(content); // pass content to process

  return {
    props: {
      blog: {
        ...data,
        content: result.toString(),
      },
    },
  };
}

// generate HTML paths at build time
export async function getStaticPaths(context) {
  const fs = require('fs');

  const path = `${process.cwd()}/contents/faq`;
  const files = fs.readdirSync(path, 'utf-8');

  const markdownFileNames = files.filter((fn) => fn.endsWith('.md')).map((fn) => fn.replace('.md', ''));

  return {
    paths: markdownFileNames.map((fileName) => {
      return {
        params: {
          slug: fileName,
        },
      };
    }),
    fallback: false,
  };
}

export default FaqPage;
