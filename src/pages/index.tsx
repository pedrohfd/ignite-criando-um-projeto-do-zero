import { useState } from 'react'
import { GetStaticProps } from 'next'
import Prismic from '@prismicio/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Head from 'next/head'
import Link from 'next/link'

import { getPrismicClient } from '../services/prismic'
import commonStyles from '../styles/common.module.scss'
import styles from './home.module.scss'

interface Post {
  uid?: string
  first_publication_date: string | null
  data: {
    title: string
    subtitle: string
    author: string
  }
}

interface PostPagination {
  next_page: string
  results: Post[]
}

interface HomeProps {
  postsPagination: PostPagination
}

interface PostsProps {
  posts: Post[]
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const formattedPost = postsPagination.results.map(post => {
    return {
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
    }
  })

  const [posts, setPosts] = useState<Post[]>(formattedPost)
  const [nextPage, setNextPage] = useState(postsPagination.next_page)
  return (
    <>
      <Head>
        <title>Posts | Space Traveling</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.content}>
          {posts.map(post => (
            <Link href={`/post/${post.uid}`}>
              <a>
                <h1>{post.data.title}</h1>
                <h2>{post.data.subtitle}</h2>
                <div>
                  <img src='/images/calendar.svg' alt='calendar' />
                  <span>{post.first_publication_date}</span>

                  <img src='/images/user.svg' alt='user' />
                  <span>{post.data.author}</span>
                </div>
              </a>
            </Link>
          ))}

          <button>Carregue mais posts</button>
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      pageSize: 2,
    }
  )

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    }
  })

  const postsPagination = {
    next_page: response.next_page,
    results: posts,
  }

  return {
    props: { postsPagination },
  }
}
